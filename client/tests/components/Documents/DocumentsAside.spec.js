import Vue from 'vue';
import Vuex from 'vuex';
import { mount } from 'vue-test-utils';

import DocumentsAside from '../../../components/Documents/DocumentsAside.vue';

import constants from '../../../constants/';

Vue.use(Vuex);

const { actions, routes, getters } = constants;

const storeConfig = {
  state: { filepicker: false },
  modules: {
    documents: {
      state: {
        currentDocument: { id: 1, hidden: false, name: 'name' },
      }
    },
  },
  actions: {
    [actions.RESET_CURRENT_DOCUMENT]: jest.fn(),
    [actions.DELETE_DOCUMENT_BY_ID]: jest.fn(),
    [actions.DOWNLOAD_DOCUMENT]: jest.fn(),
    [actions.UPLOAD_INTEGRATION_DOCUMENT_TO_PDFFILLER]: jest.fn(),
    [actions.UPLOAD_DOCUMENT_TO_INTEGRATION]: jest.fn(),
  },
  getters: {
    [getters.GET_BUTTONS_FOR_PAGE]: () => ({
      open: { show: true, title: 'Open' },
      s2s: { show: true, title: 'SendToSign' },
      l2f: { show: true, title: 'LinkToFill' },
      download: { show: true, title: 'Download' },
      delete: { show: true, title: 'Delete' },
      upload: { show: true, title: 'Upload' },
      uploadToPDFfiller: { show: true, title: 'Upload to PDFfiller' },
      uploadToIntegration: { show: false, title: 'Upload to Integration' },
    })
  }
};

const store = new Vuex.Store(storeConfig);

const componentConfig = {
  store,
  stubs: {
    'delete-document': true,
    'open-document': true,
    'button-component': true,
    'success-upload-modal': true,
  },
  mocks: {
    $router: {
      push: jest.fn()
    }
  }
};

const wrapper = mount(DocumentsAside, componentConfig);


describe('DocumentsAside component', () => {
  afterEach(() => {
    storeConfig.actions[actions.RESET_CURRENT_DOCUMENT].mockClear();
    storeConfig.actions[actions.DELETE_DOCUMENT_BY_ID].mockClear();
    storeConfig.actions[actions.DOWNLOAD_DOCUMENT].mockClear();
    storeConfig.actions[actions.UPLOAD_INTEGRATION_DOCUMENT_TO_PDFFILLER].mockClear();
    storeConfig.actions[actions.UPLOAD_DOCUMENT_TO_INTEGRATION].mockClear();
  });

  it('should call DELETE_DOCUMENT_BY_ID and RESET_CURRENT_DOCUMENT actions when call deleteDocument function', () => {
    wrapper.vm.deleteDocument();
    expect(storeConfig.actions[actions.DELETE_DOCUMENT_BY_ID]).toBeCalled();
    expect(storeConfig.actions[actions.RESET_CURRENT_DOCUMENT]).toBeCalled();
  });

  it('should call DOWNLOAD_DOCUMENT actions when call downloadDocument function', () => {
    wrapper.vm.downloadDocument();
    expect(storeConfig.actions[actions.DOWNLOAD_DOCUMENT]).toBeCalled();
  });

  it('should call UPLOAD_INTEGRATION_DOCUMENT_TO_PDFFILLER action when call uploadFromIntegration function', async () => {
    await wrapper.vm.uploadFromIntegration();
    expect(storeConfig.actions[actions.UPLOAD_INTEGRATION_DOCUMENT_TO_PDFFILLER]).toBeCalled();
    expect(wrapper.vm.showSuccessUploadToIntegrationModal).toBeTruthy();
  });

  it('should call UPLOAD_DOCUMENT_TO_INTEGRATION action when call uploadToIntegration function', async () => {
    await wrapper.vm.uploadToIntegration();
    expect(storeConfig.actions[actions.UPLOAD_DOCUMENT_TO_INTEGRATION]).toBeCalled();
    expect(wrapper.vm.showSuccessUploadToIntegrationModal).toBeTruthy();
  });

  it('should set showSuccessUploadToIntegrationModal to false and call redirect function when call closeSuccessUploadToIntegrationModal function', () => {
    wrapper.vm.closeSuccessUploadToIntegrationModal();
    expect(componentConfig.mocks.$router.push).toBeCalledWith({ name: routes.DOCUMENTS.name });
    expect(wrapper.vm.showSuccessUploadToIntegrationModal).toBeFalsy();
  });
});
