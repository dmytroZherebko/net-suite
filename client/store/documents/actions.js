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
      dispatch('getPageDocuments', page);
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
  callApi(makeEndPointUrl(endpoints.DOCUMENTS), {
    headers: {
      Authorization: `Bearer ${rootState.auth.access_token}`
    },
    method: 'POST',
    body: formData
  })
    .then(() => {
      commit(mutations.TOGGLE_LOADER);
      dispatch('getPageDocuments', state.currentPage);
    }).catch((err) => {
      commit(mutations.TOGGLE_LOADER);
      if (err.message) {
        commit(mutations.SET_ERROR, err.message);
      }
    });
};

export const updateDocumentName = ({ commit, rootState }, { documentId, newName }) => {
  commit(mutations.TOGGLE_LOADER);
  callApi(makeEndPointUrl(`${endpoints.DOCUMENTS}/${documentId}`), {
    headers: {
      Authorization: `Bearer ${rootState.auth.access_token}`
    },
    method: 'PUT',
    body: JSON.stringify({
      name: newName
    })
  })
    .then((doc) => {
      commit(mutations.TOGGLE_LOADER);
      commit(mutations.UPDATE_NAME, { name: getDocumentNameWithoutExtention(doc), documentId });
    }).catch((err) => {
      commit(mutations.TOGGLE_LOADER);
      if (err.message) {
        commit(mutations.SET_ERROR, err.message);
      }
    });
};

export const getPageDocuments = ({ commit, state, rootState }, currentPage = 1) => {
  commit(mutations.TOGGLE_LOADER);
  callApi(makeEndPointUrl(endpoints.DOCUMENTS), {
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
    }).catch((err) => {
      commit(mutations.TOGGLE_LOADER);
      if (err.message) {
        commit(mutations.SET_ERROR, err.message);
      }
    });
};
