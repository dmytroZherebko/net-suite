import { mount } from 'vue-test-utils';

import UploadAsUrl from '../../../components/Upload/UploadAsUrl.vue';

const componentConfig = {
  propsData: {
    uploadFile: jest.fn()
  }
};

const wrapper = mount(UploadAsUrl, componentConfig);


describe('UploadAsUrl component', () => {
  afterEach(() => {
    componentConfig.propsData.uploadFile.mockClear();
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

  it('should call upload action and show success popup when call onUrlUploadSubmit', () => {
    const value = 'text';
    wrapper.setData({ uploadFileUrl: {
      error: false,
      value
    } });
    wrapper.vm.onUrlUploadSubmit();
    expect(componentConfig.propsData.uploadFile).toBeCalledWith(value);
  });

  it('shouldn`t call upload action and set error to true on onUrlUploadSubmit', () => {
    const value = '';
    wrapper.setData({ uploadFileUrl: {
      error: false,
      value
    } });
    wrapper.vm.onUrlUploadSubmit();
    expect(componentConfig.propsData.uploadFile).not.toBeCalled();
    expect(wrapper.vm.uploadFileUrl.error).toBeTruthy();
  });

  it('should call call onChangeUrlValue, when input trigger input event', () => {
    jest.spyOn(wrapper.vm, 'onChangeUrlValue');
    wrapper.update();
    wrapper.find('input').trigger('input');
    expect(wrapper.vm.onChangeUrlValue).toBeCalled();
  });

  it('should call call onUrlUploadSubmit, when submit form', () => {
    jest.spyOn(wrapper.vm, 'onUrlUploadSubmit');
    wrapper.update();
    wrapper.find('form').trigger('submit');
    expect(wrapper.vm.onUrlUploadSubmit).toBeCalled();
  });
});
