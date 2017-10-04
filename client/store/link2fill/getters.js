export const getDefaultParams = (state, getters, rootState) => { // eslint-disable-line
  const params = { ...state.defaultParams };
  const email = rootState.user.userInfo && rootState.user.userInfo.email;
  params.additional_documents = [];
  params.notification_emails = [];
  if (email) {
    params.notification_emails.push({ email });
  }
  return params;
};
