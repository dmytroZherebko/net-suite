import Vue from 'vue';
import 'es6-promise/auto';
import { sync } from 'vuex-router-sync';

import router from './router';
import store from './store';

import Root from './components/Root.vue';
// styles
import './main.scss';

sync(store, router);

window.pdffiller = {
  init: (payload) => {
    store.dispatch('setClientCred', payload);
    store.dispatch('checkAuthCode');

    new Vue({
      store,
      router,
      components: {
        Root
      },
      template: '<root></root>'
    }).$mount('#app');
  }
};
