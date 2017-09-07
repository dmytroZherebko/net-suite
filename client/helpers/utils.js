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

export const getDataFromTimeStamp = (timestamp) => {
  const date = new Date(timestamp);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month < 10 ? `0${month}` : month}/${day < 10 ? `0${day}` : day}/${date.getFullYear()}`;
};
