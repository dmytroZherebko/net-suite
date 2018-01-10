import Vue from 'vue';
import Vuex from 'vuex';
import { mount } from 'vue-test-utils';

import UploadAsFile from '../../../components/Upload/UploadAsFile.vue';

import constants from '../../../constants/';

Vue.use(Vuex);

const { actions, errors } = constants;

const storeConfig = {
  state: {},
  actions: {
    [actions.SET_ERROR]: jest.fn(),
  }
};

const store = new Vuex.Store(storeConfig);

const componentConfig = {
  store,
  propsData: {
    uploadFile: jest.fn()
  }
};

const wrapper = mount(UploadAsFile, componentConfig);


describe('UploadAsFile component', () => {
  afterEach(() => {
    storeConfig.actions[actions.SET_ERROR].mockClear();
    componentConfig.propsData.uploadFile.mockClear();
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

  it('should call uploadFile function from props', () => {
    const file = 'text';
    jest.spyOn(wrapper.vm, 'validateFile').mockImplementation(() => true);
    wrapper.vm.upload(file);
    expect(componentConfig.propsData.uploadFile).toBeCalledWith(file);
    wrapper.vm.validateFile.mockRestore();
  });

  it('shouldn`t call upload action when file is not valid', () => {
    const file = 'text';
    jest.spyOn(wrapper.vm, 'validateFile').mockImplementation(() => false);
    wrapper.vm.upload(file);
    expect(componentConfig.propsData.uploadFile).not.toBeCalled();
    wrapper.vm.validateFile.mockRestore();
  });

  it('shouldn`t call upload action when no file', () => {
    jest.spyOn(wrapper.vm, 'validateFile').mockImplementation(() => true);
    wrapper.vm.upload();
    expect(componentConfig.propsData.uploadFile).not.toBeCalled();
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

  it('should call upload function on call onChooseFile', () => {
    const event = { target: { files: [1] } };
    jest.spyOn(wrapper.vm, 'upload');
    jest.spyOn(wrapper.vm, 'validateFile').mockImplementation(() => true);
    wrapper.vm.onChooseFile(event);
    expect(wrapper.vm.upload).toBeCalledWith(event.target.files[0]);
  });

  it('should call upload function on call onDrop', () => {
    const event = { dataTransfer: { files: [1] } };
    wrapper.vm.onDrop(event);
    expect(wrapper.vm.upload).toBeCalledWith(event.dataTransfer.files[0]);
    expect(wrapper.vm.dragOnFileInput).toBeFalsy();
  });

  it('should change dragOnFileInput to true on call onDragEnter', () => {
    wrapper.vm.onDragEnter();
    expect(wrapper.vm.dragOnFileInput).toBeTruthy();
  });

  it('should change dragOnFileInput to false on call onDragLeave', () => {
    wrapper.vm.onDragLeave();
    expect(wrapper.vm.dragOnFileInput).toBeFalsy();
  });

  it('should change dragOnFileInput to false on call onDragLeave', () => {
    wrapper.vm.onDragLeave();
    expect(wrapper.vm.dragOnFileInput).toBeFalsy();
  });

  it('should call call onChooseFile, when input trigger change event', () => {
    jest.spyOn(wrapper.vm, 'onChooseFile').mockImplementation(() => {});
    wrapper.update();
    wrapper.find('input').trigger('change');
    expect(wrapper.vm.onChooseFile).toBeCalled();
  });

  it('should call call onDrop, when input trigger drop event', () => {
    jest.spyOn(wrapper.vm, 'onDrop').mockImplementation(() => {});
    wrapper.update();
    wrapper.find('label').trigger('drop');
    expect(wrapper.vm.onDrop).toBeCalled();
  });
});
