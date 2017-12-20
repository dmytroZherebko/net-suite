import callApi from '../../helpers/api';
import constants from '../../constants';

const { mutations, endpoints, actions } = constants;

export default {
  async [actions.CREATE_L2F]({ commit, rootState }, payload) {
    try {
      if (payload.additional_documents.length === 0) {
        delete payload.additional_documents;
      }

      if (payload.callback_url) {
        payload.callback_url = `${payload.callback_url}&project_id=${rootState.documents.currentDocument.id}`;
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
  }
};
