import storeActions from '../../store/actions';
import constants from '../../constants';

const { mutations, actions } = constants;

const mockContext = {
  commit: jest.fn()
};

describe('root store action', () => {
  afterEach(() => {
    mockContext.commit.mockClear();
  });

  it('set error', () => {
    const error = 'error';
    storeActions[actions.SET_ERROR](mockContext, error);
    expect(mockContext.commit).toBeCalledWith(mutations.SET_ERROR, error);
  });

  it('reset error', () => {
    storeActions[actions.RESET_ERROR](mockContext);
    expect(mockContext.commit).toBeCalledWith(mutations.RESET_ERROR);
  });
});
