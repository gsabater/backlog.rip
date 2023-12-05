/* eslint-disable no-unused-vars */

/*
 * @file:    \stores\journalStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 5th December 2023
 * Modified: Tue Dec 05 2023
 */

let $nuxt = null

//+-------------------------------------------------
// Codex: List of events used in the journal
// - log (general message)
// > ref: null, data: { message: 'string' }
//
// - added (game added)
// - note (note added to ref)
// - status (started playing)
// - milestone (100h played)
//+-------------------------------------------------

export const useJournalStore = defineStore('journal', {
  state: () => ({
    meta: {
      time: 0,
      timeout: 5 * 60 * 1000,
      loading: false,
    },
  }),

  //+-------------------------------------------------
  //| 🔘 Actions
  //+-------------------------------------------------

  actions: {
    //+-------------------------------------------------
    // list()
    // Returns store as array
    // -----
    // Created
    //+-------------------------------------------------
    async list() {
      $nuxt = useNuxtApp()
      let items = await $nuxt.$db.journal
        // .filter((game) => game.api_id === undefined)
        .toArray()

      return items
    },

    //+-------------------------------------------------
    // get()
    // Get an element by uuid
    // -----
    // Created
    //+-------------------------------------------------
    async get(uuid) {
      return data[uuid]
    },

    //+-------------------------------------------------
    // init()
    // Initialize the data store
    // -----
    // Created
    //+-------------------------------------------------
    async init() {
      // $nuxt = useNuxtApp()
    },
  },
})

// HMREnabled
// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useJournalStore, import.meta.hot))
}
