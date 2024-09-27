/*
 * @file:    \stores\collectionStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 14th December 2023
 * Modified: Fri 27 September 2024 - 14:20:11
 */

let $nuxt = null

export const useCollectionStore = defineStore('collection', {
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
    async list() {
      const items = await $nuxt.$db.collections.toArray()
      return items
    },

    //+-------------------------------------------------
    // create()
    // Creates a new list and saves it
    // -----
    // Created on Fri Sep 27 2024
    //+-------------------------------------------------
    async create(data) {
      delete data.action

      data.created_at = dates.now()
      data.updated_at = dates.now()

      data.uuid = $nuxt.$uuid()
      await this.load(true)
      $cloud.update('states')

      return id
    },

    // async get(id) {
    //   const $nuxt = useNuxtApp()
    //   const item = await $nuxt.$db.collections.get(id)
    //   return item
    // },

    // async add(data) {
    //   const $nuxt = useNuxtApp()
    //   const id = await $nuxt.$db.collections.add(data)
    //   return id
    // },

    // async update(data) {
    //   const $nuxt = useNuxtApp()
    //   const id = await $nuxt.$db.collections.put(data)
    //   return id
    // },

    // async delete(id) {
    //   const $nuxt = useNuxtApp()
    //   await $nuxt.$db.collections.delete(id)
    // },

    //+-------------------------------------------------
    // init()
    // Assign references, load and index
    // -----
    // Created on Sat Feb 10 2024
    //+-------------------------------------------------
    async init() {
      if (!$nuxt) $nuxt = useNuxtApp()
      $cloud ??= useCloudStore()

      window.$collections = this
    },
  },
})

//+-------------------------------------------------
//| 🔃 HMR
//| https://pinia.vuejs.org/cookbook/hot-module-replacement.html
//+-------------------------------------------------
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCollectionStore, import.meta.hot))
}
