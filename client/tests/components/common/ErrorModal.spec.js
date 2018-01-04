import Vue from 'vue';
import Vuex from 'vuex';
import { mount } from 'vue-test-utils';

import ErrorModal from '../../../components/common/ErrorModal.vue';
import ModalComponent from '../../../components/common/ModalComponent.vue';

import constants from '../../../constants/';

Vue.use(Vuex);

const { actions } = constants;

const storeConfig = {
  state: {
    error: {
      showError: false,
      errorText: 'error'
    }
  },
  actions: {
    [actions.RESET_ERROR]: jest.fn(),
  }
};

const store = new Vuex.Store(storeConfig);

const componentConfig = {
  store,
};

const wrapper = mount(ErrorModal, componentConfig);


describe('Error modal', () => {
  it('should call reset error action', () => {
    wrapper.vm.onClose();
    expect(storeConfig.actions[actions.RESET_ERROR]).toBeCalled();
  });

  it('modal should have needed props', () => {
    expect(wrapper.find(ModalComponent).props('show-modal', storeConfig.state.error.showError)).toBeTruthy();
  });

  it('modal should call close on modal close', () => {
    jest.spyOn(wrapper.vm, 'onClose');
    wrapper.update();
    wrapper.find(ModalComponent).vm.$emit('modal-close');
    expect(wrapper.vm.onClose).toBeCalled();
    wrapper.vm.onClose.mockClear();
  });

  it('modal should call close on modal ok', () => {
    jest.spyOn(wrapper.vm, 'onClose');
    wrapper.update();
    wrapper.find(ModalComponent).vm.$emit('modal-ok');
    expect(wrapper.vm.onClose).toBeCalled();
    wrapper.vm.onClose.mockClear();
  });
});
