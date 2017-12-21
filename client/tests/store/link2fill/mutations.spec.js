import storeMutations from '../../../store/link2fill/mutations';
import constants from '../../../constants';

const { mutations } = constants;

const state = {
  defaultParams: {
    callback_url: null
  }
};

describe('l2f mutations', () => {
  it('should set l2f callback url', () => {
    const url = 'url';
    storeMutations[mutations.SET_L2F_CALLBACK_URL](state, url);
    expect(state.defaultParams.callback_url).toBe(url);
  });
});
