import { mount } from 'vue-test-utils';

import SwitcherComponent from '../../../components/common/SwitcherComponent.vue';

const componentConfig = {
  propsData: {
    checked: false
  }
};

const wrapper = mount(SwitcherComponent, componentConfig);


describe('SwitcherComponent', () => {
  it('should emit change event on onSwitcherChange call', () => {
    wrapper.vm.onSwitcherChange(true);
    expect(wrapper.emitted('change')[0]).toEqual([true]);
  });

  it('label shouldn`t has a checked class when checked is false', () => {
    expect(wrapper.find('.switch').classes()).not.toContain('checked');
  });

  it('label should has a checked class when checked is true', () => {
    wrapper.setProps({ checked: true });
    expect(wrapper.find('.switch').classes()).toContain('checked');
  });

  it('should call onSwitcherChange when input trigger change event', () => {
    wrapper.setMethods({ onSwitcherChange: jest.fn() });
    wrapper.find('input').trigger('change');
    expect(wrapper.vm.onSwitcherChange).toBeCalled();
  });
});
