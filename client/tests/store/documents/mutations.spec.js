import store from '../../../store';
import storeMutations from '../../../store/documents/mutations';
import constants from '../../../constants';

const { mutations } = constants;

const state = {
  ...store.state.documents,
  currentDocument: {
    ...store.state.documents.currentDocument
  },
  openDocument: {
    ...store.state.documents.openDocument
  }
};

const docObject = {
  id: 1,
  name: 'name',
  type: 'pdf',
  fillable: false,
  updated: 'bla',
  hidden: 'bla',
};

describe('integrations documents mutations', () => {
  it('should set loaded documents', () => {
    const docsMock = [docObject];
    storeMutations[mutations.LOAD_DOCUMENTS](state, docsMock);
    expect(state.documentsList).toBe(docsMock);
  });

  it('should reset loaded documents', () => {
    storeMutations[mutations.RESET_LOADED_DOCUMENTS](state);
    expect(state.documentsList.length).toBe(0);
  });

  it('should set current page', () => {
    const number = 1;
    storeMutations[mutations.SET_CURRENT_PAGE](state, number);
    expect(state.currentPage).toBe(number);
  });

  it('should set total documents', () => {
    const number = 10;
    storeMutations[mutations.SET_TOTAL_DOCUMENTS](state, number);
    expect(state.total).toBe(number);
  });

  it('should set edit integration document name pop up', () => {
    storeMutations[mutations.SET_EDIT_INTEGRATION_DOCUMENT_NAME_POPUP](state, true);
    expect(state.showEditIntegrationDocumentModal).toBe(true);
  });

  it('should set current documents', () => {
    storeMutations[mutations.SET_CURRENT_DOCUMENT](state, docObject);
    expect(state.currentDocument).toEqual(expect.objectContaining(docObject));
  });

  it('should reset current documents', () => {
    storeMutations[mutations.RESET_CURRENT_DOCUMENT](state);
    expect(state.currentDocument).toEqual(expect.objectContaining({
      id: null,
      name: null,
      type: null,
      fillable: null,
      updated: null,
      hidden: null,
    }));
  });

  it('should set show integration documents page', () => {
    storeMutations[mutations.SET_SHOW_INTEGRATION_DOCUMENTS_TAB](state, true);
    expect(state.showIntegrationDocumentsPage).toBeTruthy();
  });

  it('should set show my documents page', () => {
    storeMutations[mutations.SET_SHOW_MY_DOCUMENTS_TAB](state, true);
    expect(state.showMyDocumentsTab).toBeTruthy();
  });

  it('should set integration documents page title', () => {
    const name = 'name';
    storeMutations[mutations.SET_TITLE_INTEGRATION_DOCUMENTS_PAGE](state, name);
    expect(state.integrationDocumentsPageName).toBe(name);
  });

  it('should set open document popup documents', () => {
    storeMutations[mutations.SET_OPEN_DOCUMENT_POPUP](state, true);
    expect(state.openDocument.showOpenDocumentPopUp).toBe(true);
  });

  it('should set open document url', () => {
    const url = 'url';
    storeMutations[mutations.SET_OPEN_DOCUMENT_URL](state, url);
    expect(state.openDocument.documentUrl).toBe(url);
  });

  it('should set open document mode', () => {
    const mode = 'modal';
    storeMutations[mutations.SET_OPEN_DOCUMENT_MODE](state, mode);
    expect(state.openDocument.openDocumentMode).toBe(mode);
  });

  it('should update document name', () => {
    const updateNameObject = {
      documentId: 1,
      name: 'updated'
    };
    state.documentsList = [docObject];
    storeMutations[mutations.UPDATE_NAME](state, updateNameObject);
    expect(state.documentsList[0].name).toBe(updateNameObject.name);
  });
});
