import callApi from '../../helpers/api';
import { makeEndPointUrl } from '../../helpers/utils';
import { filterZohoFields, getMappedFields } from '../../helpers/zoho';
import constants from '../../constants';

const mutations = constants.mutations;
const endpoints = constants.endpoints;

export const uploadToZoho = ({ commit, rootState }) => {
  commit(mutations.TOGGLE_LOADER);
  return callApi(makeEndPointUrl(`${endpoints.DOCUMENTS}/${rootState.documents.currentDocument.id}/download`), {
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
            File: { Name: `${rootState.documents.currentDocument.name}.${rootState.documents.currentDocument.type}`, Content: blob }
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

export const fillFromZohoRecord = ({ commit, rootState, dispatch }) => {
  let pageEntity = null;
  let pageId = null;
  let pageFields = null;
  commit(mutations.TOGGLE_LOADER);
  return ZOHO.CRM.INTERACTION.getPageInfo()
    .then((pageInfo) => {
      pageEntity = pageInfo.entity;
      pageId = pageInfo.data.id;
      pageFields = filterZohoFields({ ...pageInfo.data });
      return callApi(makeEndPointUrl(`${endpoints.DOCUMENTS}/${rootState.documents.currentDocument.id}/fields`), {
        headers: {
          Authorization: `Bearer ${rootState.auth.access_token}`
        }
      });
    })
    .then((pdffillerFields) => {
      const mappedFields = getMappedFields(pdffillerFields, pageFields);

      return callApi(makeEndPointUrl(`${endpoints.DOCUMENTS}/${rootState.documents.currentDocument.id}`), {
        headers: {
          Authorization: `Bearer ${rootState.auth.access_token}`
        },
        method: 'POST',
        body: JSON.stringify({
          fillable_fields: mappedFields,
          name: rootState.documents.currentDocument.name + pageId
        })
      });
    })
    .then((filledDocumentInfo) => { // eslint-disable-line
      return callApi(makeEndPointUrl(`${endpoints.DOCUMENTS}/${filledDocumentInfo.id}/download`), {
        headers: {
          Authorization: `Bearer ${rootState.auth.access_token}`
        }
      }, true);
    })
    .then((blob) => { // eslint-disable-line
      return ZOHO.CRM.API.attachFile({
        Entity: pageEntity,
        RecordID: pageId,
        File: { Name: `${rootState.documents.currentDocument.name + pageId}.${rootState.documents.currentDocument.type}`, Content: blob }
      });
    })
    .then(() => {
      commit(mutations.TOGGLE_LOADER);
      return dispatch('getPageDocuments', { currentPage: rootState.documents.currentPage });
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
    .then((pageInfo) => {
      const pageFields = filterZohoFields({ ...pageInfo.data });
      commit(mutations.TOGGLE_LOADER);
      return pageFields;
    })
    .catch(() => {
      commit(mutations.TOGGLE_LOADER);
      commit(mutations.SET_ERROR, 'Cant get fields from Zoho');
    });
};
