/*
 * @file:    /services/listService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 1st January 2026
 * Modified: 15th February 2026 - 17:24:37
 */

export default {
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
