import storeMutations from '../../../store/buttons/mutations';
import constants from '../../../constants';

const { mutations } = constants;

const state = {
  s2s: { show: true, title: 's2s' }
};

describe('buttons mutations', () => {
  it('should update buttons', () => {
    const buttons = {
      s2s: { show: false, title: 'fff' }
    };
    storeMutations[mutations.UPDATE_BUTTONS_SETTINGS](state, buttons);

    expect(state.s2s.title).toBe(buttons.s2s.title);
    expect(state.s2s.show).toBe(buttons.s2s.show);
  });
});
