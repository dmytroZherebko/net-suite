import mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';

export default {
  state: {
    currentPage: null,
    documentsList: [],
    total: null,
    perPage: 10,
    currentDocumentId: null,
    documentLink: {
      editorLink: null,
      hash: null
    }
  },
  mutations,
  actions,
  getters
};
