import Vue from 'vue';
import 'es6-promise/auto';
import { sync } from 'vuex-router-sync';

import router from './router';
import store from './store';
import preconfigStore from './store/preconfigStore';

import App from './components/App.vue';
// styles
import './main.scss';

sync(store, router);

const pdffiller = {
  init: (config) => {
    preconfigStore(config);

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

window.pdffiller = pdffiller;
