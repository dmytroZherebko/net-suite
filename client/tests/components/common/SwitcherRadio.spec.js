import { mount } from 'vue-test-utils';

import SwitcherRadio from '../../../components/common/SwitcherRadio.vue';

const componentConfig = {
  propsData: {
    value: 'current',
    inputs: [
      {
        value: 'current',
        title: 'current',
      },
      {
        value: 'other',
        title: 'other',
      }
    ],
    radioName: 'test',
  }
};

const wrapper = mount(SwitcherRadio, componentConfig);


describe('SwitcherRadio', () => {
  it('should emit change event on onSwitcherChange call', () => {
    wrapper.vm.onSwitcherChange(componentConfig.propsData.value);
    expect(wrapper.emitted('change')[0]).toEqual([componentConfig.propsData.value]);
  });

  it('should render two items', () => {
    expect(wrapper.findAll('.switch-radio__item').length).toBe(componentConfig.propsData.inputs.length);
  });

  it('should render first item with active class', () => {
    expect(wrapper.find('.switch-radio__item').classes()).toContain('switch-radio__item_active');
  });

  it('should call onSwitcherChange when input trigger change event', () => {
    wrapper.setMethods({ onSwitcherChange: jest.fn() });
    wrapper.find('.switch-radio').trigger('change');
    expect(wrapper.vm.onSwitcherChange).toBeCalled();
  });
});
