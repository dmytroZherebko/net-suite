import callApi from '../helpers/api';
import { parseQueryString, getDataFromTimeStamp } from '../helpers/utils';
import constants from '../constants';

const mutations = constants.mutations;
const endpoints = constants.endpoints;

const getAuthToken = (code, commit, state) => {
  commit(mutations.TOGGLE_LOADER);
  callApi(endpoints.AUTH, {
    method: 'POST',
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: state.auth.client_id,
      client_secret: state.auth.client_secret,
      redirect_uri: state.auth.redirect_uri,
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
  if (!state.auth.authorize) {
    const queryParams = parseQueryString(window.location.search.substr(1));
    if (queryParams.code && queryParams.state === state.auth.state && window.parent) {
      const codeMessage = JSON.stringify({ code: decodeURIComponent(queryParams.code) });
      window.parent.postMessage(codeMessage, state.auth.redirect_uri);
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

export const deleteDocumentById = ({ commit, state, dispatch }, payload) => {
  commit(mutations.TOGGLE_LOADER);
  callApi(`${endpoints.DOCUMENTS}/${payload}`, {
    headers: {
      Authorization: `Bearer ${state.auth.access_token}`
    },
    method: 'DELETE'
  })
    .then(() => {
      commit(mutations.TOGGLE_LOADER);
      const { documents } = state;
      const page = documents.documentsList.length > 1 ? documents.currentPage : documents.currentPage - 1;
      dispatch('getPageDocuments', page);
    }).catch((err) => {
      commit(mutations.TOGGLE_LOADER);
      commit(mutations.SET_ERROR, err.message);
    });
};

export const uploadDocument = ({ commit, state, dispatch }, file) => {
  const formData = new FormData();
  formData.append('file', file);
  commit(mutations.TOGGLE_LOADER);
  callApi(endpoints.DOCUMENTS, {
    headers: {
      Authorization: `Bearer ${state.auth.access_token}`
    },
    method: 'POST',
    body: formData
  })
    .then(() => {
      commit(mutations.TOGGLE_LOADER);
      dispatch('getPageDocuments', state.documents.currentPage);
    }).catch((err) => {
      commit(mutations.TOGGLE_LOADER);
      commit(mutations.SET_ERROR, err.message);
    });
};

export const updateDocumentName = ({ commit, state }, { documentId, newName }) => {
  commit(mutations.TOGGLE_LOADER);
  callApi(`${endpoints.DOCUMENTS}/${documentId}`, {
    headers: {
      Authorization: `Bearer ${state.auth.access_token}`
    },
    method: 'PUT',
    body: JSON.stringify({
      name: newName
    })
  })
    .then(({ name }) => {
      commit(mutations.TOGGLE_LOADER);
      commit(mutations.UPDATE_NAME, { name, documentId });
    }).catch((err) => {
      commit(mutations.TOGGLE_LOADER);
      commit(mutations.SET_ERROR, err.message);
    });
};

export const getPageDocuments = ({ commit, state }, currentPage = 1) => {
  commit(mutations.TOGGLE_LOADER);
  callApi(endpoints.DOCUMENTS, {
    query: {
      page: currentPage,
      per_page: state.documents.perPage
    },
    headers: {
      Authorization: `Bearer ${state.auth.access_token}`
    }
  })
    .then((documents) => {
      const documentsWithFormatedDate = documents.items.map((doc) => {
        doc.updated = getDataFromTimeStamp(doc.updated * 1000);
        doc.created = getDataFromTimeStamp(doc.created * 1000);
        return doc;
      });
      commit(mutations.TOGGLE_LOADER);
      commit(mutations.SET_CURRENT_PAGE, currentPage);
      commit(mutations.SET_TOTAL_DOCUMENTS, documents.total);
      commit(mutations.LOAD_DOCUMENTS, documentsWithFormatedDate);
    }).catch((err) => {
      commit(mutations.TOGGLE_LOADER);
      commit(mutations.SET_ERROR, err.message);
    });
};

export const setError = ({ commit }, payload) => {
  commit(mutations.SET_ERROR, payload);
};

export const resetError = ({ commit }) => {
  commit(mutations.RESET_ERROR);
};
