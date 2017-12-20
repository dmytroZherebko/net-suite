import constants from '../constants';

const { mutations, actions } = constants;

export default {
  [actions.SET_ERROR]({ commit }, payload) {
    commit(mutations.SET_ERROR, payload);
  },

  [actions.RESET_ERROR]({ commit }) {
    commit(mutations.RESET_ERROR);
  }
};
