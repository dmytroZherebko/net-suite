import downloadjs from 'downloadjs';

import callApi from '../../../helpers/api';
import { getFormatedDocuments, getDocumentNameWithoutExtension, getDataFromTimeStamp } from '../../../helpers/utils';
import constants from '../../../constants';

const { mutations, endpoints, actions, routes } = constants;

// variables for close open window
let editorWindow;
let doneListener;

export default {
  async [actions.GET_PAGE_DOCUMENTS]({ commit, state, getters }, payload = {}) {
    try {
      const currentPage = payload.currentPage || 1;
      commit(mutations.TOGGLE_LOADER);
      const documents = await callApi(
        getters[constants.getters.GET_DOCUMENTS_REQUEST_URL],
        getters[constants.getters.GET_DOCUMENTS_REQUEST_PARAMS](currentPage)
      );

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
      let documentIds = null;
      let documentId = null;
      if (rootState.route.name === routes.INTEGRATION_DOCUMENTS.name) {
        documentIds = await dispatch(actions.GET_INTEGRATION_DOCUMENT_PDFFILLER_ID);
      } else {
        documentId = state.currentDocument.id;
      }

      commit(mutations.TOGGLE_LOADER);
      let url = endpoints.DOCUMENT_LINK.replace('{document_id}', documentId || documentIds.projectId);
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
          if (rootState.route.name === routes.INTEGRATION_DOCUMENTS.name) {
            dispatch(actions.UPDATE_INTEGRATION_FILE_CONTENT, documentIds);
          }
        }
      };

      window.addEventListener('message', doneListener);
    } catch (err) {
      if (err.message && err.message !== 'closePopUp') {
        commit(mutations.TOGGLE_LOADER);
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

  async [actions.UPLOAD_DOCUMENT]({ commit, state, dispatch, getters }, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      commit(mutations.TOGGLE_LOADER);

      await callApi(
        getters[constants.getters.GET_UPLOAD_DOCUMENT_REQUEST_URL],
        {
          ...getters[constants.getters.GET_UPLOAD_DOCUMENT_REQUEST_PARAMS],
          method: 'POST',
          body: formData
        }
      );

      commit(mutations.TOGGLE_LOADER);
      commit(mutations.RESET_CURRENT_DOCUMENT);
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
      commit(mutations.UPDATE_NAME, { name: getDocumentNameWithoutExtension(document), documentId: state.currentDocument.id });
      commit(mutations.SET_CURRENT_DOCUMENT, {
        ...document,
        name: getDocumentNameWithoutExtension(document),
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

  [actions.RESET_DOCUMENTS_STATE]({ commit }) {
    commit(mutations.RESET_CURRENT_DOCUMENT);
    commit(mutations.RESET_LOADED_DOCUMENTS);
  },

  [actions.BROADCAST_DOCUMENT_INFO_TO_PARENT](context, document) {
    if (window.opener) {
      window.opener.postMessage(JSON.stringify(document), '*');
    }
  }
};
