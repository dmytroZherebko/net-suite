import callApi from '../helpers/api';
import { parseQueryString } from '../helpers/utils';
import constants from '../constants';

const mutations = constants.mutations;
const endpoints = constants.endpoints;

const getAuthToken = (code, commit, state) => {
  commit(mutations.TOGGLE_LOADER);
  callApi(endpoints.AUTH, {
    method: 'POST',
    body: {
      grant_type: 'authorization_code',
      client_id: state.auth.client_id,
      client_secret: state.auth.client_secret,
      redirect_uri: state.auth.redirect_uri,
      code,
    }
  })
    .then((data) => {
      commit(mutations.TOGGLE_LOADER);
      commit('SET_ACCESS_TOKEN', data.access_token);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const checkAuthCode = ({ state, commit }) => { // eslint-disable-line
  const queryParams = parseQueryString(window.location.search.substr(1));
  if (queryParams.code && queryParams.state === state.auth.state && window.parent) {
    const codeMessage = JSON.stringify({ code: decodeURIComponent(queryParams.code) });
    window.parent.postMessage(codeMessage, state.auth.redirect_uri);
    commit(mutations.SET_AUTH_PROCESS, true);
    return;
  }

  function codeMessageListener(e) {
    try {
      const code = JSON.parse(e.data).code;
      if (code) {
        commit(mutations.SET_AUTH_PROCESS, true);
        getAuthToken(code, commit, state);
        window.removeEventListener('message', codeMessageListener);
      }
    } catch (err) {
      console.log(err);
    }
  }

  window.addEventListener('message', codeMessageListener);
};

export const setClientCred = ({ commit }, payload) => {
  commit(mutations.SET_CLIENT_CRED, payload);
};

export const loadDocuments = ({ commit, state }) => {
  commit(mutations.TOGGLE_LOADER);
  callApi(endpoints.DOCUMENTS, {
    headers: {
      Authorization: `Bearer ${state.auth.access_token}`
    }
  })
    .then((documents) => {
      commit(mutations.TOGGLE_LOADER);
      commit(mutations.LOAD_DOCUMENTS, documents);
    });
};
