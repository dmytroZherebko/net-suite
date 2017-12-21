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

const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const isEmailValid = email => emailReg.test(email);

export const getFormatedDocuments = documents => documents.items.map((doc) => {
  doc.name = getDocumentNameWithoutExtention(doc);
  doc.updated = getDataFromTimeStamp(doc.updated * 1000);
  doc.created = getDataFromTimeStamp(doc.created * 1000);
  return doc;
});

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

export const removeUselessS2SKeys = (s2sData) => {
  const s2sUpdated = { ...s2sData };
  if (s2sUpdated.method === 'sendtogroup') {
    delete s2sUpdated.pin;
    delete s2sUpdated.security_pin;
  }

  if (s2sUpdated.method === 'sendtoeach') {
    delete s2sUpdated.envelope_name;
    delete s2sUpdated.sign_in_order;

    if (s2sUpdated.security_pin === 'standard') {
      delete s2sUpdated.pin;
    }
  }

  s2sUpdated.recipients = s2sUpdated.recipients.map((recipient) => {
    const formatedRecipient = { ...recipient };
    if (s2sUpdated.method === 'sendtogroup' || s2sUpdated.security_pin === 'standard') {
      delete formatedRecipient.phone_authenticate;
    }

    delete formatedRecipient.errors;
    delete formatedRecipient.isCollapsed;
    if (formatedRecipient.additional_documents.length > 0) {
      formatedRecipient.additional_documents = [...formatedRecipient.additional_documents];
    } else {
      delete formatedRecipient.additional_documents;
    }
    return formatedRecipient;
  });

  return s2sUpdated;
};
