import mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';

export default {
  state: {
    currentPage: null,
    documentsList: [],
    total: null,
    perPage: 10,
    currentDocument: {
      name: null,
      id: null,
      type: null
    },
    showOpenDocumentPopUp: false,
  },
  mutations,
  actions,
  getters
};
