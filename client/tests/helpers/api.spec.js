import callApi from '../../helpers/api';
import { handleError, configureRequestParams, getQueryString } from '../../helpers/requestUtils';

jest.mock('../../helpers/requestUtils');

const requestParams = {
  url: 'url',
  method: 'POST',
  body: 'body'
};

const responseMock = {
  data: 'data',
  json: jest.fn(),
  blob: jest.fn()
};

describe('api helper', () => {
  beforeAll(() => {
    global.fetch = jest.fn();
    global.fetch.mockImplementation(() => Promise.resolve(responseMock));

    configureRequestParams.mockImplementation(() => ({ ...requestParams }));
    getQueryString.mockImplementation(() => '');
  });

  afterEach(() => {
    global.fetch.mockClear();
  });

  it('should call api with params and return object', async () => {
    await callApi(requestParams.url, { ...requestParams });

    expect(configureRequestParams).toBeCalledWith(requestParams.url, { ...requestParams }, undefined);
    expect(global.fetch).toBeCalledWith(requestParams.url, {
      cache: 'no-store',
      method: requestParams.method,
      body: requestParams.body
    });
    expect(handleError).toBeCalledWith(responseMock);
    expect(responseMock.json).toBeCalled();
  });

  it('should call api with params and return blob', async () => {
    await callApi(requestParams.url, { ...requestParams }, true);

    expect(responseMock.blob).toBeCalled();
  });

  it('should call getQueryString when it is provide', async () => {
    await callApi(requestParams.url, { ...requestParams, query: { params: 'params' } });

    expect(getQueryString).toBeCalledWith({ params: 'params' });
  });
});
