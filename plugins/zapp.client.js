/* eslint-disable no-unused-vars */

/*
 * @file:    \plugins\app.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 20th December 2023
 * Modified: Sun Feb 04 2024
 */

let $nuxt = null
let $user = null
let $data = null
let $game = null
let $state = null
let $repos = null

let app = {
  v: '0.7', //β
  key: 0,
  dev: false,
  env: 'production',

  // $db.status
  // can be true when is ready or a status
  // like 'loading' , 'error' or 'update'
  // db: null,

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

  // Global loading state
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

//+-------------------------------------------------
// init()
// Initializes the plugin. The idea of this plugin is
// to be able to serve as a global object to get app
// properties and methods
// -----
// Created on Sun Feb 04 2024
//+-------------------------------------------------
async function init() {
  if (!$nuxt) $nuxt = useNuxtApp()
  if (!$user) $user = useUserStore()
  if (!$data) $data = useDataStore()
  if (!$game) $game = useGameStore()
  if (!$state) $state = useStateStore()
  if (!$repos) $repos = useRepositoryStore()

  detectEnvironment()

  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Authenticate the user
  // Try to determinate if the user has an account
  // either locally or online and load values
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  await $user.authenticate()

  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Initialize stores
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  $data.init()
  $game.init()
  $state.init()
  $repos.init()
}

export default defineNuxtPlugin(() => {
  init()

  app.toggleSidebar = toggleSidebar

  window.$app = app
  return {
    provide: {
      app,
    },
  }
})
