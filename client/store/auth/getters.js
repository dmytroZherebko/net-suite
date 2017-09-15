export const checkAccessToPage = state => (routeName) => { // eslint-disable-line
  if (routeName === 'authorize' || state.authorize) {
    return true;
  }

  return false;
};
