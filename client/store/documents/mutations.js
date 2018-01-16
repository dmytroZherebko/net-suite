import constants from '../../constants';

const mutations = constants.mutations;

export default {
  [mutations.LOAD_DOCUMENTS]: (state, payload) => {
    state.documentsList = payload;
  },
  [mutations.RESET_LOADED_DOCUMENTS]: (state) => {
    state.documentsList = [];
  },
  [mutations.SET_CURRENT_PAGE]: (state, payload) => {
    state.currentPage = payload;
  },
  [mutations.SET_TOTAL_DOCUMENTS]: (state, payload) => {
    if (state.total !== payload) {
      state.total = payload;
    }
  },
  [mutations.SET_SHOW_INTEGRATION_DOCUMENTS_TAB]: (state, payload) => {
    state.showIntegrationDocumentsPage = payload;
  },
  [mutations.SET_UNAVAILABLE_DOCUMENT_MESSAGE]: (state, payload) => {
    state.unavailableDocumentMessage = payload;
  },
  [mutations.SET_SHOW_MY_DOCUMENTS_TAB]: (state, payload) => {
    state.showMyDocumentsTab = payload;
  },
  [mutations.SET_TITLE_INTEGRATION_DOCUMENTS_PAGE]: (state, payload) => {
    state.integrationDocumentsPageName = payload;
  },
  [mutations.SET_CURRENT_DOCUMENT]: (state, payload) => {
    state.currentDocument.id = payload.id;
    state.currentDocument.name = payload.name;
    state.currentDocument.type = payload.type;
    state.currentDocument.fillable = payload.fillable;
    state.currentDocument.updated = payload.updated;
    state.currentDocument.hidden = payload.hidden || null;
  },
  [mutations.RESET_CURRENT_DOCUMENT]: (state) => {
    state.currentDocument.id = null;
    state.currentDocument.name = null;
    state.currentDocument.type = null;
    state.currentDocument.fillable = null;
    state.currentDocument.updated = null;
    state.currentDocument.hidden = null;
  },
  [mutations.SET_OPEN_DOCUMENT_POPUP]: (state, payload) => {
    state.openDocument.showOpenDocumentPopUp = payload;
  },
  [mutations.SET_EDIT_INTEGRATION_DOCUMENT_NAME_POPUP]: (state, payload) => {
    state.showEditIntegrationDocumentModal = payload;
  },
  [mutations.SET_OPEN_DOCUMENT_URL]: (state, payload) => {
    state.openDocument.documentUrl = payload;
  },
  [mutations.SET_OPEN_DOCUMENT_MODE]: (state, payload) => {
    state.openDocument.openDocumentMode = payload;
  },
  [mutations.UPDATE_NAME]: (state, { name, documentId }) => {
    state.documentsList.forEach((document) => {
      if (document.id === documentId) {
        document.name = name;
      }
    });
  }
};
