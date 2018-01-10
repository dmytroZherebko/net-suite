import storeMutations from '../../../store/auth/mutations';
import constants from '../../../constants';

const { mutations } = constants;

const state = {
  authorize_process: false,
  redirect_uri: null,
  client_id: null,
  access_token: window.localStorage.getItem('token') || null,
  state: 'api-widget',
  authorize: !!window.localStorage.getItem('token'),
  x_auth_token: null,
};

describe('auth mutations', () => {
  it('should set auth token', () => {
    const token = 'token';
    storeMutations[mutations.SET_ACCESS_TOKEN](state, token);
    expect(state.access_token).toBe(token);
    expect(state.authorize).toBeTruthy();
  });

  it('should set auth process', () => {
    storeMutations[mutations.SET_AUTH_PROCESS](state, true);
    expect(state.authorize_process).toBeTruthy();
  });

  it('should set authorize', () => {
    state.authorize = false;
    storeMutations[mutations.SET_AUTHORIZE](state, true);
    expect(state.authorize).toBeTruthy();
  });

  it('should set x auth token', () => {
    const token = 'token';
    storeMutations[mutations.SET_X_AUTH_TOKEN](state, token);
    expect(state.x_auth_token).toBe(token);
  });

  it('should set client cred', () => {
    const clientCred = {
      client_id: 'id',
      redirect_uri: 'uri',
    };
    storeMutations[mutations.SET_CLIENT_CRED](state, clientCred);
    expect(state.client_id).toBe(clientCred.client_id);
    expect(state.redirect_uri).toBe(clientCred.redirect_uri);
  });
});
