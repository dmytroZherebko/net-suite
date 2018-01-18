import store from './index';
import constants from '../constants';
import configSchema from '../helpers/configSchema';

const { commit, dispatch } = store;
const { mutations, actions } = constants;

const preconfigStore = (config) => {
  if (config.auth) {
    dispatch(actions.SET_CLIENT_CRED, config.auth);
    dispatch(actions.CHECK_AUTH_CODE);
  } else {
    commit(mutations.SET_AUTHORIZE, true); // if no auth credential we can`t use implicit flow, so expected that integration use own auth on backend
  }

  if (config.hasOwnProperty('integration')) {
    commit(mutations.SET_INTEGRATION_CONFIG, {
      config: config[config.integration],
      name: config.integration,
    });
  }

  if (config.hasOwnProperty('pdffiller') && config.pdffiller.hasOwnProperty('proxyUrl')) {
    commit(mutations.SET_PROXY_URL, config.pdffiller.proxyUrl);
    commit(mutations.SET_PROXY, true);
  }

  if (config.hasOwnProperty('pdffiller') && config.pdffiller.hasOwnProperty('userId')) {
    commit(mutations.SET_PDFFILLER_USER_ID, config.pdffiller.userId);
  }

  Object.keys(config).forEach((key) => {
    if (configSchema.hasOwnProperty(key)) {
      commit(configSchema[key], config[key]);
    }
  });
};

export default preconfigStore;
