/* eslint-disable no-unused-vars */

/*
 * @file:    \stores\gameStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 11th January 2024
 * Modified: Wed Feb 21 2024
 */

let $nuxt = null
let $data = null

export const useGameStore = defineStore('game', {
  state: () => ({
    app: {},

    queue: [],
  }),

  actions: {
    //+-------------------------------------------------
    // load()
    // Loads an item from datastore and sets to this
    // -----
    // Created on Thu Jan 11 2024
    //+-------------------------------------------------
    async load(uuid) {
      const game = $data.get(uuid)

      this.app = game
      this.update(game)

      // game.needsUpdate = this.needsUpdate(game)
      // if (game.needsUpdate) this.getFromAPI()
    },

    //+-------------------------------------------------
    // getFromAPI()
    // Gets data from the API
    // -----
    // Created on Fri Feb 16 2024
    //+-------------------------------------------------
    async getFromAPI() {
      console.warn('🪝 Going to ask api for extended data')

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

      if (typeof uuid !== 'string') game = uuid
      else game = $data.get(uuid)

      const update = this.needsUpdate(game, data)

      if (!update) return false

      if (!data && update === 'update:api') {
        data = await this.getFromAPI()
        if (!data) return
      }

      let updated = { ...game, ...data }
      updated.uuid = game.uuid

      if (updated.api_id !== updated.uuid) {
        updated.api_id = data.uuid
      }

      // TODO: Add entry in app log

      $data.toData(updated)

      if (this.app.uuid === updated.uuid) this.app = updated

      if (updated.is_api) return

      this.queue.push(uuid?.uuid || uuid)
      console.warn('🪝 leaving a queue of', this.queue.length)

      this.storeQueue()
    },

    //+-------------------------------------------------
    // needsUpdate()
    // Checks if the app needs to be updated
    // There is two types of updates: local and api
    // -----
    // Created on Sun Feb 11 2024
    //+-------------------------------------------------
    needsUpdate(app, data) {
      // console.warn('🪝 should i update', app, data)
      if (!app) return false

      // This block is only when comparing
      // local data with the API data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (data) {
        // app does not have api_id reference
        if (!app.api_id && data?.api_id) return true

        // app has older updated_at than api data
        if (app.updated_at < data?.updated_at) return 'update:updated_at'
      }

      // This block is only when the app is loaded
      // Usually when opening the game modal
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (!data) {
        // App has never been updated from the API
        if (!app.description) return 'update:api'
      }

      // console.warn("nah, don't update")
      return false
    },

    async storeQueue() {
      await delay(3000, true)

      let amount = this.queue.length
      if (!amount) return

      console.warn('🪝 Storing', amount, 'games')

      $nuxt.$toast.success('Updated data on ' + this.queue.length + ' games', {
        // description: 'Monday, January 3rd at 6:00pm',
      })
      $data.store(this.queue)
      this.queue = []

      await delay(1000, true)
      this.storeQueue()
    },

    //+-------------------------------------------------
    // normalize()
    // Initializes default data for a game
    // -----
    // Created on Tue Feb 20 2024
    //+-------------------------------------------------
    normalize(game) {
      game.is = game.is || { in: {} }
      game.is.in = game.is.in || {}
      game.log = game.log || []

      if (game.is_lib) {
        game.playtime = game.playtime || {}
        game.last_played = game.last_played || {}
      }

      if (game.is_api) {
        game.api_id = game.uuid
        game.uuid = game.api_id
      }

      game.updated_at = game.updated_at || 0

      return game
    },

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Tue Feb 20 2024
    //+-------------------------------------------------
    _score(app) {
      let score = app.score || 0

      // Avoid very high scores not verified
      if (app.score > 96 && (!app.scores || !app.scores.igdbCount)) {
        score = 60
      }

      // Reduce the final score there is not score count
      // We cannot verify that the score is real
      if (!app.scores) score = score - 10

      // Reduce the final score if the amount of reviews is low
      if (app.scores?.igdbCount < 100) score = score - 10
      if (app.scores?.steamscore > 90 && app.scores?.steamCount < 100) score = score - 15
      // if (app.scores?.steamCount < 100) score = score * 0.6
      // else if (app.scores?.steamCount < 1000) score = score * 0.8

      return score
    },

    _playtime(app) {
      return 0
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
