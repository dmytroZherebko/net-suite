import Vue from 'vue';
import 'es6-promise/auto';
import { sync } from 'vuex-router-sync';

import router from './router';
import store from './store';

import App from './components/App.vue';
// styles
import './main.scss';

sync(store, router);

window.pdffiller = {
  init: (payload) => {
    store.dispatch('setClientCred', payload);
    store.dispatch('checkAuthCode');

    ZOHO.embeddedApp.init();

    new Vue({
      store,
      router,
      components: {
        App
      },
      template: '<app></app>'
    }).$mount('#app');
  }
};
