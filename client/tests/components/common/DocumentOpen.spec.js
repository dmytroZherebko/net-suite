import Vue from 'vue';
import Vuex from 'vuex';
import { mount } from 'vue-test-utils';

import DocumentOpen from '../../../components/common/DocumentOpen.vue';
import ModalComponent from '../../../components/common/ModalComponent.vue';

import constants from '../../../constants/';

Vue.use(Vuex);

const { actions } = constants;

const documentUrlMock = 'url';
const storeConfig = {
  state: {},
  modules: {
    documents: {
      state: {
        openDocument: {
          showOpenDocumentPopUp: false,
          openDocumentMode: 'full',
          documentUrl: null,
        }
      }
    }
  },
  actions: {
    [actions.OPEN_DOCUMENT_EDITOR]: jest.fn(),
    [actions.CLOSE_DOCUMENT_EDITOR]: jest.fn(),
  }
};

const store = new Vuex.Store(storeConfig);

const componentConfig = {
  propsData: {
    disabled: true,
    title: 'Open',
  },
  store
};

const wrapper = mount(DocumentOpen, componentConfig);


describe('DocumentOpen component', () => {
  it('should call open action on call open function', () => {
    wrapper.vm.openDocumentInEditor();
    expect(storeConfig.actions[actions.OPEN_DOCUMENT_EDITOR]).toBeCalled();
  });

  it('should call close action on call close function', () => {
    wrapper.vm.closeModal();
    expect(storeConfig.actions[actions.CLOSE_DOCUMENT_EDITOR]).toBeCalled();
  });

  it('should get empty class for modal', () => {
    const className = wrapper.vm.getModalClass();
    expect(className).toBe('');
  });

  it('should get modal_editor class for modal', () => {
    wrapper.setComputed({ documentUrl: documentUrlMock });
    const className = wrapper.vm.getModalClass();
    expect(className).toBe('modal_editor');
  });

  it('button should have text from props', () => {
    expect(wrapper.find('button').text()).toBe(componentConfig.propsData.title);
  });

  it('button should be disabled', () => {
    const disabled = wrapper.find('button').attributes().disabled;
    expect(disabled).toBe('disabled');
  });

  it('button shouldn`t be disabled', () => {
    wrapper.setProps({ disabled: false });
    const disabled = wrapper.find('button').attributes().disabled;
    expect(disabled).toBeUndefined();
  });

  it('button shouldn`t be disabled', () => {
    jest.spyOn(wrapper.vm, 'openDocumentInEditor');
    wrapper.update();
    wrapper.find('button').trigger('click');
    expect(wrapper.vm.openDocumentInEditor).toBeCalled();
  });

  it('should show iframe with documenturl when document mode is full and document url is presented', () => {
    const src = wrapper.find('iframe').attributes().src;
    expect(src).toBe(documentUrlMock);
  });

  it('shouldn`t show iframe when document mode isn`t full', () => {
    wrapper.setComputed({ openMode: 'modal' });
    expect(wrapper.is('iframe')).toBeFalsy();
  });

  it('should show ModalComponent when open showOpenDocumentPopUp', () => {
    wrapper.setComputed({ showOpenDocumentPopUp: true });
    expect(wrapper.find(ModalComponent)).toBeTruthy();
  });

  it('should show iframe with document url in ModalComponent', () => {
    const src = wrapper.find('iframe').attributes().src;
    expect(src).toBe(documentUrlMock);
  });

  it('shouldn`t show iframe when doesn`t have documentUrl in ModalComponent', () => {
    wrapper.setComputed({ documentUrl: null });
    expect(wrapper.is('iframe')).toBeFalsy();
  });
});
