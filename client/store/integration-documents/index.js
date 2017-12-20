import mutations from './mutations';
import actions from './actions';

export default {
  state: {
    showIntegrationDocumentsPage: false,
    integrationDocumentsPageName: 'Integration Documents',
    currentPage: null,
    documentsList: [],
    total: null,
    perPage: 9,
    currentDocument: {
      name: null,
      id: null,
      type: null,
      hidden: false,
    },
  },
  mutations,
  actions,
};
