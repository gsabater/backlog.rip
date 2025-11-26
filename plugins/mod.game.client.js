/*
 * @file:    \plugins\mod.game.client.js
 * @desc:    The game plugin
 * -------------------------------------------
 * Files:
 * |- /pages/account/sections/game
 * |- /components/game
 * |- /stores/game
 *
 * Events:
 * |- ✅ game:manager ⇢ Right clicked over a game
 * |- ✅ game:updated ⇢ An ephimeral event used only by components to refresh game data
 * -------------------------------------------
 * Created Date: 30th September 2025
 * Modified: 15th October 2025 - 05:05:49
 */

let plugin = {}

// Nuxt Plugin
// Created on Sat Oct 04 2025
//+-------------------------------------------------
export default defineNuxtPlugin((nuxtApp) => {
  // nuxtApp.$log('✨✅ [ Game ]')

  let time = performance.now()
  let { $app, $mitt } = nuxtApp

  let $store = useGameStore()
  $store.init()

  // Register and provide the app object to Nuxt
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  nuxtApp.provide('game', plugin)
  $app.register('game', time)
})
