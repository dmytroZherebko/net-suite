import mutations from './mutations';
import * as actions from './actions';

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
      hidden: false,
    },
  },
  mutations,
  actions,
};
