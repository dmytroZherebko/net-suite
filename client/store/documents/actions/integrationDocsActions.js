import callApi from '../../../helpers/api';
import constants from '../../../constants';

const { mutations, endpoints, actions } = constants;

// mock function that will replaced when promise will created
let resolveNamePopUpPromise = () => {};
let rejectNamePopUpPromise = () => {};

export default {
  async [actions.UPLOAD_INTEGRATION_DOCUMENT_TO_PDFFILLER]({ commit, state, rootState }) {
    try {
      commit(mutations.TOGGLE_LOADER);
      await callApi(`${rootState.integration.name}${endpoints.INTEGRATION_DOCUMENTS}/${state.currentDocument.id}/download`, {
        method: 'POST',
        noPdfillerApi: true,
        query: {
          ...rootState.integration.config,
        }
      });

      commit(mutations.TOGGLE_LOADER);
    } catch (err) {
      commit(mutations.TOGGLE_LOADER);
      if (err.message) {
        commit(mutations.SET_ERROR, err.message);
      }
      throw new Error();
    }
  },

  async [actions.GET_INTEGRATION_DOCUMENT_PDFFILLER_ID]({ commit, dispatch }) {
    commit(mutations.SET_EDIT_INTEGRATION_DOCUMENT_NAME_POPUP, true);
    const name = await dispatch(actions.WAITING_FOR_INTEGRATION_DOCUMENT_NEW_NAME);
    const { projectId, fileId } = await dispatch(actions.CREATE_INTEGRATION_DOCUMENT_IN_PDFFILLER, name);

    return { projectId, fileId };
  },

  [actions.ACCEPT_INTEGRATION_DOC_NAME_POPUP]({ commit }, name) { // hide pop up and resolve promise with new document name
    commit(mutations.SET_EDIT_INTEGRATION_DOCUMENT_NAME_POPUP, false);
    resolveNamePopUpPromise(name);
  },

  [actions.REJECT_INTEGRATION_DOC_NAME_POPUP]({ commit }) {
    commit(mutations.SET_EDIT_INTEGRATION_DOCUMENT_NAME_POPUP, false);
    rejectNamePopUpPromise(new Error('closePopUp'));
  },

  async [actions.WAITING_FOR_INTEGRATION_DOCUMENT_NEW_NAME]() { // create promise that will resolve when user click "ok" in edit name popup or reject when "cancel"
    const promise = new Promise((resolve, reject) => {
      resolveNamePopUpPromise = resolve;
      rejectNamePopUpPromise = reject;
    });

    return promise;
  },

  async [actions.CREATE_INTEGRATION_DOCUMENT_IN_PDFFILLER]({ commit, state, rootState }, { name } = {}) {
    try {
      commit(mutations.TOGGLE_LOADER);
      const { projectId, fileId } = await callApi(`${rootState.integration.name}${endpoints.INTEGRATION_CREATE_PROJECT}`, {
        method: 'POST',
        noPdfillerApi: true,
        query: {
          ...rootState.integration.config,
        },
        body: JSON.stringify({
          fileId: state.currentDocument.id,
          oldFileName: state.currentDocument.name,
          newFileName: name || state.currentDocument.name,
        })
      });

      commit(mutations.TOGGLE_LOADER);

      return { projectId, fileId };
    } catch (err) {
      commit(mutations.TOGGLE_LOADER);
      if (err.message) {
        commit(mutations.SET_ERROR, err.message);
      }
      throw new Error();
    }
  },

  async [actions.UPDATE_INTEGRATION_FILE_CONTENT]({ rootState }, documentIds) {
    await callApi(`${rootState.integration.name}${endpoints.UPDATE_INTEGRATION_FILE_CONTENT}`, {
      method: 'POST',
      noPdfillerApi: true,
      query: {
        ...rootState.integration.config,
      },
      body: JSON.stringify(documentIds)
    });
  },

  async [actions.UPLOAD_DOCUMENT_TO_INTEGRATION]({ commit, rootState }) {
    try {
      commit(mutations.TOGGLE_LOADER);

      await callApi(`${rootState.integration.name}${endpoints.UPLOAD_TO_INTEGRATION}/${rootState.documents.currentDocument.id}`, {
        method: 'POST',
        noPdfillerApi: true,
        query: {
          ...rootState.integration.config,
        }
      });

      commit(mutations.TOGGLE_LOADER);
    } catch (err) {
      commit(mutations.TOGGLE_LOADER);
      if (err.message) {
        commit(mutations.SET_ERROR, err.message);
      }
      throw new Error(err);
    }
  }
};
