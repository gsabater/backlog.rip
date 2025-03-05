/*
 * @file:    \stores\gameStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 11th January 2024
 * Modified: Wed 05 March 2025 - 16:17:03
 */

import dataService from '../services/dataService'
import gameService from '../services/gameService'

let $nuxt = null
let $data = null
let $library = null

export const useGameStore = defineStore('game', {
  state: () => ({
    app: {
      is: {},
      id: {},
      genres: [],
    },
  }),

  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Index of methods
  //
  // Retrieve data
  // * load()
  // * loadFromAPI(), service
  // * loadAchievements(), service
  //
  // Modify data
  // * create()
  // * update()
  // * normalize()
  //
  // Getters
  // * _score()
  // * _playtime()
  //
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Game Object
  // {
  //   uuid: '5c1c9b5a-1c02-4a56-85df-f0cf97929a48',
  //   name: 'DOOM',
  //   description: 'Lorem',
  //   state: 1, ⇢ State ID from states table
  //
  //   id: { 🔸 Added in this.normalize
  //     api: '5c1c9b5a-1c02-4a56-85df-f0cf97929a48', ⇢ UUID assigned by the API
  //     gog: 'ABC',
  //     xbox: 'C3QH42WRGM3R',
  //     epic: 'ABC',
  //     igdb: 7351,
  //     steam: 379720,
  //   },
  //
  //   is: {
  //     lib: 1726666517, ⇢ Timestamp of when the app was added to the library
  //     steam: 1726666517, ⇢ Timestamp of when the app was added to the steam library
  //     state: {
  //       state_1: 1726666517, ⇢ Timestamp of when assigned to state 1
  //       state_2: 1726666517, ⇢ Timestamp of when assigned to state 2...
  //     }
  //   },
  //
  //   dates: {
  //     created_at: 1726666517, ⇢ Timestamp of when the app was created
  //     updated_at: 1726666517, ⇢ Timestamp of when the app was updated
  //     released_at: 1726666517, ⇢ Timestamp of when the app was released
  //   },
  //
  //   genres: [], ⇢ Array of genres
  //
  //   scores: {
  //     igdb: 81, ⇢ Score from IGDB
  //     igdbCount: 748, ⇢ Amount of reviews on IGDB
  //     steamscore: 85, ⇢ Score from Steam
  //     steamCount: 1106232, ⇢ Amount of reviews on Steam
  //     steamscoreAlt: Very Positive, ⇢ Score from Steam
  //     userscore: 86, ⇢ Score from Steam
  //   },
  //
  //   playtime: {
  //     steam: 123, ⇢ Playtime (in minutes)
  //     steam_last: 1726666517, ⇢ Timestamp of last playtime
  //   },
  //
  //   cover: {
  //     igdb: 123, ⇢ Cover ID from IGDB
  //   },
  //
  //   log: [], ⇢ Array of logs
  // }
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
      console.warn('4')
      const game = $data.get(uuid)
      this.app = game

      if (!hooks.with?.length) return

      let loaded = {}
      debugger
      // Load API data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (hooks.with?.includes('api')) {
        const api = await gameService.loadFromAPI(game)
        if (api) loaded = { ...api }
      }

      // Load additional achievements
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (hooks.with?.includes('achievements')) {
        const achieved = await gameService.loadAchieved(game)
        if (achieved) loaded.achieved = achieved
        // loaded.dates = loaded.dates ?? {}
        // loaded.dates.achieved = dates.stamp()
      }

      if (Object.keys(loaded).length == 0) return
      this.update(game, loaded)
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

      // Update the current app if it's the same
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (this.app.uuid == updated.app.uuid) this.load(updated.app.uuid, false)
    },

    //+-------------------------------------------------
    // update()
    // Updates local data from API data
    // To modify the data by the user, use modify()
    // -----
    // Created on Sun Feb 11 2024
    // Created on Fri Jan 17 2025 - New update method
    //+-------------------------------------------------
    async updatex(uuid, data) {
      let game = null

      // Load the game by reference
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (typeof uuid === 'object') game = uuid
      else game = $data.get(uuid)

      console.trace('abc')
      // if (data && game.uuid == '4434fa13-4f18-44ec-ad80-db412ba28a96') debugger
      // if (data && game.uuid == '5c1c9b5a-1c02-4a56-85df-f0cf97929a48') debugger
      // if (data && game.uuid == 'b53cc15c-980a-4a2e-af37-0053f093eaef') debugger

      const update = gameService.needsUpdate(game, data)
      if (!update) return false

      // Update the game with the new data from the API
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (!data && update.indexOf(':api') > -1) {
        data = await this.loadFromAPI(game.uuid)
        if (!data) return
      }

      // Create the new object with the updated data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let updated = gameService.update(game, data)
      if (!updated.updated) return

      // TODO: Add entry in app log

      // Update local data, store and indexes
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      $data.toData(updated.app)
      // $data.process(updated.app, 'updated:app')

      if (this.app.uuid == updated.app.uuid) this.load(updated.app.uuid, false)
    },

    async init() {
      $nuxt ??= useNuxtApp()
      $data ??= useDataStore()
      // $library ??= useLibraryStore()

      if (window) window.$game = this
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
