/* eslint-disable no-unused-vars */

/*
 * @file:    \stores\DataStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 14th November 2023
 * Modified: Wed Nov 29 2023
 */

//+-------------------------------------------------
// Data repositories
// Those arrays hold objects of games from multiple sources
// Data is the complete list of games available to search
// Is the complete list of Local and API data
// Data is updated every time a repository is loaded or a game is added
// ---
// Library is loaded on init and updated when a game is added
// Index are updated on init and when a repository is loaded
// ---
// All elements are indexed by uuid
//+-------------------------------------------------

let data = {}

let states = {}
let library = {}
let wishlist = {}

//+-------------------------------------------------
// repos
// Repositories are searches and preset filters
// They are stored in the database and can be updated
//+-------------------------------------------------

let repos = {}
let search = {}

//+-------------------------------------------------
// index
// Hold indexed values for each of the stores
//+-------------------------------------------------

let index = {
  api: {},
  epic: {},
  steam: {},
}

let $nuxt = null

export const useDataStore = defineStore('data', {
  state: () => ({
    queue: [],
    loaded: [],
    indexes: [],

    isReady: false,

    meta: {
      time: 0,
      timeout: 5 * 60 * 1000,
      loading: false,
    },
  }),

  //+-------------------------------------------------
  // 🛞 Actions
  //+-------------------------------------------------

  actions: {
    status() {
      console.warn('Data satus')
      console.log('Data', data)

      console.table({
        'Loaded': this.loaded.join(', '),
        '-- Data --': '----',
        'Data': Object.keys(data).length,
        'States': Object.keys(states).length,
        'Library': Object.keys(library).length,
        'Wishlist': Object.keys(wishlist).length,
        '-- Repos --': '----',
        'Repos': Object.keys(repos).join(', '),
        'Search': Object.keys(search).join(', '),
        '-- Index --': '----',
        'API': Object.keys(index.api).length,
        'Epic': Object.keys(index.epic).length,
        'Steam': Object.keys(index.steam).length,
      })

      console.warn(data[index['steam'][440]])
    },

    //+-------------------------------------------------
    // list()
    // Returns the whole data array
    // -----
    // Created on Tue Nov 21 2023
    //+-------------------------------------------------
    list() {
      return data
    },

    //+-------------------------------------------------
    // get()
    // Get an element by uuid
    // -----
    // Created on Tue Nov 14 2023
    //+-------------------------------------------------
    async get(uuid) {
      return data[uuid]
    },

    //+-------------------------------------------------
    // states()
    // Returns the states array
    // -----
    // Created on Wed Nov 29 2023
    //+-------------------------------------------------
    states() {
      return states
    },

    //+-------------------------------------------------
    // search(hash)
    // -----
    // Created on Fri Nov 24 2023
    //+-------------------------------------------------
    async search(hash) {
      if (search[hash]) return
      // let $nuxt = useNuxtApp()

      const jxr = await $nuxt.$axios.get(`repository/${hash}.json`)
      if (jxr.status) {
        console.warn('Search', hash, jxr.data)
        this.addToData(jxr.data, 'api')
      }

      search[hash] = true
    },

    // faker() {
    //   let $nuxt = useNuxtApp()
    //   $nuxt.$mitt.emit('data:updated', 'yep')
    //   let uuid = null
    //   // create 20 fake elements to data
    //   for (let i = 0; i < 20; i++) {
    //     uuid = $nuxt.$uuid()

    //     data[uuid] = {
    //       uuid: uuid,
    //       name: `Faker game ${i}`,
    //       api_id: Math.floor(Math.random() * 10000) * 100,
    //       steam_id: Math.floor(Math.random() * 10000),
    //       epic_id: Math.floor(Math.random() * 10000),
    //     }
    //   }
    // },

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Mon Nov 27 2023
    //+-------------------------------------------------
    async loadStates() {
      if (this.loaded.includes('states')) return

      states = await $nuxt.$db.states.toArray()

      this.loaded.push('states')

      log(
        '❇️ User states are ready',
        `found ${states.length} states`,
        states[Math.floor(Math.random() * states.length)]
      )
    },

    //+-------------------------------------------------
    // loadLibrary()
    // Loads the entire library of indexedDB into memory
    // Should be called again after an import process
    // -----
    // Created on Fri Nov 17 2023
    //+-------------------------------------------------
    async loadLibrary() {
      if (this.loaded.includes('library')) return
      // let $nuxt = useNuxtApp()

      library = await $nuxt.$db.games.toArray()
      this.addToData(library, 'library')
      this.loaded.push('library')

      log(
        '🎴 User library is ready',
        `found ${library.length} apps`,
        library[Math.floor(Math.random() * library.length)]
      )
    },

    //+-------------------------------------------------
    // addToData()
    // Runs over an array and adds elements to data and index
    // -----
    // Created on Tue Nov 21 2023
    //+-------------------------------------------------
    async addToData(items, source) {
      // let $nuxt = useNuxtApp()

      items.forEach((item) => {
        let exists = false
        this.indexes.forEach((store) => {
          if (item[store + '_id']) {
            // If there is already an item indexed for that store
            // Update the item with new data
            // (shouldnt happen often,  only on api calls)
            if (index[store][item[store + '_id']]) {
              if (item.uuid == index[store][item[store + '_id']]) return

              console.warn('Element is already indexed on', store, item)
              console.warn(item.uuid, '(API) -> (L)', index[store][item[store + '_id']])
              this.update(item, index[store][item[store + '_id']])
              exists = true
            }
          }
        })

        if (exists == false) {
          data[item.uuid] = item
          if (item.api_id) index.api[item.api_id] = item.uuid
          if (item.steam_id) index.steam[item.steam_id] = item.uuid
        }
        // index.api[item.api_id] = index.api[item.api_id] || item.uuid
        // index.steam[item.steam_id] = index.steam[item.steam_id] || item.uuid
      })

      $nuxt.$mitt.emit('data:updated', 'loaded')
    },

    //+-------------------------------------------------
    // addToQueue()
    // Thanks copilot
    // -----
    // Created on Wed Nov 29 2023
    //+-------------------------------------------------
    addToQueue(uuid) {
      if (this.queue.includes(uuid)) return

      if (this.queue.length == 0) {
        setTimeout(() => {
          console.log('📦 Saving queue', this.queue.length)
          this.queue.forEach((uuid) => {
            console.log('📀 Saving', uuid, data[uuid].name || 'NN')
            // $nuxt.$db.games.update(uuid, data[uuid])
          })
          this.queue = []
        }, 2000)
      }

      this.queue.push(uuid)
    },

    //+-------------------------------------------------
    // update()
    // Updates an app in memory and adds it to the queue
    // -----
    // Created on Fri Nov 24 2023
    // Created on Wed Nov 29 2023
    //+-------------------------------------------------
    update(item, uuid) {
      let update = false

      if (uuid) update = data[uuid]
      else {
        this.indexes.forEach((store) => {
          if (index[store][item[store + '_id']]) {
            update = index[store][item[store + '_id']]
          }
        })
      }

      // WIP aleays will call for updating
      // first search in api index,
      // then do the store dance
      // update only when updated_at is newer || !api_id
      // second param should be force save and when true just save
      // extract index and call it manually after the item is updated

      console.warn(
        'Updating app (from -> to)',
        JSON.stringify(item),
        JSON.stringify(update)
      )

      if (!update) return

      let element = {
        ...update,
        ...item,
      }

      if (!element.api_id) element.api_id = item.uuid

      data[update.uuid] = element

      // Update the app in memory
      // data[update] = {
      //   ...local,
      //   ...item,
      //   api_id: item.uuid,
      //   uuid: local.uuid,
      // }

      console.warn('Updated', JSON.stringify(element))

      // Append the uuid to a queue to save updated items
      // if (!local.updated_at || local.updated_at < item.updated_at) {
      this.addToQueue(update.uuid)
      // }
    },

    //+-------------------------------------------------
    // topGames()
    // Created on Wed Apr 26 2023
    //+-------------------------------------------------
    async topGames(params) {
      // const jxr = await app.$axios.get(`repository/top-games`)
      // if (jxr.status) return jxr.data
    },

    //+-------------------------------------------------
    // updateMissing()
    // Search for apps without api_id and call the api
    // to get the data and update the $db
    // -----
    // Created on Sat Nov 25 2023
    //+-------------------------------------------------
    async updateMissing() {
      // let $nuxt = useNuxtApp()
      return
      let missing = {}
      let items = await $nuxt.$db.games
        .filter((game) => game.api_id === undefined)
        .toArray()

      items.forEach((item) => {
        this.indexes.forEach((store) => {
          if (item[store + '_id']) {
            if (missing[store] === undefined) missing[store] = []
            missing[store].push(item[store + '_id'])
          }
        })
      })

      if (Object.keys(missing).length > 0) {
        const jxr = await $nuxt.$axios.post(`get/batch`, missing)
        if (jxr.status) return jxr.data.forEach((item) => this.update(item))
      }
    },

    //+-------------------------------------------------
    // init()
    // Initialize the data store
    // -----
    // Created on Wed Nov 29 2023
    //+-------------------------------------------------
    async init() {
      if (this.loaded.includes('init')) return

      $nuxt = useNuxtApp()
      this.loaded.push('init')
      this.indexes = Object.keys(index)

      // Load and index data
      await this.loadStates()
      await this.loadLibrary()
      await this.updateMissing()

      // Expose data to the window
      window.db = {
        d: {
          data,
          library,
          wishlist,
          states,
          repos,
          search,
          index,
        },
        // data,
        // library,
        // repos,
        // search,
        // index,
        status: this.status,
      }

      // Finally, data is ready
      this.isReady = true
      $nuxt.$mitt.emit('data:ready')

      log('💽 Data is ready to use', {
        data: Object.keys(data).length,
        library: Object.keys(library).length,
      })
    },
  },
})

// HMREnabled
// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot))
}
