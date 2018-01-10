import Vue from 'vue';
import Vuex from 'vuex';
import { mount } from 'vue-test-utils';

import DocumentsPage from '../../../components/Documents/DocumentsPage.vue';

import constants from '../../../constants/';

Vue.use(Vuex);

const { actions, routes } = constants;

const storeConfig = {
  state: { filepicker: false },
  modules: {
    documents: {
      state: {
        documentsList: [],
        currentPage: 1,
        total: 10,
        perPage: 10,
        showEditIntegrationDocumentModal: false,
        currentDocument: { id: 1, fillable: false, name: 'name' },
      }
    }
  },
  actions: {
    [actions.GET_PAGE_DOCUMENTS]: jest.fn(),
    [actions.RESET_CURRENT_DOCUMENT]: jest.fn(),
    [actions.SET_CURRENT_DOCUMENT]: jest.fn(),
    [actions.BROADCAST_DOCUMENT_INFO_TO_PARENT]: jest.fn(),
    [actions.RESET_DOCUMENTS_STATE]: jest.fn(),
    [actions.UPDATE_DOCUMENT_NAME]: jest.fn(),
    [actions.REJECT_INTEGRATION_DOC_NAME_POPUP]: jest.fn(),
    [actions.ACCEPT_INTEGRATION_DOC_NAME_POPUP]: jest.fn(),
  }
};

const store = new Vuex.Store(storeConfig);

const componentConfig = {
  store,
  stubs: {
    'edit-name': true,
    'documents-list': true,
    'documents-aside': true,
  },
  mocks: {
    $route: {
      fullPath: '/documents',
      name: routes.DOCUMENTS.name
    }
  }
};

const wrapper = mount(DocumentsPage, componentConfig);


describe('DocumentsPage component', () => {
  afterEach(() => {
    storeConfig.actions[actions.GET_PAGE_DOCUMENTS].mockClear();
    storeConfig.actions[actions.RESET_CURRENT_DOCUMENT].mockClear();
    storeConfig.actions[actions.SET_CURRENT_DOCUMENT].mockClear();
    storeConfig.actions[actions.BROADCAST_DOCUMENT_INFO_TO_PARENT].mockClear();
    storeConfig.actions[actions.UPDATE_DOCUMENT_NAME].mockClear();
    storeConfig.actions[actions.REJECT_INTEGRATION_DOC_NAME_POPUP].mockClear();
    storeConfig.actions[actions.ACCEPT_INTEGRATION_DOC_NAME_POPUP].mockClear();
  });

  it('should call GET_PAGE_DOCUMENTS action and RESET_CURRENT_DOCUMENT action when call pageChanged function', () => {
    const page = 2;
    wrapper.vm.pageChanged(page);
    expect(storeConfig.actions[actions.GET_PAGE_DOCUMENTS]).toBeCalledWith(expect.any(Object), { currentPage: page }, undefined);
    expect(storeConfig.actions[actions.RESET_CURRENT_DOCUMENT]).toBeCalled();
  });

  it('shouldn`t call GET_PAGE_DOCUMENTS action and RESET_CURRENT_DOCUMENT action when call pageChanged function with page that equal current', () => {
    const page = 1;
    wrapper.vm.pageChanged(page);
    expect(storeConfig.actions[actions.GET_PAGE_DOCUMENTS]).not.toBeCalled();
    expect(storeConfig.actions[actions.RESET_CURRENT_DOCUMENT]).not.toBeCalled();
  });

  it('should call SET_CURRENT_DOCUMENT action when call changeCurrentDocument function', () => {
    const doc = { id: 2, name: 'name1' };
    wrapper.vm.changeCurrentDocument(doc);
    expect(storeConfig.actions[actions.SET_CURRENT_DOCUMENT]).toBeCalledWith(expect.any(Object), doc, undefined);
    expect(wrapper.vm.currentDocumentName).toBe(doc.name);
  });

  it('shouldn`t call SET_CURRENT_DOCUMENT action when call changeCurrentDocument function with current id', () => {
    const doc = { id: 1 };
    wrapper.vm.changeCurrentDocument(doc);
    expect(storeConfig.actions[actions.SET_CURRENT_DOCUMENT]).not.toBeCalled();
  });

  it('should set showEditModal to true and set document name when filepicker is false', () => {
    const doc = { name: 'name' };
    wrapper.vm.dbListener(doc);
    expect(wrapper.vm.showEditModal).toBeTruthy();
  });

  it('should call BROADCAST_DOCUMENT_INFO_TO_PARRENT action when filepicker is true', () => {
    wrapper.setComputed({ filepicker: true });
    const doc = { name: 'name' };
    wrapper.vm.dbListener(doc);
    expect(storeConfig.actions[actions.BROADCAST_DOCUMENT_INFO_TO_PARENT]).toBeCalledWith(expect.any(Object), doc, undefined);
  });

  it('should reset showEditModal props when call closeEditNameModal function', () => {
    wrapper.setData({ showEditModal: true, });
    wrapper.setComputed({ currentDocumentStoreName: 'file1', });
    wrapper.vm.closeEditNameModal();
    expect(wrapper.vm.showEditModal).toBeFalsy();
    expect(wrapper.vm.currentDocumentName).toBe('file1');
    expect(storeConfig.actions[actions.REJECT_INTEGRATION_DOC_NAME_POPUP]).not.toBeCalled();
  });

  it('should call UPDATE_DOCUMENT_NAME action and closeEditNameModal when call updateDocumentName', () => {
    const docName = 'name';
    jest.spyOn(wrapper.vm, 'closeEditNameModal');
    wrapper.vm.updateDocumentName(docName);
    expect(wrapper.vm.closeEditNameModal).toBeCalled();
    expect(storeConfig.actions[actions.UPDATE_DOCUMENT_NAME]).toBeCalledWith(expect.any(Object), docName, undefined);
    expect(storeConfig.actions[actions.ACCEPT_INTEGRATION_DOC_NAME_POPUP]).not.toBeCalled();
  });

  it('shouldn`t call BROADCAST_DOCUMENT_INFO_TO_PARENT action and set showEditModal to true when call dbListener on integration documents page', () => {
    componentConfig.mocks.$route.name = routes.INTEGRATION_DOCUMENTS.name;
    wrapper.setData({ showEditModal: false, });
    wrapper.vm.dbListener();
    expect(wrapper.vm.showEditModal).toBeFalsy();
    expect(storeConfig.actions[actions.BROADCAST_DOCUMENT_INFO_TO_PARENT]).not.toBeCalled();
  });

  it('should call REJECT_INTEGRATION_DOC_NAME_POPUP action when call closeEditNameModal function on integration documents page', () => {
    wrapper.vm.closeEditNameModal();
    expect(storeConfig.actions[actions.REJECT_INTEGRATION_DOC_NAME_POPUP]).toBeCalled();
  });

  it('should call ACCEPT_INTEGRATION_DOC_NAME_POPUP action when call closeEditNameModal function on integration documents page', () => {
    const docName = 'name';
    wrapper.vm.closeEditNameModal.mockClear();
    wrapper.setComputed({ currentDocumentStoreName: 'file2', });
    wrapper.vm.updateDocumentName(docName);
    expect(wrapper.vm.currentDocumentName).toBe('file2');
    expect(storeConfig.actions[actions.ACCEPT_INTEGRATION_DOC_NAME_POPUP]).toBeCalledWith(expect.any(Object), docName, undefined);
    expect(storeConfig.actions[actions.UPDATE_DOCUMENT_NAME]).not.toBeCalled();
    expect(wrapper.vm.closeEditNameModal).not.toBeCalled();
  });
});
