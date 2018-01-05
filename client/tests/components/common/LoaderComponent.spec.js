import Vue from 'vue';
import Vuex from 'vuex';
import { mount } from 'vue-test-utils';

import LoaderComponent from '../../../components/common/LoaderComponent.vue';

Vue.use(Vuex);

const storeConfig = {
  state: {
    isLoading: false
  }
};

const store = new Vuex.Store(storeConfig);

const componentConfig = {
  store,
};

const wrapper = mount(LoaderComponent, componentConfig);


describe('LoaderComponent', () => {
  it('shouldn`t render loader when loading is false', () => {
    expect(wrapper.findAll('.api-wrap-loading').length).toBe(0);
  });

  it('should render loader when loading is true', () => {
    wrapper.setComputed({ isLoading: true });
    expect(wrapper.findAll('.api-wrap-loading').length).toBe(1);
  });
});
