import Vue from 'vue';
import { mount } from 'vue-test-utils';

import TagsComponent from '../../../components/common/TagsComponent.vue';

const componentConfig = {
  propsData: {
    tagsList: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
    placeholder: 'text',
    maxItems: 5,
    hasError: false,
  }
};

const eventDataMock = {
  target: {
    value: 'bla'
  }
};

const wrapper = mount(TagsComponent, componentConfig);


describe('TagsComponent', () => {
  it('should render 5 tags items', () => {
    expect(wrapper.findAll('.tags__tag').length).toBe(componentConfig.propsData.tagsList.length);
  });

  it('shouldn`t render input when maxItems the same as length in tags list', () => {
    expect(wrapper.findAll('.tags__input').length).toBe(0);
  });

  it('shouldn`t emit add-tag-item event on addNewTagItem call when maxItems the same as length in tags list', () => {
    wrapper.vm.addNewTagItem(eventDataMock);
    expect(wrapper.emitted('add-tag-item')).toBeUndefined();
  });

  it('should emit add-tag-item event on addNewTagItem call', async () => {
    wrapper.setProps({ tagsList: [componentConfig.propsData.tagsList[0]] });
    wrapper.vm.addNewTagItem(eventDataMock);
    expect(wrapper.emitted('add-tag-item')[0]).toEqual([eventDataMock.target.value]);
    await Vue.nextTick();
    expect(eventDataMock.target.value).toBe('');
  });

  it('should emit remove-tag-item event on removeTagItem call', () => {
    wrapper.vm.removeTagItem(1);
    expect(wrapper.emitted('remove-tag-item')[0]).toEqual([1]);
  });

  it('should emit reset-tag-input-error event on resetTagInputError call', () => {
    wrapper.vm.resetTagInputError();
    expect(wrapper.emitted('reset-tag-input-error')[0]).toEqual([]);
  });

  it('should render input when maxItems less then length in tags list', () => {
    expect(wrapper.findAll('.tags__input').length).toBe(1);
  });

  it('should call removeTagItem on click', () => {
    wrapper.setMethods({ removeTagItem: jest.fn() });
    wrapper.find('.tags__remove').trigger('click');
    expect(wrapper.vm.removeTagItem).toBeCalled();
  });

  it('should call addNewTagItem on blur', () => {
    wrapper.setMethods({ addNewTagItem: jest.fn() });
    wrapper.find('.tags__input').trigger('blur');
    expect(wrapper.vm.addNewTagItem).toBeCalled();
  });

  it('should call addNewTagItem on enter', () => {
    wrapper.setMethods({ addNewTagItem: jest.fn() });
    wrapper.find('.tags__input').trigger('keyup.enter');
    expect(wrapper.vm.addNewTagItem).toBeCalled();
  });

  it('should call addNewTagItem on enter', () => {
    wrapper.setMethods({ resetTagInputError: jest.fn() });
    wrapper.find('.tags__input').trigger('input');
    expect(wrapper.vm.resetTagInputError).toBeCalled();
  });
});
