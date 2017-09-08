export const getDocuments = (state) => {
  if (state.documents.documentsList) {
    return state.documents.documentsList;
  }
  return null;
};

export const checkAccessToPage = state => (routeName) => {
  if (routeName === 'authorize' || state.auth.authorize) {
    return true;
  }

  return false;
};
