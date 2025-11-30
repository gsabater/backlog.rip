/*
 * @file:    \stores\RepositoryStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 3rd November 2023
 * Modified: 6th October 2025 - 05:01:54
 */

import backlogrip from '../modules/integrations/backlogrip'

let hot = []
let genres = []

export const useRepositoryStore = defineStore('repository', {
  state: () => ({
    loaded: [],

    // Getter flags
    // Those flags are set when the repository is loaded
    // triggering the getter again and returning the data
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    getHot: false,
    getGenres: false,
  }),

  getters: {
    //+-------------------------------------------------
    // hot()
    // Loads HOT repository and returns shuffled data
    // -----
    // Created on Fri Apr 19 2024
    // Created on Tue Sep 30 2025 - Improve lazy loading
    //+-------------------------------------------------
    hot() {
      if (!this.getHot) this.load('hot')
      return hot.sort(() => Math.random() - 0.5)
    },

    //+-------------------------------------------------
    // genres()
    // Lazy loads Genres repository
    // -----
    // Created on Mon Feb 12 2024
    //+-------------------------------------------------
    genres() {
      if (!this.getGenres) this.load('genres')
      return genres
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
    // load()
    // Loads a repository of data
    // -----
    // Created on Wed Dec 20 2023
    // Updated on Fri Apr 19 2024 - assign to _{repo}
    // Updated on Wed Oct 01 2025 - Use backlogrip integration
    //+-------------------------------------------------
    async load(repository) {
      if (!repository) return

      if (!this.$nuxt.$app.ready) return []
      if (this.loaded.includes(`${repository}`)) {
        return this[repository] || null
      }

      this.loaded.push(repository)
      let data = await backlogrip.getRepository(repository)

      if (data) {
        if (repository == 'hot') hot = data
        if (repository == 'hot') this.getHot = true

        if (repository == 'genres') genres = data
        if (repository == 'genres') this.getGenres = true

        if (repository == 'hot' || repository == 'top-popular') {
          let $data = useDataStore()
          $data.process(data, 'api')
        }
      }

      return data
    },

    searchGenres(query) {
      return this.genres.filter((genre) => genre.name.toLowerCase().includes(query.toLowerCase()))
    },

    //+-------------------------------------------------
    // searchGames()
    // Calls the api to search a game by name
    // Legacy, used by the palette
    // -----
    // Created on Thu Jun 27 2024
    //+-------------------------------------------------
    async searchGames(query) {
      const xhr = await $nuxt.$axios.post(`search/global`, { query })
      if (xhr.status) {
        return xhr.data
      }

      return []
    },

    async init() {
      $nuxt ??= useNuxtApp()
      $data ??= useDataStore()
    },
  },
})

// HMREnabled
// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRepositoryStore, import.meta.hot))
}
