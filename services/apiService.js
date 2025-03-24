/*
 * @file:    \services\apiService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 5th February 2025
 * Modified: Wed 19 March 2025 - 15:52:26
 */

let $nuxt = null

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
}
