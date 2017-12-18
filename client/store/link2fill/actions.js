import callApi from '../../helpers/api';
import constants from '../../constants';

const { mutations, endpoints } = constants;

export const createLinkToFill = async ({ commit, rootState, state }, payload) => { // eslint-disable-line
  try {
    if (payload.additional_documents.length === 0) {
      delete payload.additional_documents;
    }

    if (payload.callback_url) {
      payload.callback_url = `${payload.callback_url}&project_id=${state.documents.currentDocument.id}`;
    }

    commit(mutations.TOGGLE_LOADER);
    const { url } = await callApi(endpoints.LINK_TO_FILL, {
      method: 'POST',
      access_token: rootState.auth.access_token,
      body: JSON.stringify(payload)
    });
    commit(mutations.TOGGLE_LOADER);

    return url;
  } catch (err) {
    commit(mutations.TOGGLE_LOADER);
    if (err.message) {
      commit(mutations.SET_ERROR, err.message);
    }
    throw new Error();
  }
};
