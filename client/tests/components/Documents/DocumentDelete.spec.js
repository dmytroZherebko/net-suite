import { mount } from 'vue-test-utils';
import DocumentDelete from '../../../components/Documents/DocumentDelete.vue';

const componentConfig = {
  propsData: {
    deleteDocument: jest.fn(),
    disabled: false,
    title: 'title',
  }
};

const wrapper = mount(DocumentDelete, componentConfig);


describe('DocumentDelete component', () => {
  afterEach(() => {
    componentConfig.propsData.deleteDocument.mockClear();
  });

  it('should set showModal to true when call showConfirmationModal function', () => {
    wrapper.vm.showConfirmationModal();
    expect(wrapper.vm.showModal).toBeTruthy();
  });

  it('should set showModal to false when call onClose function', () => {
    wrapper.vm.onClose();
    expect(wrapper.vm.showModal).toBeFalsy();
  });

  it('should set showModal and call function from props to false when call onDelete function', () => {
    wrapper.vm.onDelete();
    expect(wrapper.vm.showModal).toBeFalsy();
    expect(componentConfig.propsData.deleteDocument).toBeCalled();
  });

  it('should call showConfirmationModal when trigger click event on button', () => {
    jest.spyOn(wrapper.vm, 'showConfirmationModal');
    wrapper.update();
    wrapper.find('button').trigger('click');
    expect(wrapper.vm.showConfirmationModal).toBeCalled();
  });
});
