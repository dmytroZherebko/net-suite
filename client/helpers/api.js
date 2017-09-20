import router from '../router';
import store from '../store';
import constants from '../constants';

const callApi = (url, params) => { // eslint-disable-line
  if (!params.headers) {
    params.headers = {};
  }

  if (params.query) {
    const query = Object.keys(params.query)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params.query[k])}`)
      .join('&');
    url = `${url}?${query}`;
  }

  if (typeof params.body !== 'object') {
    params.headers['Content-Type'] = 'application/json';
  }

  params.headers.Accept = 'application/json';
  return fetch(url, {
    cache: 'no-store',
    method: 'GET',
    ...params
  })
    .then((data) => {
      if (data.status === 401) {
        store.commit(constants.mutations.SET_ACCESS_TOKEN, null);
        router.push({ name: 'authorize', query: { redirect: router.currentRoute.fullPath } });
        throw new Error();
      }

      if (data.status >= 400) {
        return data.json()
          .then((err) => {
            let message = '';
            if (err.error) {
              message = err.message || err.error || '';
            } else {
              err.errors.forEach((e) => {
                message += `${e.message}${e.id || ''}\n`;
              });
            }
            throw new Error(message);
          });
      }
      return data;
    })
    .then(data => data.json());
};

export default callApi;
