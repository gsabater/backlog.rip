/* eslint-disable no-unused-vars */

/*
 * @file:    \stores\stateStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 14th December 2023
 * Modified: Tue Jan 30 2024
 */

let $nuxt = null
let $data = null
let $game = null
let $journal = null

export const useStateStore = defineStore('state', {
  state: () => ({
    states: [],

    index: [], // Holds index for every state keyed by state.id
    backlog: [], // Holds index for special state 'backlog'
    playing: [], // Holds index for special state 'playing'
    completed: [], // Holds index for special state 'completed'
    favorites: [], // Holds index for special state 'favorites'

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
    // list()
    // Returns the array of states
    // -----
    // Created on Fri Jan 12 2024
    //+-------------------------------------------------
    async list() {
      return this.states
    },

    //+-------------------------------------------------
    // get()
    // Returns a single state by id
    // -----
    // Created on Fri Jan 12 2024
    //+-------------------------------------------------
    async get(id) {
      return this.states.find((state) => state.id === id)
    },

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

    async delete(id) {
      this.states = this.states.filter((state) => state.id !== id)
      await $nuxt.$db.states.delete(id)
    },

    //+-------------------------------------------------
    // sortState()
    //
    // -----
    // Created on Wed Jan 17 2024
    //+-------------------------------------------------
    sortState(direction, id) {
      let states = this.states
      const index = states.findIndex((item) => item.id === id)

      if (index > 0 && direction === 'up') {
        const temp = states[index].order
        states[index].order = states[index - 1].order
        states[index - 1].order = temp
      }

      if (index < states.length - 1 && direction === 'down') {
        const temp = states[index].order
        states[index].order = states[index + 1].order
        states[index + 1].order = temp
      }

      this.states = states.sort((a, b) => a.order - b.order)
      console.warn('🔃 Sorted states', this.states)
    },

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
      $game.app.state = state

      let app = $data.get(uuid)
      let old = app.state || null

      app.state = state
      $data.store(app)

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

      $nuxt.$toast.success('Added to ' + app.state, {
        description: 'Monday, January 3rd at 6:00pm',
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
        let apps = library.filter((app) => app.state === state.id).map((app) => app.uuid)

        this.index[state.id] = apps
        if (state.key) this[state.key] = apps
      })
    },

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

    async init() {
      if (!$nuxt) $nuxt = useNuxtApp()
      if (!$data) $data = useDataStore()
      if (!$game) $game = useGameStore()
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
