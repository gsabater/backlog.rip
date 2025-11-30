/*
 * @file:    \modules\integrations\backlogrip.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 30th September 2025
 * Modified: 26th October 2025 - 03:35:39
 */

let $nuxt = null
let $search = null

// Stores instances for each search executed
// TODO: Move it to $context plugin with search instances
//+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
let hashed = {}

export default {
  //+-------------------------------------------------
  // getApiStatus()
  // Load general status from API
  // -----
  // Created on Fri Dec 22 2023
  // Updated on Sun Oct 05 2025 - Moved to integrations/backlogrip
  //+-------------------------------------------------
  async getApiStatus() {
    $nuxt ??= useNuxtApp()

    try {
      const xhr = await $nuxt.$axios.get(`get/status.json`)
      if (xhr.status) return xhr.data
    } catch (error) {
      $nuxt.$log.error('Could not get Backlog.rip API status', error)
    }

    return

    try {
      const xhr = await $nuxt.$axios.get(`get/status.json`)
      if (xhr.status) {
        $nuxt.$app.api = xhr.data
        $nuxt.$app.count.api = xhr.data?.games?.total || 0

        $nuxt.$cloud.api = xhr.data || {}
        $nuxt.$cloud.status.api = 'online'
      }
    } catch (error) {
      log('Could not establish connection with the API, working on offline mode', error)

      $nuxt.$app.api = {}
      $nuxt.$app.offline = true
      $nuxt.$app.count.api = 0
    }
  },

  //+-------------------------------------------------
  // getWorkerStatus()
  // Returns the status of the Backlog.rip worker
  // -----
  // Created on Tue Oct 21 2025
  //+-------------------------------------------------
  async getWorkerStatus() {
    $nuxt ??= useNuxtApp()

    try {
      const xhr = await $nuxt.$axios.get(`https://worker.backlog.rip/status`)
      if (xhr.status) return xhr.data
    } catch (error) {
      $nuxt.$log.error('Could not get Backlog.rip worker status', error)
    }
  },

  //+-------------------------------------------------
  // getRepository()
  // Loads a repository from Backlog.rip
  // Repositories available: hot, genres...
  // -----
  // Created on Wed Oct 01 2025
  //+-------------------------------------------------
  async getRepository(repository) {
    $nuxt ??= useNuxtApp()

    const xhr = await $nuxt.$axios.get(`repository/${repository}.json`)

    if (xhr.status) {
      $nuxt.$log(`[ backlogrip ] GET repo: {${repository}} (${xhr.data.length} items)`)
      return xhr.data
    }

    $nuxt.$log.error('Could not load repository', repository)
    return null
  },

  //+-------------------------------------------------
  // search()
  // Searches the API for games
  // -----
  // Created on Sun Jan 05 2025
  // Updated on Wed Oct 01 2025 - Improve logging
  //+-------------------------------------------------
  async search(hash = 'void') {
    $nuxt ??= useNuxtApp()
    let start = performance.now()

    let sampledHash = `${hash.length}⫩${hash.substring(0, 13)}`
    if (hashed[hash]) {
      $nuxt.$log('[ backlogrip.search ] 🛑 Skipping ' + sampledHash)
      return false
    }

    hashed[hash] = true
    // $data ??= useDataStore()
    // $search ??= useSearchStore()

    const xhr = await $nuxt.$axios.get(`search/v2/${hash}.json`)
    if (xhr.status) {
      $nuxt.$log(
        `[ backlogrip.search ] GET ${sampledHash} (${xhr.data.length} items, ${dates.microTime(performance.now() - start)})`
      )

      return xhr.data
    }

    return null
  },
}
