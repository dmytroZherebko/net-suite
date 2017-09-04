export const getDocuments = (state) => { // eslint-disable-line
  if (state.documents) {
    return state.documents.items;
  }
  return null;
};
