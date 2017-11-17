import { handleError, addHeaders, getQueryString } from './requestUtils';

const callApi = async (url, params, file) => { // eslint-disable-line
  addHeaders(params, file);

  if (params.query) {
    url = `${url}?${getQueryString(params.query)}`;
  }

  const data = await fetch(url, {
    cache: 'no-store',
    method: 'GET',
    ...params
  });

  await handleError(data);

  if (file) return data.blob();
  return data.json();
};

export default callApi;
