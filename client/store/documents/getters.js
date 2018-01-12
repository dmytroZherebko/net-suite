import constants from '../../constants';

const { getters, endpoints, routes } = constants;

export default {
  [getters.GET_DOCUMENTS_REQUEST_URL](state, getters, rootState) { // eslint-disable-line
    const url = rootState.route.name === routes.INTEGRATION_DOCUMENTS.name ?
      `${rootState.integration.name}${endpoints.INTEGRATION_DOCUMENTS}` :
      endpoints.DOCUMENTS;
    return url;
  },

  [getters.GET_DOCUMENTS_REQUEST_PARAMS](state, getters, rootState) { // eslint-disable-line
    return (currentPage) => {
      const params = {
        query: {
          page: currentPage,
          per_page: state.perPage
        },
      };

      if (rootState.route.name === routes.DOCUMENTS.name) {
        params.access_token = rootState.auth.access_token;
      } else if (rootState.route.name === routes.INTEGRATION_DOCUMENTS.name) {
        params.noPdfillerApi = true;
        params.query = {
          ...params.query,
          ...rootState.integration.config
        };
      }

      return params;
    };
  },

  [getters.GET_UPLOAD_DOCUMENT_REQUEST_URL](state, getters, rootState) { // eslint-disable-line
    const url = rootState.route.name === routes.INTEGRATION_DOCUMENTS.name ?
      `${rootState.integration.name}${endpoints.UPLOAD_TO_INTEGRATION}` :
      endpoints.UPLOAD_DOCUMENT;
    return url;
  },

  [getters.GET_UPLOAD_DOCUMENT_REQUEST_PARAMS](state, getters, rootState) { // eslint-disable-line
    const params = {};

    if (rootState.route.name === routes.DOCUMENTS.name) {
      params.access_token = rootState.auth.access_token;
    } else if (rootState.route.name === routes.INTEGRATION_DOCUMENTS.name) {
      params.noPdfillerApi = true;
      params.query = {
        ...rootState.integration.config
      };
    }

    return params;
  }
};
