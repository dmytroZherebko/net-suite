import callApi from '../../helpers/api';
import { makeEndPointUrl } from '../../helpers/utils';
import { filterZohoFields, getMappedFields } from '../../helpers/zoho';
import constants from '../../constants';

const mutations = constants.mutations;
const endpoints = constants.endpoints;

export const uploadToZoho = async ({ commit, rootState }) => {
  try {
    commit(mutations.TOGGLE_LOADER);
    const fileBlob = await callApi(makeEndPointUrl(`${endpoints.DOCUMENTS}/${rootState.documents.currentDocument.id}/download`), {
      access_token: rootState.auth.access_token,
    }, true);

    const pageInfo = await ZOHO.CRM.INTERACTION.getPageInfo();
    await ZOHO.CRM.API.attachFile({
      Entity: pageInfo.entity,
      RecordID: pageInfo.data.id,
      File: {
        Name: `${rootState.documents.currentDocument.name}.${rootState.documents.currentDocument.type}`,
        Content: fileBlob
      }
    });

    commit(mutations.TOGGLE_LOADER);
    return true;
  } catch (err) {
    commit(mutations.TOGGLE_LOADER);
    if (err.message) {
      commit(mutations.SET_ERROR, err.message);
    }
    throw new Error(err);
  }
};

export const fillFromZohoRecord = async ({ commit, rootState, dispatch }) => {
  try {
    commit(mutations.TOGGLE_LOADER);

    const pageInfo = await ZOHO.CRM.INTERACTION.getPageInfo();
    const pageEntity = pageInfo.entity;
    const pageId = pageInfo.data.id;
    const pageFields = filterZohoFields({ ...pageInfo.data });

    const fillableUrl = makeEndPointUrl(`${endpoints.DOCUMENTS}/${rootState.documents.currentDocument.id}/fields`);
    const pdffillerFields = await callApi(fillableUrl, {
      access_token: rootState.auth.access_token,
    });

    const mappedFields = getMappedFields(pdffillerFields, pageFields);

    const fillUrl = makeEndPointUrl(`${endpoints.DOCUMENTS}/${rootState.documents.currentDocument.id}`);
    const filledDocumentInfo = await callApi(fillUrl, {
      access_token: rootState.auth.access_token,
      method: 'POST',
      body: JSON.stringify({
        fillable_fields: mappedFields,
        name: rootState.documents.currentDocument.name + pageId
      })
    });

    const uploadFileUrl = makeEndPointUrl(`${endpoints.DOCUMENTS}/${filledDocumentInfo.id}/download`);
    const uploadedFile = await callApi(uploadFileUrl, {
      access_token: rootState.auth.access_token
    }, true);

    await ZOHO.CRM.API.attachFile({
      Entity: pageEntity,
      RecordID: pageId,
      File: {
        Name: `${rootState.documents.currentDocument.name + pageId}.${rootState.documents.currentDocument.type}`,
        Content: uploadedFile
      }
    });

    commit(mutations.TOGGLE_LOADER);
    return dispatch('getPageDocuments', { currentPage: rootState.documents.currentPage });
  } catch (err) {
    commit(mutations.TOGGLE_LOADER);
    if (err.message) {
      commit(mutations.SET_ERROR, err.message);
    }
    throw new Error(err);
  }
};

export const getZohoFieldsData = async ({ commit }) => {
  try {
    commit(mutations.TOGGLE_LOADER);
    const pageInfo = await ZOHO.CRM.INTERACTION.getPageInfo();
    const pageFields = filterZohoFields({ ...pageInfo.data });
    commit(mutations.TOGGLE_LOADER);
    return pageFields;
  } catch (err) {
    commit(mutations.TOGGLE_LOADER);
    commit(mutations.SET_ERROR, 'Cant get fields from Zoho');
  }
};
