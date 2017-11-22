import constants from '../../constants';

const mutations = constants.mutations;

export default {
  [mutations.LOAD_DOCUMENTS]: (state, payload) => {
    state.documentsList = payload;
  },
  [mutations.SET_CURRENT_PAGE]: (state, payload) => {
    state.currentPage = payload;
  },
  [mutations.SET_TOTAL_DOCUMENTS]: (state, payload) => {
    if (state.total !== payload) {
      state.total = payload;
    }
  },
  [mutations.SET_CURRENT_DOCUMENT]: (state, payload) => {
    state.currentDocument.id = payload.id;
    state.currentDocument.name = payload.name;
    state.currentDocument.type = payload.type;
    state.currentDocument.lastEdited = payload.updated;
  },
  [mutations.RESET_CURRENT_DOCUMENT]: (state) => {
    state.currentDocument.id = null;
    state.currentDocument.name = null;
    state.currentDocument.type = null;
    state.currentDocument.lastEdited = null;
  },
  [mutations.SET_DOCUMENT_POPUP]: (state, payload) => {
    state.showOpenDocumentPopUp = payload;
  },
  [mutations.UPDATE_NAME]: (state, { name, documentId }) => {
    state.documentsList.forEach((document) => {
      if (document.id === documentId) {
        document.name = name;
      }
    });
  }
};
