import downloadjs from 'downloadjs';

import callApi from '../../helpers/api';
import { getDataFromTimeStamp, getDocumentNameWithoutExtention, makeEndPointUrl } from '../../helpers/utils';
import constants from '../../constants';

const mutations = constants.mutations;
const endpoints = constants.endpoints;

export const deleteDocumentById = async ({ commit, state, dispatch, rootState }, payload) => {
  try {
    commit(mutations.TOGGLE_LOADER);
    await callApi(makeEndPointUrl(`${endpoints.DOCUMENTS}/${payload}`), {
      access_token: rootState.auth.access_token,
      method: 'DELETE'
    });

    commit(mutations.TOGGLE_LOADER);
    const { documentsList, currentPage } = state;
    const page = documentsList.length > 1 ? currentPage : currentPage - 1;
    return dispatch('getPageDocuments', { currentPage: page });
  } catch (err) {
    commit(mutations.TOGGLE_LOADER);
    if (err.message) {
      commit(mutations.SET_ERROR, err.message);
    }
  }
};

export const uploadDocument = async ({ commit, state, dispatch, rootState }, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    commit(mutations.TOGGLE_LOADER);

    await callApi(makeEndPointUrl(endpoints.DOCUMENTS), {
      access_token: rootState.auth.access_token,
      method: 'POST',
      body: formData
    });

    commit(mutations.TOGGLE_LOADER);
    return dispatch('getPageDocuments', {
      currentPage: state.currentPage
    });
  } catch (err) {
    commit(mutations.TOGGLE_LOADER);
    if (err.message) {
      commit(mutations.SET_ERROR, err.message);
    }
    throw new Error(err);
  }
};

export const updateDocumentName = async ({ commit, rootState, state }, { newName }) => {
  try {
    commit(mutations.TOGGLE_LOADER);
    const document = await callApi(makeEndPointUrl(`${endpoints.DOCUMENTS}/${state.currentDocument.id}`), {
      access_token: rootState.auth.access_token,
      method: 'PUT',
      body: JSON.stringify({
        name: newName
      })
    });
    commit(mutations.UPDATE_NAME, { name: getDocumentNameWithoutExtention(document), documentId: state.currentDocument.id });
    commit(mutations.TOGGLE_LOADER);
  } catch (err) {
    commit(mutations.TOGGLE_LOADER);
    if (err.message) {
      commit(mutations.SET_ERROR, err.message);
    }
  }
};

export const getPageDocuments = async ({ commit, state, rootState }, payload = {}) => {
  try {
    const currentPage = payload.currentPage || 1;
    commit(mutations.TOGGLE_LOADER);
    const documents = await callApi(makeEndPointUrl(endpoints.DOCUMENTS), {
      query: {
        page: currentPage,
        per_page: state.perPage
      },
      access_token: rootState.auth.access_token,
    });

    const formatted = documents.items.map((doc) => {
      doc.name = getDocumentNameWithoutExtention(doc);
      doc.updated = getDataFromTimeStamp(doc.updated * 1000);
      doc.created = getDataFromTimeStamp(doc.created * 1000);
      return doc;
    });

    commit(mutations.TOGGLE_LOADER);
    commit(mutations.SET_CURRENT_PAGE, currentPage);
    commit(mutations.SET_TOTAL_DOCUMENTS, documents.total);
    commit(mutations.LOAD_DOCUMENTS, formatted);
    if (payload.setFirstAsCurrent) {
      commit(mutations.SET_CURRENT_DOCUMENT, documents.items[0]);
    }
  } catch (err) {
    commit(mutations.TOGGLE_LOADER);
    if (err.message) {
      commit(mutations.SET_ERROR, err.message);
    }
  }
};

let editorWindow;
let doneListener;

export const openDocumentEditor = async ({ commit, rootState, state, dispatch }) => {
  try {
    commit(mutations.TOGGLE_LOADER);
    const { location } = await callApi(makeEndPointUrl(endpoints.DOCUMENT_LINK.replace('{document_id}', state.currentDocument.id)), {
      access_token: rootState.auth.access_token,
    });

    commit(mutations.TOGGLE_LOADER);
    commit(mutations.SET_DOCUMENT_POPUP, true);
    editorWindow = window.open(location, 'Editor');

    doneListener = (e) => {
      if (e.data === 'editorDone') {
        dispatch('closeDocumentEditor');
      }
    };

    window.addEventListener('message', doneListener);
  } catch (err) {
    commit(mutations.TOGGLE_LOADER);
    if (err.message) {
      commit(mutations.SET_ERROR, err.message);
    }
  }
};

export const closeDocumentEditor = ({ commit, dispatch, state }) => {
  if (editorWindow) {
    editorWindow.close();
  }
  window.removeEventListener('message', doneListener);
  commit(mutations.SET_DOCUMENT_POPUP, false);
  dispatch('getPageDocuments', {
    currentPage: state.currentPage
  });
};

export const downloadDocument = async ({ commit, state, rootState }) => {
  try {
    commit(mutations.TOGGLE_LOADER);
    const fileBlob = await callApi(makeEndPointUrl(`${endpoints.DOCUMENTS}/${state.currentDocument.id}/download`), {
      access_token: rootState.auth.access_token,
    }, true);
    downloadjs(fileBlob, `${state.currentDocument.name}.${state.currentDocument.type}`);
    commit(mutations.TOGGLE_LOADER);
  } catch (err) {
    commit(mutations.TOGGLE_LOADER);
    if (err.message) {
      commit(mutations.SET_ERROR, err.message);
    }
  }
};

export const setCurrentDocument = ({ commit }, document) => {
  commit(mutations.SET_CURRENT_DOCUMENT, document);
};

export const resetCurrentDocument = ({ commit }) => {
  commit(mutations.RESET_CURRENT_DOCUMENT);
};
