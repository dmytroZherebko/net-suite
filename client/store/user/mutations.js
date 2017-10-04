import constants from '../../constants';

const mutations = constants.mutations;

export default {
  [mutations.SET_USER_INFO]: (state, payload) => {
    state.userInfo = payload;
  },
};
