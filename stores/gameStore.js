/* eslint-disable no-unused-vars */

/*
 * @file:    \stores\gameStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 11th January 2024
 * Modified: Thu Jan 11 2024
 */

let $nuxt = null
let $data = null

export const useGameStore = defineStore('game', {
  state: () => ({
    app: {},

    meta: {},
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
