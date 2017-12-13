# Api Integration Widget

Widget for fast integration.

## npm command

- `npm run dev` - develop with watch and webpack-dev-server
- `npm run build` - build js and css to docs/ folder

## Stack

- Vue.js
- Vue-Router
- Vuex
- ES6/ES7
- Webpack

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
- To init widget add style and js file to html and add `<div id="app"></div>`
- for pdffiller auth widget uses implicit flow
- pdffiller.init global function that will call with config params for widget


#### Config example
```js
window.onload = function() {
    pdffiller.init({
      openDocumentMode: "full", // full - in local window, modal - in modal, window - in new window
      openInJsEditor: false, // when true will open document in js editor
      showIntegrationDocumentsTab: false, // true/false
      integrationDocumentsTabName: 'Integration Docs', //title for tab
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
      baseApiUrl: "https://someservice.pdffiller.com/api/" // base url for not pdffiller api calls
    });
  };
```