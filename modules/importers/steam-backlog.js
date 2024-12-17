/*
 * @file:    \modules\importers\steam-backlog.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 26th November 2024
 * Modified: Tue 17 December 2024 - 11:36:47
 */

let $log = null
let utils = null
let $axios = null
let $account = null

let states = {
  mapped: false,

  hold: null,
  backlog: null,
  playing: null,
  dropped: null,
  completed: null,
}

export default {
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Module manifest v1.2
  // ---
  // This object is used to define the module
  // and its capabilities to the importer plugin
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  manifest: {
    v: 1,
    ver: '1.0',
    name: 'Steam Backlog integration',
    author: 'Gaspar S.',
    updated_at: '2024-12-17',
    description:
      'Syncronize completion states for every game on your Steam backlog profile',

    source: {
      key: 'steam',
      type: 'website',
      name: 'Steam Backlog',
      logo: '/img/logos/steam-backlog.png',
      // showName: false,
    },

    requires: 'steamID',
    games: true,
    states: true,
    account: false,
    wishlist: false,
    autoupdates: false,

    // Defines that map[0] in remote data,
    // should be map[1] in id object
    map: ['appid', 'steam'],

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
  //+-------------------------------------------------
  connect(account, axios, log, data) {
    $log = log
    utils = data
    $axios = axios
    $account = account

    $axios.defaults.headers.common['Authorization'] = 'Bearer ' + account.bearer
    $log('🆗 Connection established')

    return true
  },

  //+-------------------------------------------------
  // getUserdata()
  //+-------------------------------------------------
  async getUserdata() {
    return {}
  },

  //+-------------------------------------------------
  // getLibrary()
  // Calls backend to retrieve user games
  // Must return an array even if empty
  // -----
  // Created on Thu Dec 08 2022
  //+-------------------------------------------------
  async getLibrary() {
    let url = 'https://api.backlog.rip/fetch/steam-backlog'
    let xhr = await $axios.get(url + '?steamid=' + $account.account)

    if (xhr.data.status == 'success') {
      return xhr.data?.fetch || []
    }
  },

  //+-------------------------------------------------
  // mapStates()
  // Maps the current states from the $db
  // With the states received from Steam Backlog
  // -----
  // Created on Tue Dec 10 2024
  //+-------------------------------------------------
  mapStates() {
    if (states.mapped) return

    const options = {
      hold: ['on-hold', 'hold', 'paused'],
      backlog: ['backlog', 'pending', 'queue'],
      playing: ['playing', 'current', 'active', 'in-progress'],
      dropped: ['dropped', 'abandoned', 'aborted'],
      completed: ['completed', 'complete', 'finished', 'done'],
    }

    Object.entries(options).forEach(([key, variations]) => {
      const state = utils.states.find((s) => variations.includes(s.slug))
      if (state) states[key] = state.id
    })

    states.mapped = true
  },

  //+-------------------------------------------------
  // hasUpdates()
  // Returns false if there are no updates
  // Returns an object with the updates if there are
  // -----
  // Created on Tue Dec 10 2024
  //+-------------------------------------------------
  hasUpdates(app, db) {
    this.mapStates()

    let updates = {}
    let changes = false

    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Update: name
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    updates.name = db?.name || app.name

    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Update: state
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let newState = states[app.state]
    if (app.state && states[app.state] > 0 && db?.state !== newState) {
      changes = true
      updates.state = {
        from: db?.state,
        to: newState,
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
  //+-------------------------------------------------
  update(app, data) {
    data = data || app.data
    if (!data) console.warn('update() called without data', app)

    app.name = data.name
    app.id.steam = Number(data.appid)

    app.date.steambacklog_updated_at = dates.stamp()
    app.is.steam = app.is.steam || dates.stamp()

    if (states[data.state]) app.state = states[data.state]

    // Flag this item as dirty to be saved by datastore
    app.is.dirty = true

    return app
  },

  //+-------------------------------------------------
  // linkAccount()
  // Returns an account object with mapped data
  // -----
  // Created on Tue Nov 26 2024
  //+-------------------------------------------------
  linkAccount(item, data) {
    item.v = 1
    item.data = data

    item.account = data.steamid
    item.updated_at = item.updated_at
    item.created_at = item.created_at || dates.now()

    return item
  },
}
