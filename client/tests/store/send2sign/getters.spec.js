import store from '../../../store';
import storeGetters from '../../../store/send2sign/getters';
import constants from '../../../constants';

jest.mock('../../../helpers/api');
jest.mock('../../../helpers/utils');

const { getters, mutations } = constants;

const mockState = {
  defaultParams: {
    ...store.state.send2sign.defaultParams
  },
  defaultRecipient: {
    ...store.state.send2sign.defaultRecipient
  }
};

describe('s2s getters', () => {
  it('should get correct default params', () => {
    const params = storeGetters[getters.GET_S2S_DEFAULT_PARAMS](mockState);
    expect(params).toEqual(expect.objectContaining({
      ...store.state.send2sign.defaultParams
    }));
  });

  it('should get correct default recipient', () => {
    const userInfo = {
      email: 'mail'
    };

    store.commit(mutations.SET_USER_INFO, userInfo);

    const params = storeGetters[getters.GET_S2S_DEFAULT_RECIPIENT](mockState, null, store.state);

    expect(params).toEqual(expect.objectContaining({
      ...store.state.send2sign.defaultRecipient,
      message_subject: store.state.send2sign.defaultRecipient.message_subject + userInfo.email
    }));
  });
});
