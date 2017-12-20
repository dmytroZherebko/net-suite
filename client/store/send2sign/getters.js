import constants from '../../constants';

const { getters } = constants;


export default {
  [getters.GET_S2S_DEFAULT_PARAMS](state) {
    const params = { ...state.defaultParams };
    return params;
  },

  [getters.GET_S2S_DEFAULT_RECIPIENT](state, getters, rootState) { // eslint-disable-line
    const params = { ...state.defaultRecipient };
    const email = rootState.user.userInfo && rootState.user.userInfo.email;
    if (email) {
      params.message_subject = params.message_subject + email;
    }

    return params;
  }
};
