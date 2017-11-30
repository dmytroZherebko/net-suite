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
- some version can include pdffiller.init global function that will call with parameters for implicit auth flow