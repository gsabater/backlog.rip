/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/*
 * @file:    \plugins\app.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 20th December 2023
 * Modified: Wed Apr 17 2024
 */

// import { reactive } from 'vue'
// import { useWindowSize } from '@vueuse/core'
// import { useBreakpoints } from '@vueuse/core'

let $nuxt = null
let $user = null
let $data = null
let $game = null
let $state = null
let $repos = null

let app = {
  v: '0.11.01 β', //β

  dev: false,
  env: 'production',

  // $db.status
  // can be true when is ready or a status
  // like 'loading' , 'error' or 'update'
  // db: null,

  width: 0,
  device: null,
  controller: false,

  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Counters of data
  //
  // count.api is the # of games available in the api
  // count.data is the # of games in cache
  // count.library is the # of games in local library
  //
  // states.backlog (and others) is the # of games in each state
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  count: {
    api: 0,
    data: 0,
    library: 0,

    states: {
      backlog: 0,
    },
  },

  api: {},

  // Global app state
  // Controls modules boundaries
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ready: false,
  loading: false,

  // Global log
  // Has every message received from the app
  // Used to debug and review messages
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  log: ['wip'],

  f: {
    toggleFullscreen: null,
  },

  // Global user interface
  // Quick access to ui elements on the layout
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ui: {
    drawer: false,
    sidebar: false,
    fullscreen: false,
  },
}

//+-------------------------------------------------
// goFullScreen()
// -----
// Created on Thu Apr 04 2024
//+-------------------------------------------------
// async function goFullScreen() {

// }

//+-------------------------------------------------
// toggleSidebar()
// -----
// Created on Wed Dec 27 2023
//+-------------------------------------------------
async function toggleSidebar($nuxt) {
  app.layout.sidebar = !app.layout.sidebar
  // $nuxt.$mitt.emit('app:render')
}

//+-------------------------------------------------
// detectEnvironment()
// Detects the environment and sets the app.dev and app.env
// -----
// Created on Fri Jan 12 2024
//+-------------------------------------------------
function detectEnvironment() {
  if (window.location.hostname == 'localhost') {
    app.env = 'local'
  }

  if ($nuxt.$auth.config.debug) {
    app.dev = true
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
  if (!$game) $game = useGameStore()
  if (!$repos) $repos = useRepositoryStore()

  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Initialize stores
  // Initialize only the stores that are needed
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  $game.init()
  $repos.init()
}

//+-------------------------------------------------
// initClient()
// Initializes client modules
// -----
// Created on Tue Feb 27 2024
//+-------------------------------------------------
async function initClient() {
  if (!$user) $user = useUserStore()
  if (!$data) $data = useDataStore()
  if (!$state) $state = useStateStore()

  const breakpoints = useBreakpoints({
    sm: 0,
    md: 768,
    lg: 992,
    xl: 1200,
  })

  const { width, height } = useWindowSize()
  const { isFullscreen, toggle } = useFullscreen(document.documentElement)

  app.width = width
  app.device = breakpoints.active()

  app.f.toggleFullscreen = toggle
  app.ui.fullscreen = isFullscreen

  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Authenticate the user
  // Try to determinate if the user has an account
  // either locally or online and load values
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  await $user.authenticate()

  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Initialize stores
  // Initialize only the stores that are needed
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  await $data.init()
  $state.init()

  detectEnvironment()

  await delay(300)
  app.ready = true

  // console.warn('load most popular now')
}

export default defineNuxtPlugin(() => {
  init()

  app = reactive({
    init,
    initClient,
    toggleSidebar,

    ...app,
  })

  return {
    provide: {
      app,
    },
  }
})
