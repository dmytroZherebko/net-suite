import callApi from '../../helpers/api';
import { makeEndPointUrl } from '../../helpers/utils';
import constants from '../../constants';

const mutations = constants.mutations;
const endpoints = constants.endpoints;

export const getUserInfo = ({ commit, rootState, state }) => { // eslint-disable-line
  if (!state.user_info) {
    callApi(makeEndPointUrl(endpoints.USER_INFO), {
      headers: {
        Authorization: `Bearer ${rootState.auth.access_token}`
      }
    })
      .then((user) => {
        commit(mutations.SET_USER_INFO, user);
      });
  }
};
