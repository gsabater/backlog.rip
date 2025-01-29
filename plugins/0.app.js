/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/*
 * @file:    \plugins\app.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 20th December 2023
 * Modified: Wed 29 January 2025 - 17:47:39
 */

// import { reactive } from 'vue'
// import { useWindowSize } from '@vueuse/core'
// import { useBreakpoints } from '@vueuse/core'

let $nuxt = null
let $user = null
let $data = null
let $game = null
let $list = null
let $state = null
let $repos = null
let $guild = null
let $cloud = null
let $search = null
let $integration = null

let app = {
  v: '0.18.6 β', //β
  t: 1738169255103, // Date.now()

  // Global app state
  // Controls modules boundaries
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  wip: false,
  dev: false,
  beta: false,

  ready: false,
  offline: false,

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

    fav: 0,
    lists: 0,
    pinned: 0,
    hidden: 0,
    library: 0,

    states: {
      backlog: 0,
    },
  },

  api: {},

  f: {
    toggleFullscreen: null,
  },

  // Global user interface
  // Quick access to ui elements on the layout
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ui: {
    drawer: false,
    sidebar: false,
    updating: false,
    fullscreen: false,
  },

  // Global log
  // Has every message received from the app
  // Used to debug and review messages
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  log: [],
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
// Updated on Fri Sep 20 2024 - Added app.wip for localhost
//+-------------------------------------------------
function detectEnvironment() {
  if (window.location.hostname == 'localhost') {
    app.wip = true
    app.env = 'local'
  }

  if (window.location?.origin?.includes('beta.')) {
    app.beta = true
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
  $nuxt ??= useNuxtApp()
  $game ??= useGameStore()

  $repos ??= useRepositoryStore()

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
// Updated on Tue Nov 26 2024
//+-------------------------------------------------
async function initClient() {
  $data ??= useDataStore()
  $user ??= useUserStore()
  $list ??= useListStore()
  $cloud ??= useCloudStore()
  $guild ??= useGuildStore()
  $state ??= useStateStore()
  $search ??= useSearchStore()
  $integration ??= useLibraryStore()

  // console.groupCollapsed('🔸 Initializing')

  const breakpoints = useBreakpoints({
    sm: 0,
    md: 768,
    lg: 992,
    xl: 1200,
  })

  const { width, height } = useWindowSize()
  const { isFullscreen, toggle } = useFullscreen(document.documentElement)

  detectEnvironment()

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
  $guild.init('ping')

  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Initialize stores
  // Initialize only the stores that are needed
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  await $data.init()
  $search.init()
  $integration.init()
  await $state.init()
  await $list.init()

  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Connect to the cloud
  // This process is tightly coupled with the user account
  // But also needs the local data to be loaded
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  $cloud.connect()

  // console.groupEnd()
  await delay(333)
  app.ready = true

  handleEvents()
}

function handleEvents() {
  $nuxt.$mitt.on('sync:done', () => {
    dataService.updateBatch(['empty', ':outdated'])
  })
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
