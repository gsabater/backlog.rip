/*
 * @file:    \services\apiService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 5th February 2025
 * Modified: Wed 28 May 2025 - 18:14:23
 */

let $nuxt = null
let $data = null
let $search = null

// Stores instances for each search executed
//+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
let hashed = {}

export default {
  //+-------------------------------------------------
  // getApiStatus()
  // Load general status from API
  // -----
  // Created on Fri Dec 22 2023
  // Updated on Wed Feb 05 2025 - Moved to apiService
  //+-------------------------------------------------
  async getApiStatus() {
    $nuxt ??= useNuxtApp()

    try {
      const xhr = await $nuxt.$axios.get(`get/status.json`)
      if (xhr.status) {
        $nuxt.$app.api = xhr.data
        $nuxt.$app.count.api = xhr.data?.games?.total || 0
      }
    } catch (error) {
      log('Could not establish connection with the API, working on offline mode', error)

      $nuxt.$app.api = {}
      $nuxt.$app.offline = true
      $nuxt.$app.count.api = 0
    }
  },

  //+-------------------------------------------------
  // search()
  // Searches the API for games
  // -----
  // Created on Sun Jan 05 2025
  //+-------------------------------------------------
  async search(hash) {
    if (!hash) return
    if (hashed[hash]) {
      log('search', '🛑 Skipping ' + hash, { a: hashed, b: hashed[hash] })
      return false
    }

    $data ??= useDataStore()
    $search ??= useSearchStore()
    let start = performance.now()

    hashed[hash] = true
    // log('search', `· ⇢ Searching API`, hash)
    // log('search', '·· ⇢ API Filters', JSON.stringify(filters))

    const xhr = await $nuxt.$axios.get(`search/v2/${hash}.json`)
    if (xhr.status) {
      log('search', '🪂 Data from API', xhr.data)
      await $data.process(xhr.data, 'api')
    }

    let end = performance.now()
    let time = end - start

    $search.stats.api = time
    $search.stats.api_end = end
    $search.stats.api_start = start

    return true
  },
}
