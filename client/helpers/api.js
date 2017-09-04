const callApi = (url, params) => {
  if (params.body) {
    const formData = new FormData();

    Object.keys(params.body).forEach((key) => {
      formData.append(key, params.body[key]);
    });
    params.body = formData;
  }

  return fetch(url, {
    cache: 'no-store',
    method: 'GET',
    ...params
  })
    .then(data => data.json());
};

export default callApi;
