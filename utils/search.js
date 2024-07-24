/*
 * @file:    \utils\search.js
 * @desc:    Handles search filtering and sorting
 * -------------------------------------------
 * Created Date: 9th January 2024
 * Modified: 24 July 2024 - 13:44:40
 */

export default {
  //+-------------------------------------------------
  // filter()
  // Filters out apps based on criteria
  // -----
  // Created on Tue Jan 09 2024
  // Updated on Wed Jul 24 2024 - Added fav
  //+-------------------------------------------------
  filter(source, filters, extra) {
    let items = []
    let toSort = []
    let filtered = []

    let now = dates.stamp()
    let re = /(?:^|[ ]):([a-zA-Z]+)/gm
    let searchString = filters?.string?.toLowerCase().replace(re, '').trim()

    for (const uuid in source) {
      const app = source[uuid]

      // ✨ Filter: Backlog state
      // Match with app.state
      //+---------------------------------------
      if (filters?.states?.length) {
        const { states } = filters

        if (!states.includes(app.state)) {
          filtered.push(uuid)
          continue
        }
      }

      // ✨ App is...
      // Filter apps based on filters.is
      //+---------------------------------------
      if (filters?.is) {
        if (filters.is == 'favorites' && !app.is?.fav) {
          filtered.push(uuid)
          continue
        }

        if (filters.is == 'pinned' && !app.is?.pinned) {
          filtered.push(uuid)
          continue
        }

        if (filters.is == 'hidden' && !app.is?.hidden) {
          filtered.push(uuid)
          continue
        }
      }

      // ✨ Filter: Hidden games
      // Remove any games hidden
      //+---------------------------------------
      if (app.is?.hidden && filters.is !== 'hidden') {
        filtered.push(uuid)
        // console.warn('🛑 Skipping hidden app', app.name, app)
        continue
      }

      // This should be a check "Show only owned games"
      // if (extra?.source == 'library' && filters?.state == null) {
      //   if (!app._?.owned) {
      //     if (logged > 0) {
      //       console.warn('🛑 Skipping because game is not owned', app.name)
      //       logged--
      //     }

      //     continue
      //   }
      // }

      // ✨ Filter: Name
      // Match with on app.name and store IDs
      //+---------------------------------------
      if (filters?.string?.length > 0) {
        let appName = app.name ? app.name : ''
        appName = appName.toString().toLowerCase()

        if (
          appName.indexOf(searchString) === -1 &&
          app.id.steam?.toString() !== searchString
        ) {
          // counters.skip++
          // data.hidden.string.push(id.steam)

          filtered.push(uuid)
          // console.warn(
          //   '🛑 Skipping: String not found in name',
          //   searchString,
          //   app.name
          // )

          continue
        }
      }

      // ✨ Filter: Genres
      // Include only apps with genres
      //+---------------------------------------
      if (filters?.genres?.length) {
        if (!app.genres?.some((item) => filters?.genres.includes(item))) {
          filtered.push(uuid)
          // console.warn('🛑 Skipping because has not genre', filters.genres, app.genres)

          continue
        }
      }

      // ✨ Sort By: Released at
      // Include only apps with release date
      //+---------------------------------------
      if (filters?.released > 0 || filters?.sortBy == 'released') {
        if (!app.released_at) {
          filtered.push(uuid)
          // console.warn('🛑 Skipping because has no release date', filters.genres, app.genres)

          continue
        }

        if (app.released_at > now) {
          filtered.push(uuid)
          // console.warn('🛑 Skipping because released in the future', filters.released, app.released_at

          continue
        }

        if (app.released_at < filters.released) {
          filtered.push(uuid)
          // console.warn('🛑 Skipping because released before', filters.released, app.released_at)

          continue
        }
      }

      // ✨ Sort By: HLTB
      // Include only apps with HLTB time
      // Sort by HLTB.main
      //+---------------------------------------
      if (filters?.sortBy == 'hltb') {
        if (!app.hltb?.main) {
          filtered.push(uuid)
          // console.warn('🛑 Skipping because has not genre', filters.genres, app.genres)

          continue
        }
      }

      // Finally,
      // Modify and add the app to items
      //+---------------------------------------
      items.push(uuid)

      // Index: toSort
      // Create an index of elements to sort
      //+---------------------------------------
      if (filters?.sortBy == 'rand') {
        toSort.push({ uuid, val: Math.random() })
      }

      if (filters?.sortBy == 'name') {
        toSort.push({ uuid, val: app.name?.toString().toLowerCase() || '' })
      }

      if (filters?.sortBy == 'score') {
        toSort.push({ uuid, val: app._?.score || 0 })
      }

      if (filters?.sortBy == 'released') {
        toSort.push({ uuid, val: app.released_at || 0 })
      }

      if (filters?.sortBy == 'playtime') {
        toSort.push({ uuid, val: app.playtime?.steam || 0 })
      }

      if (filters?.sortBy == 'hltb') {
        toSort.push({ uuid, val: app.hltb?.main || 0 })
      }
    }

    log(
      '✅ Filter done (amount, first, data[first])',
      items.length,
      items[0],
      window.db?.d?.[items[0]]
    )

    let sorted = this.sort(toSort, filters)

    return {
      items: sorted,
      results: items.length,
      filtered: filtered.length,
    }
  },

  //+-------------------------------------------------
  // sort()
  // Sorts the items based on the sortBy criteria
  // -----
  // Created on Wed Jan 10 2024
  //+-------------------------------------------------
  sort(items, filters) {
    const { sortBy, sortDir } = filters
    log('🔸 Sorting results by', sortBy)

    // SortBy: name
    // Using app.name
    //+---------------------------------------
    if (filters?.sortBy == 'name') {
      return items
        .sort((a, b) => {
          const A = a.val || ''
          const B = b.val || ''
          const compare = A.localeCompare(B)
          return filters?.sortDir === 'desc' ? -compare : compare
        })
        .map((item) => item.uuid)
    }

    // SortBy: numeric value
    // Using app.playtime // score // rand
    //+---------------------------------------
    if (['rand', 'hltb', 'score', 'playtime', 'released'].includes(sortBy)) {
      return items
        .sort((a, b) => {
          const A = a.val || 0
          const B = b.val || 0
          return filters?.sortDir === 'desc' ? B - A : A - B
        })
        .map((item) => item.uuid)
    }

    // Left as a helper
    debugger
  },

  paginate(items, options) {
    if (!items || items.length == 0) return []

    const { page, perPage } = options
    const start = (page - 1) * perPage
    const end = start + perPage

    return items.slice(0, end)
  },

  //+-------------------------------------------------
  // underScore()
  // Calculates a new underlying score based on the amount
  // of reviews and the median score
  // -----
  // Created on Mon Feb 12 2024
  //+-------------------------------------------------
  underScore(app) {
    // TODO: use the method in $gameStore instead
    let score = app.score || 0

    // Avoid very high scores not verified
    if (app.score > 96 && !app.scores) score = 60

    // Reduce the final score there is not score count
    // We cannot verify that the score is real
    if (!app.scores) score = score - 10

    // Reduce the final score if the amount of reviews is low
    // if (app.scores?.steamCount < 100) score = score * 0.6
    // else if (app.scores?.steamCount < 1000) score = score * 0.8

    if (app.scores?.igdbCount < 100) score = score - 10

    return score
  },
}
