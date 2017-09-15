import Vue from 'vue';
import Vuex from 'vuex';

import mutations from './mutations';
import * as actions from './actions';
import auth from './auth';
import documents from './documents';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false,
    error: {
      showError: false,
      errorText: null
    }
  },
  modules: {
    auth,
    documents
  },
  mutations,
  actions,
  strict: process.env.NODE_ENV !== 'production'
});
