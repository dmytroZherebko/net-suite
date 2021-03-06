import preconfigStore from '../../store/preconfigStore';
import store from '../../store';
import constants from '../../constants';

const { mutations, actions } = constants;

jest.mock('../../store', () => ({
  commit: jest.fn(),
  dispatch: jest.fn(),
}));

const { commit, dispatch } = store;

describe('preconfig store', () => {
  afterEach(() => {
    commit.mockClear();
    dispatch.mockClear();
  });

  it('should set auth', () => {
    const config = {
      auth: {}
    };

    preconfigStore(config);
    expect(dispatch).toBeCalledWith(actions.SET_CLIENT_CRED, config.auth);
    expect(dispatch).toBeCalledWith(actions.CHECK_AUTH_CODE);
  });

  it('should set authorize when no auth in config', () => {
    const config = {};

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_AUTHORIZE, true);
  });

  it('should set open document mode', () => {
    const config = {
      openDocumentMode: 'full'
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_OPEN_DOCUMENT_MODE, config.openDocumentMode);
  });

  it('should set open in js editor', () => {
    const config = {
      openInJsEditor: true
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_EDITOR_MODE, config.openInJsEditor);
  });

  it('should set pdffiller proxy url', () => {
    const config = {
      pdffiller: {
        proxyUrl: 'url'
      }
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_PROXY_URL, config.pdffiller.proxyUrl);
    expect(commit).toBeCalledWith(mutations.SET_PROXY, true);
  });

  it('should set auth', () => {
    const config = {
      pdffiller: {
        userId: 'url'
      }
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_PDFFILLER_USER_ID, config.pdffiller.userId);
  });

  it('should set base api url', () => {
    const config = {
      baseApiUrl: 'full'
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_BASE_URL, config.baseApiUrl);
  });

  it('should set show integration documents tab', () => {
    const config = {
      showIntegrationDocumentsTab: false
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_SHOW_INTEGRATION_DOCUMENTS_TAB, config.showIntegrationDocumentsTab);
  });

  it('should set show my documents tab', () => {
    const config = {
      showMyDocumentsTab: false
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_SHOW_MY_DOCUMENTS_TAB, config.showMyDocumentsTab);
  });

  it('should set set unavailableDocumentMessage', () => {
    const config = {
      unavailableDocumentMessage: 'message'
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_UNAVAILABLE_DOCUMENT_MESSAGE, config.unavailableDocumentMessage);
  });

  it('should set show integration documents tab name', () => {
    const config = {
      integrationDocumentsTabName: 'name'
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_TITLE_INTEGRATION_DOCUMENTS_PAGE, config.integrationDocumentsTabName);
  });

  it('should set update opened document message', () => {
    const config = {
      updateOpenedDocumentMessage: 'name'
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_UPDATE_OPENED_DOCUMENT_MESSAGE, config.updateOpenedDocumentMessage);
  });

  it('should set x auth token', () => {
    const config = {
      x_auth_token: 'token'
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_X_AUTH_TOKEN, config.x_auth_token);
  });

  it('should set integration config', () => {
    const config = {
      integration: 'token',
      token: {
        configProp: 'prop'
      }
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_INTEGRATION_CONFIG, {
      config: config[config.integration],
      name: config.integration,
    });
  });

  it('should set s2s_callback_url', () => {
    const config = {
      s2s_callback_url: 'token'
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_S2S_CALLBACK_URL, config.s2s_callback_url);
  });

  it('should set l2f_callback_url', () => {
    const config = {
      l2f_callback_url: 'token'
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_L2F_CALLBACK_URL, config.l2f_callback_url);
  });

  it('should set buttons', () => {
    const config = {
      buttons: {
        s2s: { show: false }
      }
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.UPDATE_BUTTONS_SETTINGS, config.buttons);
  });
});
