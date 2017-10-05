export const getS2SDefaultParams = (state) => {
  const params = { ...state.defaultParams };
  params.recipients = [];

  return params;
};

export const getS2SDefaultRecipient = (state, getters, rootState) => {
  const params = { ...state.defaultRecipient };
  params.additional_documents = [];
  params.message_subject = params.message_subject + rootState.user.userInfo.email;

  return params;
};
