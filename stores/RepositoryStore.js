/*
 * @file:    \stores\RepositoryStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 3rd November 2023
 * Modified: Tue Feb 20 2024
 */

let $nuxt = null

export const useRepositoryStore = defineStore('repository', {
  state: () => ({
    _genres: [],

    loaded: [],
  }),

  getters: {
    //+-------------------------------------------------
    // genres()
    // Dynamically loads genres and returns data
    // -----
    // Created on Mon Feb 12 2024
    //+-------------------------------------------------
    genres() {
      if (this._genres.length === 0) this.getGenres()
      return this._genres
    },

    keyedGenres() {
      let keyed = this.genres.reduce((obj, genre) => {
        obj[genre.id] = genre
        return obj
      }, {})

      return keyed
    },
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
        this._genres = jxr.data
      }

      log(
        '❇️ Genres loaded',
        `${jxr.data.length} genres loaded from API`,
        jxr.data[Math.floor(Math.random() * jxr.data.length)]
      )

      return true
    },

    //+-------------------------------------------------
    // getTop()
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
