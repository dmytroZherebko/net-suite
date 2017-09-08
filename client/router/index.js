import Vue from 'vue';
import VueRouter from 'vue-router';

import store from '../store';
import AuthorizePage from '../components/Auhtorize/Authorize.vue';
import Documents from '../components/Documents/Documents.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/documents'
  },
  {
    path: '/documents',
    name: 'documents',
    component: Documents
  },
  {
    name: 'authorize',
    path: '/authorize',
    component: AuthorizePage
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (!store.getters.checkAccessToPage(to.name)) {
    next({ path: '/authorize', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
