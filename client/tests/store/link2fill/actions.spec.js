import store from '../../../store';
import storeActions from '../../../store/link2fill/actions';
import callApi from '../../../helpers/api';
import constants from '../../../constants';

jest.mock('../../../helpers/api');
jest.mock('../../../helpers/utils');

const { mutations, actions, endpoints } = constants;

const mockContext = {
  commit: jest.fn(),
  rootState: store.state,
};

describe('l2f actions', () => {
  afterEach(() => {
    callApi.mockClear();
  });

  it('should create l2f', async () => {
    const mockApiAnswer = {};
    const payload = {
      ...store.state.link2fill.defaultParams
    };

    callApi.mockImplementation(() => Promise.resolve(mockApiAnswer));

    await storeActions[actions.CREATE_L2F](mockContext, payload);

    expect(callApi).toBeCalledWith(endpoints.LINK_TO_FILL, expect.objectContaining({
      access_token: null,
      method: 'POST',
      body: JSON.stringify(payload)
    }));
  });

  it('should update callback url added current document', async () => {
    const url = 'url';
    const currentDocument = {
      id: 1
    };

    store.commit(mutations.SET_CURRENT_DOCUMENT, currentDocument);
    store.commit(mutations.SET_L2F_CALLBACK_URL, url);

    const mockApiAnswer = {};
    const payload = {
      ...store.state.link2fill.defaultParams
    };

    callApi.mockImplementation(() => Promise.resolve(mockApiAnswer));

    await storeActions[actions.CREATE_L2F](mockContext, payload);
    expect(callApi).toBeCalledWith(endpoints.LINK_TO_FILL, expect.objectContaining({
      access_token: null,
      method: 'POST',
      body: JSON.stringify(payload)
    }));

    expect(payload.callback_url).toBe(`${url}&project_id=${currentDocument.id}`);
  });

  it('should catch error', async () => {
    const payload = {
      ...store.state.link2fill.defaultParams
    };
    const errorMessage = 'error';
    const error = new Error(errorMessage);

    callApi.mockImplementation(() => Promise.reject(error));

    try {
      await storeActions[actions.CREATE_L2F](mockContext, payload);
    } catch (err) {
      if (err.message) {
        expect(1).toBe(err.message);
      }
    }

    expect(callApi).toBeCalledWith(endpoints.LINK_TO_FILL, expect.objectContaining({
      access_token: null,
      method: 'POST',
      body: JSON.stringify(payload)
    }));
    expect(mockContext.commit).toBeCalledWith(mutations.SET_ERROR, errorMessage);
  });
});
