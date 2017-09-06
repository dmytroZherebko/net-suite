export const getDocuments = (state) => (currentPage) => { // eslint-disable-line
  if (state.documents.documentsList[currentPage]) {
    return state.documents.documentsList[currentPage];
  }
  return null;
};
