import storeMutations from '../../../store/user/mutations';
import constants from '../../../constants';

const { mutations } = constants;

const state = {
  userInfo: null
};

describe('user mutations', () => {
  it('should set user', () => {
    const userMock = {
      email: 'email'
    };
    storeMutations[mutations.SET_USER_INFO](state, userMock);
    expect(state.userInfo).toBe(userMock);
  });
});
