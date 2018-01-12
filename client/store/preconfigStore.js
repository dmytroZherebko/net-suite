import store from './index';
import constants from '../constants';

const { commit, dispatch } = store;
const { mutations, actions } = constants;

const preconfigStore = (config) => {
  if (config.auth) {
    dispatch(actions.SET_CLIENT_CRED, config.auth);
    dispatch(actions.CHECK_AUTH_CODE);
  } else {
    commit(mutations.SET_AUTHORIZE, true); // if no auth credential we can`t use implicit flow, so expected that integration use own auth on backend
  }

  if (config.hasOwnProperty('openDocumentMode')) {
    commit(mutations.SET_OPEN_DOCUMENT_MODE, config.openDocumentMode);
  }

  if (config.hasOwnProperty('openInJsEditor')) {
    commit(mutations.SET_EDITOR_MODE, config.openInJsEditor);
  }

  if (config.hasOwnProperty('pdffiller') && config.pdffiller.hasOwnProperty('proxyUrl')) {
    commit(mutations.SET_PROXY_URL, config.pdffiller.proxyUrl);
    commit(mutations.SET_PROXY, true);
  }

  if (config.hasOwnProperty('pdffiller') && config.pdffiller.hasOwnProperty('userId')) {
    commit(mutations.SET_PDFFILLER_USER_ID, config.pdffiller.userId);
  }

  if (config.hasOwnProperty('baseApiUrl')) {
    commit(mutations.SET_BASE_URL, config.baseApiUrl);
  }

  if (config.hasOwnProperty('showIntegrationDocumentsTab')) {
    commit(mutations.SET_SHOW_INTEGRATION_DOCUMENTS_TAB, config.showIntegrationDocumentsTab);
  }

  if (config.hasOwnProperty('showMyDocumentsTab')) {
    commit(mutations.SET_SHOW_MY_DOCUMENTS_TAB, config.showMyDocumentsTab);
  }

  if (config.hasOwnProperty('integrationDocumentsTabName')) {
    commit(mutations.SET_TITLE_INTEGRATION_DOCUMENTS_PAGE, config.integrationDocumentsTabName);
  }

  if (config.hasOwnProperty('x_auth_token')) {
    commit(mutations.SET_X_AUTH_TOKEN, config.x_auth_token);
  }

  if (config.hasOwnProperty('integration')) {
    commit(mutations.SET_INTEGRATION_CONFIG, {
      config: config[config.integration],
      name: config.integration,
    });
  }

  if (config.hasOwnProperty('s2s_callback_url')) {
    commit(mutations.SET_S2S_CALLBACK_URL, config.s2s_callback_url);
  }

  if (config.hasOwnProperty('l2f_callback_url')) {
    commit(mutations.SET_L2F_CALLBACK_URL, config.l2f_callback_url);
  }

  if (config.hasOwnProperty('buttons')) {
    commit(mutations.UPDATE_BUTTONS_SETTINGS, config.buttons);
  }
};

export default preconfigStore;
