import callApi from '../../helpers/api';
import { makeEndPointUrl, removeUselessS2SKeys } from '../../helpers/utils';
import constants from '../../constants';

const { mutations, endpoints } = constants;

export const createSendToSign = async({ commit, rootState}, payload) => { // eslint-disable-line
  try {
    const s2sData = removeUselessS2SKeys(payload);

    commit(mutations.TOGGLE_LOADER);

    await callApi(makeEndPointUrl(endpoints.SEND_TO_SIGN), {
      method: 'POST',
      access_token: rootState.auth.access_token,
      body: JSON.stringify(s2sData)
    });

    commit(mutations.TOGGLE_LOADER);
  } catch (err) {
    commit(mutations.TOGGLE_LOADER);
    if (err.message) {
      commit(mutations.SET_ERROR, err.message);
    }
    throw new Error();
  }
};
