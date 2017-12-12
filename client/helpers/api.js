import { handleError, configureRequestParams, getQueryString } from './requestUtils';

const callApi = async (url, params, file) => { // eslint-disable-line
  if (params.query) {
    url = `${url}?${getQueryString(params.query)}`;
  }

  const requestParams = configureRequestParams(url, params, file);

  const requestUrl = requestParams.url;
  delete requestParams.url;

  const data = await fetch(requestUrl, {
    cache: 'no-store',
    method: 'GET',
    ...requestParams
  });

  await handleError(data);

  if (file) return data.blob();
  return data.json();
};

export default callApi;
