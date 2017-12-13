import constants from '../../constants';

const mutations = constants.mutations;

export default {
  [mutations.LOAD_INTEGRATION_DOCUMENTS]: (state, payload) => {
    state.documentsList = payload;
  },
  [mutations.SET_SHOW_INTEGRATION_DOCUMENTS_PAGE]: (state, payload) => {
    state.showIntegrationDocumentsPage = payload;
  },
  [mutations.SET_TITLE_INTEGRATION_DOCUMENTS_PAGE]: (state, payload) => {
    state.integrationDocumentsPageName = payload;
  },
  [mutations.SET_INTEGRATION_CURRENT_PAGE]: (state, payload) => {
    state.currentPage = payload;
  },
  [mutations.SET_INTEGRATION_TOTAL_DOCUMENTS]: (state, payload) => {
    if (state.total !== payload) {
      state.total = payload;
    }
  },
  [mutations.SET_INTEGRATION_CURRENT_DOCUMENT]: (state, payload) => {
    state.currentDocument.id = payload.id;
    state.currentDocument.name = payload.name;
    state.currentDocument.type = payload.type;
    state.currentDocument.hidden = payload.hidden;
  },
  [mutations.RESET_INTEGRATION_CURRENT_DOCUMENT]: (state) => {
    state.currentDocument.id = null;
    state.currentDocument.name = null;
    state.currentDocument.type = null;
    state.currentDocument.hidden = null;
  }
};
