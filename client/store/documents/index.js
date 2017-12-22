import mutations from './mutations';
import actions from './actions/';
import getters from './getters';

export default {
  state: {
    showIntegrationDocumentsPage: true,
    integrationDocumentsPageName: 'Integration Documents',
    currentPage: null,
    documentsList: [],
    total: null,
    perPage: 9,
    currentDocument: {
      name: null,
      id: null,
      type: null,
      fillable: null,
      updated: null,
      hidden: null
    },
    openDocument: {
      openDocumentMode: 'full', // can be window, modal and full
      showOpenDocumentPopUp: false,
      documentUrl: null
    },
    showEditIntegrationDocumentModal: false,
  },
  mutations,
  actions,
  getters,
};
