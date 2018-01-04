import store from '../../../store';
import storeActions from '../../../store/send2sign/actions';
import callApi from '../../../helpers/api';
import constants from '../../../constants';
import { removeUselessS2SKeys } from '../../../helpers/utils';

jest.mock('../../../helpers/api');
jest.mock('../../../helpers/utils');

const { mutations, actions, endpoints } = constants;

const mockContext = {
  commit: jest.fn(),
  rootState: store.state,
};

describe('send2sign actions', () => {
  afterEach(() => {
    callApi.mockClear();
    mockContext.commit.mockClear();
  });

  it('should create s2s', async () => {
    const mockApiAnswer = {};
    const payload = {
      ...store.state.send2sign.defaultParams
    };

    callApi.mockImplementation(() => Promise.resolve(mockApiAnswer));
    removeUselessS2SKeys.mockImplementation(() => payload);

    await storeActions[actions.CREATE_S2S](mockContext, payload);

    expect(callApi).toBeCalledWith(endpoints.SEND_TO_SIGN, expect.objectContaining({
      access_token: null,
      method: 'POST',
      body: JSON.stringify(payload)
    }));
    expect(removeUselessS2SKeys).toBeCalledWith(payload);
  });

  it('should update callback url added current document before create s2s', async () => {
    const url = 'url';
    const currentDocument = {
      id: 1
    };

    store.commit(mutations.SET_CURRENT_DOCUMENT, currentDocument);
    store.commit(mutations.SET_S2S_CALLBACK_URL, url);

    const mockApiAnswer = {};
    const payload = {
      ...store.state.send2sign.defaultParams
    };

    callApi.mockImplementation(() => Promise.resolve(mockApiAnswer));
    removeUselessS2SKeys.mockImplementation(() => payload);

    await storeActions[actions.CREATE_S2S](mockContext, payload);
    expect(callApi).toBeCalledWith(endpoints.SEND_TO_SIGN, expect.objectContaining({
      access_token: null,
      method: 'POST',
      body: JSON.stringify(payload)
    }));

    expect(payload.callback_url).toBe(`${url}&project_id=${currentDocument.id}`);
  });

  it('should catch error', async () => {
    const payload = {
      ...store.state.send2sign.defaultParams
    };
    const errorMessage = 'error';
    const error = new Error(errorMessage);

    callApi.mockImplementation(() => Promise.reject(error));
    removeUselessS2SKeys.mockImplementation(() => payload);

    try {
      await storeActions[actions.CREATE_S2S](mockContext, payload);
    } catch (err) {
      if (err.message) {
        expect(1).toBe(err.message);
      }
    }

    expect(callApi).toBeCalledWith(endpoints.SEND_TO_SIGN, expect.objectContaining({
      access_token: null,
      method: 'POST',
      body: JSON.stringify(payload)
    }));
    expect(mockContext.commit).toBeCalledWith(mutations.SET_ERROR, errorMessage);
  });
});
