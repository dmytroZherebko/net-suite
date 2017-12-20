import constants from '../../constants';

const { getters } = constants;

export default {
  [getters.CHECK_ACCESS_TO_PAGE](state) {
    return (routeName) => {
      if (routeName === 'authorize' || state.authorize) {
        return true;
      }

      return false;
    };
  }
};
