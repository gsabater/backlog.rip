/*
 * @file:    \services\gameService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 15th January 2025
 * Modified: Fri 07 February 2025 - 20:01:46
 */

export default {
  //+-------------------------------------------------
  // function()
  // - tries to update an app with new data.
  // - returns an object with the updated app, and a result
  // - results can be: false, updated, update:api
  // -----
  // Created on Thu Jan 16 2025
  //+-------------------------------------------------
  smartUpdate(app, data) {
    let api = dataService.prepareToData(data)
    let hasChanges = false

    const blacklist = [
      'uuid',
      '_',
      'is',
      'log',
      'state',
      'playtime',
      'dates.created',
      'dates.refreshed',
    ]

    const isBlacklisted = (path) => {
      return blacklist.includes(path)
    }

    const compareAndUpdate = (original, updates, parentPath = '') => {
      if (!updates) return false
      let changed = false

      for (const key in updates) {
        const currentPath = parentPath ? `${parentPath}.${key}` : key
        if (updates[key] === null) continue
        if (isBlacklisted(currentPath)) continue

        // Handle nested objects
        if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
          if (!original[key]) original[key] = {}
          if (compareAndUpdate(original[key], updates[key], currentPath)) {
            changed = true
          }
          continue
        }

        // Handle arrays
        if (Array.isArray(updates[key])) {
          if (JSON.stringify(original[key]) !== JSON.stringify(updates[key])) {
            original[key] = [...updates[key]]
            changed = true
          }
          continue
        }

        // Handle primitive values
        if (original[key] !== updates[key]) {
          original[key] = updates[key]
          changed = true
        }
      }

      return changed
    }

    hasChanges = compareAndUpdate(app, api)

    return {
      status: hasChanges ? 'updated' : 'unchanged',
      data: hasChanges ? app : null,
    }
  },

  //+-------------------------------------------------
  // needsUpdate()
  // Checks if the app needs to be updated
  // There are three possible outcomes
  // - false if update is not required
  // - true or update:field to get data from the api
  // - store:db if the app needs to be added to the store
  // -----
  // Created on Sun Feb 11 2024
  //+-------------------------------------------------
  needsUpdate(app, data) {
    if (!app) return false

    // This block is only when comparing
    // local data with the API data
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (data) {
      if (!app.is.lib) return false

      // app matched with an api item
      if (!app.id?.api && (data?.id?.api || data?.api_id)) return 'update:match'

      // The source app is local
      if (app.uuid.indexOf('local:') > -1) return 'update:match'

      // The app level is empty
      // Implies that some basic fields are missing
      // Defined in gameService._detail
      if (app._.detail == 'empty') return 'update:refresh'

      return true
    }

    // This block is only when checking app data
    // without a new object
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (!data) {
      // App has never been updated from the API
      if (!app.description) return 'update:api'
      if (!app.providers) {
        console.warn('should update and save providers, (hltb ID, opencritic ID, etc)')
      }
    }

    // For internal updates like changing data
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // nunca ocurre
    // if (app.state !== data.state) return 'update:state'
    if (app?.is?.dirty || data?.is?.dirty) {
      debugger
      return 'store:db'
    }

    return false
  },

  //+-------------------------------------------------
  // update()
  // Tries to compare and update the app with the api
  // And returns the status of the update
  // -----
  // Created on Wed Jan 15 2025
  // Updated on Fri Feb 07 2025
  //+-------------------------------------------------
  update(app, api) {
    let updates = []
    let updated = false

    let data = dataService.prepareToData(api)
    data.id.api = data.uuid

    let blacklist = ['log', 'state', 'playtime', 'source']

    for (const key in data) {
      if (data[key] === null) continue
      if (blacklist.includes(key)) continue

      let sample = null

      // Check local uuids
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (key == 'uuid') {
        if (!app.uuid.includes('local:')) continue
      }

      // Compare simple fields
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (typeof data[key] !== 'object' && !Array.isArray(data[key])) {
        if (app[key] == data[key]) continue
        else app[key] = data[key]
      }

      // The item needs a refresh
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (key == '_') {
        if (app._.detail == 'empty' || app._.detail.includes(':outdated')) {
          updates.push({ key: 'refresh', old: app.dates.refreshed || 'none', new: 'now' })
        }
        continue
      }

      // Compare dates
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (key == 'dates') {
        const dateFields = ['released_at', 'created_at', 'updated_at']
        const filtered = (obj) =>
          Object.fromEntries(Object.entries(obj).filter(([k]) => dateFields.includes(k)))
        const serialized = JSON.stringify(filtered(app[key]))
        const incoming = JSON.stringify(filtered(data[key]))

        if (serialized === incoming) continue
        app[key] = { ...app[key], ...data[key] }
      }

      // Compare objects
      // > 'is' is an object, but it can be the same object but flagged as dirty
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (typeof data[key] === 'object' && !Array.isArray(data[key]) && key !== 'dates') {
        let serializedApp = this.sortAndStringify(app[key]) // JSON.stringify(app[key])
        let serializedData = this.sortAndStringify(data[key]) // JSON.stringify(data[key])

        if (key == 'is' && !data.is?.dirty && serializedApp == serializedData) continue
        else if (key == 'is' && Object.keys(data.is).length == 0) continue
        else if (key !== 'is' && serializedApp == serializedData) continue
        else {
          app[key] = {
            ...app[key],
            ...data[key],
          }

          sample = [serializedApp, serializedData]
        }
      }

      // Compare Arrays
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (Array.isArray(data[key])) {
        if (app[key] && app[key].length == data[key].length) continue
        else {
          app[key] = data[key]
        }
      }

      updates.push({ key, old: data[key], new: app[key], sample })
    }

    // Set flags to update and store
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (updates.length || !app.dates.refreshed) {
      updated = true
      app.toStore = true
      app.dates.refreshed = dates.stamp()
    }

    return {
      updated,
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
}
