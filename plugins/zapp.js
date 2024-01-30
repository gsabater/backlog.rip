/* eslint-disable no-unused-vars */

/*
 * @file:    \plugins\app.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 20th December 2023
 * Modified: Tue Jan 30 2024
 */

let $nuxt = null
let $data = null

let app = {
  v: '0.6.5', //β
  key: 0,
  dev: false,
  env: 'production',

  api: {},
  layout: {
    sidebar: false,
  },

  //+-------------------------------------------------
  // Counters of data
  // states are counted in stateStore
  // count.api is the number of games available in the api
  // count.data is the number of games in the database
  // count.lib is the number of games in each library
  // ---
  // Maybe move this to libraryStore, or some other plugin
  //+-------------------------------------------------
  count: {
    api: 0,
    data: 0,
    lib: {
      steam: 0,
      gog: 0,
      epic: 0,
    },
  },

  // Loading state
  // Controls global nprogress bar
  //+-----------------------------------------------
  loading: false,
}

//+-------------------------------------------------
// toggleSidebar()
// -----
// Created on Wed Dec 27 2023
//+-------------------------------------------------
async function toggleSidebar($nuxt) {
  app.layout.sidebar = !app.layout.sidebar
  $nuxt.$mitt.emit('app:render')
}

//+-------------------------------------------------
// detectEnvironment()
// Detects the environment and sets the app.dev and app.env
// -----
// Created on Fri Jan 12 2024
//+-------------------------------------------------
function detectEnvironment() {
  if (window.location.hostname == 'localhost') {
    app.dev = true
    app.env = 'local'
  }
}
function init() {
  if (!$nuxt) $nuxt = useNuxtApp()
  if (!$data) $data = useDataStore()

  detectEnvironment()
}

export default defineNuxtPlugin(() => {
  init()

  app.toggleSidebar = toggleSidebar
  // app.c_library = Object.keys($data.library).length

  window.$app = app
  return {
    provide: {
      app,
    },
  }
})
