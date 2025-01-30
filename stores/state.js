/*
 * @file:    \stores\stateStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 14th December 2023
 * Modified: Thu 30 January 2025 - 16:38:19
 */

let $nuxt = null
let $data = null
let $game = null
let $cloud = null
let $journal = null

export const useStateStore = defineStore('state', {
  state: () => ({
    keyed: {},
    states: [],

    index: [], // Holds index for every state keyed by state.id

    // fav: [], // Holds index for special state 'fav'
    // pinned: [], // Holds index for special state 'pinned'
    // hidden: [], // Holds index for special state 'hidden'

    backlog: [], // Holds index for special state 'backlog'
    playing: [], // Holds index for special state 'playing'
    completed: [], // Holds index for special state 'completed'

    undeletable: [1, 2, 3],

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

    pinnedStates() {
      if (!this.states.length) return ['xx']
      const pinned = $nuxt.$auth?.menu?.states || []
      return this.states.filter((state) => pinned.includes(state.id))
    },

    unPinnedStates() {
      if (!this.states.length) return ['xx']
      const pinned = $nuxt.$auth?.menu?.states || []
      return this.states.filter((state) => !pinned.includes(state.id))
    },
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
    get(id) {
      return this.states.find((state) => state.id === id)
    },

    //+-------------------------------------------------
    // create()
    // Creates a new state and saves it
    // -----
    // Created on Tue Jun 18 2024
    // Updated on Thu Sep 05 2024 - Up`dates the cloud
    //+-------------------------------------------------
    async create(data) {
      delete data.action

      data.created_at = dates.now()
      data.updated_at = dates.now()

      const id = await $nuxt.$db.states.put(data)
      await this.load(true)
      $cloud.update('states')

      return id
    },

    //+-------------------------------------------------
    // update()
    // Update a state and reload
    // -----
    // Created on Thu Jun 20 2024
    // Updated on Thu Sep 05 2024 - Up`dates the cloud
    //+-------------------------------------------------
    async update(data) {
      delete data.action

      data.updated_at = dates.now()
      await $nuxt.$db.states.put(data)
      await this.load(true)
      $cloud.update('states')
    },

    //+-------------------------------------------------
    // delete()
    // Deletes a state in the $db
    // -----
    // Created on Thu Jun 20 2024
    // Updated on Thu Sep 05 2024 - Up`dates the cloud
    //+-------------------------------------------------
    async delete(id) {
      this.states = this.states.filter((state) => state.id !== id)

      await $nuxt.$db.states.delete(id)
      await this.load(true)
      $cloud.update('states')

      return true
    },

    //+-------------------------------------------------
    // sort()
    // Sorts a state in a direction and saves both states
    // -----
    // Created on Wed Jan 17 2024
    // Updated on Thu Sep 05 2024 - Up`dates the cloud
    //+-------------------------------------------------
    sort(direction, id) {
      let states = this.states
      const index = states.findIndex((item) => item.id === id)

      if (index > 0 && direction === 'up') {
        const temp = states[index].order
        states[index].order = states[index - 1].order
        states[index - 1].order = temp

        $nuxt.$db.states.bulkPut([{ ...states[index] }, { ...states[index - 1] }])
      }

      if (index < states.length - 1 && direction === 'down') {
        const temp = states[index].order
        states[index].order = states[index + 1].order
        states[index + 1].order = temp

        $nuxt.$db.states.bulkPut([{ ...states[index] }, { ...states[index - 1] }])
      }

      this.states = states.sort((a, b) => a.order - b.order)
      console.warn('🔃 Sorted states', this.states)
      $nuxt.$toast.success('Order saved', {
        // description: 'Monday, January 3rd at 6:00pm',
      })

      $cloud.update('states')
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
    // Created on Thu Jul 11 2024 - Added hidden
    // Updated on Thu Sep 05 2024 - Toggle a state
    //+-------------------------------------------------
    set(uuid, state) {
      if (state == 'fav') {
        this.favorite(uuid)
        return
      }

      if (state == 'pinned') {
        this.pin(uuid)
        return
      }

      if (state == 'hidden') {
        this.hide(uuid)
        return
      }

      let app = $data.get(uuid)
      let obj = this.keyed[state]
      let old = app.state || null

      if (state == app.state) {
        this.clear(uuid, state)
        return
      }

      // Update the state
      // on $game and $data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      app.state = state
      app.is.dirty = true
      app.is.state = app.is.state || {}
      app.is.state[obj.key] = dates.stamp()
      app.is.lib = app.is.lib ?? dates.stamp()

      $game.app.state = state
      $game.update(uuid, { ...app })

      $nuxt.$mitt.emit('state:change', {
        uuid: uuid,
        state: state,
      })

      $nuxt.$toast.success(app.name + ' set as ' + obj.name, {
        // description: 'Monday, January 3rd at 6:00pm',
      })

      this.indexLibrary()

      // $journal.add({
      //   event: 'state',
      //   ref: uuid,
      //   data: {
      //     state: state,
      //     old: old,
      //   },
      // })
    },

    //+-------------------------------------------------
    // clear()
    // Clears the state on an app
    // -----
    // Created on Mon Sep 02 2024
    //+-------------------------------------------------
    clear(uuid, state) {
      let app = $data.get(uuid)
      let obj = this.keyed[state]

      app.is.dirty = true
      app.is.state = app.is.state || {}

      delete app.state
      delete app.is.state[obj.key]

      delete $game.app.state
      $game.update(uuid, { ...app })

      $nuxt.$mitt.emit('state:change', {
        uuid: uuid,
        state: null,
      })

      $nuxt.$toast.success('The state has been cleared on ' + app.name, {
        // description: 'Monday, January 3rd at 6:00pm',
      })

      this.indexLibrary()
    },

    //+-------------------------------------------------
    // favorite()
    // Switch is.fav flag
    // -----
    // Created on Tue Jul 23 2024
    //+-------------------------------------------------
    favorite(uuid) {
      let app = $data.get(uuid)
      let old = app.is?.fav || false
      let isFav = !old

      // Update the status
      // on $game and $data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      app.is.fav = isFav
      app.is.dirty = true
      app.is.lib = app.is.lib ?? dates.stamp()

      $game.app.is.fav = isFav
      $game.update(uuid, { ...app })

      $nuxt.$mitt.emit('state:change', {
        uuid: uuid,
        state: 'fav',
        fav: isFav,
      })

      $nuxt.$toast.success(
        'Game has been ' + (old ? 'removed from favorites' : 'added to favorites')
      )

      this.indexLibrary('fav')
    },

    //+-------------------------------------------------
    // pin()
    // Toggle the is.pinned flag on an app
    // -----
    // Created on Fri May 10 2024
    //+-------------------------------------------------
    pin(uuid) {
      let app = $data.get(uuid)
      let old = app.is?.pinned || false

      // Update the status
      // on $game and $data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      app.is.dirty = true
      app.is.pinned = !old
      app.is.lib = app.is.lib ?? 0

      $game.app.is.pinned = !old
      $game.update(uuid, { ...app })

      $nuxt.$mitt.emit('pinned:change', {
        uuid: uuid,
        pinned: !old,
      })

      $nuxt.$toast.success('Game has been ' + (old ? 'unpinned' : 'pinned'), {
        // description: 'Monday, January 3rd at 6:00pm',
      })

      this.indexLibrary('pinned')
    },

    //+-------------------------------------------------
    // hide()
    //
    // -----
    // Created on Thu Jul 11 2024
    //+-------------------------------------------------
    hide(uuid) {
      let app = $data.get(uuid)
      let old = app.is?.hidden || false

      // Update the hidden status
      // on $game and $data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      app.is.dirty = true
      app.is.hidden = !old
      app.is.lib = app.is.lib ?? 0

      $game.app.is.hidden = !old
      $game.update(uuid, { ...app })

      $nuxt.$mitt.emit('hidden:change', {
        uuid: uuid,
        hidden: !old,
      })

      $nuxt.$toast.success('Game has been ' + (old ? 'unhidden' : 'hidden'), {
        // description: 'Monday, January 3rd at 6:00pm',
      })

      this.indexLibrary('hidden')
    },

    //+-------------------------------------------------
    // canBeDeleted()
    // Returns true if the state can be deleted
    // -----
    // Created on Wed Nov 06 2024
    //+-------------------------------------------------
    canBeDeleted(state) {
      if (this.undeletable.includes(state.id)) return false

      return true
    },

    //+-------------------------------------------------
    // indexLibrary()
    // Creates an index Array of UUIDs for each state
    // keyed by the state's id
    // -----
    // Created on Sat Jan 06 2024
    // Updated on Wed Jul 24 2024 - Added index by key
    //+-------------------------------------------------
    async indexLibrary(scan = 'states') {
      let library = $data.library('array')

      // Scan the library for states
      // And index each state on this
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (scan == 'states' || scan == 'all') {
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
      }

      // Scan the library for states
      // And set the index on $data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (scan == 'fav' || scan == 'all') {
        let fav = library.filter((app) => app.is && app.is.fav).map((app) => app.uuid)
        $data.setIndex('fav', fav)
      }

      // Scan all data for special
      // And set the index on $data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (scan == 'pinned' || scan == 'hidden' || scan == 'all') {
        let data = $data.list('array')

        let pinned = data.filter((app) => app.is && app.is.pinned).map((app) => app.uuid)
        let hidden = data.filter((app) => app.is && app.is.hidden).map((app) => app.uuid)

        $data.setIndex('pinned', pinned)
        $data.setIndex('hidden', hidden)
      }
    },

    //+-------------------------------------------------
    // load()
    // Loads the state array from DB to this
    // -----
    // Created on Sat Jan 06 2024
    // Updated on Wed Jun 19 2024 - Reload
    // Updated on Wed Nov 06 2024 - Handle repeated order values
    //+-------------------------------------------------
    async load(reload = false) {
      if (this.meta.loaded && !reload) return

      const states = await $nuxt.$db.states.toArray()

      this.states = states.sort((a, b) => a.order - b.order)
      this.keyed = states.reduce((obj, state, index) => {
        // if (state.key === true) delete state.key
        // state.key = state.key || `state_${state.id}`
        state.key = `state_${state.id}`

        if (state.order != index) {
          state.order = index
          $nuxt.$db.states.put(state)
        }

        obj[state.id] = state
        return obj
      }, {})

      log(
        '❇️ States loaded',
        `${states.length} states in DB`,
        states[Math.floor(Math.random() * states.length)]
      )

      this.meta.loaded = true
    },

    //+-------------------------------------------------
    // init()
    // Assign references, load and index
    // -----
    // Created on Sat Feb 10 2024
    //+-------------------------------------------------
    async init() {
      $nuxt ??= useNuxtApp()
      $cloud ??= useCloudStore()

      if (!$data) $data = useDataStore()
      if (!$game) $game = useGameStore()
      if (!$journal) $journal = useJournalStore()

      await this.load()
      await this.indexLibrary('all')

      window.$states = {
        x: this,
        k: this.keyed,
        s: this.states,
        index: this.index,
      }
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
