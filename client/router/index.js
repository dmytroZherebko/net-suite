import Vue from 'vue';
import VueRouter from 'vue-router';

import store from '../store';
import AuthorizePage from '../components/Auhtorize/AuthorizePage.vue';
import Documents from '../components/Documents/DocumentsPage.vue';
import LinkToFillForm from '../components/LinkToFill/LinkToFillFormTemplate.vue';
import SendToSignForm from '../components/SendToSign/SendToSignFormTemplate.vue';
import constants from '../constants';

const { getters } = constants;
const routesConstants = constants.routes;

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: () => {
      let redirectTo = null;
      if (store.state.documents.showIntegrationDocumentsPage) {
        redirectTo = routesConstants.INTEGRATION_DOCUMENTS.name;
      } else {
        redirectTo = routesConstants.DOCUMENTS.name;
      }
      return redirectTo;
    }
  },
  {
    path: routesConstants.DOCUMENTS.path,
    name: routesConstants.DOCUMENTS.name,
    component: Documents
  },
  {
    path: routesConstants.INTEGRATION_DOCUMENTS.path,
    name: routesConstants.INTEGRATION_DOCUMENTS.name,
    component: Documents
  },
  {
    name: routesConstants.AUTH.name,
    path: routesConstants.AUTH.path,
    component: AuthorizePage,
    meta: {
      hideNavBar: true
    },
  },
  {
    name: routesConstants.L2F_CREATE.name,
    path: routesConstants.L2F_CREATE.path,
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
    name: routesConstants.S2S_CREATE.name,
    path: routesConstants.S2S_CREATE.path,
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
        redirectTo = routesConstants.INTEGRATION_DOCUMENTS.name;
      } else {
        redirectTo = routesConstants.DOCUMENTS.name;
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
    next({ path: routesConstants.AUTH.path, query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
