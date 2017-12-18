import callApi from '../../helpers/api';
import { removeUselessS2SKeys } from '../../helpers/utils';
import constants from '../../constants';

const { mutations, endpoints } = constants;

export const createSendToSign = async({ commit, rootState, state}, payload) => { // eslint-disable-line
  try {
    const s2sData = removeUselessS2SKeys(payload);

    if (s2sData.callback_url) {
      s2sData.callback_url = `${s2sData.callback_url}&project_id=${state.documents.currentDocument.id}`;
    }

    commit(mutations.TOGGLE_LOADER);

    await callApi(endpoints.SEND_TO_SIGN, {
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
