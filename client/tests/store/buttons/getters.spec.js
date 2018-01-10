import store from '../../../store';
import storeGetters from '../../../store/buttons/getters';
import constants from '../../../constants';

const { getters, routes } = constants;

const mockState = {
  ...store.state.buttons
};

const rootState = {
  route: {
    name: routes.DOCUMENTS.name
  }
};

describe('buttons getters', () => {
  it('should get correct buttons params for documents page', () => {
    const buttons = storeGetters[getters.GET_BUTTONS_FOR_PAGE](mockState, null, rootState);
    expect(buttons.open).toEqual(expect.objectContaining({
      ...store.state.buttons.open,
    }));

    expect(buttons.s2s).toEqual(expect.objectContaining({
      ...store.state.buttons.s2s,
    }));

    expect(buttons.l2f).toEqual(expect.objectContaining({
      ...store.state.buttons.l2f,
    }));

    expect(buttons.delete).toEqual(expect.objectContaining({
      ...store.state.buttons.delete,
    }));

    expect(buttons.download).toEqual(expect.objectContaining({
      ...store.state.buttons.download,
    }));

    expect(buttons.uploadToIntegration).toEqual(expect.objectContaining({
      ...store.state.buttons.uploadToIntegration,
    }));

    expect(buttons.uploadToPDFfiller).toEqual(expect.objectContaining({
      ...store.state.buttons.uploadToPDFfiller, show: false
    }));
  });

  it('should get correct buttons params for integration documents page', () => {
    rootState.route.name = routes.INTEGRATION_DOCUMENTS.name;
    const buttons = storeGetters[getters.GET_BUTTONS_FOR_PAGE](mockState, null, rootState);
    expect(buttons.open).toEqual(expect.objectContaining({
      ...store.state.buttons.editIntegration,
    }));

    expect(buttons.s2s).toEqual(expect.objectContaining({
      ...store.state.buttons.s2sIntegration,
    }));

    expect(buttons.l2f).toEqual(expect.objectContaining({
      ...store.state.buttons.l2fIntegration,
    }));

    expect(buttons.delete).toEqual(expect.objectContaining({
      ...store.state.buttons.delete, show: false
    }));

    expect(buttons.download).toEqual(expect.objectContaining({
      ...store.state.buttons.download, show: false
    }));

    expect(buttons.uploadToIntegration).toEqual(expect.objectContaining({
      ...store.state.buttons.uploadToIntegration, show: false
    }));

    expect(buttons.uploadToPDFfiller).toEqual(expect.objectContaining({
      ...store.state.buttons.uploadToPDFfiller,
    }));
  });
});
