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

  params.headers['Content-Type'] = 'application/json';
  params.headers.Accept = 'application/json';
  return fetch(url, {
    cache: 'no-store',
    method: 'GET',
    ...params
  })
    .then(data => data.json());
};

export default callApi;
