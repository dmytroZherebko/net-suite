import Vue from 'vue';
import Vuex from 'vuex';

import mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    documents: null,
    isLoading: false,
    auth: {
      authorize_process: false,
      redirect_uri: null,
      client_id: null,
      client_secret: null,
      access_token: null,
      state: 'api-widget',
      authorize: false
    }
  },

  mutations,
  actions,
  getters
});
