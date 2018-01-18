import mutations from './mutations';
import actions from './actions/';
import getters from './getters';

export default {
  state: {
    showIntegrationDocumentsPage: true,
    showMyDocumentsTab: true,
    integrationDocumentsPageName: 'Integration Documents',
    unavailableDocumentMessage: 'You can\'t work with this document, it is unavailable.',
    updateOpenedDocumentMessage: 'We update opened file. It can take some time.',
    showUpdateOpenedDocumentPopUp: false,
    currentPage: null,
    documentsList: [],
    total: null,
    perPage: 9,
    currentDocument: {
      name: null,
      id: 1,
      type: null,
      fillable: null,
      updated: null,
      hidden: true
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
