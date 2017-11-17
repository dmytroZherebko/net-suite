import Vue from 'vue';
import Vuex from 'vuex';

import mutations from './mutations';
import * as actions from './actions';
import auth from './auth';
import documents from './documents';
import link2fill from './link2fill';
import send2sign from './send2sign';
import user from './user';

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
    documents,
    link2fill,
    send2sign,
    user,
  },
  mutations,
  actions,
  strict: process.env.NODE_ENV !== 'production'
});
