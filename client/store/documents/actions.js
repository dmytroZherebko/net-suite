import downloadjs from 'downloadjs';

import callApi from '../../helpers/api';
import { getDataFromTimeStamp, getDocumentNameWithoutExtention, makeEndPointUrl } from '../../helpers/utils';
import constants from '../../constants';

const mutations = constants.mutations;
const endpoints = constants.endpoints;

export const deleteDocumentById = ({ commit, state, dispatch, rootState }, payload) => {
  commit(mutations.TOGGLE_LOADER);
  callApi(makeEndPointUrl(`${endpoints.DOCUMENTS}/${payload}`), {
    headers: {
      Authorization: `Bearer ${rootState.auth.access_token}`
    },
    method: 'DELETE'
  })
    .then(() => {
      commit(mutations.TOGGLE_LOADER);
      const { documentsList, currentPage } = state;
      const page = documentsList.length > 1 ? currentPage : currentPage - 1;
      dispatch('getPageDocuments', { currentPage: page });
    }).catch((err) => {
      commit(mutations.TOGGLE_LOADER);
      if (err.message) {
        commit(mutations.SET_ERROR, err.message);
      }
    });
};

export const uploadDocument = ({ commit, state, dispatch, rootState }, file) => {
  const formData = new FormData();
  formData.append('file', file);
  commit(mutations.TOGGLE_LOADER);
  return callApi(makeEndPointUrl(endpoints.DOCUMENTS), {
    headers: {
      Authorization: `Bearer ${rootState.auth.access_token}`
    },
    method: 'POST',
    body: formData
  })
    .then(() => {
      commit(mutations.TOGGLE_LOADER);
      return dispatch('getPageDocuments', {
        currentPage: state.currentPage
      });
    }).catch((err) => {
      commit(mutations.TOGGLE_LOADER);
      if (err.message) {
        commit(mutations.SET_ERROR, err.message);
      }
      throw new Error(err);
    });
};

export const updateDocumentName = ({ commit, rootState, state }, { newName }) => {
  commit(mutations.TOGGLE_LOADER);
  callApi(makeEndPointUrl(`${endpoints.DOCUMENTS}/${state.currentDocument.id}`), {
    headers: {
      Authorization: `Bearer ${rootState.auth.access_token}`
    },
    method: 'PUT',
    body: JSON.stringify({
      name: newName
    })
  })
    .then((doc) => {
      commit(mutations.UPDATE_NAME, { name: getDocumentNameWithoutExtention(doc), documentId: state.currentDocument.id });
      commit(mutations.TOGGLE_LOADER);
    }).catch((err) => {
      commit(mutations.TOGGLE_LOADER);
      if (err.message) {
        commit(mutations.SET_ERROR, err.message);
      }
    });
};

export const getPageDocuments = ({ commit, state, rootState }, payload = {}) => {
  const currentPage = payload.currentPage || 1;
  commit(mutations.TOGGLE_LOADER);
  return callApi(makeEndPointUrl(endpoints.DOCUMENTS), {
    query: {
      page: currentPage,
      per_page: state.perPage
    },
    headers: {
      Authorization: `Bearer ${rootState.auth.access_token}`
    }
  })
    .then((documents) => {
      const documentsWithFormatedDate = documents.items.map((doc) => {
        doc.name = getDocumentNameWithoutExtention(doc);
        doc.updated = getDataFromTimeStamp(doc.updated * 1000);
        doc.created = getDataFromTimeStamp(doc.created * 1000);
        return doc;
      });
      commit(mutations.TOGGLE_LOADER);
      commit(mutations.SET_CURRENT_PAGE, currentPage);
      commit(mutations.SET_TOTAL_DOCUMENTS, documents.total);
      commit(mutations.LOAD_DOCUMENTS, documentsWithFormatedDate);
      if (payload.setFirstAsCurrent) {
        commit(mutations.SET_CURRENT_DOCUMENT, documents.items[0]);
      }
    }).catch((err) => {
      commit(mutations.TOGGLE_LOADER);
      if (err.message) {
        commit(mutations.SET_ERROR, err.message);
      }
    });
};

let doneListener;

export const openDocumentEditor = ({ commit, rootState, state, dispatch }) => {
  commit(mutations.TOGGLE_LOADER);
  callApi(makeEndPointUrl(endpoints.DOCUMENT_LINK.replace('{document_id}', state.currentDocument.id)), {
    headers: {
      Authorization: `Bearer ${rootState.auth.access_token}`
    }
  })
    .then((res) => {
      commit(mutations.TOGGLE_LOADER);
      commit(mutations.SET_DOCUMENT_LINK, res.location);
      doneListener = (e) => {
        if (e.data === 'editorDone') {
          dispatch('closeDocumentEditor');
        }
      };

      window.addEventListener('message', doneListener);
    }).catch((err) => {
      commit(mutations.TOGGLE_LOADER);
      if (err.message) {
        commit(mutations.SET_ERROR, err.message);
      }
    });
};

export const downloadDocument = ({ commit, state, rootState }) => {
  commit(mutations.TOGGLE_LOADER);
  callApi(makeEndPointUrl(`${endpoints.DOCUMENTS}/${state.currentDocument.id}/download`), {
    headers: {
      Authorization: `Bearer ${rootState.auth.access_token}`
    }
  }, true)
    .then((blob) => {
      downloadjs(blob, `${state.currentDocument.name}.${state.currentDocument.type}`);
      commit(mutations.TOGGLE_LOADER);
    }).catch((err) => {
      commit(mutations.TOGGLE_LOADER);
      if (err.message) {
        commit(mutations.SET_ERROR, err.message);
      }
    });
};

export const uploadToZoho = ({ commit, state, rootState }) => {
  commit(mutations.TOGGLE_LOADER);
  return callApi(makeEndPointUrl(`${endpoints.DOCUMENTS}/${state.currentDocument.id}/download`), {
    headers: {
      Authorization: `Bearer ${rootState.auth.access_token}`
    }
  }, true)
    .then((blob) => { // eslint-disable-line
      return ZOHO.CRM.INTERACTION.getPageInfo()
        .then((page) => { // eslint-disable-line
          return ZOHO.CRM.API.attachFile({
            Entity: page.entity,
            RecordID: page.data.id,
            File: { Name: `${state.currentDocument.name}.${state.currentDocument.type}`, Content: blob }
          });
        });
    })
    .then(() => {
      commit(mutations.TOGGLE_LOADER);
      return true;
    })
    .catch((err) => {
      commit(mutations.TOGGLE_LOADER);
      if (err.message) {
        commit(mutations.SET_ERROR, err.message);
      }
      throw new Error(err);
    });
};

export const getZohoFieldsData = ({ commit }) => {
  commit(mutations.TOGGLE_LOADER);
  return ZOHO.CRM.INTERACTION.getPageInfo()
    .then((fields) => {
      console.log(fields);
      commit(mutations.TOGGLE_LOADER);
      return fields;
    })
    .catch(() => {
      commit(mutations.TOGGLE_LOADER);
      commit(mutations.SET_ERROR, 'Cant get fields from Zoho');
    });
};

export const closeDocumentEditor = ({ commit }) => {
  commit(mutations.RESET_DOCUMENT_LINK);
  window.removeEventListener('message', doneListener);
};

export const setCurrentDocument = ({ commit }, document) => {
  commit(mutations.SET_CURRENT_DOCUMENT, document);
};

export const resetCurrentDocument = ({ commit }) => {
  commit(mutations.RESET_CURRENT_DOCUMENT);
};
