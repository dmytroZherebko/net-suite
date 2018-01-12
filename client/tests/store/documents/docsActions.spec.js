import downloadjs from 'downloadjs';
import store from '../../../store';
import storeActions from '../../../store/documents/actions/docsActions';
import callApi from '../../../helpers/api';
import { getFormatedDocuments, getDocumentNameWithoutExtension, getDataFromTimeStamp } from '../../../helpers/utils';
import constants from '../../../constants';

jest.mock('../../../helpers/api');
jest.mock('../../../helpers/utils');
jest.mock('downloadjs');

const { mutations, actions, endpoints, getters } = constants;

const mockContext = {
  commit: jest.fn(),
  dispatch: jest.fn(),
  getters: {
    [getters.GET_DOCUMENTS_REQUEST_URL]: 'url',
    [getters.GET_DOCUMENTS_REQUEST_PARAMS]: () => 'url',
    [getters.GET_UPLOAD_DOCUMENT_REQUEST_URL]: 'url',
    [getters.GET_UPLOAD_DOCUMENT_REQUEST_PARAMS]: {}
  },
  rootState: {
    ...store.state,
    route: {
      name: 'name'
    }
  },
  state: {
    ...store.state.documents,
    currentDocument: {
      ...store.state.documents.currentDocument
    },
    currentPage: 1
  },
};

const docObject = {
  id: 1,
  name: 'name',
  type: 'pdf',
  fillable: false,
  updated: '111'
};

getDocumentNameWithoutExtension.mockImplementation(() => docObject.name);
getDataFromTimeStamp.mockImplementation(() => docObject.updated);

describe('documents actions', () => {
  afterEach(() => {
    callApi.mockClear();
    mockContext.commit.mockClear();
    mockContext.dispatch.mockClear();
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

    await storeActions[actions.GET_PAGE_DOCUMENTS](mockContext, payload);

    expect(callApi).toBeCalledWith(
      mockContext.getters[getters.GET_DOCUMENTS_REQUEST_URL],
      mockContext.getters[getters.GET_DOCUMENTS_REQUEST_PARAMS]()
    );

    expect(mockContext.commit).toBeCalledWith(mutations.SET_CURRENT_PAGE, payload.currentPage);
    expect(mockContext.commit).toBeCalledWith(mutations.SET_TOTAL_DOCUMENTS, mockApiAnswer.total);
    expect(mockContext.commit).toBeCalledWith(mutations.LOAD_DOCUMENTS, mockApiAnswer.items);
  });

  it('should load documents list and update current document', async () => {
    const mockApiAnswer = {
      items: [docObject],
      total: 1
    };

    mockContext.state.currentDocument = { ...docObject };

    callApi.mockImplementation(() => Promise.resolve(mockApiAnswer));
    getFormatedDocuments.mockImplementation(() => mockApiAnswer.items);

    await storeActions[actions.GET_PAGE_DOCUMENTS](mockContext);

    expect(mockContext.commit).toBeCalledWith(mutations.SET_CURRENT_DOCUMENT, mockContext.state.currentDocument);
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

    await storeActions[actions.GET_PAGE_DOCUMENTS](mockContext, payload);

    expect(mockContext.commit).toBeCalledWith(mutations.SET_CURRENT_DOCUMENT, mockApiAnswer.items[0]);
  });

  it('should catch error when load documents list', async () => {
    const errorMessage = 'error';
    const error = new Error(errorMessage);

    callApi.mockImplementation(() => Promise.reject(error));

    await storeActions[actions.GET_PAGE_DOCUMENTS](mockContext);

    expect(mockContext.commit).toBeCalledWith(mutations.SET_ERROR, errorMessage);
  });

  it('should open document editor', async () => {
    const responseMock = {
      location: 'url'
    };
    callApi.mockImplementation(() => Promise.resolve(responseMock));
    mockContext.dispatch.mockImplementation(() => Promise.resolve(1));
    global.addEventListener = jest.fn();

    await storeActions[actions.OPEN_DOCUMENT_EDITOR](mockContext);

    expect(callApi).toBeCalledWith(endpoints.DOCUMENT_LINK.replace('{document_id}', docObject.id), expect.objectContaining({
      access_token: mockContext.rootState.auth.access_token,
    }));

    expect(global.addEventListener).toBeCalledWith('message', expect.any(Function));
  });

  it('should open document editor for integration document', async () => {
    const responseMock = {
      location: 'url'
    };
    callApi.mockImplementation(() => Promise.resolve(responseMock));
    mockContext.dispatch.mockImplementation(() => Promise.resolve({ projectId: docObject.id, fileId: docObject.id }));
    mockContext.rootState.route.name = 'integration-documents';
    global.addEventListener = jest.fn();

    await storeActions[actions.OPEN_DOCUMENT_EDITOR](mockContext);

    expect(callApi).toBeCalledWith(endpoints.DOCUMENT_LINK.replace('{document_id}', docObject.id), expect.objectContaining({
      access_token: mockContext.rootState.auth.access_token,
    }));

    expect(mockContext.dispatch).toBeCalledWith(actions.GET_INTEGRATION_DOCUMENT_PDFFILLER_ID);
    expect(global.addEventListener).toBeCalledWith('message', expect.any(Function));
  });

  it('should open document editor with call js', async () => {
    const responseMock = {
      location: 'url'
    };
    callApi.mockImplementation(() => Promise.resolve(responseMock));
    global.addEventListener = jest.fn();
    mockContext.rootState.openInJsEditor = true;

    await storeActions[actions.OPEN_DOCUMENT_EDITOR](mockContext);

    mockContext.rootState.openInJsEditor = false;
    expect(callApi).toBeCalledWith(expect.stringContaining('editor_type=JS_NEW'), expect.objectContaining({
      access_token: mockContext.rootState.auth.access_token,
    }));

    expect(global.addEventListener).toBeCalledWith('message', expect.any(Function));
  });

  it('should open in new window when mode is window', async () => {
    const responseMock = {
      location: 'url'
    };
    callApi.mockImplementation(() => Promise.resolve(responseMock));
    global.addEventListener = jest.fn();
    global.open = jest.fn();
    store.commit(mutations.SET_OPEN_DOCUMENT_MODE, 'window');

    await storeActions[actions.OPEN_DOCUMENT_EDITOR](mockContext);

    expect(callApi).toBeCalledWith(endpoints.DOCUMENT_LINK.replace('{document_id}', docObject.id), expect.objectContaining({
      access_token: mockContext.rootState.auth.access_token,
    }));

    expect(global.addEventListener).toBeCalledWith('message', expect.any(Function));
    expect(global.open).toBeCalledWith(responseMock.location, expect.any(String));
  });

  it('should catch error when open document editor', async () => {
    const errorMessage = 'error';
    const error = new Error(errorMessage);

    callApi.mockImplementation(() => Promise.reject(error));

    await storeActions[actions.OPEN_DOCUMENT_EDITOR](mockContext);

    expect(mockContext.commit).toBeCalledWith(mutations.SET_ERROR, errorMessage);
  });

  it('should close document editor', () => {
    global.removeEventListener = jest.fn();

    storeActions[actions.CLOSE_DOCUMENT_EDITOR](mockContext);

    expect(global.removeEventListener).toBeCalledWith('message', expect.any(Function));
    expect(mockContext.commit).toBeCalledWith(mutations.SET_OPEN_DOCUMENT_POPUP, false);
    expect(mockContext.commit).toBeCalledWith(mutations.SET_OPEN_DOCUMENT_URL, null);
    expect(mockContext.dispatch).toBeCalledWith(actions.GET_PAGE_DOCUMENTS, {
      currentPage: mockContext.state.currentPage
    });
  });

  it('should upload document', async () => {
    const mockFile = new File(['bla'], 'name');
    const responseMock = { ...docObject };
    callApi.mockImplementation(() => Promise.resolve(responseMock));

    await storeActions[actions.UPLOAD_DOCUMENT](mockContext, mockFile);

    expect(callApi).toBeCalledWith(
      mockContext.getters[getters.GET_UPLOAD_DOCUMENT_REQUEST_URL],
      expect.objectContaining({
        ...mockContext.getters[getters.GET_UPLOAD_DOCUMENT_REQUEST_PARAMS],
        method: 'POST',
        body: expect.any(Object)
      })
    );

    expect(mockContext.dispatch).toBeCalledWith(actions.GET_PAGE_DOCUMENTS, {
      currentPage: mockContext.state.currentPage
    });
  });

  it('should catch error when upload document', async () => {
    const mockFile = new File(['bla'], 'name');
    const errorMessage = 'error';
    const error = new Error(errorMessage);

    callApi.mockImplementation(() => Promise.reject(error));

    try {
      await storeActions[actions.UPLOAD_DOCUMENT](mockContext, mockFile);
    } catch (err) {
      if (err.message) {
        expect(1).toBe(err.message);
      }
    }

    expect(mockContext.commit).toBeCalledWith(mutations.SET_ERROR, errorMessage);
  });

  it('should delete document and load documents for page -1 when  =< 1 document in list ', async () => {
    callApi.mockImplementation(() => Promise.resolve({ ...docObject }));

    await storeActions[actions.DELETE_DOCUMENT_BY_ID](mockContext);

    expect(callApi).toBeCalledWith(`${endpoints.DOCUMENTS}/${mockContext.state.currentDocument.id}`, expect.objectContaining({
      access_token: mockContext.rootState.auth.access_token,
      method: 'DELETE'
    }));

    expect(mockContext.dispatch).toBeCalledWith(actions.GET_PAGE_DOCUMENTS, {
      currentPage: mockContext.state.currentPage - 1
    });
  });

  it('should delete document and load documents for the same page', async () => {
    mockContext.state.documentsList = [docObject, docObject];

    callApi.mockImplementation(() => Promise.resolve({ ...docObject }));

    await storeActions[actions.DELETE_DOCUMENT_BY_ID](mockContext);

    expect(callApi).toBeCalledWith(`${endpoints.DOCUMENTS}/${mockContext.state.currentDocument.id}`, expect.objectContaining({
      access_token: mockContext.rootState.auth.access_token,
      method: 'DELETE'
    }));

    expect(mockContext.dispatch).toBeCalledWith(actions.GET_PAGE_DOCUMENTS, {
      currentPage: mockContext.state.currentPage
    });
  });

  it('should catch error when delete document', async () => {
    const errorMessage = 'error';
    const error = new Error(errorMessage);

    callApi.mockImplementation(() => Promise.reject(error));

    await storeActions[actions.DELETE_DOCUMENT_BY_ID](mockContext);

    expect(mockContext.commit).toBeCalledWith(mutations.SET_ERROR, errorMessage);
  });

  it('should update name', async () => {
    const mockName = {
      name: 'name'
    };
    const responseMock = { ...docObject };
    callApi.mockImplementation(() => Promise.resolve(responseMock));

    await storeActions[actions.UPDATE_DOCUMENT_NAME](mockContext, mockName);

    expect(callApi).toBeCalledWith(`${endpoints.DOCUMENTS}/${mockContext.state.currentDocument.id}`, expect.objectContaining({
      access_token: mockContext.rootState.auth.access_token,
      method: 'PUT',
      body: JSON.stringify(mockName)
    }));

    expect(mockContext.commit).toBeCalledWith(mutations.UPDATE_NAME, {
      name: docObject.name,
      documentId: docObject.id
    });

    expect(mockContext.commit).toBeCalledWith(mutations.SET_CURRENT_DOCUMENT, {
      ...docObject
    });
  });

  it('should catch error when update document name', async () => {
    const mockName = {
      name: 'name'
    };
    const errorMessage = 'error';
    const error = new Error(errorMessage);

    callApi.mockImplementation(() => Promise.reject(error));

    await storeActions[actions.UPDATE_DOCUMENT_NAME](mockContext, mockName);

    expect(mockContext.commit).toBeCalledWith(mutations.SET_ERROR, errorMessage);
  });

  it('should download document', async () => {
    const responseMock = { ...docObject };
    callApi.mockImplementation(() => Promise.resolve(responseMock));

    await storeActions[actions.DOWNLOAD_DOCUMENT](mockContext);

    expect(callApi).toBeCalledWith(`${endpoints.DOCUMENTS}/${mockContext.state.currentDocument.id}/download`, expect.objectContaining({
      access_token: mockContext.rootState.auth.access_token,
    }), true);
    expect(downloadjs).toBeCalledWith(responseMock, `${mockContext.state.currentDocument.name}.${mockContext.state.currentDocument.type}`);
  });

  it('should catch error when download document', async () => {
    const errorMessage = 'error';
    const error = new Error(errorMessage);

    callApi.mockImplementation(() => Promise.reject(error));

    await storeActions[actions.DOWNLOAD_DOCUMENT](mockContext);

    expect(mockContext.commit).toBeCalledWith(mutations.SET_ERROR, errorMessage);
  });

  it('should set current document', () => {
    storeActions[actions.SET_CURRENT_DOCUMENT](mockContext, docObject);

    expect(mockContext.commit).toBeCalledWith(mutations.SET_CURRENT_DOCUMENT, docObject);
  });

  it('should reset current document', () => {
    storeActions[actions.RESET_CURRENT_DOCUMENT](mockContext);

    expect(mockContext.commit).toBeCalledWith(mutations.RESET_CURRENT_DOCUMENT);
  });

  it('should reset current documents state', () => {
    storeActions[actions.RESET_DOCUMENTS_STATE](mockContext);

    expect(mockContext.commit).toBeCalledWith(mutations.RESET_CURRENT_DOCUMENT);
    expect(mockContext.commit).toBeCalledWith(mutations.RESET_LOADED_DOCUMENTS);
  });

  it('should broadcast current document', () => {
    global.opener = {
      postMessage: jest.fn()
    };

    storeActions[actions.BROADCAST_DOCUMENT_INFO_TO_PARENT](mockContext, docObject);

    expect(global.opener.postMessage).toBeCalledWith(JSON.stringify(docObject), '*');
  });
});
