/* eslint-disable no-unused-vars */

/*
 * @file:    \stores\gameStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 11th January 2024
 * Modified: Thu Mar 21 2024
 */

let $nuxt = null
let $data = null

export const useGameStore = defineStore('game', {
  state: () => ({
    app: {},
  }),

  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Index of methods
  //
  // Retrieve data
  // * load()
  // * getFromAPI()
  //
  // Modify data
  // * update()
  //
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  actions: {
    //+-------------------------------------------------
    // load()
    // Loads an item from datastore and sets this.app
    // Calls update() to check if the app needs to be updated
    // -----
    // Created on Thu Jan 11 2024
    //+-------------------------------------------------
    async load(uuid) {
      const game = $data.get(uuid)

      this.app = game
      this.update(game)
    },

    // async add(data) {
    //   const $nuxt = useNuxtApp()
    //   const id = await $nuxt.$db.states.add(data)
    //   return id
    // },

    // async delete(id) {
    //   const $nuxt = useNuxtApp()
    //   await $nuxt.$db.states.delete(id)
    // },

    //+-------------------------------------------------
    // update()
    // Updates local data from API data
    // To modify the data by the user, use modify()
    // -----
    // Created on Sun Feb 11 2024
    //+-------------------------------------------------
    async update(uuid, data) {
      let game = null
      if (uuid === true) {
        console.error('🔥', uuid, data)
      }

      // Load the game by reference
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (typeof uuid !== 'string') game = uuid
      else game = $data.get(uuid)
      if (game === true) {
        console.error('🔥🚫', uuid, data)
      }

      const update = this.needsUpdate(game, data)
      if (!update) return false

      console.warn('🪝 updating as', update, game, data)

      // Update the game with the new data from the API
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (!data && update.indexOf(':api') > -1) {
        data = await this.getFromAPI()
        if (!data) return
      }

      // Create the new object with the updated data
      // And normalize removing unwanted data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let updated = { ...game, ...data }

      updated.uuid = game.uuid
      updated = this.normalize(updated)
      // console.warn(JSON.stringify(updated, null, 2))
      // debugger

      // TODO: Add entry in app log

      // Update local data, store and indexes
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      $data.process(updated, update)
      if (this.app.uuid == updated.uuid) this.app = updated
    },

    //+-------------------------------------------------
    // needsUpdate()
    // Checks if the app needs to be updated
    // There are three possible outcomes
    // - false if update is not required
    // - true or update:field to get data from the api
    // - store:db if the app needs to be added to the store
    // -----
    // Created on Sun Feb 11 2024
    //+-------------------------------------------------
    needsUpdate(app, data) {
      if (!app) return false

      // This block is only when comparing
      // local data with the API data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (data) {
        // app matched with an api item
        if (app && !app.api_id && data?.api_id) return 'update:match'

        // disabled as i havent decided if this should be
        // a match or update:api or what
        // app has older updated_at than api data
        // if (app.updated_at < data?.updated_at) return 'update:refresh'
      }

      // This block is only when checking app data
      // without a new object
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (!data) {
        // App has never been updated from the API
        if (!app.description) return 'update:api'
        if (!app.providers) {
          console.warn('should update and save providers')
        }
      }

      // For internal updates like changing data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // nunca ocurre
      // if (app.state !== data.state) return 'update:state'
      if (app?.is?.dirty || data?.is?.dirty) return 'store:db'

      return false
    },

    //+-------------------------------------------------
    // getFromAPI()
    // Gets more data from the API
    // -----
    // Created on Fri Feb 16 2024
    //+-------------------------------------------------
    async getFromAPI() {
      console.warn('🪝 Going to ask api for more data')

      let app = this.app.uuid
      let api = this.app.api_id
      if (this.app.is_api) api = this.app.uuid

      if (!api) {
        console.error('🪝 No API ID found')
        return
      }

      let jxr = await $nuxt.$axios.get(`/get/${api}.json`)

      if (jxr.status == 200) {
        console.warn('🪝 Data received: Updating')
        return jxr.data
      } else {
        console.error('🪝 Error loading data from API', jxr)
      }
    },

    //+-------------------------------------------------
    // normalize()
    // Normalizes data for the game.
    // This is meant to be used when the game is used in the app
    // For preparing data to be stored, use process() or prepareToStore()
    // -----
    // Created on Tue Feb 20 2024
    //+-------------------------------------------------
    normalize(game) {
      game.is = game.is || { in: {} }
      game.is.in = game.is.in || {}

      game.log = game.log || []
      game.scores = game.scores || {}
      game.genres = game.genres || []

      if (game.is_lib) {
        game.playtime = game.playtime || {}
        game.last_played = game.last_played || {}
      }

      // if (game.is_api) {
      //   game.api_id = game.uuid
      //   game.uuid = game.api_id
      // }

      game.updated_at = game.updated_at || 0

      delete game.trigger
      return game
    },

    //+-------------------------------------------------
    // _score()
    // Generates a new score by taking context into account
    // -----
    // Created on Tue Feb 20 2024
    //+-------------------------------------------------
    _score(app) {
      let score = app.score || 0

      // Avoid very high scores not verified
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (!app.scores) score = score - 10
      if (app.score >= 96 && !app.scores) {
        score = 60
      }

      // Reduce the final score if the amount of reviews is low
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (app.score > 90 && app.scores?.steamCount < 100) score *= 0.8
      if (app.score > 93 && app.scores?.steamCount < 3000) score *= 0.8

      if (app.score >= 95 && app.scores?.steamCount < 3000) score *= 0.8
      if (app.score >= 95 && app.scores?.steamCount < 15000) score *= 0.8

      if (app.scores?.igdbCount < 90) score *= 0.9

      // Only when there is only igdb
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (app.scores && !app.scores?.steamCount) {
        if (app.scores?.igdb >= 90 && !app.scores.igdbCount) score *= 0.8
      }

      // if (app.scores?.steamCount < 100) score = score * 0.6
      // else if (app.scores?.steamCount < 1000) score = score * 0.8

      return score
    },

    _playtime(app) {
      if (!app.playtime) return 0

      let sum = Object.values(app.playtime).reduce((total, num) => total + num, 0)
      return sum
    },

    _dateOwned(app) {
      return app.is.lib * 1000 || false
    },

    async init() {
      if (!$nuxt) $nuxt = useNuxtApp()
      if (!$data) $data = useDataStore()
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
