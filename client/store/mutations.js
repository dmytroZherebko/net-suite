import constants from '../constants';

const mutations = constants.mutations;

export default {
  [mutations.TOGGLE_LOADER]: (state) => {
    state.isLoading = !state.isLoading;
  },
  [mutations.SET_ERROR]: (state, payload) => {
    state.error.errorText = payload;
    state.error.showError = true;
  },
  [mutations.RESET_ERROR]: (state) => {
    state.error.errorText = null;
    state.error.showError = false;
  },
  [mutations.SET_BASE_URL]: (state, payload) => {
    state.baseUrl = payload;
  },
  [mutations.SET_PROXY]: (state, payload) => {
    state.proxy = payload;
  },
  [mutations.SET_PROXY_URL]: (state, payload) => {
    state.proxyUrl = payload;
  },
  [mutations.SET_PDFFILLER_USER_ID]: (state, payload) => {
    state.pdffillerUserId = payload;
  },
  [mutations.SET_INTEGRATION_CONFIG]: (state, payload) => {
    state.integration.name = payload.name;
    state.integration.config = payload.config;
  },
};
