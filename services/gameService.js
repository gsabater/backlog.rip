/*
 * @file:    \services\gameService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 15th January 2025
 * Modified: Mon 24 March 2025 - 19:23:15
 */

import steamAPIService from './steamAPIService'

let $nuxt = null
let $library = null

export default {
  //+-------------------------------------------------
  // loadFromAPI()
  // Gets more data from the API
  // -----
  // Created on Fri Feb 16 2024
  // Updated on Thu Jan 30 2025 - Get uuid from param
  // Updated on Fri Feb 28 2025 - Moved to a service
  //+-------------------------------------------------
  async loadFromAPI(app) {
    // Check if the game actually needs to be loaded
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (app.uuid.includes('local:') && !app.id.api) return
    if (app._.detail.includes('full') && !app._.detail.includes(':outdated')) return

    const uuid = app.id.api || app.uuid
    if (!uuid || uuid.includes('local:')) return

    // Load and return
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    $nuxt ??= useNuxtApp()
    const xhr = await $nuxt.$axios.get(`/get/${uuid}.json`)

    if (xhr.status == 200) {
      return xhr.data
    } else {
      console.error('🪝 Error loading data from API', xhr)
      debugger
    }
  },

  //+-------------------------------------------------
  // function()
  // Loads game achievements using the Steam API bridge
  // -----
  // Created on Fri Mar 14 2025
  //+-------------------------------------------------
  async getAchievements(game, loaded) {
    if (!game.id.steam) return

    debugger
    let achievements = game.achievements || []

    // First, check if the API has achievements
    // if no achievements and api key, GetSchemaForGame
    // if (!achievements.length && game.id.api) {
    //   let c = await steamAPIService.GetSchemaForGame(game.id.steam)
    //   achievements = this.mergeAchievements(achievements, c)
    // }

    // If the achievements list is not empty:
    // and there are games without percentages, GetGlobalAchievementPercentagesForApp
    // let missing = !achievements.length || achievements.some((a) => !a.completion)
    // if (missing) {
    //   let c = await steamAPIService.GetGlobalAchievementPercentagesForApp(game.id.steam)
    //   achievements = this.mergeAchievements(achievements, c)
    // }

    debugger
    // if is in lib:
    // if no key get achievements from api
    // else get achievements from steam api

    // merge achievements after each step

    // First, check if any achievement in game has missing completion rate
    let achieved = steamAPIService.getAchievements(game.id.steam)
  },

  //+-------------------------------------------------
  // getAchieved()
  // Gets user achievements and updates the game object
  // -----
  // Created on Thu Feb 27 2025
  //+-------------------------------------------------
  async getAchieved(game) {
    if (!game.id.steam) return
    // Only load achievements for games in the library
    // WIP - if the game is not in lib but has api token and no achievements in api, look for them them
    if (!game.is.lib) return
    if (!dates.isStale(game.dates.achievements, 24)) return

    $library ??= useLibraryStore()
    let achieved = await $library.steam.getAchievements(game)
    // game.achieved = achieved
    // game.dates.achieved = dates.stamp()

    return achieved

    // Update local data, store and indexes
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // await $data.process(game, 'updated', false)
    // if (this.app.uuid == game.uuid) this.load(game.uuid, false)
  },

  //+-------------------------------------------------
  // needsUpdate()
  // Checks if the app needs to be updated
  // There are three possible outcomes
  // - false if update is not required
  // - true or update:field to get data from the api
  // - store:db if the app needs to be added to the store
  // -----
  // It can return an action : update, load
  // And a reasong for the action : swapUUID, missing
  // -----
  // Created on Sun Feb 11 2024
  //+-------------------------------------------------
  needsUpdate(app, data) {
    if (!app) return false
    let toUpdate = []

    // This block is only when comparing
    // local data with the API data
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (data) {
      if (!app.is.lib) return false
      const apiUUID = data?.id?.api || data?.api_id

      // If it has a flag to be updated, honor it
      if (data.toUpdate) return true

      // The app is matched with another app from the API
      if (!app.id?.api && apiUUID) return ['update:swapUUID']

      // The app is local, and now we have an app from the API
      if (app.uuid.indexOf('local:') > -1 && apiUUID) return ['update:swapUUID']

      // For some reason the API has a greater updated_at
      if (data.updated_at > (app.dates.updated ?? 0)) return ['update:stale']

      return false
    }

    // This block is only when checking app data
    // without a new object
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (!data) {
      // The app level is empty
      // Implies that some basic fields are missing
      // Defined in gameService._detail
      // WIP -> delete this, now is checked in loadFromAPI
      if (app._.detail == 'empty') toUpdate.push('api:missing')

      // If the app has never been updated from the API
      // This is known because the app has no description at all
      if (app.description === undefined) toUpdate.push('api:missing')

      // The app has no achievements, so it needs them
      if (app.achievements === undefined) toUpdate.push('api:achievements')

      // if (!app.providers) {
      //   console.warn('should update and save providers, (hltb ID, opencritic ID, etc)')
      // }

      if (toUpdate.length) return toUpdate
    }

    return false
  },

  // //+-------------------------------------------------
  // // function()
  // // - tries to update an app with new data.
  // // - returns an object with the updated app, and a result
  // // - results can be: false, updated, update:api
  // // -----
  // // Created on Thu Jan 16 2025
  // //+-------------------------------------------------
  // smartUpdate(app, data) {
  //   let api = dataService.prepareToData(data)
  //   let hasChanges = false

  //   const blacklist = [
  //     'uuid',
  //     '_',
  //     'is',
  //     'log',
  //     'state',
  //     'playtime',
  //     'dates.created',
  //     'dates.refreshed',
  //   ]

  //   const isBlacklisted = (path) => {
  //     return blacklist.includes(path)
  //   }

  //   const compareAndUpdate = (original, updates, parentPath = '') => {
  //     if (!updates) return false
  //     let changed = false

  //     for (const key in updates) {
  //       const currentPath = parentPath ? `${parentPath}.${key}` : key
  //       if (updates[key] === null) continue
  //       if (isBlacklisted(currentPath)) continue

  //       // Handle nested objects
  //       if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
  //         if (!original[key]) original[key] = {}
  //         if (compareAndUpdate(original[key], updates[key], currentPath)) {
  //           changed = true
  //         }
  //         continue
  //       }

  //       // Handle arrays
  //       if (Array.isArray(updates[key])) {
  //         if (JSON.stringify(original[key]) !== JSON.stringify(updates[key])) {
  //           original[key] = [...updates[key]]
  //           changed = true
  //         }
  //         continue
  //       }

  //       // Handle primitive values
  //       if (original[key] !== updates[key]) {
  //         original[key] = updates[key]
  //         changed = true
  //       }
  //     }

  //     return changed
  //   }

  //   hasChanges = compareAndUpdate(app, api)

  //   return {
  //     status: hasChanges ? 'updated' : 'unchanged',
  //     data: hasChanges ? app : null,
  //   }
  // },

  //+-------------------------------------------------
  // merge()
  // Tries to compare and update the app with the api
  // And returns the status of the update
  // -----
  // Created on Wed Jan 15 2025
  // Updated on Fri Feb 07 2025
  // Updated on Sat Mar 01 2025 - Changed to whitelist
  //+-------------------------------------------------
  merge(app, api) {
    let updates = []

    // Prepare the incoming data
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let data = dataService.prepareToData(api)
    if (data.uuid) data.id.api = data.uuid

    // let blacklist = ['log', 'state', 'playtime', 'source', 'toUpdate']
    let whitelist = [
      // Simple fields
      'uuid',
      'category',
      'slug',
      'name',
      'description',
      'has_demo',
      'score',
      // Objects
      'id',
      'is',
      'dates',
      'cover',
      'hltb',
      'scores',
      'ratings',
      'playtime',
      // Arrays
      'languages',
      'genres',
      'achievements',
    ]

    for (const key in data) {
      let merge = null
      if (data[key] === null) continue
      if (!whitelist.includes(key)) continue

      // Merge Strings, booleans and numbers
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (typeof data[key] !== 'object' && !Array.isArray(data[key])) {
        merge = this.mergeString(app[key], data[key])
        if (merge.updated) {
          app[key] = merge.value

          // updated = true
          updates.push({ key, ...merge.sample })
        }

        continue
      }

      // Special treatment for achievements
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (key == 'achievements') {
        merge = this.mergeAchievements(app, data[key], data.achieved)
        if (merge.updated) {
          app[key] = merge.value
          app.dates.achievements = dates.stamp()
          updates.push({ key })
        }

        continue
      }

      // Merge Arrays
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (Array.isArray(data[key])) {
        merge = this.mergeArray(app[key], data[key])
        if (merge.updated) {
          app[key] = merge.value
          updates.push({ key, ...merge.sample })
        }

        continue
      }

      // Merge Objects
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
        merge = this.mergeObject(app[key], data[key])
        if (merge.updated) {
          app[key] = merge.value
          updates.push({ key, ...merge.sample })
        }

        continue
      }

      console.warn(key, app, updates)
      debugger

      // // Check local uuids
      // //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // if (key == 'uuid') {
      //   if (!app.uuid.includes('local:')) continue
      // }

      // // Compare simple fields
      // //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // if (typeof data[key] !== 'object' && !Array.isArray(data[key])) {
      //   if (app[key] == data[key]) continue
      //   else app[key] = data[key]
      // }

      // // The item needs a refresh
      // //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // if (key == '_') {
      //   if (app._.detail == 'empty' || app._.detail.includes(':outdated')) {
      //     updates.push({ key: 'refresh', old: app.dates.refreshed || 'none', new: 'now' })
      //   }
      //   continue
      // }

      // // Compare dates
      // //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // if (key == 'dates') {
      //   const dateFields = ['released_at', 'created_at', 'updated_at', 'achievements']
      //   const filtered = (obj) =>
      //     Object.fromEntries(Object.entries(obj).filter(([k]) => dateFields.includes(k)))
      //   const serialized = JSON.stringify(filtered(app[key]))
      //   const incoming = JSON.stringify(filtered(data[key]))

      //   if (serialized === incoming) continue
      //   app[key] = { ...app[key], ...data[key] }
      // }

      // // Compare objects
      // // > 'is' is an object, but it can be the same object but flagged as dirty
      // //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // if (typeof data[key] === 'object' && !Array.isArray(data[key]) && key !== 'dates') {
      //   let serializedApp = this.sortAndStringify(app[key]) // JSON.stringify(app[key])
      //   let serializedData = this.sortAndStringify(data[key]) // JSON.stringify(data[key])

      //   if (Object.keys(data[key]).length == 0) continue
      //   else if (key == 'is' && !data.is?.dirty && serializedApp == serializedData)
      //     continue
      //   else if (key == 'is' && Object.keys(data.is).length == 0) continue
      //   else if (key !== 'is' && serializedApp == serializedData) continue
      //   else {
      //     app[key] = {
      //       ...app[key],
      //       ...data[key],
      //     }

      //     sample = [serializedApp, serializedData]
      //   }
      // }

      // // Compare Arrays
      // //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // if (Array.isArray(data[key])) {
      //   if (app[key] && app[key].length == data[key].length) continue
      //   else {
      //     updates.push({ key, old: app[key] || 'none', new: data[key] })
      //     app[key] = data[key]
      //     continue
      //   }
      // }

      // updates.push({ key, old: data[key], new: app[key], sample })
    }

    // Sets the refreshed date
    // This is later used by ._.detail and appends :outdated
    // +~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (api.uuid && (updates.length || !app.dates.refreshed)) {
      app.dates.refreshed = dates.stamp()
    }

    return {
      updated: updates.length > 0,
      updates,
      app,
    }
  },

  sortAndStringify(obj) {
    if (!obj) return ''
    const ordered = Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = obj[key]
        return acc
      }, {})
    return JSON.stringify(ordered)
  },

  //+-------------------------------------------------
  // mergeString()
  // Merges (replaces) simple strings
  // -----
  // Created on Sat Mar 01 2025
  //+-------------------------------------------------
  mergeString(app, api) {
    if (app == api) return { updated: false }

    let merge = {
      value: false,
      sample: {},
    }

    merge.value = api
    merge.sample = { old: app, new: api }
    merge.updated = true

    return merge
  },

  //+-------------------------------------------------
  // mergeArray()
  // Merges (replaces) arrays if they are different in length
  // -----
  // Created on Sat Mar 01 2025
  //+-------------------------------------------------
  mergeArray(app, api) {
    if (api.length == 0) return { updated: false }
    if (app && app.length == api.length) return { updated: false }

    let merge = {
      value: false,
      sample: {},
    }

    merge.value = api
    merge.sample = { old: app, new: api }
    merge.updated = true

    return merge
  },

  //+-------------------------------------------------
  // mergeObject()
  // Merges objects prop by prop
  // -----
  // Created on Sat Mar 01 2025
  //+-------------------------------------------------
  mergeObject(app, api) {
    if (!app) app = {}
    if (Object.keys(api).length == 0) return { updated: false }

    // Initial check for equality
    const serialized = this.sortAndStringify(app)
    const comparison = this.sortAndStringify(api)
    if (serialized === comparison) return { updated: false }

    let value = { ...app }
    let merge = {
      value: null,
      sample: {},
    }

    for (const key in api) {
      const element = api[key]
      if (api[key] === null || api[key] === undefined) continue

      value[key] = element
    }

    merge.value = value
    merge.sample = { old: JSON.stringify(app), new: JSON.stringify(value) }
    merge.updated = true

    return merge
  },

  //+-------------------------------------------------
  // mergeAchievements()
  // Merges achievements and achieved status
  // -----
  // Created on Thu Feb 27 2025
  //+-------------------------------------------------
  mergeAchievements(app, entries = []) {
    if (entries.length == 0) return { updated: false }

    // Create a copy of the achievements array
    let updated = structuredClone(app.achievements || [])

    // Create a map of existing entries by steam_key for quick lookups
    // +~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const map = new Map()
    updated.forEach((achievement) => {
      map.set(achievement.steam_key, achievement)
    })

    // Process achievements
    // +~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    entries.forEach((newAchievement) => {
      if (newAchievement.apiname) {
        newAchievement.steam_key = newAchievement.apiname
        delete newAchievement.apiname
      }

      let existing = map.get(newAchievement.steam_key)
      if (!existing) {
        // Create new achievement object with steam_key
        existing = {
          steam_key: newAchievement.steam_key,
        }

        // Add the new achievement to the map
        updated.push(existing)
        map.set(existing.steam_key, existing)
      }

      Object.assign(existing, {
        name: newAchievement.name,
        description: newAchievement.description,
        completion: newAchievement.completion,
        icon: newAchievement.icon,
        gray: newAchievement.gray,
        hide: newAchievement.hide,
        highlighted: newAchievement.highlighted,
      })

      // Update achievement status
      // +~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (newAchievement.achieved === 1) {
        existing.is = existing.is || {}
        existing.is.status = 'unlocked'
        existing.is.time = newAchievement.unlocktime
        existing.is.steam = newAchievement.unlocktime
      }
    })

    debugger

    return {
      updated: updated.length > 0,
      value: updated,
    }
  },
}
