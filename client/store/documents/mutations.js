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
    state.currentDocumentId = payload;
  },
  [mutations.RESET_CURRENT_DOCUMENT]: (state) => {
    state.currentDocumentId = null;
  },
  [mutations.SET_DOCUMENT_LINK]: (state, payload) => {
    state.documentLink.editorLink = payload;
  },
  [mutations.RESET_DOCUMENT_LINK]: (state) => {
    state.documentLink.editorLink = null;
  },
  [mutations.UPDATE_NAME]: (state, { name, documentId }) => {
    state.documentsList.forEach((document) => {
      if (document.id === documentId) {
        document.name = name;
      }
    });
  }
};
