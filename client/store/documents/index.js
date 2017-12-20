import mutations from './mutations';
import actions from './actions';

export default {
  state: {
    currentPage: null,
    documentsList: [],
    total: null,
    perPage: 9,
    currentDocument: {
      name: null,
      id: null,
      type: null,
      fillable: null,
      lastEdited: null
    },
    openDocument: {
      openDocumentMode: 'full', // can be window, modal and full
      showOpenDocumentPopUp: false,
      documentUrl: null
    },
    showOpenDocumentPopUp: false,
  },
  mutations,
  actions,
};
