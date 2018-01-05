import Vue from 'vue';
import Vuex from 'vuex';
import { mount } from 'vue-test-utils';

import AuthorizePage from '../../../components/Auhtorize/AuthorizePage.vue';

Vue.use(Vuex);

const storeConfig = {
  state: {},
  modules: {
    auth: {
      state: {
        client_id: '11',
        redirect_uri: 'uri',
        state: 'state',
        authorizeProcess: false,
        authorize: false,
      }
    }
  },
};

const store = new Vuex.Store(storeConfig);

const componentConfig = {
  store,
  mocks: {
    $router: {
      push: jest.fn()
    },
    $route: {
      query: {
        redirect: 'redirect'
      }
    }
  }
};

const wrapper = mount(AuthorizePage, componentConfig);


describe('AuthorizePage component', () => {
  it('should call router push with redirect patch when call redirect function', () => {
    wrapper.vm.redirect();
    expect(componentConfig.mocks.$router.push).toBeCalledWith(componentConfig.mocks.$route.query.redirect);
  });

  it('should show iframe with data from store in src when authorizeProcess is false', () => {
    const iframeSrc = wrapper.find('iframe').attributes().src;
    expect(iframeSrc).toContain(storeConfig.modules.auth.state.client_id);
    expect(iframeSrc).toContain(storeConfig.modules.auth.state.redirect_uri);
    expect(iframeSrc).toContain(storeConfig.modules.auth.state.state);
  });

  it('shouldn`t show iframe when authorizeProcess is true', () => {
    wrapper.setComputed({ authorizeProcess: true });
    expect(wrapper.findAll('iframe').length).toBe(0);
  });
});
