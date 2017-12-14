import mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';

export default {
  state: {
    authorize_process: false,
    redirect_uri: null,
    client_id: null,
    client_secret: null,
    access_token: window.localStorage.getItem('token') || null,
    state: 'api-widget',
    authorize: !!window.localStorage.getItem('token'),
    x_auth_token: null,
  },
  mutations,
  actions,
  getters
};
