/*
 * @file:    \stores\stateStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 14th December 2023
 * Modified: 24th November 2025 - 03:31:58
 */

let $db = null
let $log = null
let $nuxt = null
let $data = null
let $game = null

export const useStateStore = defineStore('state', {
  state: () => ({
    keyed: {},
    states: [],

    index: [], // Holds index for every state keyed by state.id

    backlog: [], // Holds index for special state 'backlog'
    playing: [], // Holds index for special state 'playing'
    completed: [], // Holds index for special state 'completed'

    undeletable: [-1, 1, 2, 3],

    empty: {
      id: -1,
      key: 'state_-1',
      slug: 'uncategorized',
      color: '#666',
      name: 'Uncategorized',
      description: 'Games without any assigned status. Useful as a neutral or undefined state.',
    },

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
      if (!this.states.length) return ['']
      const pinned = $nuxt.$auth?.menu?.states || []
      return this.states.filter((state) => pinned.includes(state.id))
    },

    unPinnedStates() {
      if (!this.states.length) return ['']
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
    // Updated on Wed Mar 12 2025 - Emit event
    //+-------------------------------------------------
    async create(data) {
      delete data.action

      data.created_at = dates.now()
      data.updated_at = dates.now()

      const id = await $db.states.put(data)
      $nuxt.$mitt.emit('state:created', data)

      // this.load(true)
      // $cloud.update('states')
      // queueService.queue('states', 'cloud')

      return id
    },

    //+-------------------------------------------------
    // update()
    // Update a state and reload
    // -----
    // Created on Thu Jun 20 2024
    // Updated on Thu Sep 05 2024 - Up`dates the cloud
    // Updated on Wed Mar 12 2025 - Emit event
    //+-------------------------------------------------
    async update(data) {
      delete data.action

      data.updated_at = dates.now()
      await $db.states.put(data)
      $nuxt.$mitt.emit('state:updated', data)

      // this.load(true)
      // $cloud.update('states')
    },

    //+-------------------------------------------------
    // delete()
    // Deletes a state in the $db
    // -----
    // Created on Thu Jun 20 2024
    // Updated on Thu Sep 05 2024 - Up`dates the cloud
    // Updated on Wed Mar 12 2025 - Emit event
    //+-------------------------------------------------
    async delete(id) {
      this.states = this.states.filter((state) => state.id !== id)

      await $db.states.delete(id)
      $nuxt.$mitt.emit('state:deleted')

      // this.load(true)
      // $cloud.update('states')

      return true
    },

    //+-------------------------------------------------
    // sort()
    // Sorts a state in a direction and saves both states
    // -----
    // Created on Wed Jan 17 2024
    // Updated on Thu Sep 05 2024 - Up`dates the cloud
    // Updated on Wed Mar 12 2025 - Emit event
    //+-------------------------------------------------
    sort(direction, id) {
      let states = this.states
      const index = states.findIndex((item) => item.id === id)

      if (index > 0 && direction === 'up') {
        const temp = states[index].order
        states[index].order = states[index - 1].order
        states[index - 1].order = temp

        $db.states.bulkPut([{ ...states[index] }, { ...states[index - 1] }])
      }

      if (index < states.length - 1 && direction === 'down') {
        const temp = states[index].order
        states[index].order = states[index + 1].order
        states[index + 1].order = temp

        $db.states.bulkPut([{ ...states[index] }, { ...states[index - 1] }])
      }

      this.states = states.sort((a, b) => a.order - b.order)
      console.warn('🔃 Sorted states', this.states)
      $nuxt.$toast.success('Order saved', {
        // description: 'Monday, January 3rd at 6:00pm',
      })

      // $cloud.update('states')
      $nuxt.$mitt.emit('state:updated')
    },

    //+-------------------------------------------------
    // set()
    // Sets a state to an app and also
    // - ✅ updates the app's state in library
    // - ✅ updates the app's states timestamp
    // - ✅ updates the state's index array
    // - logs the change in the journal
    // - ✅ emits a state change event
    // -----
    // Created on Sat Jan 06 2024
    // Updated on Fri May 10 2024 - Added pinned
    // Updated on Thu Jul 11 2024 - Added hidden
    // Updated on Thu Sep 05 2024 - Toggle a state
    // Updated on Sat Mar 01 2025
    // Updated on Tue Oct 14 2025 - Simplified
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
        this.clear(app, state)
        return
      }

      $log(`[State] Setting ${obj?.name || 'clear'} to ${app.name}`)

      // Update the state
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      app.state = state
      app.is.state = app.is.state || {}
      app.is.state[obj.key] = dates.stamp()
      app.is.lib = app.is.lib ?? dates.stamp()

      $game.app.state = state
      $data.process(app, 'store:update:state')

      // Notify the app and the user
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let amount = this.index[state]?.length ?? 0
      $nuxt.$toast.success(app.name + ' set as ' + obj.name, {
        description: `${amount + 1} games in ${obj.name}`,
      })

      // Reindex the state
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      this.indexLibrary('states')

      return state

      // $nuxt.$mitt.emit('state:changed', {
      //   uuid: uuid,
      //   state: state,
      // })

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
    clear(app, state) {
      let obj = this.keyed[state]

      $log(`[State] Removing state on ${app.name}`)

      delete app.state
      delete app.is.state[state]
      delete $game.app.state

      $data.process(app, 'store:update:state')

      // Notify the app and the user
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let amount = this.index[state]?.length ?? 1
      $nuxt.$toast.success('The state has been cleared on ' + app.name, {
        description: `${amount - 1} games in ${obj.name}`,
      })

      // Reindex the state
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      this.indexLibrary('states')
    },

    //+-------------------------------------------------
    // favorite()
    // -----
    // Created on Tue Jul 23 2024
    //+-------------------------------------------------
    favorite(uuid) {
      let app = $data.get(uuid)
      let old = app.is?.fav || false
      let isFav = !old

      $log(`[State] Set favorite for ${app.name} to ${isFav}`)

      // Update the state
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      app.is.fav = isFav
      app.is.lib = app.is.lib ?? dates.stamp()

      $game.app.is.fav = isFav
      $data.process(app, 'store:update:state')

      // Notify the app and the user
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let action = isFav ? 'added to' : 'removed from'
      $nuxt.$toast.success(`${app.name} has been ${action} favorites`)

      // Reindex the state
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
      let isPinned = !old

      $log(`[State] Set pinned for ${app.name} to ${isPinned}`)

      // Update the state
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      app.is.pinned = isPinned
      app.is.lib = app.is.lib ?? 0

      $game.app.is.pinned = isPinned
      $data.process(app, 'store:update:state')

      // Notify the app and the user
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      $nuxt.$toast.success(app.name + ' has been ' + (!isPinned ? 'unpinned' : 'pinned'))

      // Reindex the state
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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

      $log(`[State] Hiding ${app.name} to ${!old}`)

      // Update the state
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      app.is.hidden = !old
      app.is.lib = app.is.lib ?? 0

      $game.app.is.hidden = !old
      $data.process(app, 'store:update:state')

      // Notify the app and the user
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      $nuxt.$toast.success(app.name + ' has been ' + (!old ? 'hidden' : 'restored'))

      // Reindex the state
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
          const apps = library.filter((app) => app.state === state.id).map((app) => app.uuid)

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
        $nuxt.$app.count['fav'] = fav.length || 0
      }

      // Scan all data for special
      // And set the index on $data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (scan == 'pinned' || scan == 'hidden' || scan == 'all') {
        let data = $data.list('array')

        let pinned = data.filter((app) => app.is && app.is.pinned).map((app) => app.uuid)
        let hidden = data.filter((app) => app.is && app.is.hidden).map((app) => app.uuid)

        $data.setIndex('pinned', pinned)
        $nuxt.$app.count['pinned'] = pinned.length || 0

        $data.setIndex('hidden', hidden)
        $nuxt.$app.count['hidden'] = hidden.length || 0
      }

      // Scan and find the amount of games without a state
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (scan == 'all') {
        let empty = library.filter((app) => !app.state).map((app) => app.uuid)
        this.index[-1] = empty
        $nuxt.$app.count.states['state_-1'] = empty.length || 0
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

      const states = await $db.states.toArray()

      this.states = states.sort((a, b) => a.order - b.order)
      this.keyed = states.reduce((obj, state, index) => {
        // if (state.key === true) delete state.key
        // state.key = state.key || `state_${state.id}`
        state.key = `state_${state.id}`

        if (state.order != index) {
          state.order = index
          $db.states.put(state)
        }

        obj[state.id] = state
        return obj
      }, {})

      // Set metadata
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      this.states.unshift(this.empty)
      this.meta.loaded = true

      $log(`[ States ] ${states.length} states in DDBB`)
      console.debug(states[Math.floor(Math.random() * states.length)])

      this.indexLibrary('all')
    },

    //+-------------------------------------------------
    // init()
    // Assign references, load and index
    // -----
    // Created on Sat Feb 10 2024
    // Updated on Thu Oct 02 2025 - Simplified
    //+-------------------------------------------------
    async init() {
      $nuxt ??= useNuxtApp()

      $db ??= $nuxt.$db
      $log ??= $nuxt.$log

      $data ??= useDataStore()
      $game ??= useGameStore()
      // $journal ??= useJournalStore()
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
