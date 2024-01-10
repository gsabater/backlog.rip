/* eslint-disable no-unused-vars */

/*
 * @file:    \stores\stateStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 14th December 2023
 * Modified: Sun Jan 07 2024
 */

let $nuxt = null
let $data = null
let $journal = null

export const useStateStore = defineStore('state', {
  state: () => ({
    states: [],
    index: {},

    meta: {
      loaded: false,
      loading: false,
    },
  }),

  //+-------------------------------------------------
  //| 🔘 Actions
  //+-------------------------------------------------

  actions: {
    //+-------------------------------------------------
    // load()
    // Loads the state array from DB to this
    // -----
    // Created on Sat Jan 06 2024
    //+-------------------------------------------------
    async load() {
      if (this.meta.loaded) return

      const states = await $nuxt.$db.states.toArray()

      this.states = states.sort((a, b) => a.order - b.order)
      this.meta.loaded = true

      log(
        '❇️ States are ready',
        `found ${states.length} states`,
        states[Math.floor(Math.random() * states.length)]
      )
    },

    async list() {
      const items = await $nuxt.$db.states.toArray()
      return items
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
    // set()
    // Sets a state to an app and also
    // - ✅ updates the app's state in library
    // - ✅ updates the state's index array
    // - ✅ logs the change in the journal
    // - ✅ emits a state change event
    // -----
    // Created on Sat Jan 06 2024
    //+-------------------------------------------------
    set(uuid, state) {
      $data.app.state = state

      let app = $data.get(uuid)
      let old = app.state || null

      app.state = state
      $data.update(app, uuid, true)

      $journal.add({
        event: 'state',
        ref: uuid,
        data: {
          state: state,
          old: old,
        },
      })

      $nuxt.$mitt.emit('state:change', {
        uuid: uuid,
        state: state,
      })

      this.indexLibrary()
    },

    //+-------------------------------------------------
    // indexLibrary()
    // Creates an index Array of UUIDs for each state
    // keyed by the state's id
    // -----
    // Created on Sat Jan 06 2024
    //+-------------------------------------------------
    async indexLibrary() {
      let library = await $data.library('array')

      this.states.forEach((state) => {
        this.index[state.id] = library
          .filter((app) => app.state === state.id)
          .map((app) => app.uuid)
      })
    },

    async init() {
      if (!$nuxt) $nuxt = useNuxtApp()
      if (!$data) $data = useDataStore()
      if (!$journal) $journal = useJournalStore()

      await this.load()
      await this.indexLibrary()
    },
  },
})

//+-------------------------------------------------
//| 🔃 HMR
//| https://pinia.vuejs.org/cookbook/hot-module-replacement.html
//+-------------------------------------------------
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStateStore, import.meta.hot))
}
