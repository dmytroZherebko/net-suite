import store from '../../../store';
import storeGetters from '../../../store/link2fill/getters';
import constants from '../../../constants';

const { getters, mutations } = constants;

const mockState = {
  defaultParams: {
    ...store.state.link2fill.defaultParams
  },
};

describe('l2f getters', () => {
  it('should get correct default params', () => {
    const params = storeGetters[getters.GET_L2F_DEFAULT_PARAMS](mockState, null, store.state);
    expect(params).toEqual(expect.objectContaining({
      ...store.state.link2fill.defaultParams,
    }));
  });

  it('should get correct default params with user in notifications emails', () => {
    const userMock = {
      email: 'email'
    };

    store.commit(mutations.SET_USER_INFO, userMock);
    const params = storeGetters[getters.GET_L2F_DEFAULT_PARAMS](mockState, null, store.state);
    expect(params).toEqual(expect.objectContaining({
      ...store.state.link2fill.defaultParams,
      notification_emails: [userMock]
    }));
  });
});
