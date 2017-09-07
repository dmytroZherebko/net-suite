export const getDocuments = state => (currentPage) => {
  if (state.documents.documentsList[currentPage]) {
    return state.documents.documentsList[currentPage];
  }
  return null;
};

export const checkAccessToPage = state => (routeName) => {
  if (routeName === 'authorize' || state.auth.authorize) {
    return true;
  }

  return false;
};
