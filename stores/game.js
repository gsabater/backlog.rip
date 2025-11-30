/*
 * @file:    \stores\gameStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 11th January 2024
 * Modified: 15th October 2025 - 05:05:18
 */

import dataService from '../services/dataService'
import gameService from '../services/gameService'

let $log = null
let $db = null
let $nuxt = null
let $data = null

export const useGameStore = defineStore('game', {
  state: () => ({
    app: {
      is: {},
      id: {},
      genres: [],
    },
  }),

  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Codex of methods
  //
  // Retrieve data
  // * load()
  // * gameService.loadFromAPI()
  // * gameService.getAchieved()
  //
  // Handle data
  // * create()
  // * update()
  //
  // Getters
  // * _score()
  // * _playtime()
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  actions: {
    //+-------------------------------------------------
    // load()
    // Loads an item from datastore and sets this.app
    // Can load additional resources if needed
    // -----
    // Created on Thu Jan 11 2024
    //+-------------------------------------------------
    async load(uuid, hooks = {}) {
      const game = $data.get(uuid)
      this.replaceApp(game)

      if (!hooks.with?.length) return
      let loaded = {}

      // Load API data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (hooks.with?.includes('api')) {
        const api = await gameService.loadFromAPI(game)
        if (api) loaded = { ...api }
      }

      // Load additional achievements
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // if (hooks.with?.includes('achievements')) {
      //   let achieved = await gameService.getAchievements(game, loaded)
      //   if (achieved) loaded.achieved = achieved
      //   // loaded.dates = loaded.dates ?? {}
      //   // loaded.dates.achieved = dates.stamp()
      // }

      if (Object.keys(loaded).length == 0) return
      this.update(game, loaded)
    },

    replaceApp(newApp) {
      for (const key in this.app) {
        delete this.app[key]
      }
      Object.assign(this.app, newApp)
    },

    //+-------------------------------------------------
    // create()
    // Creates a new item and normalizes it
    // -----
    // Created on Wed Apr 10 2024
    // Created on Wed Dec 04 2024 - Mark uuid as local
    //+-------------------------------------------------
    create(data = {}) {
      let app = {}

      app = dataService.normalize({ ...data })
      app.uuid = app.uuid || `local::${$nuxt.$uuid()}`
      app.is.lib = app.is.lib || dates.stamp()

      return app
    },

    //+-------------------------------------------------
    // update()
    // Gets some data, compares it with game and updates it
    // Then processes the resulting data to store it and sets this.app
    // -----
    // Created on Tue Feb 25 2025
    //+-------------------------------------------------
    async update(uuid, data) {
      // debugger

      // Load the game by reference
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      const app = uuid.uuid ? uuid : $data.get(uuid)

      // Make a new item with merged data
      // Sometimes, the merged does not have any updates
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let updated = gameService.merge(app, data)
      if (!updated.updated) return

      // Update local data, store and indexes
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (app.is.lib) app.toStore = true
      await $data.process(updated.app, 'updated', false)
      // $nuxt.$mitt.emit('game:data', { uuid: updated.app.uuid })

      // Update the current app if it's the same
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (this.app.uuid == updated.app.uuid) this.load(updated.app.uuid, false)
    },

    // //+-------------------------------------------------
    // // update()
    // // Updates local data from API data
    // // To modify the data by the user, use modify()
    // // -----
    // // Created on Sun Feb 11 2024
    // // Created on Fri Jan 17 2025 - New update method
    // //+-------------------------------------------------
    // async updatex(uuid, data) {
    //   let game = null

    //   // Load the game by reference
    //   //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //   if (typeof uuid === 'object') game = uuid
    //   else game = $data.get(uuid)

    //   console.trace('abc')
    //   // if (data && game.uuid == '4434fa13-4f18-44ec-ad80-db412ba28a96') debugger
    //   // if (data && game.uuid == '5c1c9b5a-1c02-4a56-85df-f0cf97929a48') debugger
    //   // if (data && game.uuid == 'b53cc15c-980a-4a2e-af37-0053f093eaef') debugger

    //   const update = gameService.needsUpdate(game, data)
    //   if (!update) return false

    //   // Update the game with the new data from the API
    //   //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //   if (!data && update.indexOf(':api') > -1) {
    //     data = await this.loadFromAPI(game.uuid)
    //     if (!data) return
    //   }

    //   // Create the new object with the updated data
    //   //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //   let updated = gameService.update(game, data)
    //   if (!updated.updated) return

    //   // TODO: Add entry in app log

    //   // Update local data, store and indexes
    //   //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //   $data.toData(updated.app)
    //   // $data.process(updated.app, 'updated:app')

    //   $nuxt.$mitt.emit('game:data', { uuid: updated.app.uuid })
    //   if (this.app.uuid == updated.app.uuid) this.load(updated.app.uuid, false)
    // },

    //+-------------------------------------------------
    // init()
    // -----
    // Created on Sun Feb 11 2024
    //+-------------------------------------------------
    async init() {
      $nuxt ??= useNuxtApp()
      $data ??= useDataStore()

      $log ??= $nuxt.$log
      $db ??= $nuxt.$db
    },
  },
})

//+-------------------------------------------------
//| 🔃 HMR
//| https://pinia.vuejs.org/cookbook/hot-module-replacement.html
//+-------------------------------------------------
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot))
}
