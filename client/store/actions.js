import constants from '../constants';

const mutations = constants.mutations;

export const setError = ({ commit }, payload) => {
  commit(mutations.SET_ERROR, payload);
};

export const resetError = ({ commit }) => {
  commit(mutations.RESET_ERROR);
};
