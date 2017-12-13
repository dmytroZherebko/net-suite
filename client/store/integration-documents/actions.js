import callApi from '../../helpers/api';
import { getDataFromTimeStamp, getDocumentNameWithoutExtention } from '../../helpers/utils';
import constants from '../../constants';

const { mutations, endpoints } = constants;

export const getIntegrationPageDocuments = async ({ commit, state, rootState }, payload = {}) => {
  try {
    const currentPage = payload.currentPage || 1;
    commit(mutations.TOGGLE_LOADER);
    const documents = await callApi(endpoints.DOCUMENTS, {
      query: {
        page: currentPage,
        per_page: state.perPage
      },
      access_token: rootState.auth.access_token,
    });

    const formatted = documents.items.map((doc) => {
      doc.name = getDocumentNameWithoutExtention(doc);
      doc.updated = getDataFromTimeStamp(doc.updated * 1000);
      doc.created = getDataFromTimeStamp(doc.created * 1000);
      return doc;
    });

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
};

export const uploadIntegrationDocumentToPdffiller = async ({ commit, state, rootState }) => {
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
    throw new Error(err);
  }
};

export const setIntegrationCurrentDocument = ({ commit }, document) => {
  commit(mutations.SET_INTEGRATION_CURRENT_DOCUMENT, document);
};

export const resetIntegrationCurrentDocument = ({ commit }) => {
  commit(mutations.RESET_INTEGRATION_CURRENT_DOCUMENT);
};
