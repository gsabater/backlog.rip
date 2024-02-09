/*
 * @file:    \utils\search.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 9th January 2024
 * Modified: Fri Feb 09 2024
 */

export default {
  //+-------------------------------------------------
  // filter()
  // Filters out apps based on criteria
  // -----
  // Created on Tue Jan 09 2024
  //+-------------------------------------------------
  filter(source, filters, extra) {
    let logged = 5
    let items = []
    let toSort = []

    console.time('Filter')
    const start = performance.now()

    for (const uuid in source) {
      const app = source[uuid]

      // Filter: Ignored games
      // Remove any games ignored
      //+---------------------------------------
      if (app.is?.ignored) {
        if (logged > 0) {
          console.warn('🛑 Skipping ignored app', app.name, app)
          logged--
        }
        continue
      }

      // Filter: Backlog state
      // Match with app.state
      //+---------------------------------------
      if (filters?.states?.length) {
        if (!filters.states.includes(app.state)) {
          // if (app.state !== filters.state) {
          if (logged > 0) {
            console.warn('🛑 Skipping as not in state', filters.state, app.name)
            logged--
          }

          continue
        }
      }

      // This should be a check "Show only owned games"
      // if (extra?.source == 'library' && filters?.state == null) {
      //   if (!app.is?.owned) {
      //     if (logged > 0) {
      //       console.warn('🛑 Skipping because game is not owned', app.name)
      //       logged--
      //     }

      //     continue
      //   }
      // }

      // Filter: Name
      // Match with on app.name and steam_id
      //+---------------------------------------
      if (filters?.string?.length > 0) {
        let appName = app.name ? app.name : ''
        appName = appName.toString().toLowerCase()

        if (
          appName.indexOf(filters.string) === -1 &&
          app.steam_id?.toString() !== filters.string
        ) {
          // counters.skip++
          // data.hidden.string.push(steam_id)

          if (logged > 0) {
            console.warn(
              '🛑 Skipping: String not found in name',
              filters.string,
              app.name
            )
            logged--
          }
          continue
        }
      }

      // Filter: Genres
      // Include only apps with genres
      //+---------------------------------------
      if (filters?.genres?.length) {
        if (!app.genres?.some((item) => filters?.genres.includes(item))) {
          if (logged > 0) {
            console.warn('🛑 Skipping because has not genre', filters.genres, app.genres)
            logged--
          }
          continue
        }
      }

      // Finally, add the app to items
      //+---------------------------------------
      items.push(uuid)

      // Index: toSort
      // Create an index of elements to sort
      //+---------------------------------------
      if (filters?.sortBy == 'name') {
        toSort.push({ uuid, name: app.name?.toString().toLowerCase() || '' })
      }

      if (filters?.sortBy == 'score') {
        toSort.push({ uuid, score: app.score || 0 })
      }

      if (filters?.sortBy == 'playtime') {
        toSort.push({ uuid, playtime: app.playtime?.steam || 0 })
      }

      if (filters?.sortBy == 'random') {
        toSort.push({ uuid, random: Math.random() })
      }
    }

    console.timeEnd('Filter')
    const end = performance.now()

    log(
      '✅ Filter done (amount, first, data[first])',
      items.length,
      items[0],
      window.db?.d?.[items[0]]
    )

    log(
      '🔸 Stats:',
      {
        time: end - start,
      },
      filters
    )

    return this.sort(toSort, filters)
  },

  //+-------------------------------------------------
  // function()
  //
  // -----
  // Created on Wed Jan 10 2024
  //+-------------------------------------------------

  sort(items, filters) {
    log('🔸 Sorting results by', filters.sortBy)

    // SortBy: name
    // Using app.name
    //+---------------------------------------
    if (filters?.sortBy == 'name') {
      return items
        .sort((a, b) => {
          const A = a.name || ''
          const B = b.name || ''
          return A.localeCompare(B)
        })
        .map((item) => item.uuid)
    }

    // SortBy: numeric value
    // Using app.playtime // score
    //+---------------------------------------
    if (filters?.sortBy == 'playtime' || filters?.sortBy == 'score') {
      const field = filters?.sortBy

      return items
        .sort((a, b) => {
          const A = a[field] || 0
          const B = b[field] || 0
          return B - A
        })
        .map((item) => item.uuid)
    }
  },

  paginate(items, options) {
    const { page, perPage } = options
    const start = (page - 1) * perPage
    const end = start + perPage
    return items.slice(0, end)
  },
}
