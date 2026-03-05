/*
 * @file:    \stores\list.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 27th September 2024
 * Modified: 5th March 2026 - 11:16:11
 */

import listService from '../services/listService'

import supabase from '../modules/integrations/supabase'
import supabaseService from '../services/supabaseService'

let $db = null
let $log = null
let $nuxt = null
let $data = null

export const useListStore = defineStore('list', {
  state: () => ({
    list: { games: [] },
    lists: [],

    model: {
      games: [],
      author: {},

      name: '',
      slug: null,
      description: '',

      type: 'list', // dynamic, challenge
      layout: 'ordered', // null
      sortBy: 'none',
      sortDir: 'desc',

      is_public: false,

      created_at: null,
      updated_at: null,

      _: {
        action: null,
        make_slug: false,
      },
    },

    meta: {
      loaded: false,
      loading: false,
      working: false,
    },
  }),

  actions: {
    //+-------------------------------------------------
    // reset()
    // Resets the state
    // -----
    // Created on Fri Feb 06 2026
    //+-------------------------------------------------
    reset() {
      this.list = { ...this.model }
    },

    //+-------------------------------------------------
    // use()
    // Assigns a deep copy of a list to this.list
    // And populates the subset to dataStore
    // -----
    // Created on Fri Oct 25 2024
    // Updated on Wed Nov 27 2025 - Use deep copy instead of reference
    //+-------------------------------------------------
    async use(ref, populate = true) {
      if (this.lists.length == 0) return

      let list = this.lists.find((item) => {
        return item.uuid == ref || item.slug == ref
      })

      if (!list) {
        this.list = { error: 'list not found', games: [] }
        return
      }

      this.list = {
        ...this.model,
        ...JSON.parse(JSON.stringify(list)),
      }

      if (populate) $data.process(this.list.games, 'list:populate')
    },

    //+-------------------------------------------------
    // create()
    // Creates a new list and saves it
    // -----
    // Created on Tue Oct 08 2024
    //+-------------------------------------------------
    async create(payload, options = { timestamps: true }) {
      let data = await this.prepare(payload)

      data.uuid = $nuxt.$uuid()

      if (options.timestamps) {
        data.created_at = dates.now()
        data.updated_at = dates.now()
      }

      await $db.lists.put(data)
      await this.storePublic(data)
      $log('[ listStore.create ]', data)

      await this.load(true)
      return data
    },

    //+-------------------------------------------------
    // update()
    // Stores the updated item in local DB
    // Udpated timestamp and cleans vue watchers
    // -----
    // Created on Thu Oct 10 2024
    //+-------------------------------------------------
    async update(payload, options = { timestamps: true }) {
      let data = await this.prepare(payload)

      if (options.timestamps) {
        data.updated_at = dates.now()
      }

      await $db.lists.put(data)
      await this.storePublic(data)
      $log('[ listStore.update ]', data)

      await this.load(true)

      // Update this list if is the active
      if (this.list.uuid == data.uuid) this.list = { ...this.list, ...data }
      return data
    },

    //+-------------------------------------------------
    // prepare()
    // prepares the list to be ingested by dexie and supabase
    // -----
    // Created on Fri Feb 13 2026
    //+-------------------------------------------------
    async prepare(payload) {
      const data = { ...payload }

      data.slug = this.makeSlug(data)
      data.games = listService.prepareGames(data)

      delete data._
      delete data.covers
      delete data.author

      const prepared = JSON.parse(JSON.stringify(data))
      return prepared
    },

    //+-------------------------------------------------
    // delete()
    // Deletes a list in the $db and $cloud
    // -----
    // Created on Wed Nov 06 2024
    //+-------------------------------------------------
    async delete(list) {
      await this.deletePublic(list)
      await $db.lists.delete(list.uuid)
      await this.load(true)

      return true
    },

    //+-------------------------------------------------
    // addToList()
    // Adds a game to a list
    // -----
    // Created on Fri Oct 25 2024
    //+-------------------------------------------------
    addToList(list, app, position) {
      if (this.list.uuid !== list.uuid) this.use(list)

      if (this.list.games.some((item) => item.uuid === app.uuid)) return

      let data = $data.get(app.uuid)
      if (!data || data.error) return
      if (data.uuid.includes('local:')) return

      let item = {
        name: data.name,
        uuid: data.uuid,
        cover: data.cover || undefined,
        steam_id: data.id?.steam || undefined,
      }

      if (position == 'top') this.list.games.unshift(item)
      else this.list.games.push(item)
    },

    //+-------------------------------------------------
    // removeFromList()
    // Removes an item searching the uuid
    // -----
    // Created on Tue Oct 22 2024
    //+-------------------------------------------------
    removeFromList(list, app) {
      if (this.list.uuid !== list.uuid) this.use(list)

      const index = this.list.games.findIndex((game) => game.uuid == app.uuid)
      if (index == -1) return

      this.list.games.splice(index, 1)
    },

    //+-------------------------------------------------
    // modify()
    // Modifies a list and "Toggles" an app in it
    // > If the item is in the list, it will be removed,
    // > otherwise it will be added.
    // > Updates the subset
    // > and updates
    // -----
    // Created on Thu Oct 24 2024
    // Created on Thu Mar 05 2026 - Added loading indicators
    //+-------------------------------------------------
    async modify(uuid, app) {
      this.meta.working = true

      if (this.list.uuid !== uuid) await this.use(uuid)
      let isIncluded = this.hasApp(this.list, app)

      if (!isIncluded) this.addToList(this.list, app)
      else this.removeFromList(this.list, app)

      await this.update({ ...this.list })

      this.meta.working = false
    },

    //+-------------------------------------------------
    // hasApp()
    // Looks if a list has an app.
    // Tries to use the the provided list first
    // If it doesn't exist, it will try to find it
    // -----
    // Created on Fri Oct 25 2024
    //+-------------------------------------------------
    hasApp(list, app) {
      if (!list?.uuid) return false
      if (!app?.uuid && !app.id?.api) return false

      if (!list.games?.length) {
        list = this.lists.find((item) => item.uuid == list.uuid)
      }

      return list.games.some((item) => item.uuid == app.uuid || item.uuid == app.id?.api)

      // find is slower than some, but is useful for when we need the item back
      // return list.games.find((item) => item.uuid == app.uuid) || false
    },

    //+-------------------------------------------------
    // makeSlug()
    // Returns a slug for the current list
    // -----
    // Created on Fri Oct 11 2024
    // Created on Fri Feb 13 2026 - Prevent slug change
    //+-------------------------------------------------
    makeSlug(data) {
      if (data.slug && !data._?.make_slug) return data.slug

      let text = data.slug || data.name
      let slug = format.stringToSlug(text)

      let exists = Object.values(this.lists).find((list) => {
        return list.slug == slug && list.uuid !== data.uuid
      })

      if (exists) {
        slug = slug + '-' + Math.floor(Math.random() * 1000)
      }

      return slug
    },

    // //+-------------------------------------------------
    // // findCovers()
    // // Tries to make an array of covers for the list
    // // This is less accurate than the covers in the editor, because
    // // We can't load the covers beforehand, but we can try to make URLs
    // // -----
    // // Created on Fri Oct 25 2024
    // //+-------------------------------------------------
    // findCovers(list) {
    //   let srcList = []
    //   let asset = {
    //     steam: 'https://steamcdn-a.akamaihd.net/steam/apps/%ID%/library_600x900.jpg',
    //   }

    //   list.games.forEach((app) => {
    //     if (app.steam_id) {
    //       let image = asset.steam.replace('%ID%', app.steam_id)
    //       srcList.push(image)
    //     }
    //   })

    //   return srcList.splice(0, 15)
    // },

    //+-------------------------------------------------
    // load()
    // Load the lists from $db
    // -----
    // Created on Wed Oct 09 2024
    //+-------------------------------------------------
    async load(reload = false) {
      if (this.meta.loaded && !reload) return

      const { $app, $moment } = this.$nuxt

      // Query and sort the lists to Dexie
      // sort the lists using $moment in descending order
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let lists = await $db.lists.toArray()
      let sorted = lists.sort((a, b) => {
        return $moment(b.updated_at).diff($moment(a.updated_at))
      })

      // Assign the sorted lists to the store
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      this.lists = sorted.map((list) => {
        // list.key = list.uuid // list.key ||
        list.games = list.games || []
        return list
      })

      // Set metadata
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      $app.count.lists = lists.length || 0
      this.meta.loaded = true

      $log(`[ Lists ] Loaded ${lists.length} lists`)
      console.debug(lists[Math.floor(Math.random() * lists.length)])
    },

    //+-------------------------------------------------
    // loadPublic()
    // Loads a public list from Supabase
    // -----
    // Created on Tue Jan 20 2026
    //+-------------------------------------------------
    async loadPublic(user, slug) {
      let xhr = await supabaseService.getList(user, slug)
      if (xhr == null) xhr = { games: [], not_found: true }

      this.list = this.list = {
        ...this.model,
        ...xhr,
      }

      $data.process(xhr.games, 'list:populate')
    },

    //+-------------------------------------------------
    // storePublic()
    // Sends the list to Supabase.
    // To avoid having too many lists, only public lists with games are sent.
    // -----
    // Created on Mon Jan 05 2026
    //+-------------------------------------------------
    async storePublic(list) {
      if (!list?.id && !list.is_public) return
      if (!list?.id && list.games.length === 0) return

      let response = await supabase.storeList(list)

      // The new list has been created in supabase
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (!list?.id && response?.id) {
        list.id = response.id
        await $db.lists.put(list)
      }

      return list
    },

    //+-------------------------------------------------
    // deletePublic()
    //
    // -----
    // Created on Thu Jan 29 2026
    //+-------------------------------------------------
    async deletePublic(list) {
      if (!list?.id) return
      await supabase.deleteList(list.id)
    },

    //+-------------------------------------------------
    // init()
    // Assign references
    // -----
    // Created on Mon Sep 30 2024
    // Updated on Tue Sep 30 2025 - Simplified
    //+-------------------------------------------------
    async init() {
      $nuxt ??= useNuxtApp()

      $log ??= $nuxt.$log
      $db ??= $nuxt.$db

      $data ??= useDataStore()
      await this.load()
    },
  },
})

//+-------------------------------------------------
//| 🔃 HMR
//| https://pinia.vuejs.org/cookbook/hot-module-replacement.html
//+-------------------------------------------------
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useListStore, import.meta.hot))
}
