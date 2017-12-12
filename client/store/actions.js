import constants from '../constants';

const mutations = constants.mutations;

export const setError = ({ commit }, payload) => {
  commit(mutations.SET_ERROR, payload);
};

export const resetError = ({ commit }) => {
  commit(mutations.RESET_ERROR);
};

export const setBaseUrl = ({ commit }, payload) => {
  commit(mutations.SET_BASE_URL, payload);
};
