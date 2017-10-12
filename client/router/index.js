import Vue from 'vue';
import VueRouter from 'vue-router';

import store from '../store';
import AuthorizePage from '../components/Auhtorize/Authorize.vue';
import Documents from '../components/Documents/Documents.vue';
import LinkToFillForm from '../components/LinkToFill/LinkToFillFormTemplate.vue';
import SendToSignForm from '../components/SendToSign/SendToSignFormTemplate.vue';

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
    component: AuthorizePage,
    meta: {
      hideNavBar: true
    },
  },
  {
    name: 'link_to_fill_create',
    path: '/link-to-fill/create',
    component: LinkToFillForm,
    params: true,
    beforeEnter: (to, from, next) => {
      if (!store.state.documents.currentDocument.id) {
        next({ path: '/documents' });
      } else {
        next();
      }
    },
    meta: {
      hideNavBar: true
    },
  },
  {
    name: 'send_to_sign_create',
    path: '/send-to-sign/create',
    component: SendToSignForm,
    params: true,
    beforeEnter: (to, from, next) => {
      if (!store.state.documents.currentDocument.id) {
        next({ path: '/documents' });
      } else {
        next();
      }
    },
    meta: {
      hideNavBar: true
    },
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
