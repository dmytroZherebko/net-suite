import callApi from '../../helpers/api';
import { getFormatedDocuments } from '../../helpers/utils';
import constants from '../../constants';

const { mutations, endpoints, actions } = constants;

export default {
  async [actions.GET_INTEGRATIONS_PAGE_DOCUMENTS]({ commit, state, rootState }, payload = {}) {
    try {
      const currentPage = payload.currentPage || 1;
      commit(mutations.TOGGLE_LOADER);
      const documents = await callApi(`${rootState.integration.name}${endpoints.INTEGRATION_DOCUMENTS}`, {
        query: {
          page: currentPage,
          per_page: state.perPage,
          ...rootState.integration.config
        },
        noPdfillerApi: true,
      });

      const formatted = getFormatedDocuments(documents);

      commit(mutations.TOGGLE_LOADER);
      commit(mutations.SET_INTEGRATION_CURRENT_PAGE, currentPage);
      commit(mutations.SET_INTEGRATION_TOTAL_DOCUMENTS, documents.total);
      commit(mutations.LOAD_INTEGRATION_DOCUMENTS, formatted);

      if (payload.setFirstAsCurrent) {
        commit(mutations.SET_INTEGRATION_CURRENT_DOCUMENT, documents.items[0]);
      } else {
        const currentDocument = formatted.find(doc => doc.id === state.currentDocument.id);
        if (currentDocument) commit(mutations.SET_INTEGRATION_CURRENT_DOCUMENT, currentDocument);
      }
    } catch (err) {
      commit(mutations.TOGGLE_LOADER);
      if (err.message) {
        commit(mutations.SET_ERROR, err.message);
      }
    }
  },

  async [actions.UPLOAD_INTEGRATION_DOCUMENT_TO_PDFFILLER]({ commit, state, rootState }) {
    try {
      commit(mutations.TOGGLE_LOADER);
      await callApi(`${rootState.integration.name}${endpoints.INTEGRATION_DOCUMENTS}/${state.currentDocument.id}/download`, {
        method: 'POST',
        noPdfillerApi: true,
        query: {
          ...rootState.integration.config,
        }
      });

      commit(mutations.TOGGLE_LOADER);
    } catch (err) {
      commit(mutations.TOGGLE_LOADER);
      if (err.message) {
        commit(mutations.SET_ERROR, err.message);
      }
      throw new Error();
    }
  },

  [actions.SET_INTEGRATION_CURRENT_DOCUMENT]({ commit }, document) {
    commit(mutations.SET_INTEGRATION_CURRENT_DOCUMENT, document);
  },

  [actions.RESET_INTEGRATION_CURRENT_DOCUMENT]({ commit }) {
    commit(mutations.RESET_INTEGRATION_CURRENT_DOCUMENT);
  }
};
