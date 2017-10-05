// import callApi from '../../helpers/api';
// import { makeEndPointUrl } from '../../helpers/utils';
// import constants from '../../constants';
//
// const mutations = constants.mutations;
// const endpoints = constants.endpoints;

// export const createLinkToFill = ({ commit, rootState}, payload) => { // eslint-disable-line
//   commit(mutations.TOGGLE_LOADER);
//   return callApi(makeEndPointUrl(endpoints.LINK_TO_FILL), {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${rootState.auth.access_token}`
//     },
//     body: JSON.stringify(payload)
//   })
//     .then((linkToFill) => {
//       commit(mutations.TOGGLE_LOADER);
//
//       return linkToFill.url;
//     })
//     .catch((err) => {
//       commit(mutations.TOGGLE_LOADER);
//       if (err.message) {
//         commit(mutations.SET_ERROR, err.message);
//       }
//     });
// };
