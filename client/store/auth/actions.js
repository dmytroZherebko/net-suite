import callApi from '../../helpers/api';
import { parseQueryString } from '../../helpers/utils';
import constants from '../../constants';

const mutations = constants.mutations;
const endpoints = constants.endpoints;

const getAuthToken = (code, commit, state) => {
  commit(mutations.TOGGLE_LOADER);
  callApi(endpoints.AUTH, {
    method: 'POST',
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: state.client_id,
      client_secret: state.client_secret,
      redirect_uri: state.redirect_uri,
      code,
    })
  })
    .then((data) => {
      commit(mutations.TOGGLE_LOADER);
      commit(mutations.SET_ACCESS_TOKEN, data.access_token);
      window.localStorage.setItem('token', data.access_token);
    }).catch((err) => {
      commit(mutations.TOGGLE_LOADER);
      commit(mutations.SET_ERROR, err.message);
    });
};

export const checkAuthCode = ({ state, commit }) => { // eslint-disable-line
  if (!state.authorize) {
    const queryParams = parseQueryString(window.location.search.substr(1));
    if (queryParams.code && queryParams.state === state.state && window.parent) {
      const codeMessage = JSON.stringify({ code: decodeURIComponent(queryParams.code) });
      window.parent.postMessage(codeMessage, state.redirect_uri);
      commit(mutations.SET_AUTH_PROCESS, true);
      return;
    }

    function codeMessageListener(e) { // eslint-disable-line
      try {
        const code = JSON.parse(e.data).code;
        if (code) {
          getAuthToken(code, commit, state);
          window.removeEventListener('message', codeMessageListener);
        }
      } catch (err) {
        console.log(err); // eslint-disable-line
      }
    }

    window.addEventListener('message', codeMessageListener);
  }
};

export const setClientCred = ({ commit }, payload) => {
  commit(mutations.SET_CLIENT_CRED, payload);
};
