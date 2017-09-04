import Vue from 'vue';
import VueRouter from 'vue-router';

import Root from '../components/Root.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Root
  }
];

export default new VueRouter({
  routes
});
