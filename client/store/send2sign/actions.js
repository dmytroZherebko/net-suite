import callApi from '../../helpers/api';
import { makeEndPointUrl } from '../../helpers/utils';
import constants from '../../constants';

const mutations = constants.mutations;
const endpoints = constants.endpoints;

const removeUselessS2SKeys = (s2sData) => {
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
    formatedRecipient.additional_documents = [...formatedRecipient.additional_documents];
    return formatedRecipient;
  });

  return s2sUpdated;
};

export const createSendToSign = ({ commit, rootState}, payload) => { // eslint-disable-line
  const s2sData = removeUselessS2SKeys(payload);

  commit(mutations.TOGGLE_LOADER);
  return callApi(makeEndPointUrl(endpoints.SEND_TO_SIGN), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${rootState.auth.access_token}`
    },
    body: JSON.stringify(s2sData)
  })
    .then(() => {
      commit(mutations.TOGGLE_LOADER);
    })
    .catch((err) => {
      commit(mutations.TOGGLE_LOADER);
      if (err.message) {
        commit(mutations.SET_ERROR, err.message);
      }
      throw new Error();
    });
};
