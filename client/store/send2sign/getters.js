export const getS2SDefaultParams = (state) => {
  const params = { ...state.defaultParams };
  return params;
};

export const getS2SDefaultRecipient = (state, getters, rootState) => {
  const params = { ...state.defaultRecipient };
  const email = rootState.user.userInfo && rootState.user.userInfo.email;
  if (email) {
    params.message_subject = params.message_subject + email;
  }

  return params;
};
