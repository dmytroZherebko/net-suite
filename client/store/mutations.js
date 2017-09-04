import constants from '../constants';

const mutations = constants.mutations;

export default {
  [mutations.SET_ACCESS_TOKEN]: (state, payload) => {
    state.auth.access_token = payload;
    state.auth.authorize = true;
  },
  [mutations.SET_AUTH_PROCESS]: (state, payload) => {
    state.auth.authorize_process = payload;
  },
  [mutations.SET_CLIENT_CRED]: (state, payload) => {
    state.auth.redirect_uri = payload.redirect_uri;
    state.auth.client_secret = payload.client_secret;
    state.auth.client_id = payload.client_id;
  },
  [mutations.TOGGLE_LOADER]: (state) => {
    state.isLoading = !state.isLoading;
  },
  [mutations.LOAD_DOCUMENTS]: (state, payload) => {
    state.documents = payload;
  },
};
