import mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';

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
      fillable: null
    },
    showOpenDocumentPopUp: false,
  },
  mutations,
  actions,
  getters
};
