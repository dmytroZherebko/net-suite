export const parseQueryString = (queryString) => { // eslint-disable-line
  const params = {};
  let temp,
    i,
    l;
  // Split into key/value pairs
  const queries = queryString.split('&');
  // Convert the array of strings into an object
  for (i = 0, l = queries.length; i < l; i++) {
    temp = queries[i].split('=');
    params[temp[0]] = temp[1];
  }
  return params;
};
