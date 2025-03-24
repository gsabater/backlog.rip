/*
 * @file:    \services\achievementsService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 19th March 2025
 * Modified: Mon 24 March 2025 - 15:38:53
 */

let $data = null
let $game = null

export default {
  //+-------------------------------------------------
  // findToUpdate()
  // Returns items that need their achievements to be updated
  // -----
  // NOTE: there are multiple checks for update, maybe
  // i can move them to an updateService
  // -----
  // Created on Wed Mar 19 2025
  //+-------------------------------------------------
  findToUpdate() {
    $data ??= useDataStore()

    let IDs = $data
      .library()
      .sort((a, b) => {
        return (a.playtime?.steam_last ?? 0) - (b.playtime?.steam_last ?? 0)
      })

      // Filter the items that need to be updated
      // - The game has a steam ID
      // - The game is in the library
      .filter((item) => {
        if (!item.is.lib) return false
        if (!item.id.steam) return false

        // Check if the game has been recently played
        if (item.playtime?.steam_last) {
          if (dates.isStale(item.playtime?.steam_last, 14, 'd')) return true
        }

        // Check if the game has achievements recently updated
        if (dates.isStale(item.dates?.achievements, 180, 'd')) return true

        return false
      })

      // Map the IDs to the worker
      // This is the ID that will be used to identify the game
      .map((item) => {
        return item.id.steam
      })

      // Send max 25 items to the worker
      .slice(0, 25)

    return IDs
  },

  //+-------------------------------------------------
  // processSync()
  // Receives an array of items processed by the worker
  // And updates apps with the new achievements
  // -----
  // Created on Mon Mar 24 2025
  //+-------------------------------------------------
  async processSync(queues) {
    $data ??= useDataStore()
    $game ??= useGameStore()

    queues.forEach((work) => {
      if (!work.data) return
      debugger

      for (const appid in work.data) {
        const achievements = work.data[appid]
        let uuid = $data.findBySource('steam', appid, 'uuid')

        if (uuid && achievements?.length) {
          $game.update(uuid, {
            achievements: achievements,
          })
        }
      }
    })
  },
}
