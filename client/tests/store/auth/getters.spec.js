import storeGetters from '../../../store/auth/getters';
import constants from '../../../constants';

const { getters } = constants;

const mockState = {
  authorize: true
};

describe('auth getters', () => {
  it('should return true because authorize true', () => {
    const routeName = 'documents';
    const access = storeGetters[getters.CHECK_ACCESS_TO_PAGE](mockState)(routeName);
    expect(access).toBeTruthy();
  });

  it('should return true because authorize page', () => {
    const routeName = 'authorize';
    mockState.authorize = false;
    const access = storeGetters[getters.CHECK_ACCESS_TO_PAGE](mockState)(routeName);
    expect(access).toBeTruthy();
  });

  it('should return false page not authorize and authorize in store false', () => {
    const routeName = 'documents';
    mockState.authorize = false;
    const access = storeGetters[getters.CHECK_ACCESS_TO_PAGE](mockState)(routeName);
    expect(access).toBeFalsy();
  });
});
