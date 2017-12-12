import store from './index';

const { dispatch } = store;

const preconfigStore = (config) => {
  if (config.auth) {
    dispatch('setClientCred', config.auth);
    dispatch('checkAuthCode');
  }

  if (config.mode) {
    dispatch('setOpenDocumentMode', config.mode);
  }

  if (config.baseUrl) {
    dispatch('setBaseUrl', config.baseUrl);
  }
};

export default preconfigStore;
