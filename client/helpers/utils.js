import constants from '../constants';

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

export const getDocumentNameWithoutExtention = ({ name, type }) => {
  let formatedName = name.split('.');
  if (formatedName[formatedName.length - 1].toLowerCase() === type) {
    formatedName.pop();
  }
  formatedName = formatedName.join('.');
  return formatedName;
};

export const makeEndPointUrl = (endpoint) => {
  if (process.env.NODE_ENV === 'production') {
    return `${constants.endpoints.BASE_URL}${endpoint}`;
  }
  return endpoint;
};

export const isEmailValid = email => /.+@.+\..+/i.test(email);

export const copyToClipboard = (text) => {
  const textArea = document.createElement('textarea');
  textArea.style.position = 'fixed';
  textArea.style.height = '0';
  textArea.style.opacity = '0';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.log(err); // eslint-disable-line
  } finally {
    document.body.removeChild(textArea);
  }
};
