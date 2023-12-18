/*
 * @file:    \stores\collectionStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 14th December 2023
 * Modified: Thu Dec 14 2023
 */

let $nuxt = null

export const useCollectionsStore = defineStore('collections', {
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
  },
})

//+-------------------------------------------------
//| 🔃 HMR
//| https://pinia.vuejs.org/cookbook/hot-module-replacement.html
//+-------------------------------------------------
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCollectionsStore, import.meta.hot))
}
