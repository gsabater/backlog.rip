/**
 * @project: backlog.rip
 * @file:    \modules\importers\steam-public.js
 * @desc:    Utility helper to make requests to and return a list of games
 * -------------------------------------------
 * Created Date: 27th November 2022
 * Modified: Mon Mar 13 2023
 **/

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

let $log = null
let $axios = null
let $account = null

export default {
  //+-------------------------------------------------
  // Module manifest
  // ---
  // This manifest is used to describe the module
  // and its capabilities to the importer plugin
  //+-------------------------------------------------

  manifest: {
    version: '1.1',
    name: 'Steam importer',
    author: 'Gaspar S.',

    store: 'Steam',
    source: 'steam',

    description:
      'Import all your games and playtime for every game on your library, including free games.',

    games: true,
    account: true,
    wishlist: false,

    requeriments: [
      {
        name: 'User has a public profile',
        description: 'Check if the user has a public profile',
      },
    ],
  },

  //+-------------------------------------------------
  // connect()
  // Registers the importer script with the vue instance
  // This allows the script to access the vue methods
  // Methods available are setStep, log, onError...
  // -----
  // Created on Tue Nov 29 2022
  //+-------------------------------------------------
  connect(account, axios, log) {
    $log = log
    $axios = axios
    $account = account

    $axios.defaults.headers.common['Authorization'] = 'Bearer ' + account.bearer

    $log('🆗 Connection established')

    return true
  },

  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Methods
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  //+-------------------------------------------------
  // prepareToStore()
  // Gets an app and appends data to it
  // -----
  // Created on Sun Dec 24 2023
  // Updated on Tue Mar 05 2024 - New item properties
  //+-------------------------------------------------
  prepareToStore(app) {
    if (!app.data) console.warn('prepareToStore() called without data', app)

    app.is.dirty = true

    app.is.in = app.is.in || {}
    app.is.in.steam = dates.stamp()

    app.playtime = app.playtime || {}
    app.playtime.steam = app.data.playtime_forever

    app.last_played = app.last_played || {}
    app.last_played.steam = app.data.rtime_last_played

    return app
  },

  //+-------------------------------------------------
  // hasUpdates()
  // Receives a field and compares two objects
  // Returns false if there are no updates
  // Returns an object with the updates if there are
  // -----
  // Created on Wed Jan 24 2024
  //+-------------------------------------------------
  hasUpdates(field, lib, app) {
    // Update: playtime
    //+---------------------------------------
    if (field == 'playtime') {
      if (lib.playtime?.steam !== app.playtime_forever) {
        return {
          from: lib.playtime?.steam,
          to: app.playtime_forever,
        }
      }
    }

    // Update: playtime
    //+---------------------------------------
    if (field == 'last_played') {
      if (lib.last_played?.steam !== app.rtime_last_played) {
        return {
          from: lib.last_played?.steam,
          to: app.rtime_last_played,
        }
      }
    }

    return false
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
    let jxr = await $axios.get(url + '?steamid=' + $account.steam)

    if (jxr.data.status == 'success') {
      return jxr.data?.fetch?.data || {}
    }
  },

  //+-------------------------------------------------
  // getGames()
  // Calls backend to retrieve user games
  // -----
  // Created on Thu Dec 08 2022
  //+-------------------------------------------------
  async getGames() {
    let url = 'https://api.backlog.rip/fetch/steam/games'
    let jxr = await $axios.get(url + '?steamid=' + $account.steam)

    if (jxr.data.status == 'success') {
      // xDDDD
      return jxr.data?.fetch?.data?.games || {}
    }
  },

  //+-------------------------------------------------
  // function()
  //
  // -----
  // Created on Mon Feb 12 2024
  //+-------------------------------------------------
  async getSteamBacklog() {
    let url = 'https://api.backlog.rip/fetch/steam-backlog'
    let jxr = await $axios.get(url + '?steamid=' + $account.steam)

    if (jxr.data.status == 'success') {
      return jxr.data?.fetch || {}
    }
  },

  //+-------------------------------------------------
  // onScan()
  // hook fired on the scan step.
  // Receives data and instance
  // -----
  // Created on Mon Feb 12 2024
  //+-------------------------------------------------
  async onScan(data, x) {
    data.backlog = await this.getSteamBacklog()
    return data.backlog
  },
}
