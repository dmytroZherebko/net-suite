import store from '../../../store';
import storeActions from '../../../store/integration-documents/actions';
import callApi from '../../../helpers/api';
import { getFormatedDocuments } from '../../../helpers/utils';
import constants from '../../../constants';
import preconfigStore from '../../../store/preconfigStore';

jest.mock('../../../helpers/api');
jest.mock('../../../helpers/utils');

const { mutations, actions, endpoints } = constants;

const mockContext = {
  commit: jest.fn(),
  rootState: store.state,
  state: {
    ...store.state.integrationDocuments,
    currentDocument: {
      ...store.state.integrationDocuments.currentDocument
    }
  },
};

const docObject = {
  id: 1,
  name: 'name',
  type: 'pdf',
  hidden: false
};

const integrationConf = {
  integration: 'intg',
  intg: {
    id: 1
  }
};

preconfigStore(integrationConf);

describe('integration documents actions', () => {
  afterEach(() => {
    callApi.mockClear();
    mockContext.commit.mockClear();
  });

  it('should load documents list', async () => {
    const mockApiAnswer = {
      items: [docObject],
      total: 1
    };
    const payload = {
      currentPage: 1
    };

    callApi.mockImplementation(() => Promise.resolve(mockApiAnswer));
    getFormatedDocuments.mockImplementation(() => mockApiAnswer.items);

    await storeActions[actions.GET_INTEGRATIONS_PAGE_DOCUMENTS](mockContext, payload);

    expect(callApi).toBeCalledWith(`${integrationConf.integration}${endpoints.INTEGRATION_DOCUMENTS}`, expect.objectContaining({
      query: {
        page: payload.currentPage,
        per_page: mockContext.state.perPage,
        ...integrationConf.intg
      },
      noPdfillerApi: true,
    }));

    expect(mockContext.commit).toBeCalledWith(mutations.SET_INTEGRATION_CURRENT_PAGE, payload.currentPage);
    expect(mockContext.commit).toBeCalledWith(mutations.SET_INTEGRATION_TOTAL_DOCUMENTS, mockApiAnswer.total);
    expect(mockContext.commit).toBeCalledWith(mutations.LOAD_INTEGRATION_DOCUMENTS, mockApiAnswer.items);
  });

  it('should load documents list and update current document', async () => {
    const mockApiAnswer = {
      items: [docObject],
      total: 1
    };

    mockContext.state.currentDocument = { ...docObject };

    callApi.mockImplementation(() => Promise.resolve(mockApiAnswer));
    getFormatedDocuments.mockImplementation(() => mockApiAnswer.items);

    await storeActions[actions.GET_INTEGRATIONS_PAGE_DOCUMENTS](mockContext);

    expect(mockContext.commit).toBeCalledWith(mutations.SET_INTEGRATION_CURRENT_DOCUMENT, mockContext.state.currentDocument);
  });

  it('should load documents list and set first document as current', async () => {
    const mockApiAnswer = {
      items: [{ ...docObject }, { ...docObject }],
      total: 1
    };

    const payload = {
      setFirstAsCurrent: true
    };

    mockContext.state.currentDocument = { ...docObject };

    callApi.mockImplementation(() => Promise.resolve(mockApiAnswer));
    getFormatedDocuments.mockImplementation(() => mockApiAnswer.items);

    await storeActions[actions.GET_INTEGRATIONS_PAGE_DOCUMENTS](mockContext, payload);

    expect(mockContext.commit).toBeCalledWith(mutations.SET_INTEGRATION_CURRENT_DOCUMENT, mockApiAnswer.items[0]);
  });

  it('should catch error when load documents list', async () => {
    const errorMessage = 'error';
    const error = new Error(errorMessage);

    callApi.mockImplementation(() => Promise.reject(error));

    await storeActions[actions.GET_INTEGRATIONS_PAGE_DOCUMENTS](mockContext);

    expect(mockContext.commit).toBeCalledWith(mutations.SET_ERROR, errorMessage);
  });

  it('should upload document from integration', async () => {
    store.commit(mutations.SET_INTEGRATION_CURRENT_DOCUMENT, docObject);

    callApi.mockImplementation(() => Promise.resolve(true));

    await storeActions[actions.UPLOAD_INTEGRATION_DOCUMENT_TO_PDFFILLER](mockContext);

    expect(callApi).toBeCalledWith(`${integrationConf.integration}${endpoints.INTEGRATION_DOCUMENTS}/${mockContext.state.currentDocument.id}/download`,
      expect.objectContaining({
        method: 'POST',
        noPdfillerApi: true,
        query: {
          ...integrationConf.intg,
        }
      }));
  });

  it('should catch error when upload document', async () => {
    const errorMessage = 'error';
    const error = new Error(errorMessage);

    callApi.mockImplementation(() => Promise.reject(error));
    try {
      await storeActions[actions.UPLOAD_INTEGRATION_DOCUMENT_TO_PDFFILLER](mockContext);
    } catch (err) {
      if (err.message) {
        expect(1).toBe(err.message);
      }
    }

    expect(mockContext.commit).toBeCalledWith(mutations.SET_ERROR, errorMessage);
  });

  it('should set current document', () => {
    storeActions[actions.SET_INTEGRATION_CURRENT_DOCUMENT](mockContext, docObject);

    expect(mockContext.commit).toBeCalledWith(mutations.SET_INTEGRATION_CURRENT_DOCUMENT, docObject);
  });

  it('should reset current document', () => {
    storeActions[actions.RESET_INTEGRATION_CURRENT_DOCUMENT](mockContext);

    expect(mockContext.commit).toBeCalledWith(mutations.RESET_INTEGRATION_CURRENT_DOCUMENT);
  });
});
