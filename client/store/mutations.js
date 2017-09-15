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
};
