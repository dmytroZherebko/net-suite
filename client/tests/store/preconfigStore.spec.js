import preconfigStore from '../../store/preconfigStore';
import store from '../../store';
import constants from '../../constants';

const { mutations } = constants;

jest.mock('../../store', () => ({
  commit: jest.fn(),
  dispatch: jest.fn(),
}));

const { commit, dispatch } = store;

describe('should preconfig store', () => {
  afterEach(() => {
    commit.mockClear();
    dispatch.mockClear();
  });

  it('set auth', () => {
    const config = {
      auth: {}
    };

    preconfigStore(config);
    expect(dispatch).toBeCalledWith('setClientCred', config.auth);
    expect(dispatch).toBeCalledWith('checkAuthCode');
  });

  it('set open document mode', () => {
    const config = {
      openDocumentMode: 'full'
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_OPEN_DOCUMENT_MODE, config.openDocumentMode);
  });

  it('set open in js editor', () => {
    const config = {
      openInJsEditor: true
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_EDITOR_MODE, config.openInJsEditor);
  });

  it('set pdffiller proxy url', () => {
    const config = {
      pdffiller: {
        proxyUrl: 'url'
      }
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_PROXY_URL, config.pdffiller.proxyUrl);
    expect(commit).toBeCalledWith(mutations.SET_PROXY, true);
  });

  it('set auth', () => {
    const config = {
      pdffiller: {
        userId: 'url'
      }
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_PDFFILLER_USER_ID, config.pdffiller.userId);
  });

  it('set base api url', () => {
    const config = {
      baseApiUrl: 'full'
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_BASE_URL, config.baseApiUrl);
  });

  it('set show integration documents tab', () => {
    const config = {
      showIntegrationDocumentsTab: true
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_SHOW_INTEGRATION_DOCUMENTS_PAGE, config.showIntegrationDocumentsTab);
  });

  it('set show integration documents tab name', () => {
    const config = {
      integrationDocumentsTabName: 'name'
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_TITLE_INTEGRATION_DOCUMENTS_PAGE, config.integrationDocumentsTabName);
  });

  it('set x auth token', () => {
    const config = {
      x_auth_token: 'token'
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_X_AUTH_TOKEN, config.x_auth_token);
  });

  it('set integration config', () => {
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

  it('set s2s_callback_url', () => {
    const config = {
      s2s_callback_url: 'token'
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_S2S_CALLBACK_URL, config.s2s_callback_url);
  });

  it('set l2f_callback_url', () => {
    const config = {
      l2f_callback_url: 'token'
    };

    preconfigStore(config);
    expect(commit).toBeCalledWith(mutations.SET_L2F_CALLBACK_URL, config.l2f_callback_url);
  });
});
