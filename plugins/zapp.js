/* eslint-disable no-unused-vars */

/*
 * @file:    \plugins\app.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 20th December 2023
 * Modified: Thu Jan 18 2024
 */

let $nuxt = null
let $data = null

let app = {
  v: 'β 0.5',
  key: 0,
  dev: false,
  env: 'production',

  api: {},
  layout: {
    sidebar: false,
  },

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
  app.c_library = Object.keys($data.library).length

  window.$app = app
  return {
    provide: {
      app,
    },
  }
})
