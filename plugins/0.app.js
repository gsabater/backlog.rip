/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/*
 * @file:    \plugins\app.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 20th December 2023
 * Modified: 24th November 2025 - 05:07:22
 */

// import { reactive } from 'vue'
// import { useWindowSize } from '@vueuse/core'
// import { useBreakpoints } from '@vueuse/core'

let $log = null
let $nuxt = null

let app = {
  v: '0.21.2 β', //β
  t: 1748963753259, // Date.now()

  // App State and services
  // reactive declaration of the app status for other components
  dev: false,
  wip: false,
  beta: false,
  ready: false,
  offline: false,
  env: 'prod', // dev, beta, prod

  width: 0,
  device: null,
  controller: false,

  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Application services
  //
  // Services are registered when they are ready
  // The app is ready when all critical services are ready
  // Other services can be loaded after another
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  critical: new Set(['user', 'data', 'states']),
  services: {
    user: false,
    data: false,
  },

  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Counters of data
  //
  // count.api is the # of games available in the api
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

    states: {},
  },

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

    showLogs: false,
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
async function toggleSidebar() {
  app.layout.sidebar = !app.layout.sidebar
}

//+-------------------------------------------------
// detectEnvironment()
// Detects if the application is running in a specific environment
// -----
// Created on Fri Jan 12 2024
// Updated on Fri Sep 20 2024 - Added app.wip for localhost
//+-------------------------------------------------
function detectEnvironment() {
  const origin = process.server ? useRequestURL().origin : window.location.origin
  const hostname = process.server ? useRequestURL().hostname : window.location.hostname

  if (hostname == 'localhost') {
    app.dev = true
    app.wip = true
    app.env = 'local'
  }

  if (origin?.includes('beta.')) {
    app.beta = true
    app.env = 'beta'
  }
}

//+-------------------------------------------------
// boot()
// Boots the app on server side
// -----
// Created on Sun Feb 04 2024
//+-------------------------------------------------
async function boot() {
  detectEnvironment()
}

//+-------------------------------------------------
// init()
// Initializes client modules
// -----
// Created on Tue Feb 27 2024
// Updated on Tue Nov 26 2024
//+-------------------------------------------------
async function init() {
  app.t = performance.now()

  // Define interface information
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const { width, height } = useWindowSize()

  const breakpoints = useBreakpoints({
    sm: 0,
    md: 768,
    lg: 992,
    xl: 1200,
  })

  app.width = width
  app.device = breakpoints.active()

  const { isFullscreen, toggle } = useFullscreen(document.documentElement)
  app.f.toggleFullscreen = toggle
  app.ui.fullscreen = isFullscreen
}

//+-------------------------------------------------
// register()
// Services register when they are ready
// -----
// Created on Tue Sep 30 2025
//+-------------------------------------------------
function register(service, time = 0) {
  let now = dates.microTime(performance.now() - time)

  // Register the service
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // console.warn(`${service} registered in ${now} ${app.critical.has(service) ? '<critical>' : ''}`)
  app.services[service] = now

  // Check if all critical services are ready
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const criticalReady = [...app.critical].every((srv) => app.services[srv])
  if (criticalReady && !app.ready) {
    // Notify application is ready
    // All major services are initialized
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    $nuxt.$mitt.emit('app:ready')
    app.ready = performance.now()

    $nuxt.$log(`[ App ] 🟢 Ready in ${dates.microTime(app.ready)}`)
    console.debug('↪ ' + JSON.stringify(app.services))
    console.debug('↪ ' + JSON.stringify({ data: app.count }))
    console.debug(
      '↪ ' +
        JSON.stringify({
          app: { ready: app.ready },
          cron: JSON.parse(JSON.stringify($nuxt.$auth.cron)),
        })
    )
  }
}

// Nuxt Plugin
// Created on Thu Oct 02 2025
//+-------------------------------------------------
export default defineNuxtPlugin((nuxtApp) => {
  boot()

  $nuxt = nuxtApp
  $log = $nuxt.$log

  app = reactive({
    init,
    register,
    toggleSidebar,

    ...app,
  })

  // Extend pinia to have access to nuxtApp
  // This allows to use $nuxt inside pinia stores with this.$nuxt
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  nuxtApp.$pinia.use(({ store }) => {
    store.$nuxt = nuxtApp
  })

  // Provide the app object to the Nuxt instance
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  nuxtApp.provide('app', app)
})
