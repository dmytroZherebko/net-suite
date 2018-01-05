import { mount } from 'vue-test-utils';

import ModalComponent from '../../../components/common/ModalComponent.vue';

const componentConfig = {
  propsData: {
    showModal: false,
    modalType: 'alert',
    modalClass: 'modal',
    showButtons: false,
    showHeader: false,
    primaryButton: 'ok',
    secondaryButton: 'cancel',
    modalTitle: 'title',
    closeByOutsideClick: false,
  },
  slots: {
    'modal-body': '<div class="modal-body"></div> '
  }
};

const wrapper = mount(ModalComponent, componentConfig);


describe('ModalComponent', () => {
  it('should emit modal-ok event on onPrimaryClick function call', () => {
    wrapper.vm.onPrimaryClick();
    expect(wrapper.emitted('modal-ok').length).toBe(1);
  });

  it('should emit modal-cancel event on onSecondaryClick function call', () => {
    wrapper.vm.onSecondaryClick();
    expect(wrapper.emitted('modal-cancel').length).toBe(1);
  });

  it('should emit modal-close event on onCloseClick function call', () => {
    wrapper.vm.onCloseClick();
    expect(wrapper.emitted('modal-close').length).toBe(1);
  });

  it('shouldn`t emit modal-close event on onOutsideCloseClick function call when closeByOutsideClick is false', () => {
    wrapper.vm.onOutsideCloseClick();
    expect(wrapper.emitted('modal-close').length).toBe(1);
  });

  it('should emit modal-close event on onOutsideCloseClick function call when closeByOutsideClick is true', () => {
    wrapper.setProps({ closeByOutsideClick: true });
    wrapper.vm.onOutsideCloseClick();
    expect(wrapper.emitted('modal-close').length).toBe(2);
  });

  it('shouldn`t render modal when show modal is false', () => {
    expect(wrapper.findAll('.modal-wrapper').length).toBe(0);
  });

  it('should render modal when show modal is true', () => {
    wrapper.setProps({ showModal: true });
    expect(wrapper.findAll('.modal-wrapper').length).toBe(1);
  });

  it('should set slot for modal body', () => {
    expect(wrapper.findAll('.modal-body').length).toBe(1);
  });

  it('should call onOutsideCloseClick function on click in wrapper', () => {
    wrapper.setMethods({
      onOutsideCloseClick: jest.fn()
    });
    wrapper.find('.modal-wrapper').trigger('click');
    expect(wrapper.vm.onOutsideCloseClick).toBeCalled();
  });

  it('shouldn`t render header when showHeader is false', () => {
    expect(wrapper.findAll('.modal-header').length).toBe(0);
  });

  it('should render header when showHeader is true', () => {
    wrapper.setProps({ showHeader: true });
    expect(wrapper.findAll('.modal-header').length).toBe(1);
  });

  it('should call onCloseClick function when click close button', () => {
    wrapper.setMethods({
      onCloseClick: jest.fn()
    });
    wrapper.find('.modal-header__close').trigger('click');
    expect(wrapper.vm.onCloseClick).toBeCalled();
  });

  it('shouldn`t render buttons when showButtons is false', () => {
    expect(wrapper.findAll('.modal-buttons').length).toBe(0);
  });

  it('should render buttons when showButtons is true', () => {
    wrapper.setProps({ showButtons: true });
    expect(wrapper.findAll('.modal-buttons').length).toBe(1);
  });

  it('should call onPrimaryClick function when click primary button', () => {
    wrapper.setMethods({
      onPrimaryClick: jest.fn()
    });
    wrapper.find('.button_primary').trigger('click');
    expect(wrapper.vm.onPrimaryClick).toBeCalled();
  });

  it('shouldn`t render secondary button when type is alert', () => {
    expect(wrapper.findAll('.button_secondary').length).toBe(0);
  });

  it('should render secondary button when type is confirm', () => {
    wrapper.setProps({ modalType: 'confirm' });
    expect(wrapper.findAll('.button_secondary').length).toBe(1);
  });

  it('should call onSecondaryClick function when click secondary button', () => {
    wrapper.setMethods({
      onSecondaryClick: jest.fn()
    });
    wrapper.find('.button_secondary').trigger('click');
    expect(wrapper.vm.onSecondaryClick).toBeCalled();
  });
});
