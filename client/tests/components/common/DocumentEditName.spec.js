import { mount } from 'vue-test-utils';
import DocumentEditName from '../../../components/common/DocumentEditName.vue';
import ModalComponent from '../../../components/common/ModalComponent.vue';

const componentConfig = {
  propsData: {
    showEditModal: true,
    value: 'name',
    closeEditNameModal: jest.fn(),
    updateNameAction: jest.fn(),
  }
};

const wrapper = mount(DocumentEditName, componentConfig);


describe('DocumentEditName component', () => {
  afterEach(() => {
    componentConfig.propsData.updateNameAction.mockClear();
  });

  it('should set correct props to modal component', () => {
    expect(wrapper.find(ModalComponent).props('show-modal', componentConfig.propsData.showEditModal)).toBeTruthy();
    expect(wrapper.find(ModalComponent).props('modal-type', 'confirm')).toBeTruthy();
  });

  it('should call correct functions on modal close', () => {
    wrapper.find(ModalComponent).vm.$emit('modal-close');
    expect(componentConfig.propsData.closeEditNameModal).toBeCalled();
  });

  it('should call correct functions on modal confirm', () => {
    jest.spyOn(wrapper.vm, 'onEditNameConfirm');
    wrapper.update();
    wrapper.find(ModalComponent).vm.$emit('modal-ok');
    expect(wrapper.vm.onEditNameConfirm).toBeCalled();
    wrapper.vm.onEditNameConfirm.mockRestore();
    wrapper.update();
  });

  it('should call onDocumentNameChange when trigger input event', () => {
    jest.spyOn(wrapper.vm, 'onDocumentNameChange').mockImplementation(() => {});
    wrapper.update();
    wrapper.find('input').trigger('input');
    expect(wrapper.vm.onDocumentNameChange).toBeCalled();
    wrapper.vm.onDocumentNameChange.mockRestore();
    wrapper.update();
  });

  it('input shouldn`t has a class input_invalid', () => {
    expect(wrapper.find('input').classes()).not.toContain('input_invalid');
  });

  it('input should has a class input_invalid', () => {
    wrapper.setData({ inputError: true });
    expect(wrapper.find('input').classes()).toContain('input_invalid');
  });

  it('should emit input event', () => {
    const event = { target: { value: 'new name' } };
    wrapper.vm.onDocumentNameChange(event);
    expect(wrapper.emitted('input')[0]).toEqual([event.target.value]);
  });

  it('should set input error to true when name length less then 3', () => {
    const event = { target: { value: 'ne' } };
    wrapper.vm.onDocumentNameChange(event);
    expect(wrapper.vm.inputError).toBeTruthy();
  });

  it('should set input error to false when name length less then 3', () => {
    const event = { target: { value: 'new' } };
    wrapper.vm.onDocumentNameChange(event);
    expect(wrapper.vm.inputError).toBeFalsy();
  });

  it('should call update name action on confirm', () => {
    wrapper.vm.onEditNameConfirm();
    expect(componentConfig.propsData.updateNameAction).toBeCalledWith({ name: componentConfig.propsData.value });
  });

  it('shouldn`t call update name action on confirm when have error', () => {
    wrapper.setData({ inputError: true });
    wrapper.vm.onEditNameConfirm();
    expect(componentConfig.propsData.updateNameAction).not.toBeCalled();
  });
});
