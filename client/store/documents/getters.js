export const getDocuments = (state) => { // eslint-disable-line
  if (state.documentsList) {
    return state.documentsList;
  }
  return null;
};
