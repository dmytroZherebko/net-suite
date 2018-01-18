import constants from '../constants';

const { mutations } = constants;

export default {
  updateOpenedDocumentMessage: mutations.SET_UPDATE_OPENED_DOCUMENT_MESSAGE,
  unavailableDocumentMessage: mutations.SET_UNAVAILABLE_DOCUMENT_MESSAGE,
  buttons: mutations.UPDATE_BUTTONS_SETTINGS,
  l2f_callback_url: mutations.SET_L2F_CALLBACK_URL,
  s2s_callback_url: mutations.SET_S2S_CALLBACK_URL,
  x_auth_token: mutations.SET_X_AUTH_TOKEN,
  integrationDocumentsTabName: mutations.SET_TITLE_INTEGRATION_DOCUMENTS_PAGE,
  showMyDocumentsTab: mutations.SET_SHOW_MY_DOCUMENTS_TAB,
  showIntegrationDocumentsTab: mutations.SET_SHOW_INTEGRATION_DOCUMENTS_TAB,
  baseApiUrl: mutations.SET_BASE_URL,
  openInJsEditor: mutations.SET_EDITOR_MODE,
  openDocumentMode: mutations.SET_OPEN_DOCUMENT_MODE,
};
