import store from '../../../store';
import storeActions from '../../../store/user/actions';
import callApi from '../../../helpers/api';
import constants from '../../../constants';

jest.mock('../../../helpers/api');

const { mutations, actions, endpoints } = constants;

const mockContext = {
  commit: jest.fn(),
  rootState: store.state,
  state: store.state.user
};

describe('user actions', () => {
  afterEach(() => {
    mockContext.commit.mockClear();
    callApi.mockClear();
  });

  it('should set user info', async () => {
    const mockApiAnswer = {
      email: 'email'
    };
    callApi.mockImplementation(() => Promise.resolve(mockApiAnswer));
    await storeActions[actions.GET_USER_INFO](mockContext);
    expect(callApi).toBeCalledWith(endpoints.USER_INFO, expect.objectContaining({ access_token: null }));
    expect(mockContext.commit).toBeCalledWith(mutations.SET_USER_INFO, mockApiAnswer);
  });
});
