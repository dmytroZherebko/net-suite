import callApi from '../../helpers/api';
import { makeEndPointUrl } from '../../helpers/utils';
import constants from '../../constants';

const mutations = constants.mutations;
const endpoints = constants.endpoints;

export const getUserInfo = async({ commit, rootState, state }) => { // eslint-disable-line
  if (!state.user_info) {
    const user = await callApi(makeEndPointUrl(endpoints.USER_INFO), {
      access_token: rootState.auth.access_token,
    });
    commit(mutations.SET_USER_INFO, user);
  }
};
