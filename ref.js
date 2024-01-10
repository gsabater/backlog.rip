/**
 * @project: steam-backlog
 * @file:    backlog.tools.filter.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 20th May 2019
 * Modified: Thu Apr 16 2020
 **/

//+-------------------------------------------------
// Backlog tools: filter
// Filters apps, from library, wishlist, all, or an array of IDs
// Usually used with the backlog.discover component
// -----
// Usage:
// backlog.filter({'string':'borderlands'}, 'library')
// backlog.filter({'tags':['F2P']}, 'all')
// -----
// Created on Tue Oct 16 2018
// Updated on Thu Jan 24 2019
//+-------------------------------------------------
function filter(_filters, apps) {
  // ...
  // Initial filter values
  // Values are merged with param _filters
  //+---------------------------------------
  let filters = {
    string: '',
    tags: [],

    attr: {
      singlePlayer: false,
      multiPlayer: false,
      coop: false,
      localCoop: false,
      mmo: false,
      controller: false,
      cloud: false,
      achievements: false,
      cards: false,
      inApp: false,
      workshop: false,
    },

    minScore: 0,
    minTagIndex: 1000,
    minSteamVotes: 0,

    released_to: 2025,
    released_from: 1983,
    includeUnreleased: true,

    includeDLC: false,
    includeMOD: false,
    includeGames: true,

    languages: [],
    platforms: {
      windows: true,
      mac: true,
      linux: true,
    },

    limit: 30,
    orderBy: 'steamscore',
    orderDir: 'desc',

    settings: {
      excludeOwned: false,
      excludeTagged: false,
      includeHidden: false,
      wishlistInLibrary: false,
    },
  }

  // Filters override
  // Replaces local values from func param
  //+---------------------------------------
  filters = backlog.mergeProps(filters, _filters)
  filters.minScore = parseInt(filters.minScore, 0)

  // Data
  // Returned data by the function
  // Holds filtered and skipped apps
  //+---------------------------------------
  let data = {
    // tags: [], -- not used yet, should return the available apps from filtered
    apps: [],
    hidden: {
      string: [],
      tags: {},
      attr: {
        singlePlayer: [],
        multiPlayer: [],
        coop: [],
        localCoop: [],
        mmo: [],
        controller: [],
        cloud: [],
        achievements: [],
        cards: [],
        inApp: [],
        workshop: [],
      },
      orderBy: {
        name: [],
        steamscore: [],
        metascore: [],
        userscore: [],
        oc: [],
        released: [],
        hltb: [],
      },
      isGame: [],
      isDLC: [],
      isMOD: [],
    },
  }

  let counters = {
    pass: 0,
    skip: 0,
  }

  // Initial apps override
  // Sets apps based on a keyword
  //+---------------------------------------
  if (apps === 'library') {
    apps = Object.keys(window.library)

    if (filters.settings.wishlistInLibrary === true) {
      apps = apps.concat(Object.keys(window.wishlist))
    }
  }

  if (apps === 'wishlist') {
    // apps = Object.keys(window.wishlist);
    apps = window.wishlist
  }

  if (apps === 'db' || apps === 'all') {
    apps = Object.keys(window.db)
  }

  if (apps === 'backlog') {
    apps = store.state.flags[filters.backlog]
  }

  if (
    apps === 'favorites' ||
    apps === 'backlog' ||
    apps === 'playing' ||
    apps === 'completed' ||
    apps === 'hold' ||
    apps === 'dropped' ||
    apps === 'hided'
  ) {
    apps = store.state.flags[apps]
  }

  // Remove :filters from search string
  //+---------------------------------------
  let re = /(?:^|[ ]):([a-zA-Z]+)/gm
  let appName = ''
  let searchString = filters.string.toLowerCase().replace(re, '').trim()

  if (apps.length === 0) {
    console.log('🧻 Received an empty pool of apps', apps)
    return {
      data,
      counters,
    }
  }

  console.log(`⚡ Filtering ${apps.length} apps`)
  console.log('🧬 Applying filters', filters)

  // Dance db
  //+---------------------------------------
  // Search every app in db and filter away
  // results based on filters and/or orders
  //+---------------------------------------
  console.time('Filter')

  // TODO: probar array.filter
  // var divisibleByThrreeES5 = array.filter(function (v){
  //     return v % 3 === 0;
  //   });

  dance: for (let item of apps) {
    let app = db[item]

    // Kick out apps that are not games or anything
    //+---------------------------------------
    if (app === undefined || app.type === null) {
      continue
    }

    let { appid } = app

    // ************************************************
    // Section: General Cleaning
    // Filter away certain types of apps
    // ************************************************

    // Filter: Name
    // Filter out games based on app.name and appid
    //+---------------------------------------
    if (searchString.length > 0) {
      appName = app.name ? app.name : ''
      appName = appName.toString().toLowerCase()

      if (appName.indexOf(searchString) === -1 && app.appid.toString() !== searchString) {
        counters.skip++
        data.hidden.string.push(appid)
        continue
      }
    }

    // Filter: Game
    // Kick out games
    //+---------------------------------------
    if (filters.includeGames === false && app.type === 'game') {
      counters.skip++
      data.hidden.isGame.push(appid)
      continue
    }

    // Filter: DLC
    // Display DLC only when browsing wishlist
    // Or when the includeDLC flag is true
    //+---------------------------------------
    if (filters.includeDLC === false && app.type === 'dlc') {
      counters.skip++
      data.hidden.isDLC.push(appid)
      continue
    }

    // Filter: MOD
    // Display MOD only when the includeMOD flag is true
    //+---------------------------------------
    if (filters.includeMOD === false && app.type === 'mod') {
      counters.skip++
      data.hidden.isMOD.push(appid)
      continue
    }

    // Filter: Platforms
    // Display games for selected platforms
    //+---------------------------------------
    if (
      filters.platforms.windows === false ||
      filters.platforms.mac === false ||
      filters.platforms.linux === false
    ) {
      if (
        app.platforms === undefined ||
        app.platforms === null ||
        app.platforms === false
      ) {
        continue
      }

      let found = false

      if (filters.platforms.windows === true) {
        if (app.platforms.windows === true) {
          found = true
        }
      }

      if (found === false && filters.platforms.mac === true) {
        if (app.platforms.mac === true) {
          found = true
        }
      }

      if (found === false && filters.platforms.linux === true) {
        if (app.platforms.linux === true) {
          found = true
        }
      }

      if (found === false) {
        continue
      }
    }

    // Filter: Language
    // Display games for selected languages
    //+---------------------------------------
    if (filters.languages.length > 0) {
      if (
        app.languages === undefined ||
        app.languages === null ||
        app.languages === false ||
        app.languages.length == 0
      ) {
        continue
      }

      found = false
      filters.languages.forEach((lang) => {
        if (app.languages.indexOf(lang) > -1) {
          found = true
        }
      })

      if (found === false) {
        continue
      }
    }

    // ************************************************
    // Section: Tags and attrs
    // Filter out apps based on tags, single player, locale...
    // ************************************************

    // Filter: Release date
    // Hide apps based on release date
    //+---------------------------------------
    if (filters.released_from !== 1983 || filters.released_to !== 2025) {
      if (app.released_at === null || app.released_at === undefined) {
        continue
      }

      // let released = moment(app.released_at).year();
      let released = parseInt(app.released_at.split('-')[0], 0)
      if (released < filters.released_from || released > filters.released_to) {
        continue
      }
    }

    // Filter: Hidden
    // Hide apps in flags.hidden
    // Or show them if "includeHidden" is checked
    //+---------------------------------------
    // prettier-ignore
    if (filters.settings.includeHidden === false &&
          (
              filters.mode !== 'backlog' ||
              filters.mode === 'backlog' && filters.backlog !== 'hided'
          )
      ) {
          if (store.state.flags.hided.indexOf(app.appid) > -1) {
              continue;
          }
      }

    // Filter: Excludetagged
    // Removed apps already in backlog
    //+---------------------------------------
    if (
      filters.mode !== 'backlog' &&
      filters.settings.excludeTagged === true &&
      (store.state.flags.backlog.indexOf(app.appid) > -1 ||
        store.state.flags.playing.indexOf(app.appid) > -1 ||
        store.state.flags.completed.indexOf(app.appid) > -1 ||
        store.state.flags.dropped.indexOf(app.appid) > -1 ||
        store.state.flags.hold.indexOf(app.appid) > -1)
    ) {
      continue
    }

    // Filter: Exclude Owned
    // Removes owned games
    //+---------------------------------------
    if (filters.mode !== 'backlog' && filters.settings.excludeOwned === true) {
      if (window.library[app.appid] !== undefined) {
        continue
      }
    }

    // Filter: Attributes
    // Skip the app if don't have the attribute
    //+---------------------------------------
    for (const attr in filters.attr) {
      if (filters.attr[attr] === true) {
        if (
          app.attributes === null ||
          app.attributes === undefined ||
          app.attributes[attr] === undefined ||
          app.attributes[attr] === false ||
          (attr == 'achievements' && app.attributes[attr] == 0)
        ) {
          counters.skip++
          data.hidden.attr[attr].push(appid)
          continue dance
        }
      }
    }

    // Filter: tags
    // Skip the app if don't have the tag
    //+---------------------------------------
    if (filters.tags.length > 0) {
      if (!app.tags) {
        continue
      }

      let tagIndex = filters.minTagIndex !== undefined ? filters.minTagIndex : 50

      for (let tag of filters.tags) {
        let index = app.tags.indexOf(tag)
        if (index > tagIndex || index === -1) {
          counters.skip++

          if (data.hidden.tags[tag] === undefined) {
            data.hidden.tags[tag] = [appid]
          } else {
            data.hidden.tags[tag].push(appid)
          }

          continue dance
        }
      }
    }

    // ************************************************
    // Section: OrderBy
    // Exclude games that lack a specific order criteria
    // ************************************************

    if (filters.orderBy === 'name') {
      if (app.name === null || app.name === undefined) {
        counters.skip++
        data.hidden.orderBy.name.push(appid)
        continue
      }
    }

    // if (_orderBy === 'playtime') {
    // }

    // Sort By: HLTB
    // Dont skip apps, but count apps without hltb
    //+---------------------------------------
    if (filters.orderBy === 'hltb') {
      if (app.hltb === null || app.hltb === undefined || app.hltb === false) {
        counters.skip++
        data.hidden.orderBy.hltb.push(appid)
        continue
      }

      if (
        app.hltb.main === null ||
        app.hltb.main === undefined ||
        app.hltb.main === false
      ) {
        counters.skip++
        data.hidden.orderBy.hltb.push(appid)
        continue
      }
    }

    if (filters.orderBy === 'released') {
      if (app.released_at === null || app.released_at === undefined) {
        counters.skip++
        data.hidden.orderBy.released.push(appid)
        continue
      }
    }

    if (
      filters.orderBy === 'steamscore' ||
      filters.orderBy === 'metascore' ||
      filters.orderBy === 'userscore' ||
      filters.orderBy === 'oc'
    ) {
      if (
        app.scores === null ||
        app.scores === undefined ||
        app.scores[filters.orderBy] === null ||
        app.scores[filters.orderBy] === undefined
      ) {
        counters.skip++
        data.hidden.orderBy[filters.orderBy].push(appid)
        continue
      }
    }

    // When sorting by steamscore, and the game has very low
    // steam votes, skip it
    if (
      filters.mode === 'all' &&
      filters.orderBy === 'steamscore' &&
      filters.orderDir === 'desc'
    ) {
      if (
        app.scores.steamscore > 95 &&
        (app.scores.steamscoreCount === null || app.scores.steamscoreCount === undefined)
      ) {
        continue
      }

      if (app.scores.steamscore > 98 && app.scores.steamscoreCount < 100) {
        continue
      }

      if (app.scores.steamscore > 95 && app.scores.steamscoreCount < 500) {
        continue
      }
    }

    // ************************************************
    // Section: Scores
    // Filter out apps without score when sorting score
    // ************************************************

    // Flag: minSteamVotes
    // Skip apps that under the minimum level
    //+---------------------------------------
    if (filters.minSteamVotes !== undefined && filters.minSteamVotes > 0) {
      if (
        app.scores.steamscoreCount < filters.minSteamVotes ||
        app.scores.steamscoreCount === undefined
      ) {
        continue
      }
    }

    // Flag: minScore
    // Skip apps under the minimum combined score
    // TODO: Make some kind of threshold, and skip games with any score very low,
    // for example, userscore = 30 in min 70
    //+---------------------------------------
    if (filters.minScore !== undefined && filters.minScore > 0) {
      if (
        app.scores === undefined ||
        app.scores === null ||
        app.scores.steamscore === 0 ||
        app.scores.length == 0
      ) {
        // console.log('minscore', 'noscore');
        continue
      } else {
        let computed =
          ((app.scores.steamscore || filters.minScore) +
            (app.scores.metascore || filters.minScore) +
            (app.scores.oc || filters.minScore) +
            (app.scores.userscore || filters.minScore)) /
          4

        if (computed < filters.minScore) {
          // console.log('minscore', filters.minScore, computed);
          continue
        } else {
          // console.log('passcore', computed, app.scores);
        }
      }
    }

    // Flag: includeUnreleased
    // When false, exclude any games to be released
    // NOTE: very time consuming
    //+---------------------------------------
    if (filters.includeUnreleased === false) {
      let now = moment().unix()
      let time = moment(app.released_at).unix()
      if (time > now) {
        // console.log('excluded', time, now);
        continue
      }
    }

    // Finally, add the app to filteredApps
    //+---------------------------------------
    // console.log(counters.fetched, app.appid, app);
    data.apps.push(appid)
    counters.pass++
  }

  console.timeEnd('Filter')

  return {
    data,
    counters,
  }
}

// Export function to global Backlog object
// -----
window.backlog.filter = filter
