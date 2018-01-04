import store from '../../../store';
import storeActions from '../../../store/auth/actions';
import { parseQueryString } from '../../../helpers/utils';
import constants from '../../../constants';

jest.mock('../../../helpers/utils');

const { mutations, actions } = constants;

const mockContext = {
  commit: jest.fn(),
  state: {
    ...store.state.auth,
    authorize: false,
    state: 'state',
    redirect_uri: '*'
  },
};

describe('auth actions', () => {
  afterEach(() => {
    mockContext.commit.mockClear();
  });

  it('should set creds', () => {
    const payload = {
      client_id: 'id'
    };

    storeActions[actions.SET_CLIENT_CRED](mockContext, payload);

    expect(mockContext.commit).toBeCalledWith(mutations.SET_CLIENT_CRED, payload);
  });

  it('should set postmessage listener', () => {
    global.location = {
      hash: '11token=11'
    };
    global.addEventListener = jest.fn();
    parseQueryString.mockImplementation(() => ({
      access_token: '11',
    }));

    storeActions[actions.CHECK_AUTH_CODE](mockContext);

    expect(global.addEventListener).toBeCalledWith('message', expect.any(Function));
  });

  it('should check auth code and add listener for post message event', () => {
    global.location = {
      hash: '11token=11'
    };
    global.parent = {
      postMessage: () => {}
    };
    parseQueryString.mockImplementation(() => ({
      access_token: '11',
      state: mockContext.state.state
    }));

    storeActions[actions.CHECK_AUTH_CODE](mockContext);

    expect(parseQueryString).toBeCalledWith(global.location.hash.substr(2));
    expect(mockContext.commit).toBeCalledWith(mutations.SET_AUTH_PROCESS, true);
  });
});
