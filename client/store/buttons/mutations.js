import constants from '../../constants';

const mutations = constants.mutations;

export default {
  [mutations.UPDATE_BUTTONS_SETTINGS]: (state, payload) => {
    Object.keys(payload).forEach((key) => {
      if (state[key] && payload[key].hasOwnProperty('show')) {
        state[key].show = payload[key].show;
      }

      if (state[key] && payload[key].hasOwnProperty('title')) {
        state[key].title = payload[key].title;
      }
    });
  },
};
