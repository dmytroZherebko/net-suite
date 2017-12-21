import storeMutations from '../../../store/send2sign/mutations';
import constants from '../../../constants';

const { mutations } = constants;

const state = {
  defaultParams: {
    callback_url: null
  }
};

describe('s2s mutations', () => {
  it('should set s2s callback url', () => {
    const url = 'url';
    storeMutations[mutations.SET_S2S_CALLBACK_URL](state, url);
    expect(state.defaultParams.callback_url).toBe(url);
  });
});
