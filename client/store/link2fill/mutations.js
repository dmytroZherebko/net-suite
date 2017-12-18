import constants from '../../constants';

const mutations = constants.mutations;

export default {
  [mutations.SET_L2F_CALLBACK_URL]: (state, payload) => {
    state.defaultParams.callback_url = payload;
  },
};
