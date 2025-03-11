/*
 * @file:    \modules\importers\steam.js
 * @desc:    Utility helper to make requests to and return a list of games
 * ----------------------------------------------
 * Created Date: 16th November 2023
 * Modified: Tue 11 March 2025 - 14:30:45
 */

import axios from 'axios'
import steamAPI from '~/services/steamAPIService'

let $log = null
let $axios = null
let $account = null

export default {
  //+-------------------------------------------------
  // Module manifest v1.2
  // ---
  // This object is used to define the module
  // and its capabilities to the importer plugin
  //+-------------------------------------------------

  manifest: {
    ver: '1.5',
    name: 'Steam library integration',
    author: 'Gaspar S.',
    updated_at: '2025-03-11',
    description:
      'Synchronize all your games and playtime for every game on Steam, including free games.',
    url: 'https://github.com/gsabater/backlog.rip/blob/master/modules/importers/steam.js',

    source: {
      key: 'steam',
      type: 'store',
      name: 'Steam',
      logo: '/img/logos/steam.png',
      // showName: false,
    },

    requires: 'steamID',
    games: true,
    states: false,
    account: true,
    wishlist: false,
    autoupdates: true,

    // Defines that map[0] in remote data,
    // should be map[1] in id object
    map: ['appid', 'steam'],
    sortBy: 'playtime_forever',

    // sync: ['name', 'playtime', 'last_played'],

    requeriments: [
      {
        title: 'User has a public profile',
        description: 'Check if the user has a public profile',
      },
    ],
  },

  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Methods
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  //+-------------------------------------------------
  // connect()
  // Registers the importer script with the vue instance
  // This allows the script to access the vue methods
  // Methods available are setStep, log, onError...
  // -----
  // Created on Tue Nov 29 2022
  // Created on Wed Feb 26 2025 - Initialize axios instance
  //+-------------------------------------------------
  connect(account, log) {
    $log = log || console.debug
    $account = account

    $axios ??= axios.create({
      timeout: 60000,
    })

    $axios.defaults.headers.common['Authorization'] = 'Bearer ' + account.bearer
    $log('🆗 Connection established', {
      account,
    })

    return true
  },

  //+-------------------------------------------------
  // getUserdata()
  // Calls backend to retrieve user profile data
  // -----
  // Created on Thu Dec 08 2022
  // Updated on Mon Mar 13 2023
  //+-------------------------------------------------
  async getUserdata() {
    let url = 'https://api.backlog.rip/fetch/steam/userdata'
    let xhr = await $axios.get(url + '?steamid=' + $account.account)

    if (xhr.data.status == 'success') {
      return xhr.data?.fetch?.data || {}
    }
  },

  //+-------------------------------------------------
  // getLibrary()
  // Calls backend to retrieve user games
  // Must return an array even if empty
  // -----
  // Created on Thu Dec 08 2022
  //+-------------------------------------------------
  async getLibrary() {
    let url = 'https://api.backlog.rip/fetch/steam/games'
    let xhr = await $axios.get(url + '?steamid=' + $account.account)

    if (xhr.data.status == 'success') {
      return xhr.data?.fetch?.data?.games || []
    }
  },

  //+-------------------------------------------------
  // getAchievements()
  // Gets an app achievements
  // -----
  // Created on Wed Feb 26 2025
  //+-------------------------------------------------
  async getAchievements(game) {
    console.warn($account)
    if (!game.id.steam) return
    let data = null

    // // Achievements via Steam API using user key
    // //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // achievements = steamAPI.GetPlayerAchievements(
    //   $account.api_token,
    //   $account.account,
    //   game.id.steam
    // )

    // Get the achievements using the Backlog API
    // This is just a proxy to "lend" the API key
    // to users without a Steam API key
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let url = 'https://api.backlog.rip/fetch/steam/achievements/' + game.id.steam
    let xhr = await $axios.get(url)
    if (xhr.data.status.includes('success')) {
      data = xhr.data?.fetch?.data || []
    }

    return data
  },

  //+-------------------------------------------------
  // hasUpdates()
  // Returns false if there are no updates
  // Returns an object with the updates if there are
  // -----
  // Created on Wed Jan 24 2024
  // Updated on Tue Dec 10 2024 - Use new format
  //+-------------------------------------------------
  hasUpdates(app, db) {
    let updates = {}
    let changes = false

    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Update: name
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    updates.name = db?.name || app.name

    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Update: playtime
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (app.playtime_forever > 0 && db?.playtime?.steam !== app.playtime_forever) {
      changes = true
      updates.playtime = {
        from: db?.playtime?.steam,
        to: app.playtime_forever,
      }
    }

    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Update: Last played on steam
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (app.rtime_last_played > 0 && db?.playtime?.steam_last !== app.rtime_last_played) {
      changes = true
      updates.last_played = {
        from: db?.playtime?.steam_last,
        to: app.rtime_last_played,
      }
    }

    return changes ? updates : false
  },

  //+-------------------------------------------------
  // update()
  // takes an app from ddbb and a data object from
  // steam API and assign values to the app
  // -----
  // Created on Wed Apr 10 2024
  // Updated on Tue Dec 17 2024 - Adapted to the new game Object
  //+-------------------------------------------------
  update(app, data) {
    data = data || app.data
    if (!data) console.warn('update() called without data', app)

    app.name = data.name
    app.id.steam = Number(data.appid)

    app.dates.steam_updated_at = dates.stamp()
    app.is.steam = app.is.steam || dates.stamp()

    app.playtime.steam = data.playtime_forever
    app.playtime.steam_last = data.rtime_last_played

    // Flag the item to store
    app.toStore = true

    // delete app.last_played
    // delete app.enabled
    // delete app.appid
    // delete app.data

    return app
  },

  //+-------------------------------------------------
  // updateAchievements()
  // Updates the achievements array with the new data
  // -----
  // Created on Thu Feb 27 2025
  //+-------------------------------------------------
  updateAchievements(app, data) {
    let achievements = structuredClone(app.achievements || [])
    if (!data || !data.length) return achievements
    debugger

    data.forEach((ach) => {
      const isUnlocked = ach.achieved > 0
      const achvStatus = {
        status: isUnlocked ? 'unlocked' : 'locked',
        steam: isUnlocked ? ach.unlocktime : null,
      }

      // Find existing achievement or create a new one
      let item = achievements.find((a) => a.steam_key === ach.apiname)

      // Update existing achievement
      if (item) {
        if (isUnlocked) {
          item.is = item.is || {}
          item.is.steam = achvStatus.steam
          item.is.status = achvStatus.status
        }

        // Create new achievement
      } else {
        const newAchievement = {
          name: ach.name,
          steam_key: ach.apiname,
          description: ach.description,
        }

        // Only add the steam unlock time if it's unlocked
        if (isUnlocked) {
          newAchievement.is = achvStatus
        }

        achievements.push(newAchievement)
      }
    })

    return achievements
  },

  // //+-------------------------------------------------
  // // getSteamBacklog()
  // //
  // // -----
  // // Created on Mon Feb 12 2024
  // //+-------------------------------------------------
  // async getSteamBacklog() {
  //   let url = 'https://api.backlog.rip/fetch/steam-backlog'
  //   let xhr = await $axios.get(url + '?steamid=' + $account.steam)

  //   if (xhr.data.status == 'success') {
  //     return xhr.data?.fetch || {}
  //   }
  // },

  // //+-------------------------------------------------
  // // onScan()
  // // hook fired on the scan step.
  // // Receives data and instance
  // // -----
  // // Created on Mon Feb 12 2024
  // //+-------------------------------------------------
  // async onScan(data, x) {
  //   data.backlog = await this.getSteamBacklog()
  //   return data.backlog
  // },

  //+-------------------------------------------------
  // linkAccount()
  // Returns an account object with mapped data
  // -----
  // Created on Tue Nov 26 2024
  //+-------------------------------------------------
  linkAccount(item, data) {
    item.v = 1
    item.data = data

    item.avatar = data.avatarfull
    item.account = data.steamid
    item.username = data.personaname
    item.updated_at = item.updated_at
    item.created_at = item.created_at || dates.now()

    return item
  },
}

// {
//   appid: 211420,
//   name: 'DARK SOULS™: Prepare To Die Edition',
//   playtime_forever: 1286,
//   img_icon_url: 'a24804c6c8412c8cd9d50efd06bf03fa58ff80a9',
//   has_community_visible_stats: true,
//   playtime_windows_forever: 0,
//   playtime_mac_forever: 0,
//   playtime_linux_forever: 0,
//   rtime_last_played: 1418686838,
//   sort_as: 'Dark Souls',
//   has_workshop: false,
//   has_market: false,
//   will_import: true,
//   will_ignore: false,
//   has_dlc: true,
//   playtime_disconnected: 0,
// }
