import router from '../router';
import store from '../store';
import constants from '../constants';

export const handleError = async (data) => {
  if (data.status === 401) {
    store.commit(constants.mutations.SET_ACCESS_TOKEN, null);
    store.dispatch('checkAuthCode');
    router.push({ name: 'authorize', query: { redirect: router.currentRoute.fullPath } });
    throw new Error();
  }

  if (data.status === 413) {
    throw new Error('File size is limited to 25 Mb! Please select a smaller file.');
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

export const addHeaders = (params, file) => {
  if (!params.headers) {
    params.headers = {};
  }

  if (params.access_token) {
    params.headers.Authorization = `Bearer ${params.access_token}`;
  }

  if (!file) {
    params.headers.Accept = 'application/json';
  }

  if (typeof params.body !== 'object' && !file) {
    params.headers['Content-Type'] = 'application/json';
  }
};

export const getQueryString = queryObject => Object.keys(queryObject)
  .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(queryObject[k])}`)
  .join('&');
