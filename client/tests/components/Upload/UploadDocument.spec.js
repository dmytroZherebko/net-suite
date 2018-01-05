import Vue from 'vue';
import Vuex from 'vuex';
import { mount } from 'vue-test-utils';

import UploadDocument from '../../../components/Upload/UploadDocument.vue';

import constants from '../../../constants/';

Vue.use(Vuex);

const { actions, errors } = constants;

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
    [actions.SET_ERROR]: jest.fn(),
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
    storeConfig.actions[actions.SET_ERROR].mockClear();
  });
  it('should change property showModal to true when call openModal function', () => {
    wrapper.vm.openModal();
    expect(wrapper.vm.showModal).toBeTruthy();
  });

  it('should change property showModal to false and reset uploadFileUrl data to default when call closeModal function', () => {
    wrapper.setData({ uploadFileUrl: {
      error: true,
      value: 'text'
    } });
    wrapper.vm.closeModal();
    expect(wrapper.vm.showModal).toBeFalsy();
    expect(wrapper.vm.uploadFileUrl.error).toBeFalsy();
    expect(wrapper.vm.uploadFileUrl.value).toBeNull();
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

  it('should get class that drag over area by call checkOnDragBlock', () => {
    wrapper.setData({ dragOnFileInput: true });
    const className = wrapper.vm.checkOnDragBlock();
    expect(className).toContain('upload-section__file_ondrag');
  });

  it('shouldn`t get class that drag over area by call checkOnDragBlock', () => {
    wrapper.setData({ dragOnFileInput: false });
    const className = wrapper.vm.checkOnDragBlock();
    expect(className).not.toContain('upload-section__file_ondrag');
  });

  it('should get class that drag over area by call checkOnDragBlock', () => {
    const className = wrapper.vm.checkOptionIsActive('url');
    expect(className).toContain('options__item_active');
  });

  it('shouldn`t get class that option is active by call checkOptionIsActive', () => {
    const className = wrapper.vm.checkOptionIsActive('file');
    expect(className).not.toContain('options__item_active');
  });

  it('should reset error when have value onChangeUrlValue', () => {
    wrapper.setData({ uploadFileUrl: {
      error: true,
      value: 'text'
    } });
    wrapper.vm.onChangeUrlValue();
    expect(wrapper.vm.uploadFileUrl.error).toBeFalsy();
  });

  it('should get correct class name when checkUrlError error is true', () => {
    wrapper.setData({ uploadFileUrl: {
      error: true,
    } });
    const className = wrapper.vm.checkUrlError();
    expect(className).toBe('input_invalid');
  });

  it('shouldn`t get invalid class name when checkUrlError error is true', () => {
    wrapper.setData({ uploadFileUrl: {
      error: false,
    } });
    const className = wrapper.vm.checkUrlError();
    expect(className).not.toBe('input_invalid');
  });

  it('should call upload action and show success popup when call onUrlUploadSubmit', async () => {
    const value = 'text';
    wrapper.setData({ uploadFileUrl: {
      error: false,
      value
    } });
    jest.spyOn(wrapper.vm, 'closeModal');
    await wrapper.vm.onUrlUploadSubmit();
    expect(storeConfig.actions[actions.UPLOAD_DOCUMENT]).toBeCalledWith(expect.any(Object), value, undefined);
    expect(wrapper.vm.closeModal).toBeCalled();
    expect(wrapper.vm.showSuccessUploadModal).toBeTruthy();
  });

  it('shouldn`t call upload action and set error tu true', async () => {
    const value = '';
    wrapper.setData({ uploadFileUrl: {
      error: false,
      value
    } });
    await wrapper.vm.onUrlUploadSubmit();
    expect(storeConfig.actions[actions.UPLOAD_DOCUMENT]).not.toBeCalled();
    expect(wrapper.vm.uploadFileUrl.error).toBeTruthy();
  });

  it('should call upload action and show success popup when call upload', async () => {
    const file = 'text';
    jest.spyOn(wrapper.vm, 'validateFile').mockImplementation(() => true);
    await wrapper.vm.upload(file);
    expect(storeConfig.actions[actions.UPLOAD_DOCUMENT]).toBeCalledWith(expect.any(Object), file, undefined);
    expect(wrapper.vm.closeModal).toBeCalled();
    expect(wrapper.vm.showSuccessUploadModal).toBeTruthy();
    wrapper.vm.validateFile.mockRestore();
  });

  it('shouldn`t call upload action when file is not valid', async () => {
    const file = 'text';
    jest.spyOn(wrapper.vm, 'validateFile').mockImplementation(() => false);
    await wrapper.vm.upload(file);
    expect(storeConfig.actions[actions.UPLOAD_DOCUMENT]).not.toBeCalled();
    wrapper.vm.validateFile.mockRestore();
  });

  it('shouldn`t call upload action when no file', async () => {
    jest.spyOn(wrapper.vm, 'validateFile').mockImplementation(() => true);
    await wrapper.vm.upload();
    expect(storeConfig.actions[actions.UPLOAD_DOCUMENT]).not.toBeCalled();
    wrapper.vm.validateFile.mockRestore();
  });

  it('should return true for file with valid size and extension', () => {
    const file = {
      name: 'bla.pdf',
      size: 20
    };
    expect(wrapper.vm.validateFile(file)).toBeTruthy();
  });

  it('should return false and call set error action for file with valid size and invalid extension', () => {
    const file = {
      name: 'bla.avi',
      size: 20
    };
    expect(wrapper.vm.validateFile(file)).toBeFalsy();
    expect(storeConfig.actions[actions.SET_ERROR]).toBeCalledWith(expect.any(Object), errors.NOT_SUPPORTED_FORMAT, undefined);
  });

  it('should return false for file with invalid size and valid extension', () => {
    const file = {
      name: 'bla.pdf',
      size: 27214400
    };
    expect(wrapper.vm.validateFile(file)).toBeFalsy();
    expect(storeConfig.actions[actions.SET_ERROR]).toBeCalledWith(expect.any(Object), errors.BIG_FILE, undefined);
  });
});
