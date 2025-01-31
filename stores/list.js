/*
 * @file:    \stores\list.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 27th September 2024
 * Modified: Fri 31 January 2025 - 13:07:21
 */

let $nuxt = null
let $data = null
let $cloud = null

export const useListStore = defineStore('list', {
  state: () => ({
    list: { games: [] },
    lists: [],

    base: {
      games: [],

      name: '',
      description: '',
      visibility: 'public', // public, occult, private
      layout: 'ordered', // null
      type: 'list', // dynamic, challenge
      author: null,
      created_at: null,
      updated_at: null,
    },

    meta: {
      loaded: false,
      loading: false,
    },
  }),

  actions: {
    //+-------------------------------------------------
    // use()
    // Assigns a list to this.list
    // And populates the subset to dataStore
    // -----
    // Created on Fri Oct 25 2024
    //+-------------------------------------------------
    use(ref, populate = true) {
      let list = this.lists.find((item) => {
        return item.uuid == ref || item.slug == ref
      })

      if (!list) {
        this.list = { error: 'list not found', games: [] }
        return
      }

      this.list = {
        ...this.base,
        ...list,
      }

      if (populate) $data.process(this.list.games, 'list:populate')
    },

    //+-------------------------------------------------
    // create()
    // Creates a new list and saves it
    // -----
    // Created on Tue Oct 08 2024
    //+-------------------------------------------------
    async create(data) {
      delete data.action

      data.uuid = `local:${$nuxt.$uuid()}`
      data.slug = this.makeSlug(data)
      data.created_at = dates.now()
      data.updated_at = dates.now()

      await $nuxt.$db.lists.put(data)
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
    async update(data, options = {}) {
      delete data.key
      delete data.action

      data.slug = this.makeSlug(data)
      data.games = this.prepareGames(data)
      if (options.covers) data.covers = this.findCovers(data)

      data.updated_at = dates.now()
      let item = JSON.parse(JSON.stringify(data))

      await $nuxt.$db.lists.put(item)
      // await this.updateAPI(item)

      await this.load(true)

      // Update this list if is the current one
      if (this.list.uuid == data.uuid) this.list = { ...this.list, ...data }
    },

    //+-------------------------------------------------
    // updateAPI()
    // Sends the list to the API
    // -----
    // Created on Thu Oct 24 2024
    //+-------------------------------------------------
    async updateAPI(data) {
      let body = { ...data }
      const xhr = await $nuxt.$axios.post('lists/update', body)

      debugger
    },

    //+-------------------------------------------------
    // delete()
    // Deletes a list in the $db and $cloud
    // -----
    // Created on Wed Nov 06 2024
    //+-------------------------------------------------
    async delete(id) {
      await $nuxt.$db.lists.delete(id)
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
      // if (!data?.id?.api) return
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
    //+-------------------------------------------------
    async modify(uuid, app) {
      if (this.list.uuid !== uuid) this.use(uuid)
      let isIncluded = this.hasApp(this.list, app)

      if (!isIncluded) this.addToList(this.list, app)
      else this.removeFromList(this.list, app)

      await this.update(
        { ...this.list },
        {
          covers: true,
        }
      )
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

      // console.warn(
      //   list.name,
      //   app.name,
      //   app.uuid,
      //   app.id?.api,
      //   list.games.some((item) => item.uuid == app.uuid || item.uuid == app.id?.api),
      //   list.games
      // )

      return list.games.some((item) => item.uuid == app.uuid || item.uuid == app.id?.api)

      // find is slower than some, but is useful for when we need the item back
      // return list.games.find((item) => item.uuid == app.uuid) || false
    },

    //+-------------------------------------------------
    // makeSlug()
    // Returns a slug for the current list
    // -----
    // Created on Fri Oct 11 2024
    //+-------------------------------------------------
    makeSlug(data) {
      let slug = format.stringToSlug(data.name)
      let rand = Math.floor(Math.random() * 1000)

      let exists = Object.values(this.lists).find((list) => {
        return list.slug === slug
      })

      if (exists && exists.slug !== slug) {
        slug = slug + '-' + rand
      }

      return slug
    },

    //+-------------------------------------------------
    // prepareGames(list)
    // Prepares and subset of the list, containing the
    // Minimum data needed to display the list for the first time
    // -----
    // Created on Fri Oct 18 2024
    //+-------------------------------------------------
    prepareGames(list) {
      let subset = []

      list.games.forEach((app) => {
        let data = $data.get(app.uuid)

        if (!data || data.error) return
        // if (!data?.id?.api) return
        if (data.uuid.includes('local:')) return

        let item = {
          name: data.name,
          uuid: data.uuid,
          cover: data.cover || undefined,
          // steam_id: data.steam_id || undefined,
          steam_id: data.steam_id || data.id?.steam,
        }

        subset.push(item)
      })

      return subset
    },

    //+-------------------------------------------------
    // findCovers()
    // Tries to make an array of covers for the list
    // This is less accurate than the covers in the editor, because
    // We can't load the covers beforehand, but we can try to make URLs
    // -----
    // Created on Fri Oct 25 2024
    //+-------------------------------------------------
    findCovers(list) {
      let srcList = []
      let asset = {
        steam: 'https://steamcdn-a.akamaihd.net/steam/apps/%ID%/library_600x900.jpg',
      }

      list.games.forEach((app) => {
        if (app.steam_id) {
          let image = asset.steam.replace('%ID%', app.steam_id)
          srcList.push(image)
        }
      })

      return srcList.splice(0, 15)
    },

    //+-------------------------------------------------
    // load()
    // Load the lists from $db
    // -----
    // Created on Wed Oct 09 2024
    //+-------------------------------------------------
    async load(reload = false) {
      if (this.meta.loaded && !reload) return

      let lists = await $nuxt.$db.lists.toArray()

      // sort the lists using $nuxt.$moment and updated_at in descending order
      let sorted = lists.sort((a, b) => {
        return $nuxt.$moment(b.updated_at).diff($nuxt.$moment(a.updated_at))
      })

      this.lists = sorted.map((list) => {
        list.key = list.uuid // list.key ||
        list.games = list.games || []
        return list
      })

      // this.lists = sorted.reduce((obj, list) => {
      //   list.key = 'list_' + list.uuid // list.key ||
      //   list.games = list.games || []
      //   obj[list.uuid] = list
      //   return obj
      // }, {})

      this.meta.loaded = true
      $nuxt.$app.count.lists = lists.length || 0

      log(
        '🔖 Lists loaded',
        `${lists.length} lists in local DB`,
        lists[Math.floor(Math.random() * lists.length)]
      )
    },

    //+-------------------------------------------------
    // init()
    // Assign references, load and index
    // -----
    // Created on Mon Sep 30 2024
    //+-------------------------------------------------
    async init() {
      $nuxt ??= useNuxtApp()
      $data ??= useDataStore()
      $cloud ??= useCloudStore()

      this.load()

      window.$lists = {
        x: this,
      }
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
