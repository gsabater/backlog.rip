/* eslint-disable no-unused-vars */

/*
 * @file:    \plugins\app.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 20th December 2023
 * Modified: Mon Jan 01 2024
 */

let $nuxt = null

let app = {
  v: '0.2 (Alpha)',
  key: 0,

  api: {},
  layout: {
    sidebar: false,
  },
}

//+-------------------------------------------------
// toggleSidebar()
// -----
// Created on Wed Dec 27 2023
//+-------------------------------------------------
async function toggleSidebar($nuxt) {
  if (!$nuxt) $nuxt = useNuxtApp()

  app.layout.sidebar = !app.layout.sidebar
  $nuxt.$mitt.emit('app:render')
}

export default defineNuxtPlugin(() => {
  app.toggleSidebar = toggleSidebar

  return {
    provide: {
      app,
    },
  }
})
