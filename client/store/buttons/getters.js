import constants from '../../constants';

const { getters, routes } = constants;

export default {
  [getters.GET_BUTTONS_FOR_PAGE](state, getters, rootState) { // eslint-disable-line
    const buttons = {
      download: {
        ...state.download,
        show: rootState.route.name === routes.DOCUMENTS.name && state.download.show
      },
      delete: {
        ...state.delete,
        show: rootState.route.name === routes.DOCUMENTS.name && state.delete.show
      },
      uploadToPDFfiller: {
        ...state.uploadToPDFfiller,
        show: rootState.route.name === routes.INTEGRATION_DOCUMENTS.name && state.uploadToPDFfiller.show
      },
      uploadToIntegration: {
        ...state.uploadToIntegration,
        show: rootState.route.name === routes.INTEGRATION_DOCUMENTS.name && state.uploadToIntegration.show
      },
    };

    if (rootState.route.name === routes.DOCUMENTS.name) {
      buttons.open = { ...state.open };
      buttons.s2s = { ...state.s2s };
      buttons.l2f = { ...state.l2f };
    } else {
      buttons.open = { ...state.editIntegration };
      buttons.s2s = { ...state.s2sIntegration };
      buttons.l2f = { ...state.l2fIntegration };
    }

    return buttons;
  },
};
