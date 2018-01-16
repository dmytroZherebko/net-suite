# Api Integration Widget

Widget for fast integration.

## npm command

- `npm run dev` - develop with watch and webpack-dev-server(up server on 3000 port)
- `npm run build` - build js and css to build/ folder
- `npm test` - to run all unit tests

## Stack

- Vue.js
- Vue-Router
- Vuex
- ES6/ES7
- Webpack
- Jest

# Features 
- l2f
- s2s
- open in editor
- work with templates

## Notes
- Use `git cherry-pick <commit hash>` to sync between different versions to prevent issues when widget have files of other
integration or integration doesn`t have own components or files.
- Base widget version uses implicit flow auth
- Static build file:
  - prod - `https://cdn.pdffiller.com/public-api-integration-widget/<build-number>/<file-name>`
  - dev - `https://d-cdn.pdffiller.com/public-api-integration-widget/<build-number>/<file-name>`
- To init widget add link to style and js file to html and add `<div id="app"></div>` and then call in your js `pdfffiller.init(config)`
- pdffiller.init global function that will call with config params for widget


#### Config example
```js
window.onload = function() {
    pdffiller.init({
      auth: { // config for auth need for implicit flow
        redirect_uri: 'uri',
        client_id: 'id',
      },
      openDocumentMode: "full", // full - in local window, modal - in modal, window - in new window
      openInJsEditor: false, // when true will open document in js editor
      s2s_callback_url: "https://someservice.pdffiller.com?param=param", // s2s callback url
      l2g_callback_url: "https://someservice.pdffiller.com?param=param", // l2f callback url
      showIntegrationDocumentsTab: false, // true/false
      showMyDocumentsTab: true, // true/false
      integrationDocumentsTabName: "Integration Docs", //title for tab
      unavailableDocumentMessage: "You can't work with this document, it is hidden by Hubspot", // message for unavailable documents
      x_auth_token: "blablasometoken", // token for integration api calls if provide will set header x-auth-token
      integration: "hubspot", // integration name - also all not pdffiller api endpoints will start with this name
      hubspot: { // integration config will send as query string in all requests
        userId: "2222",
        associatedObjectType: "LEADS",
        associatedObjectId: "23232323",
        portalId: "23232323"
      },
      pdffiller: { // config for pdffiller proxy calls
        userId: "2323", // user id will set as header x-pdffiller-user-id
        proxyUrl: "https://someservice.pdffiller.com/api/proxy" // url for calls to pdffiller api for which api call url will set as header x-proxy-url
      },
      baseApiUrl: "https://someservice.pdffiller.com/api/", // base url for not pdffiller api calls
      // reassign buttons config, buttons names: - my docs page: s2s, l2f, open, download, delete, uploadToIntegration
      //                                         - navbar: upload
      //                                         - integration docs page: uploadToPDFfiller, editIntegration, s2sIntegration, l2fIntegration
      buttons: {
        s2s: { show: false, title: "bla" }
      } 
    });
  };
```