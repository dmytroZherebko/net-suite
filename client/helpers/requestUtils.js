import router from '../router';
import store from '../store';
import constants from '../constants';

const { mutations, actions, errors } = constants;

export const handleError = async (data) => {
  if (data.status === 401) {
    store.commit(mutations.SET_ACCESS_TOKEN, null);
    store.dispatch(actions.CHECK_AUTH_CODE);
    router.push({ name: 'authorize', query: { redirect: router.currentRoute.fullPath } });
    throw new Error();
  }

  if (data.status === 413) {
    throw new Error(errors.BIG_FILE);
  }

  if (data.status >= 400) {
    const err = await data.json();
    let message = '';
    if (err.error) {
      message = err.message || err.error || '';
    } else {
      err.errors.forEach((e) => {
        message += `${e.message}\n`;
      });
    }
    throw new Error(message);
  }
};

export const configureRequestParams = (url, params, file) => {
  if (!params.headers) {
    params.headers = {};
  }

  if (params.access_token) {
    params.headers.Authorization = `Bearer ${params.access_token}`;
  }

  if (!file) {
    params.headers.Accept = 'application/json';
  }

  if (store.state.auth.x_auth_token) {
    params.headers['x-auth-token'] = store.state.auth.x_auth_token;
  }

  if (typeof params.body !== 'object' && !file) {
    params.headers['Content-Type'] = 'application/json';
  }

  params.credentials = 'same-origin';

  if (store.state.proxy && !params.noPdfillerApi) {
    params.headers['x-pdffiller-user-id'] = store.state.pdffillerUserId;
    params.headers['x-proxy-url'] = url;
    params.url = store.state.proxyUrl;
  } else {
    params.url = `${store.state.baseUrl}${url}`;
  }

  return params;
};

export const getQueryString = queryObject => Object.keys(queryObject)
  .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(queryObject[k])}`)
  .join('&');
