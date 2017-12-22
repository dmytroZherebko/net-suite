import constants from '../../constants';

const { getters, endpoints } = constants;

export default {
  [getters.GET_DOCUMENTS_REQUEST_URL](state, getters, rootState) { // eslint-disable-line
    const url = rootState.route.name === 'integration-documents' ?
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

      if (rootState.route.name === 'documents') {
        params.access_token = rootState.auth.access_token;
      } else if (rootState.route.name === 'integration-documents') {
        params.noPdfillerApi = true;
        params.query = {
          ...params.query,
          ...rootState.integration.config
        };
      }

      return params;
    };
  }
};
