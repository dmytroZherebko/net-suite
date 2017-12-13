import store from './index';
import constants from '../constants';

const { commit } = store;
const { mutations } = constants;

const preconfigStore = (config) => {
  if (config.auth) {
    commit('setClientCred', config.auth);
    commit('checkAuthCode');
  }

  if (config.openDocumentMode) {
    commit(mutations.SET_OPEN_DOCUMENT_MODE, config.openDocumentMode);
  }

  if (config.openInJsEditor) {
    commit(mutations.SET_EDITOR_MODE, config.openInJsEditor);
  }

  if (config.pdffiller && config.pdffiller.proxyUrl) {
    commit(mutations.SET_PROXY_URL, config.pdffiller.proxyUrl);
    commit(mutations.SET_PROXY, true);
  }

  if (config.baseApiUrl) {
    commit(mutations.SET_BASE_URL, config.baseApiUrl);
  }

  if (config.pdffiller && config.pdffiller.userId) {
    commit(mutations.SET_PDFFILLER_USER_ID, config.pdffiller.userId);
  }

  if (config.showInregrationDocsTab) {
    commit(mutations.SET_SHOW_INTEGRATION_DOCUMENTS_PAGE, config.showInregrationDocsTab);
  }

  if (config.integrationDocumentsTabName) {
    commit(mutations.SET_TITLE_INTEGRATION_DOCUMENTS_PAGE, config.config.integrationDocumentsTabName);
  }

  if (config.integration) {
    commit(mutations.SET_INTEGRATION_CONFIG, {
      config: config[config.integration],
      name: config.integration,
    });
  }
};

export default preconfigStore;
