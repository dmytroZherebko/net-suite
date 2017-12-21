import callApi from '../../helpers/api';
import constants from '../../constants';

const { mutations, endpoints, actions } = constants;

export default {
  async [actions.GET_USER_INFO]({ commit, rootState }) {
    const user = await callApi(endpoints.USER_INFO, {
      access_token: rootState.auth.access_token,
    });
    commit(mutations.SET_USER_INFO, user);
  }
};
