/*
 * @file:    \services\dataService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 31st December 2024
 * Modified: Thu 20 March 2025 - 12:48:04
 */

import queueService from './queueService'

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
    $nuxt ??= useNuxtApp()
    $data ??= useDataStore()
    $game ??= useGameStore()

    item = this.normalize(item)
    item._ = this.normalize_(item)

    // this is not used anymore
    if (item.is?.dirty || item.toSwap) {
      debugger
      // item.uuid = item.uuid || $nuxt.$uuid()
    }

    delete item.toStore
    delete item.services
    delete item.platforms

    return item
  },

  //+-------------------------------------------------
  // normalize()
  // Normalizes data for the game.
  // This is meant to be used when the game is used in the app
  // For preparing data to be stored, use process() or prepareToStore()
  // -----
  // Created on Tue Feb 20 2024
  // Created on Wed Dec 11 2024 - Normalize local uuids with API
  //+-------------------------------------------------
  normalize(game) {
    game.id = game.id || {}
    game.is = game.is || {}
    game.log = game.log || []

    game.dates = game.dates || {}
    game.scores = game.scores || {}
    game.genres = game.genres || []
    game.playtime = game.playtime || {}

    game = this.normalizeID(game)
    game = this.normalizeDates(game)
    game = this.normalizeScores(game)
    game = this.normalizeLanguages(game)

    game = this.cleanup(game)
    // game.updated_at = game.updated_at || 0

    return game
  },

  //+-------------------------------------------------
  // normalizeID()
  // Normalizes multiple ID fields
  // -----
  // Created on Mon Dec 16 2024
  // Updated on Wed Mar 05 2025 - Added game swapping
  //+-------------------------------------------------
  normalizeID(game) {
    if (game.api_id) game.id.api = game.api_id
    if (game.igdb_id) game.id.igdb = game.igdb_id
    if (game.xbox_id) game.id.xbox = game.xbox_id
    if (game.epic_id) game.id.epic = game.epic_id
    if (game.steam_id) game.id.steam = game.steam_id
    if (game.id.steam) game.id.steam = Number(game.id.steam)
    if (game.igdb_slug) game.id.igdb_slug = game.igdb_slug

    // Handle local games with wrong UUIDs
    // This is called swapping
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (game.id.api && (!game.uuid || game.uuid !== game.id.api)) {
      debugger
      // Since swapping is something delicate
      // Control the last swap so it doesn't stays in a loop
      // swap loop can happen when there are duplicates on the API
      const weekInSeconds = 7 * 24 * 60 * 60
      const now = dates.stamp()
      if (!game.dates?.swapped || now - game.dates.swapped > weekInSeconds) {
        queueService.queue([game.uuid, game.id.api], 'swap')

        game.dates.swapped = now
        game.uuid = game.id.api
      }
    }

    delete game.api_id
    delete game.gog_id
    delete game.igdb_id
    delete game.xbox_id
    delete game.epic_id
    delete game.steam_id
    delete game.igdb_slug

    return game
  },

  //+-------------------------------------------------
  // normalizeScores()
  // -----
  // Created on Wed Feb 05 2025
  //+-------------------------------------------------
  normalizeScores(game) {
    if (!game.scores.steamscore) return game

    game.scores.steamdb = this.calcSteamdbRating(game.scores)
    return game
  },

  //+-------------------------------------------------
  // normalizeDates()
  // - created_at -> Is the date the game was created in the API
  // - updated_at -> Is the date the game was updated in the API
  // - released_at -> Is the date the game was released
  // - refreshed -> The date where metadata has been updated/checked from the API
  // -----
  // Created on Tue Dec 31 2024
  //+-------------------------------------------------
  normalizeDates(game) {
    if (game.released_at) game.dates.released = game.released_at
    if (game.created_at) game.dates.created = game.created_at
    if (game.updated_at) game.dates.updated = game.updated_at

    delete game.created_at
    delete game.updated_at
    delete game.released_at

    return game
  },

  //+-------------------------------------------------
  // normalizeLanguages()
  // Normalizes the languages string
  // -----
  // Created on Fri Feb 07 2025
  //+-------------------------------------------------
  normalizeLanguages(game) {
    if (!game.languages) return game
    if (typeof game.languages !== 'string') return game

    let languages = game.languages || []
    game.languages = languages.split(',').map((lang) => {
      return lang.toLowerCase()
    })

    return game
  },

  //+-------------------------------------------------
  // normalize_()
  // -----
  // Created on Mon Dec 16 2024
  // Updated on Tue Dec 17 2024 - Added owned_at
  //+-------------------------------------------------
  normalize_(game) {
    return {
      score: this._score(game),
      detail: this._detail(game),
      astats: this._astats(game),
      playtime: this._playtime(game),

      released: this._dateReleasedAt(game),
      releasedYear: this._dateReleasedAt(game, 'YYYY'),

      owned_at: this._dateOwnedAt(game),
      created_at: this._dateCreatedAt(game),
      updated_at: this._dateUpdatedAt(game),
    }
  },

  //+-------------------------------------------------
  // _detail
  // Returns a level of detail available for the game
  // -----
  // - empty, no data
  // - basic, has name, score, scores
  // - full, has all data available for the game
  // - source, highest level of detail with sources
  // -----
  // Created on Wed Jan 15 2025
  //+-------------------------------------------------
  _detail(app) {
    let detail = 'empty'
    let outdated = ''

    // debugger
    // if (app.uuid.includes('local:')) debugger

    // Outdated check
    // Apps should be refreshed every 3 months
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const outdatedThreshold = new Date()
    outdatedThreshold.setMonth(outdatedThreshold.getMonth() - 3)
    const expiration = Math.floor(outdatedThreshold / 1000)

    if (new Date(app.dates.refreshed) < expiration) {
      outdated = ':outdated'
    }

    // Basic detail
    // Most basic fields are
    // name, refreshed date and API ID
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (app.name && app.dates.refreshed && app.id.api) {
      detail = 'basic'
    } else return detail + outdated

    // Full detail
    // The app has been requested to the api
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (app.description) {
      detail = 'full'
    } else return detail + outdated

    // Source detail
    // Not implemented yet
    // The app must have .source
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // if (app.sources && app.sources.length > 0) {
    //   detail = 'fullsource'
    // }

    return detail + outdated
  },

  //+-------------------------------------------------
  // _astats()
  // Gather achievement stats
  // -----
  // Created on Sun Mar 02 2025
  //+-------------------------------------------------
  _astats(app) {
    let stats = {
      total: 0,
      hidden: 0,
      completed: 0,
      percentage: 0,
      latest: null,
    }

    // Early return if no achievements
    if (!app.achievements?.length) return stats

    // Filter achievements by status
    const completedAchievements = app.achievements.filter(
      (achievement) => achievement.is?.status === 'unlocked'
    )

    const validAchievements = app.achievements.filter(
      (ach) =>
        !ach.is?.status || (ach.is.status !== 'abandoned' && ach.is.status !== 'bugged')
    )

    // Calculate basic stats
    stats.total = validAchievements.length
    stats.hidden = app.achievements.length - validAchievements.length
    stats.completed = completedAchievements.length

    // Calculate completion percentage (avoid division by zero)
    if (stats.total > 0) {
      stats.percentage = Math.round((stats.completed / stats.total) * 100)
    }

    // Find the most recent achievement
    if (completedAchievements.length) {
      let recent = completedAchievements.reduce((latest, ach) => {
        return ach.is?.time > latest.is?.time ? ach : latest
      })

      if (recent) stats.latest = recent.steam_key
    }

    return stats
  },

  //+-------------------------------------------------
  // _score()
  // Generates a new score by taking context into account
  // -----
  // Created on Tue Feb 20 2024
  // Updated on Fri 08 Nov 2024 - Score is now handled in the API
  //+-------------------------------------------------
  _score(app) {
    return app.score || 0
    // let score = app.score || 0

    // // Avoid very high scores not verified
    // //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // if (!app.scores) score = score - 25
    // if (app.score >= 96 && !app.scores) {
    //   score = 50
    // }

    // // Reduce the final score if the amount of reviews is low
    // //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // if (app.scores?.steamCount < 100) score *= 0.7
    // else if (app.scores?.steamCount < 1000) score *= 0.8
    // else if (app.scores?.steamCount < 3000) score *= 0.9

    // if (app.score >= 95 && app.scores?.steamCount < 16000) score *= 0.8

    // // On games outside of steam...
    // //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // if (app.scores.igdb > 0 && app.scores?.igdbCount < 90) score *= 0.8

    // // Only when there is only igdb
    // //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // // if (app.scores && !app.scores?.steamCount) {
    // //   if (app.scores?.igdb >= 90 && !app.scores.igdbCount) score *= 0.8
    // // }

    // return score
  },

  _playtime(app) {
    if (!app.playtime) return 0

    return Object.entries(app.playtime)
      .filter(([key]) => !key.endsWith('_last'))
      .reduce((total, [, num]) => total + num, 0)
  },

  _dateReleasedAt(app, format = 'LL') {
    if (!app.dates.released) return null
    return $nuxt.$moment(app.dates.released * 1000).format(format)
  },

  _dateCreatedAt(app) {
    if (!app.dates.created) return null
    return $nuxt.$moment(app.dates.created).format('LL')
  },

  _dateUpdatedAt(app) {
    if (!app.dates.updated) return null
    return $nuxt.$moment(app.dates.updated * 1000).format('LL')
  },

  _dateOwnedAt(app, format = 'LL') {
    if (!app.is.lib) return null
    return $nuxt.$moment(app.is.lib * 1000).format(format)
  },

  //+-------------------------------------------------
  // cleanup()
  // -----
  // Created on Tue Dec 31 2024
  //+-------------------------------------------------
  cleanup(game) {
    if (game.dates) delete game.date

    delete game.enabled
    delete game.data

    return game
  },

  //+-------------------------------------------------
  // updateBatch()
  // Searches for games under the detail level
  // And calls the api for an update
  // -----
  // Created on Wed Jan 15 2025
  //+-------------------------------------------------
  async updateBatch(levels = ['empty']) {
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

    // log('↻ Updating a batch...', outdated)
    await this.getBatch(outdated)
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
      await $data.process(xhr.data, 'api:batch')
    }
  },

  //+-------------------------------------------------
  // calcSteamdbRating()
  // https://steamdb.info/blog/steamdb-rating/
  // -----
  // Created on Sun Feb 02 2025
  //+-------------------------------------------------
  calcSteamdbRating(scores) {
    // Convert percentage to decimal (e.g. 85% -> 0.85)
    const positivePercentage = scores.steamscore / 100

    // Calculate actual vote counts
    const totalVotes = scores.steamCount
    const positiveVotes = Math.round(totalVotes * positivePercentage)
    const negativeVotes = totalVotes - positiveVotes

    // Rating calculation
    const average = positiveVotes / totalVotes
    const score = average - (average - 0.5) * Math.pow(2, -Math.log10(totalVotes + 1))

    return score * 100
  },

  //+-------------------------------------------------
  // deduplicate()
  // This function compares two items that index for the same store,
  // And tries to deduplicate them
  // -----
  // Created on Wed Mar 05 2025
  //+-------------------------------------------------
  async deduplicate(item, indexed) {
    $nuxt ??= useNuxtApp()
    $data ??= useDataStore()
    $game ??= useGameStore()

    if (!item.is?.lib) return
    let app = $data.get(indexed.uuid)

    if (!app.is?.lib) return

    // If the item is a local one, and the indexed is not
    // update the indexed app and delete the local item
    if (item.uuid.includes('local:') && !app.uuid.includes('local:')) {
      $game.update(app, {
        is: item.is || {},
        dates: item.dates || {},
        achievements: item.achievements || [],
      })

      queueService.queue(item.uuid, 'delete')
      return
    }

    // This means the app is duplicated but did not fall in the previous case
    // WIP there is still work to be done
    // debugger
  },
}
