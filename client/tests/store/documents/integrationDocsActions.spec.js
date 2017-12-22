import store from '../../../store';
import storeActions from '../../../store/documents/actions/integrationDocsActions';
import callApi from '../../../helpers/api';
import constants from '../../../constants';

jest.mock('../../../helpers/api');

const { mutations, actions, endpoints } = constants;

const mockContext = {
  commit: jest.fn(),
  dispatch: jest.fn(),
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

describe('documents integration actions', () => {
  afterEach(() => {
    callApi.mockClear();
    mockContext.commit.mockClear();
    mockContext.dispatch.mockClear();
  });

  it('should upload integration document', async () => {
    const responseMock = {};
    callApi.mockImplementation(() => Promise.resolve(responseMock));

    await storeActions[actions.UPLOAD_INTEGRATION_DOCUMENT_TO_PDFFILLER](mockContext);

    expect(callApi).toBeCalledWith(
      `${mockContext.rootState.integration.name}${endpoints.INTEGRATION_DOCUMENTS}/${mockContext.state.currentDocument.id}/download`,
      expect.objectContaining({
        method: 'POST',
        noPdfillerApi: true,
        query: {
          ...mockContext.rootState.integration.config,
        }
      }));
  });

  it('should catch error when upload integration document', async () => {
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

  it('should create integration document in pdffiller', async () => {
    const responseMock = {
      projectId: 1
    };
    callApi.mockImplementation(() => Promise.resolve(responseMock));

    await storeActions[actions.CREATE_INTEGRATION_DOCUMENT_IN_PDFFILLER](mockContext);

    expect(callApi).toBeCalledWith(
      `${mockContext.rootState.integration.name}${endpoints.INTEGRATION_CREATE_PROJECT}`,
      expect.objectContaining({
        method: 'POST',
        noPdfillerApi: true,
        query: {
          ...mockContext.rootState.integration.config,
        },
        body: JSON.stringify({
          fileId: mockContext.state.currentDocument.id,
          oldFileName: mockContext.state.currentDocument.name,
          newFileName: mockContext.state.currentDocument.name,
        })
      })
    );
  });

  it('should catch error when create integration document in pdffiller', async () => {
    const errorMessage = 'error';
    const error = new Error(errorMessage);

    callApi.mockImplementation(() => Promise.reject(error));

    try {
      await storeActions[actions.CREATE_INTEGRATION_DOCUMENT_IN_PDFFILLER](mockContext);
    } catch (err) {
      if (err.message) {
        expect(1).toBe(err.message);
      }
    }

    expect(mockContext.commit).toBeCalledWith(mutations.SET_ERROR, errorMessage);
  });

  it('should update integtation file content', async () => {
    const responseMock = {
      projectId: 1
    };
    callApi.mockImplementation(() => Promise.resolve(responseMock));

    await storeActions[actions.UPDATE_INTEGRATION_FILE_CONTENT](mockContext, 1);

    expect(callApi).toBeCalledWith(
      `${mockContext.rootState.integration.name}${endpoints.UPDATE_INTEGRATION_FILE_CONTENT}`,
      expect.objectContaining({
        method: 'POST',
        noPdfillerApi: true,
        query: {
          ...mockContext.rootState.integration.config,
        },
        body: JSON.stringify({
          fileId: mockContext.state.currentDocument.id,
          projectId: 1
        })
      })
    );
  });

  it('should hide popup when update name', () => {
    const name = { name: 'name' };
    storeActions[actions.ACCEPT_INTEGRATION_DOC_NAME_POPUP](mockContext, name);
    expect(mockContext.commit).toBeCalledWith(mutations.SET_EDIT_INTEGRATION_DOCUMENT_NAME_POPUP, false);
  });

  it('should hide popup when cancel update name', () => {
    const name = { name: 'name' };
    storeActions[actions.REJECT_INTEGRATION_DOC_NAME_POPUP](mockContext, name);
    expect(mockContext.commit).toBeCalledWith(mutations.SET_EDIT_INTEGRATION_DOCUMENT_NAME_POPUP, false);
  });

  it('should get id document prew show popup', async () => {
    const name = { name: 'name' };
    mockContext.dispatch.mockImplementation(() => Promise.resolve(1));
    const projectId = await storeActions[actions.GET_INTEGRATION_DOCUMENT_PDFFILLER_ID](mockContext, name);

    expect(mockContext.dispatch).toBeCalledWith(actions.WAITING_FOR_INTEGRATION_DOCUMENT_NEW_NAME);
    expect(mockContext.dispatch).toBeCalledWith(actions.CREATE_INTEGRATION_DOCUMENT_IN_PDFFILLER, 1);
    expect(mockContext.commit).toBeCalledWith(mutations.SET_EDIT_INTEGRATION_DOCUMENT_NAME_POPUP, true);
    expect(projectId).toBe(1);
  });
});
