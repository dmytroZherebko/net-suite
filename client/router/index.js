import Vue from 'vue';
import VueRouter from 'vue-router';

import store from '../store';
import AuthorizePage from '../components/Auhtorize/AuthorizePage.vue';
import Documents from '../components/Documents/DocumentsPage.vue';
import IntegrationDocuments from '../components/IntegrationDocuments/DocumentsPage.vue';
import LinkToFillForm from '../components/LinkToFill/LinkToFillFormTemplate.vue';
import SendToSignForm from '../components/SendToSign/SendToSignFormTemplate.vue';
import constants from '../constants';

const { getters } = constants;

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: () => {
      let redirectTo = null;
      if (store.state.documents.showIntegrationDocumentsPage) {
        redirectTo = 'integration-documents';
      } else {
        redirectTo = 'documents';
      }
      return redirectTo;
    }
  },
  {
    path: '/documents',
    name: 'documents',
    component: Documents
  },
  {
    path: '/integration-documents',
    name: 'integration-documents',
    component: IntegrationDocuments
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
        next(from);
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
        next(from);
      } else {
        next();
      }
    },
    meta: {
      hideNavBar: true
    },
  },
  {
    path: '*',
    redirect: () => {
      let redirectTo = null;
      if (store.state.documents.showIntegrationDocumentsPage) {
        redirectTo = 'integration-documents';
      } else {
        redirectTo = 'documents';
      }
      return redirectTo;
    }
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (!store.getters[getters.CHECK_ACCESS_TO_PAGE](to.name)) {
    next({ path: '/authorize', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
