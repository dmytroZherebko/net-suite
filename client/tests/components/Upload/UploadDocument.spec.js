import Vue from 'vue';
import Vuex from 'vuex';
import { mount } from 'vue-test-utils';

import UploadDocument from '../../../components/Upload/UploadDocument.vue';

import constants from '../../../constants/';

Vue.use(Vuex);

const { actions } = constants;

const storeConfig = {
  state: {},
  modules: {
    buttons: {
      state: {
        upload: {
          show: true,
          title: 'upload'
        }
      }
    }
  },
  actions: {
    [actions.UPLOAD_DOCUMENT]: jest.fn(),
  }
};

const store = new Vuex.Store(storeConfig);

const componentConfig = {
  store
};

const wrapper = mount(UploadDocument, componentConfig);


describe('UploadDocument component', () => {
  afterEach(() => {
    storeConfig.actions[actions.UPLOAD_DOCUMENT].mockClear();
  });

  it('should change property showModal to true when call openModal function', () => {
    wrapper.vm.openModal();
    expect(wrapper.vm.showModal).toBeTruthy();
  });

  it('should change property showModal to false', () => {
    wrapper.vm.closeModal();
    expect(wrapper.vm.showModal).toBeFalsy();
  });

  it('should change property showSuccessModal to false when call closeSuccessModal function', () => {
    wrapper.setData({ showSuccessModal: true });
    wrapper.vm.closeSuccessModal();
    expect(wrapper.vm.showSuccessModal).toBeFalsy();
  });

  it('should change upload option when call changeUploadOption function', () => {
    const uploadOption = 'url';
    wrapper.vm.changeUploadOption(uploadOption);
    expect(wrapper.vm.currentOption).toBe(uploadOption);
  });

  it('should get class that option is active by call checkOptionIsActive', () => {
    const className = wrapper.vm.checkOptionIsActive('url');
    expect(className).toContain('options__item_active');
  });

  it('shouldn`t get class that option is active by call checkOptionIsActive', () => {
    const className = wrapper.vm.checkOptionIsActive('file');
    expect(className).not.toContain('options__item_active');
  });

  it('should call upload action and show success popup when call upload', async () => {
    const file = 'text';
    jest.spyOn(wrapper.vm, 'closeModal');
    await wrapper.vm.uploadFile(file);
    expect(storeConfig.actions[actions.UPLOAD_DOCUMENT]).toBeCalledWith(expect.any(Object), file, undefined);
    expect(wrapper.vm.closeModal).toBeCalled();
    expect(wrapper.vm.showSuccessUploadModal).toBeTruthy();
  });
});
