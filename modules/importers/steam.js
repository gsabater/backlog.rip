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
  manifest: {
    version: '1.0',
    store: 'Steam',
    name: 'Steam public profiles',
    author: 'Gaspar S.',

    description:
      'This tool will import all your games and playtime for every game on your library, including free games.',

    games: true,
    account: true,
    wishlist: false,

    does: ['Your Steam library'],
    doesnot: [],

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

  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Methods
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  //+-------------------------------------------------
  // prepareToStore()
  // Gets an app and appends data to it
  // -----
  // Created on Sun Dec 24 2023
  //+-------------------------------------------------
  prepareToStore(app) {
    let data = app.data
    app.playtime.steam = data.playtime_forever
    app.last_played.steam = data.rtime_last_played
    delete app.data
    return app
  },

  //+-------------------------------------------------
  // getUserdata()
  // Calls backend to retrieve user profile data
  // -----
  // Created on Thu Dec 08 2022
  // Updated on Mon Mar 13 2023
  //+-------------------------------------------------
  async getUserdata() {
    let jxr = await $axios.get(
      'https://api.backlog.rip/fetch/steam/userdata?steamid=' + $account.steam
    )

    if (jxr.data.status == 'success') {
      return jxr.data?.fetch?.data || {}
    }
  },

  async getGames() {
    let jxr = await $axios.get(
      'https://api.backlog.rip/fetch/steam/games?steamid=' + $account.steam
    )

    if (jxr.data.status == 'success') {
      // xDDDD
      return jxr.data?.fetch?.data?.games || {}
    }
  },

  getWishlist() {
    return 333
  },
}
