import { parseQueryString } from '../../helpers/utils';
import constants from '../../constants';

const { mutations, actions } = constants;

export default {
  [actions.CHECK_AUTH_CODE]({ state, commit }) {
    if (!state.authorize) {
      const queryParams = parseQueryString(window.location.hash.substr(2));

      if (queryParams.access_token && queryParams.state === state.state && window.parent) {
        const codeMessage = JSON.stringify({ access_token: decodeURIComponent(queryParams.access_token) });

        window.parent.postMessage(codeMessage, state.redirect_uri);
        commit(mutations.SET_AUTH_PROCESS, true);
        return;
      }

      function codeMessageListener(e) { // eslint-disable-line
        try {
          const token = JSON.parse(e.data).access_token;
          if (token) {
            commit(mutations.SET_ACCESS_TOKEN, token);
            window.removeEventListener('message', codeMessageListener);
          }
        } catch (err) {
          console.log(err); // eslint-disable-line
        }
      }

      window.addEventListener('message', codeMessageListener);
    }
  },

  [actions.SET_CLIENT_CRED]({ commit }, payload) {
    commit(mutations.SET_CLIENT_CRED, payload);
  }
};
