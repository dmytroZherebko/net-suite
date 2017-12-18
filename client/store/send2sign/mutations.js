import constants from '../../constants';

const mutations = constants.mutations;

export default {
  [mutations.SET_S2S_CALLBACK_URL]: (state, payload) => {
    state.defaultParams.callback_url = payload;
  },
};
