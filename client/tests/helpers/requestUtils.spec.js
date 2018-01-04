import { handleError, configureRequestParams, getQueryString } from '../../helpers/requestUtils';
import store from '../../store';
import constants from '../../constants';
import router from '../../router';

const { mutations, actions, errors } = constants;

const mockState = {
  auth: {
    x_auth_token: false
  },
  proxy: false,
  pdffillerUserId: '1111',
  proxyUrl: 'proxyUrl',
  baseUrl: 'baseUrl',
};


store.commit = jest.fn();
store.dispatch = jest.fn();
store.replaceState(mockState);
router.push = jest.fn();

const responseMock = {
  status: 200,
  json: jest.fn()
};

const url = 'url';

describe('request utils tests', () => {
  beforeAll(() => {
    global.Error = jest.fn();
  });

  afterEach(() => {
    global.Error.mockClear();
  });

  describe('handle error', () => {
    it('shouldnt throw error when status 200', async () => {
      await handleError(responseMock);
      expect(global.Error).not.toBeCalled();
    });

    it('should throw empty error and redirect to auth page when status 401', async () => {
      responseMock.status = 401;
      try {
        await handleError(responseMock);
      } catch (err) { console.log(err); }

      expect(store.commit).toBeCalledWith(mutations.SET_ACCESS_TOKEN, null);
      expect(store.dispatch).toBeCalledWith(actions.CHECK_AUTH_CODE);
      expect(router.push).toBeCalledWith({ name: 'authorize', query: { redirect: router.currentRoute.fullPath } });
      expect(global.Error).toBeCalled();
    });

    it('should throw error when status 413', async () => {
      responseMock.status = 413;
      try {
        await handleError(responseMock);
      } catch (err) { console.log(err); }

      expect(global.Error).toBeCalledWith(errors.BIG_FILE);
    });

    it('should throw error when status 400', async () => {
      responseMock.status = 400;
      const errorsMock = { errors: [{ message: 'error' }] };
      responseMock.json.mockImplementation(() => Promise.resolve(errorsMock));

      try {
        await handleError(responseMock);
      } catch (err) { console.log(err); }

      expect(global.Error).toBeCalledWith(`${errorsMock.errors[0].message}\n`);
    });

    it('should throw error when status 400', async () => {
      responseMock.status = 400;
      const errorsMock = { error: 'error' };
      responseMock.json.mockImplementation(() => Promise.resolve(errorsMock));

      try {
        await handleError(responseMock);
      } catch (err) { console.log(err); }

      expect(global.Error).toBeCalledWith(errorsMock.error);
    });
  });

  describe('configureRequestParams function', () => {
    it('should set accept header', () => {
      const params = configureRequestParams(url, {});
      expect(params.headers.Accept).toBe('application/json');
    });

    it('should set credentials as same-origin', () => {
      const params = configureRequestParams(url, {});
      expect(params.credentials).toBe('same-origin');
    });

    it('should set content type header', () => {
      const params = configureRequestParams(url, {});
      expect(params.headers['Content-Type']).toBe('application/json');
    });

    it('shouldn`t set accept header json and content type headers', () => {
      const params = configureRequestParams(url, {}, true);
      expect(params.headers.Accept).not.toBe('application/json');
      expect(params.headers['Content-Type']).not.toBe('application/json');
    });

    it('should set access token', () => {
      const params = {
        access_token: 'token'
      };
      const paramsResult = configureRequestParams(url, params);
      expect(paramsResult.headers.Authorization).toBe(`Bearer ${params.access_token}`);
    });

    it('should set x-auth token header', () => {
      mockState.auth.x_auth_token = 'token';
      const paramsResult = configureRequestParams(url, {});
      expect(paramsResult.headers['x-auth-token']).toBe(mockState.auth.x_auth_token);
    });

    it('should get base url when no proxy', () => {
      const paramsResult = configureRequestParams(url, {});
      expect(paramsResult.url).toBe(`${mockState.baseUrl}${url}`);
    });

    it('should get base url when noPdfillerApi ', () => {
      mockState.proxy = true; // set proxy to true for this and other tests that after
      const paramsResult = configureRequestParams(url, { noPdfillerApi: true });
      expect(paramsResult.url).toBe(`${mockState.baseUrl}${url}`);
    });

    it('should get correct url when proxy true and pdffiller request', () => {
      const paramsResult = configureRequestParams(url, {});
      expect(paramsResult.url).toBe(mockState.proxyUrl);
    });

    it('should get correct headers and headers when proxy true and pdffiller request', () => {
      const paramsResult = configureRequestParams(url, {});
      expect(paramsResult.headers['x-proxy-url']).toBe(url);
      expect(paramsResult.headers['x-pdffiller-user-id']).toBe(mockState.pdffillerUserId);
    });
  });

  describe('query string function', () => {
    it('should get query string from object', () => {
      const query = {
        name: 'name',
        bla: 'bla'
      };
      const result = getQueryString(query);
      expect(result).toBe('name=name&bla=bla');
    });
  });
});
