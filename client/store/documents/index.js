import mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';

export default {
  state: {
    currentPage: null,
    documentsList: null,
    total: null,
    perPage: 10
  },
  mutations,
  actions,
  getters
};
