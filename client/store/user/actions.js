import callApi from '../../helpers/api';
import constants from '../../constants';

const { mutations, endpoints } = constants;

export const getUserInfo = async({ commit, rootState, state }) => { // eslint-disable-line
  if (!state.user_info) {
    const user = await callApi(`${rootState.baseUrl}${endpoints.USER_INFO}`, {
      access_token: rootState.auth.access_token,
    });
    commit(mutations.SET_USER_INFO, user);
  }
};
