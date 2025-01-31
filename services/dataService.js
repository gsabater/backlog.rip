/*
 * @file:    \services\dataService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 31st December 2024
 * Modified: Fri 31 January 2025 - 10:29:24
 */

let $nuxt = null
let $data = null
let $game = null

export default {
  //+-------------------------------------------------
  // prepareToData()
  // Prepares an item before adding it to data
  // -----
  // Created on Thu Mar 07 2024
  // Updated on Sat Nov 23 2024 - Added $gamestore for when is called in ssr
  // Updated on Wed Jan 15 2025 - Moved to dataService
  //+-------------------------------------------------
  prepareToData(item) {
    $game ??= useGameStore()

    item = $game.normalize(item)
    item._ = $game.normalize_(item)

    if (item.is?.dirty) {
      item.uuid = item.uuid || $nuxt.$uuid()
    }

    delete item.services
    delete item.platforms

    return item
  },

  //+-------------------------------------------------
  // updateBatch()
  // Searches for games under the detail level
  // And calls the api for an update
  // -----
  // Created on Wed Jan 15 2025
  //+-------------------------------------------------
  updateBatch(levels = ['empty']) {
    $data ??= useDataStore()

    let outdated = {
      api: [],
      steam: [],
    }

    $data
      .library()
      .filter((item) => {
        return levels.some((level) => item._.detail.includes(level))
      })
      .map((game) => {
        if (game.id.api) outdated.api.push(game.id.api)
        else if (game.id.steam) outdated.steam.push(game.id.steam)
      })

    // Check if no games were added
    if (outdated.api.length === 0 && outdated.steam.length === 0) {
      return
    }

    log('↻ Updating a batch...', outdated)
    this.getBatch(outdated)
  },

  //+-------------------------------------------------
  // getBatch()
  // Querys the API for a batch of games
  // -----
  // Created on Wed Jan 15 2025
  //+-------------------------------------------------
  async getBatch(apps) {
    $nuxt ??= useNuxtApp()
    $data ??= useDataStore()

    log('🪂 Requesting a batch of games', apps)

    const xhr = await $nuxt.$axios.post(`get/batch`, apps)
    if (xhr.status) {
      log('🪂 Data from API', xhr.data)
      await $data.process(xhr.data, 'api:update:batch')
    }
  },
}
