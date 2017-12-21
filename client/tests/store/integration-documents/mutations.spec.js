import store from '../../../store';
import storeMutations from '../../../store/integration-documents/mutations';
import constants from '../../../constants';

const { mutations } = constants;

const state = {
  ...store.state.integrationDocuments,
  currentDocument: {
    ...store.state.integrationDocuments.currentDocument
  }
};

const docObject = {
  id: 1,
  name: 'name',
  type: 'pdf',
  hidden: false
};

describe('integrations documents mutations', () => {
  it('should set loaded documents', () => {
    const docsMock = [docObject];
    storeMutations[mutations.LOAD_INTEGRATION_DOCUMENTS](state, docsMock);
    expect(state.documentsList).toBe(docsMock);
  });

  it('should set show integration documents page', () => {
    storeMutations[mutations.SET_SHOW_INTEGRATION_DOCUMENTS_PAGE](state, true);
    expect(state.showIntegrationDocumentsPage).toBeTruthy();
  });

  it('should set integration documents page title', () => {
    const name = 'name';
    storeMutations[mutations.SET_TITLE_INTEGRATION_DOCUMENTS_PAGE](state, name);
    expect(state.integrationDocumentsPageName).toBe(name);
  });

  it('should set current page', () => {
    const number = 1;
    storeMutations[mutations.SET_INTEGRATION_CURRENT_PAGE](state, number);
    expect(state.currentPage).toBe(number);
  });

  it('should set total documents', () => {
    const number = 10;
    storeMutations[mutations.SET_INTEGRATION_TOTAL_DOCUMENTS](state, number);
    expect(state.total).toBe(number);
  });

  it('should set current documents', () => {
    storeMutations[mutations.SET_INTEGRATION_CURRENT_DOCUMENT](state, docObject);
    expect(state.currentDocument).toEqual(expect.objectContaining(docObject));
  });

  it('should reset current documents', () => {
    storeMutations[mutations.RESET_INTEGRATION_CURRENT_DOCUMENT](state);
    expect(state.currentDocument).toEqual(expect.objectContaining({
      id: null,
      name: null,
      type: null,
      hidden: null
    }));
  });
});
