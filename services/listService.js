/*
 * @file:    /services/listService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 1st January 2026
 * Modified: 6th March 2026 - 11:52:14
 */

let $data = null

export default {
  //+-------------------------------------------------
  // prepareGames(list)
  // Prepares and subset of the list, containing the
  // Minimum data needed to display the list for the first time
  // -----
  // Created on Fri Oct 18 2024
  // Created on Fri Mar 06 2026 - Improved the data population
  //+-------------------------------------------------
  prepareGames(list) {
    $data ??= useDataStore()
    const subset = []

    for (const app of list?.games || []) {
      if (app.uuid.includes('local:')) continue

      const stored = $data.get(app.uuid)
      const src = stored?.error ? app : { ...app, ...stored }

      if (src.uuid?.includes('local:')) continue

      subset.push({
        uuid: src.uuid,
        name: src.name,
        cover: src.cover || undefined,
        steam_id: src.steam_id || src.id?.steam,
      })
    }

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
