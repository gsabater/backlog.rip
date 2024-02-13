/* eslint-disable no-unused-vars */

/*
 * @file:    \stores\gameStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 11th January 2024
 * Modified: Mon Feb 12 2024
 */

let $nuxt = null
let $data = null

export const useGameStore = defineStore('game', {
  state: () => ({
    app: {},

    queue: [],
  }),

  //+-------------------------------------------------
  //| 🔘 Actions
  //+-------------------------------------------------

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
    },

    // async get(id) {
    //   const $nuxt = useNuxtApp()
    //   const item = await $nuxt.$db.states.get(id)
    //   return item
    // },

    // async add(data) {
    //   const $nuxt = useNuxtApp()
    //   const id = await $nuxt.$db.states.add(data)
    //   return id
    // },

    // async update(data) {
    //   const $nuxt = useNuxtApp()
    //   const id = await $nuxt.$db.states.put(data)
    //   return id
    // },

    // async delete(id) {
    //   const $nuxt = useNuxtApp()
    //   await $nuxt.$db.states.delete(id)
    // },

    //+-------------------------------------------------
    // update()
    // Updates data from the API when required
    // To modify the data by the user, use modify()
    // -----
    // Created on Sun Feb 11 2024
    //+-------------------------------------------------
    async update(uuid, data) {
      const game = $data.get(uuid)

      if (!this.needsUpdate(game, data)) return

      let item = { ...game, ...data }
      item.uuid = game.uuid

      if (item.api_id !== item.uuid) {
        item.api_id = data.uuid
      }

      this.queue.push(data)
    },

    //+-------------------------------------------------
    // needsUpdate()
    // Checks if the app needs to be updated
    // -----
    // Created on Sun Feb 11 2024
    //+-------------------------------------------------
    needsUpdate(app, data) {
      if (!app) return false

      // app does not have api_id reference
      if (!app.api_id && data.api_id) return true

      // app has older updated_at than data
      if (app.updated_at < data.updated_at) return true

      return false
    },

    async init() {
      // if (!$nuxt) $nuxt = useNuxtApp()
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
