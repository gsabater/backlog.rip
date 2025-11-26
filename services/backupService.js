/*
 * @file:    \services\backupService.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 24th October 2025
 * Modified: 29th October 2025 - 05:31:04
 */

export default {
  //+-------------------------------------------------
  // makeHash()
  // Increments the backup and creates a new hash
  // -----
  // Created on Fri Oct 24 2025
  //+-------------------------------------------------
  makeHash(backup, create = false) {
    let old = backup.hash
    let version = old && old.includes('.') ? old.split('.')[0] : 0
    if (create) version = 0

    let versioned = parseInt(version) + 1
    let newHash = Math.random().toString(36).substring(2, 8)

    return `${versioned}.${newHash}`
  },

  //+-------------------------------------------------
  // makeSignature()
  //
  // -----
  // Created on Mon Oct 27 2025
  //+-------------------------------------------------
  async makeSignature(json) {
    let string = JSON.stringify(json)
    const data = new TextEncoder().encode(string)

    // Hash using SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((bytes) => bytes.toString(16).padStart(2, '0')).join('')

    return {
      hash: `${hashHex}`,
      time: `${dates.stamp()}`,
      full: `${dates.stamp()}.${hashHex}`,
    }
  },

  //+-------------------------------------------------
  // prepareAccountData()
  // Prepares the account data for backup by removing sensitive fields
  // -----
  // Created on Mon Oct 27 2025
  //+-------------------------------------------------
  prepareAccountData(account) {
    let data = {}

    data.account = { ...account.me }
    data.config = { ...account.config }

    // Clean object using a blacklist
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const blacklist = {
      config: ['updated_at'],
      account: ['uuid', 'bearer', 'avatar', 'updated_at', 'steam_updated_at', 'steam_data'],
    }

    Object.entries(blacklist).forEach(([key, fields]) => {
      fields.forEach((field) => delete data[key][field])
    })

    return data
  },

  prepareLibrary(library) {
    let clean = library.map((game) => this.prepareGameData(game))
    const data = JSON.stringify(clean)

    return data
  },

  //+-------------------------------------------------
  // prepareGameData()
  // Takes a game object and returns a clean version
  // -----
  // Created on Tue Aug 20 2024
  //+-------------------------------------------------
  prepareGameData(game) {
    let clean = {}
    let whitelist = ['uuid', 'name', 'id', 'is', 'state', 'cover', 'playtime', 'achievements']

    for (const key in game) {
      if (key == 'achievements') {
        let ach = this.prepareAchievements(game)
        if (ach) clean[key] = ach
      } else if (whitelist.includes(key)) clean[key] = game[key]
    }

    return clean
  },

  //+-------------------------------------------------
  // prepareAchievements()
  //
  // -----
  // Created on Thu Mar 13 2025
  //+-------------------------------------------------
  prepareAchievements(game) {
    if (!game.achievements) return false

    let prepared = []
    game.achievements.forEach((achievement) => {
      if (!achievement.is?.status) return
      prepared.push({
        steam_key: achievement.steam_key,
        is: achievement.is,
      })
    })

    return prepared
  },
}
