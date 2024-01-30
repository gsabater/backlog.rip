/*
 * @file:    \stores\RepositoryStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 3rd November 2023
 * Modified: Sun Jan 28 2024
 */

let $nuxt = null

export const useRepositoryStore = defineStore('repository', {
  state: () => ({
    genres: [],

    loaded: [],
  }),

  getters: {
    // upper() {
    //   return this.message.toUpperCase();
    // },
  },

  actions: {
    //+-------------------------------------------------
    // getGenres()
    // -----
    // Created on Mon Jan 15 2024
    //+-------------------------------------------------
    async getGenres() {
      if (this.loaded.includes('genres')) return

      const jxr = await $nuxt.$axios.get(`repository/genres.json`)
      if (jxr.status) {
        this.loaded.push('genres')
        this.genres = jxr.data
      }

      return true
    },

    //+-------------------------------------------------
    // getTop()
    // NOTE: Belongs to a repository store
    // -----
    // Created on Wed Dec 20 2023
    //+-------------------------------------------------
    async getTop(batch) {
      if (!batch) return
      if (this.loaded.includes(`top:${batch}`)) return

      const jxr = await $nuxt.$axios.get(`repository/top-${batch}.json`)
      if (jxr.status) {
        this.toData(jxr.data, 'api')
        this.loaded.push(`top:${batch}`)
      }
    },

    async init() {
      if (!$nuxt) $nuxt = useNuxtApp()
    },
  },
})

// HMREnabled
// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRepositoryStore, import.meta.hot))
}
