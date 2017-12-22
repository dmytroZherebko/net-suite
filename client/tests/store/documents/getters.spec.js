import store from '../../../store';
import storeGetters from '../../../store/documents/getters';
import constants from '../../../constants';

const { getters, endpoints } = constants;

const mockStore = {
  rootState: {
    ...store.state, route: { name: 'documents' }
  },
  state: {
    ...store.state.documents
  }
};

describe('documents getters', () => {
  it('should get correct url when current page is documents', () => {
    const url = storeGetters[getters.GET_DOCUMENTS_REQUEST_URL](null, null, mockStore.rootState);
    expect(url).toBe(endpoints.DOCUMENTS);
  });

  it('should get correct url when current page is integration documents', () => {
    mockStore.rootState.route.name = 'integration-documents';
    const url = storeGetters[getters.GET_DOCUMENTS_REQUEST_URL](null, null, mockStore.rootState);
    expect(url).toBe(`${store.state.integration.name}${endpoints.INTEGRATION_DOCUMENTS}`);
  });

  it('should get correct request params for load integration documents', () => {
    const params = storeGetters[getters.GET_DOCUMENTS_REQUEST_PARAMS](mockStore.state, null, mockStore.rootState)(1);
    expect(params).toEqual(expect.objectContaining({
      query: {
        page: 1,
        per_page: mockStore.state.perPage
      },
      noPdfillerApi: true
    }));
  });

  it('should get correct request params for load documents', () => {
    mockStore.rootState.route.name = 'documents';
    const params = storeGetters[getters.GET_DOCUMENTS_REQUEST_PARAMS](mockStore.state, null, mockStore.rootState)(1);
    expect(params).toEqual(expect.objectContaining({
      query: {
        page: 1,
        per_page: mockStore.state.perPage
      },
    }));
  });
});
