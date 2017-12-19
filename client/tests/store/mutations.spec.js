import storeMutations from '../../store/mutations';
import constants from '../../constants';

const { mutations } = constants;

const state = {
  isLoading: false,
  error: {
    showError: false,
    errorText: null
  },
  filepicker: false,
  baseUrl: 'https://api.pdffiller.com',
  proxy: false,
  proxyUrl: null,
  pdffillerUserId: null,
  openInJsEditor: false,
  integration: {
    name: null,
    config: {}
  }
};

describe('root store mutations', () => {
  it('toogle loader', () => {
    storeMutations[mutations.TOGGLE_LOADER](state);
    expect(state.isLoading).toBeTruthy();
  });

  it('set error', () => {
    const error = 'error';
    storeMutations[mutations.SET_ERROR](state, error);
    expect(state.error.showError).toBeTruthy();
    expect(state.error.errorText).toBe(error);
  });

  it('reset error', () => {
    storeMutations[mutations.RESET_ERROR](state);
    expect(state.error.showError).toBeFalsy();
    expect(state.error.errorText).toBe(null);
  });

  it('set request base url', () => {
    const baseUrl = 'url';
    storeMutations[mutations.SET_BASE_URL](state, baseUrl);
    expect(state.baseUrl).toBe(baseUrl);
  });

  it('set proxy', () => {
    storeMutations[mutations.SET_PROXY](state, true);
    expect(state.proxy).toBeTruthy();
  });

  it('set proxy url', () => {
    const proxyUrl = 'url';
    storeMutations[mutations.SET_PROXY_URL](state, proxyUrl);
    expect(state.proxyUrl).toBe(proxyUrl);
  });

  it('set jsEditorMode', () => {
    storeMutations[mutations.SET_EDITOR_MODE](state, true);
    expect(state.openInJsEditor).toBeTruthy();
  });

  it('set pdffillerUserId', () => {
    const userId = '1';
    storeMutations[mutations.SET_PDFFILLER_USER_ID](state, userId);
    expect(state.pdffillerUserId).toBe(userId);
  });

  it('set integration config', () => {
    const integrationConfig = {
      name: 'integration',
      config: {
        id: 1,
        name: 'name'
      }
    };
    storeMutations[mutations.SET_INTEGRATION_CONFIG](state, integrationConfig);
    expect(state.integration.name).toBe(integrationConfig.name);
    expect(state.integration.config).toBe(integrationConfig.config);
  });
});
