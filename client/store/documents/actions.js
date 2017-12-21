import downloadjs from 'downloadjs';

import callApi from '../../helpers/api';
import { getFormatedDocuments, getDocumentNameWithoutExtention, getDataFromTimeStamp } from '../../helpers/utils';
import constants from '../../constants';

const { mutations, endpoints, actions } = constants;

// variables for close open window
let editorWindow;
let doneListener;

export default {
  async [actions.GET_PAGE_DOCUMENTS]({ commit, state, rootState }, payload = {}) {
    try {
      const currentPage = payload.currentPage || 1;
      commit(mutations.TOGGLE_LOADER);
      const documents = await callApi(endpoints.DOCUMENTS, {
        query: {
          page: currentPage,
          per_page: state.perPage
        },
        access_token: rootState.auth.access_token,
      });

      const formatted = getFormatedDocuments(documents);

      commit(mutations.TOGGLE_LOADER);
      commit(mutations.SET_CURRENT_PAGE, currentPage);
      commit(mutations.SET_TOTAL_DOCUMENTS, documents.total);
      commit(mutations.LOAD_DOCUMENTS, formatted);
      if (payload.setFirstAsCurrent) {
        commit(mutations.SET_CURRENT_DOCUMENT, documents.items[0]);
      } else {
        const currentDocument = formatted.find(doc => doc.id === state.currentDocument.id);
        if (currentDocument) commit(mutations.SET_CURRENT_DOCUMENT, currentDocument);
      }
    } catch (err) {
      commit(mutations.TOGGLE_LOADER);
      if (err.message) {
        commit(mutations.SET_ERROR, err.message);
      }
    }
  },

  async [actions.OPEN_DOCUMENT_EDITOR]({ commit, rootState, state, dispatch }) {
    try {
      commit(mutations.TOGGLE_LOADER);
      let url = endpoints.DOCUMENT_LINK.replace('{document_id}', state.currentDocument.id);
      url = rootState.openInJsEditor ? `${url}&editor_type=JS_NEW` : url;
      const { location } = await callApi(url, {
        access_token: rootState.auth.access_token,
      });

      commit(mutations.TOGGLE_LOADER);
      commit(mutations.SET_OPEN_DOCUMENT_POPUP, true);

      if (state.openDocument.openDocumentMode === 'window') {
        editorWindow = window.open(location, 'Editor');
      } else {
        commit(mutations.SET_OPEN_DOCUMENT_URL, location);
      }

      doneListener = (e) => {
        if (e.data === 'editorDone') {
          dispatch(actions.CLOSE_DOCUMENT_EDITOR);
        }
      };

      window.addEventListener('message', doneListener);
    } catch (err) {
      commit(mutations.TOGGLE_LOADER);
      if (err.message) {
        commit(mutations.SET_ERROR, err.message);
      }
    }
  },

  [actions.CLOSE_DOCUMENT_EDITOR]({ commit, dispatch, state }) {
    if (editorWindow && editorWindow.close) {
      editorWindow.close();
    }
    window.removeEventListener('message', doneListener);
    commit(mutations.SET_OPEN_DOCUMENT_POPUP, false);
    commit(mutations.SET_OPEN_DOCUMENT_URL, null);
    dispatch(actions.GET_PAGE_DOCUMENTS, {
      currentPage: state.currentPage
    });
  },

  async [actions.UPLOAD_DOCUMENT]({ commit, state, dispatch, rootState }, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      commit(mutations.TOGGLE_LOADER);

      await callApi(endpoints.DOCUMENTS, {
        access_token: rootState.auth.access_token,
        method: 'POST',
        body: formData
      });

      commit(mutations.TOGGLE_LOADER);
      return dispatch(actions.GET_PAGE_DOCUMENTS, {
        currentPage: state.currentPage
      });
    } catch (err) {
      commit(mutations.TOGGLE_LOADER);
      if (err.message) {
        commit(mutations.SET_ERROR, err.message);
      }
      throw new Error();
    }
  },

  async [actions.DELETE_DOCUMENT_BY_ID]({ commit, state, dispatch, rootState }) {
    try {
      commit(mutations.TOGGLE_LOADER);
      await callApi(`${endpoints.DOCUMENTS}/${state.currentDocument.id}`, {
        access_token: rootState.auth.access_token,
        method: 'DELETE'
      });

      commit(mutations.TOGGLE_LOADER);
      const { documentsList, currentPage } = state;
      const page = documentsList.length > 1 ? currentPage : currentPage - 1;
      return dispatch(actions.GET_PAGE_DOCUMENTS, { currentPage: page });
    } catch (err) {
      commit(mutations.TOGGLE_LOADER);
      if (err.message) {
        commit(mutations.SET_ERROR, err.message);
      }
    }
  },

  async [actions.UPDATE_DOCUMENT_NAME]({ commit, rootState, state }, { name }) {
    try {
      commit(mutations.TOGGLE_LOADER);
      const document = await callApi(`${endpoints.DOCUMENTS}/${state.currentDocument.id}`, {
        access_token: rootState.auth.access_token,
        method: 'PUT',
        body: JSON.stringify({
          name
        })
      });
      commit(mutations.UPDATE_NAME, { name: getDocumentNameWithoutExtention(document), documentId: state.currentDocument.id });
      commit(mutations.SET_CURRENT_DOCUMENT, {
        ...document,
        name: getDocumentNameWithoutExtention(document),
        updated: getDataFromTimeStamp(document.updated * 1000)
      });
      commit(mutations.TOGGLE_LOADER);
    } catch (err) {
      commit(mutations.TOGGLE_LOADER);
      if (err.message) {
        commit(mutations.SET_ERROR, err.message);
      }
    }
  },

  async [actions.DOWNLOAD_DOCUMENT]({ commit, state, rootState }) {
    try {
      commit(mutations.TOGGLE_LOADER);
      const fileBlob = await callApi(`${endpoints.DOCUMENTS}/${state.currentDocument.id}/download`, {
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
  },

  [actions.SET_CURRENT_DOCUMENT]({ commit }, document) {
    commit(mutations.SET_CURRENT_DOCUMENT, document);
  },

  [actions.RESET_CURRENT_DOCUMENT]({ commit }) {
    commit(mutations.RESET_CURRENT_DOCUMENT);
  },

  [actions.BROADCAST_DOCUMENT_INFO_TO_PARRENT](context, document) {
    if (window.opener) {
      window.opener.postMessage(JSON.stringify(document), '*');
    }
  }
};
