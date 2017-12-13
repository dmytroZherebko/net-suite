import mutations from './mutations';
import * as actions from './actions';

export default {
  state: {
    showIntegrationDocumentsPage: false,
    integrationDocumentsPageName: 'Integration Docs',
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
