import constants from '../../constants';

const mutations = constants.mutations;

export default {
  [mutations.SET_ACCESS_TOKEN]: (state, payload) => {
    state.access_token = payload;
    state.authorize = !!payload;
    if (payload) {
      window.localStorage.setItem('token', payload);
    } else {
      window.localStorage.removeItem('token');
    }
  },
  [mutations.SET_AUTH_PROCESS]: (state, payload) => {
    state.authorize_process = payload;
  },
  [mutations.SET_X_AUTH_TOKEN]: (state, payload) => {
    state.x_auth_token = payload;
  },
  [mutations.SET_AUTHORIZE]: (state, payload) => {
    state.authorize = payload;
  },
  [mutations.SET_CLIENT_CRED]: (state, payload) => {
    state.redirect_uri = payload.redirect_uri;
    state.client_id = payload.client_id;
  }
};
