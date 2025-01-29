/*
 * @file:    \stores\RepositoryStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 3rd November 2023
 * Modified: Wed 22 January 2025 - 17:07:44
 */

let $nuxt = null
let $data = null

export const useRepositoryStore = defineStore('repository', {
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // List of defined repositories
  //
  // - top: top 500 games
  // - hot: hot games this month + autoloaded
  // - genres: list of genres + autoloaded
  //
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  state: () => ({
    _hot: [],
    _genres: [],

    loaded: [],
  }),

  getters: {
    //+-------------------------------------------------
    // hot()
    // Dynamically loads repository and returns data
    // -----
    // Created on Fri Apr 19 2024
    //+-------------------------------------------------
    hot() {
      if (this._hot.length === 0) this.load('hot')
      return this._hot.sort(() => Math.random() - 0.5).slice(0, 7)
    },

    //+-------------------------------------------------
    // genres()
    // Dynamically loads repository and returns data
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
      if (this.loaded.includes('genres')) return this.genres

      const xhr = await $nuxt.$axios.get(`repository/genres.json`)
      if (xhr.status) this._genres = xhr.data

      log(
        '❇️ Genres loaded',
        `${xhr.data.length} genres loaded from API`,
        xhr.data[Math.floor(Math.random() * xhr.data.length)]
      )

      this.loaded.push('genres')
      return xhr.data
    },

    searchGenres(query) {
      return this.genres.filter((genre) =>
        genre.name.toLowerCase().includes(query.toLowerCase())
      )
    },

    //+-------------------------------------------------
    // searchGames()
    // Calls the api to search a game by name
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

    //+-------------------------------------------------
    // load()
    // Returns a named batch of 500 games.
    // -----
    // Created on Wed Dec 20 2023
    // Updated on Fri Apr 19 2024 - assign to _{repo}
    //+-------------------------------------------------
    async load(repo) {
      if (!repo) return
      if (!$nuxt.$app.ready) return []
      if (this.loaded.includes(`${repo}`)) return

      const xhr = await $nuxt.$axios.get(`repository/${repo}.json`)
      if (xhr.status) {
        this.loaded.push(repo)
        $data.process(xhr.data, 'api')
        if (this[`_${repo}`]) this[`_${repo}`] = xhr.data
      }
    },

    //+-------------------------------------------------
    // topGames()
    // Returns a named batch of 500 games.
    // -----
    // Created on Wed Dec 20 2023
    //+-------------------------------------------------
    async topGames(batch) {
      if (!batch) return
      if (this.loaded.includes(`top:${batch}`)) return
      this.loaded.push(`top:${batch}`)

      const xhr = await $nuxt.$axios.get(`repository/top-${batch}.json`)
      if (xhr.status) {
        $data.process(xhr.data, 'api')
      }
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
