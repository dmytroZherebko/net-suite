import Vue from 'vue';
import Promise from 'promise-polyfill';
import { sync } from 'vuex-router-sync';

import router from './router';
import store from './store';

// styles
import './main.scss';

// promise polyfill
if (!window.Promise) {
  window.Promise = Promise;
}

sync(store, router);

window.pdffiller = {
  init: (payload) => {
    store.dispatch('setClientCred', payload);
    store.dispatch('checkAuthCode');

    new Vue({
      store,
      router,
    }).$mount('#app');
  }
};
