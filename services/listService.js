/*
 * @file:    /services/listService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 1st January 2026
 * Modified: 5th March 2026 - 08:47:32
 */

let $data = null

export default {
  //+-------------------------------------------------
  // prepareGames(list)
  // Prepares and subset of the list, containing the
  // Minimum data needed to display the list for the first time
  // -----
  // Created on Fri Oct 18 2024
  //+-------------------------------------------------
  prepareGames(list) {
    $data ??= useDataStore()
    let subset = []

    list.games.forEach((app) => {
      let data = $data.get(app.uuid)

      if (!data || data.error) return
      // if (!data?.id?.api) return
      if (data.uuid.includes('local:')) return

      let item = {
        name: data.name,
        uuid: data.uuid,
        cover: data.cover || undefined,
        // steam_id: data.steam_id || undefined,
        steam_id: data.steam_id || data.id?.steam,
      }

      subset.push(item)
    })

    return subset
  },

  //+-------------------------------------------------
  // getCovers()
  // Return a list of cover URLs for a list
  // -----
  // Created on Thu Jan 01 2026
  //+-------------------------------------------------
  getCovers(list) {
    if (!list?.games?.length) return []

    let covers = []

    for (const app of list.games) {
      if (covers.length >= 5) break

      let src = this.coverURL(app)
      if (src) covers.push(src)
    }

    return covers
  },

  //+-------------------------------------------------
  // coverURL()
  // Return the cover URL for a game
  // -----
  // Created on Thu Jan 01 2026
  //+-------------------------------------------------
  coverURL(app) {
    if (!app) return null

    // Steam
    if (app.steam_id) {
      return `https://steamcdn-a.akamaihd.net/steam/apps/${app.steam_id}/library_600x900.jpg`
    }

    // IGDB
    if (app.igdb_id) {
      return `https://images.igdb.com/igdb/image/upload/t_cover_big/${app.igdb_id}.jpg`
    }

    return null
  },
}
