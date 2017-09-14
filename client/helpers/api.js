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
      if (data.status >= 400) {
        return data.json()
          .then((err) => {
            let message = '';
            if (err.error) {
              message = `${err.hint || ''}\n${err.message}`;
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
