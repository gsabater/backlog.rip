/* eslint-disable no-unused-vars */

/*
 * @file:    \stores\stateStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 14th December 2023
 * Modified: Thu Jun 20 2024
 */

let $nuxt = null
let $data = null
let $game = null
let $journal = null

export const useStateStore = defineStore('state', {
  state: () => ({
    keyed: {},
    states: [],

    index: [], // Holds index for every state keyed by state.id

    pinned: [], // Holds index for special state 'pinned'
    backlog: [], // Holds index for special state 'backlog'
    playing: [], // Holds index for special state 'playing'
    completed: [], // Holds index for special state 'completed'

    meta: {
      loaded: false,
      loading: false,
    },
  }),

  getters: {
    //+-------------------------------------------------
    // function()
    // TODO: load the games and sort them by added to playing
    // or maybe do it at games-list
    // -----
    // Created on Sun Mar 03 2024
    //+-------------------------------------------------
    // not used
    // getCurrentlyPlaying() {
    //   return this.playing
    // },
  },

  actions: {
    //+-------------------------------------------------
    // count()
    // Returns the amount of apps in a state
    // Used when is not possible to use the global $app.count[state]
    // -----
    // Created on Wed Apr 03 2024
    //+-------------------------------------------------
    count(state) {
      return this.index[state]?.length || 0
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

    // async update(data) {
    //   const $nuxt = useNuxtApp()
    //   const id = await $nuxt.$db.states.put(data)
    //   return id
    // },

    //+-------------------------------------------------
    // create()
    // Creates a new state and saves it to the DB
    // -----
    // Created on Tue Jun 18 2024
    //+-------------------------------------------------
    async create(data) {
      delete data.action

      data.created_at = dates.now()
      data.updated_at = dates.now()

      const id = await $nuxt.$db.states.put(data)
      await this.load(true)

      return id
    },

    //+-------------------------------------------------
    // update()
    // Update a state and reload
    // -----
    // Created on Thu Jun 20 2024
    //+-------------------------------------------------
    async update(data) {
      delete data.action

      data.updated_at = dates.now()
      await $nuxt.$db.states.put(data)
      await this.load(true)
    },

    async delete(id) {
      this.states = this.states.filter((state) => state.id !== id)

      await $nuxt.$db.states.delete(id)
      await this.load(true)

      return true
    },

    //+-------------------------------------------------
    // sort()
    // Sorts a state in a direction and saves both states
    // -----
    // Created on Wed Jan 17 2024
    //+-------------------------------------------------
    sort(direction, id) {
      let states = this.states
      const index = states.findIndex((item) => item.id === id)

      if (index > 0 && direction === 'up') {
        const temp = states[index].order
        states[index].order = states[index - 1].order
        states[index - 1].order = temp

        $nuxt.$db.states.bulkPut([
          { ...states[index], nonCloneableProp: undefined },
          { ...states[index - 1], nonCloneableProp: undefined },
        ])
      }

      if (index < states.length - 1 && direction === 'down') {
        const temp = states[index].order
        states[index].order = states[index + 1].order
        states[index + 1].order = temp

        $nuxt.$db.states.bulkPut([
          { ...states[index], nonCloneableProp: undefined },
          { ...states[index - 1], nonCloneableProp: undefined },
        ])
      }

      this.states = states.sort((a, b) => a.order - b.order)
      console.warn('🔃 Sorted states', this.states)
      $nuxt.$toast.success('Order saved', {
        // description: 'Monday, January 3rd at 6:00pm',
      })
    },

    //+-------------------------------------------------
    // set()
    // Sets a state to an app and also
    // - ✅ updates the app's state in library
    // - ✅ updates the app's states timestamp
    // - ✅ updates the state's index array
    // - ✅ logs the change in the journal
    // - ✅ emits a state change event
    // -----
    // Created on Sat Jan 06 2024
    // Updated on Fri May 10 2024 - Added pinned
    //+-------------------------------------------------
    set(uuid, state) {
      if (state == 'pinned') {
        this.pin(uuid)
        return
      }

      let obj = this.keyed[state]
      let app = $data.get(uuid)
      let old = app.state || null

      // Update the state
      // on $game and $data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      app.state = state
      app.is.dirty = true
      app.is.state = app.is.state || {}
      app.is.state[obj.key] = dates.stamp()

      $game.app.state = state
      $game.update(uuid, { ...app })

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

      $nuxt.$toast.success('Added to ' + obj.name, {
        // description: 'Monday, January 3rd at 6:00pm',
      })

      this.indexLibrary()
    },

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Fri May 10 2024
    //+-------------------------------------------------
    pin(uuid) {
      let app = $data.get(uuid)
      let old = app.is?.pinned || false

      // Update the pin status
      // on $game and $data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      app.is.dirty = true
      app.is.pinned = !old

      $game.app.is.pinned = !old
      $game.update(uuid, { ...app })

      $nuxt.$mitt.emit('pinned:change', {
        uuid: uuid,
        pinned: !old,
      })

      $nuxt.$toast.success('Game has been ' + (old ? 'unpinned' : 'pinned'), {
        // description: 'Monday, January 3rd at 6:00pm',
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
      let library = $data.library('array')

      this.states.forEach((state) => {
        const apps = library
          .filter((app) => app.state === state.id)
          .map((app) => app.uuid)

        this.index[state.id] = apps

        if (state.key) {
          this[state.key] = apps
          $nuxt.$app.count.states[state.key] = apps.length || 0
        }
      })

      this.pinned = library
        .filter((app) => app.is && app.is.pinned)
        .map((app) => app.uuid)
    },

    //+-------------------------------------------------
    // load()
    // Loads the state array from DB to this
    // -----
    // Created on Sat Jan 06 2024
    // Updated on Wed Jun 19 2024 - Reload
    //+-------------------------------------------------
    async load(reload = false) {
      if (this.meta.loaded && !reload) return

      const states = await $nuxt.$db.states.toArray()

      this.states = states.sort((a, b) => a.order - b.order)
      this.keyed = states.reduce((obj, state) => {
        state.key = state.key || 'state_' + state.id
        obj[state.id] = state
        return obj
      }, {})

      this.meta.loaded = true

      log(
        '❇️ States loaded',
        `${states.length} states in local DB`,
        states[Math.floor(Math.random() * states.length)]
      )
    },

    //+-------------------------------------------------
    // init()
    // Assign references, load and index
    // -----
    // Created on Sat Feb 10 2024
    //+-------------------------------------------------
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
