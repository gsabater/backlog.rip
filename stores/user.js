/*
 * @file:    \stores\UserStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 18th November 2023
 * Modified: 24th November 2025 - 05:33:43
 */

let $db = null
let $log = null
let $nuxt = null
let $cloud = null
let $library = null

//+-------------------------------------------------
// User auth and flow
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// - User account data is created on first visit
// - Data and configuration can live offline on localDB
// - On page load, call authenticate()
// > - $auth.user.me -- $db.account.get('me')

// > - $auth.user.config -- $db.config.toArray()
// > - $auth.user.cloud -- $db.account.get('cloud')
// > - $auth.user.guild -- $db.account.get('guild')

// > - $auth.user.jwt from $db.account.cloud.jwt
// > - $auth.user.bearer from $db.account.me.bearer
//+-------------------------------------------------

export const useUserStore = defineStore('user', {
  state: () => ({
    user: { username: 'John Doe' },

    jwt: null, // JWT token to sync data with the cloud
    bearer: null, // Determines if the user is logged in with the API

    me: {},
    api: {},
    cloud: {},
    guild: {},
    config: {},

    is: {
      cloud: false,
      logged: false,
      checked: false,
    },

    redirectTo: null,
  }),

  actions: {
    //+-------------------------------------------------
    // authenticate()
    // Loads current user from local database
    // If required, loads cloud credentials from API
    // -----
    // Created on Wed Mar 22 2023
    // Updated on Wed Dec 13 2023
    // Updated on Fri Aug 02 2024 - Call cloud connect
    //+-------------------------------------------------
    async authenticate() {
      if (this.user?.uuid) return this.user

      await this.loadMe()
      await this.getApiData()

      this.user = { ...this.api, ...this.me }

      $log(`[ User ] Loaded ${this.user.username}`)
      console.debug('User', this.user)
      console.debug('Config', this.config)

      this.is.checked = true
      if (this.bearer) this.is.logged = true

      $mitt.emit('user:ready')
    },

    //+-------------------------------------------------
    // loadMe()
    // Gets the local "account" database
    // -----
    // Created on Fri Nov 17 2023
    // Updated on Thu Aug 15 2024 - load cloud account
    // Updated on Tue Jan 28 2025 - load guild profile
    //+-------------------------------------------------
    async loadMe() {
      this.me = (await $db.account.get('me')) || {}
      this.cloud = (await $db.account.get('cloud')) || {}
      this.guild = (await $db.account.get('guild')) || {}

      this.setJWT(this.cloud?.jwt)
      this.setBearer(this.me?.bearer)

      let config = await $db.config.toArray()
      let _config = config.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {})

      this.config = _config
    },

    //+-------------------------------------------------
    // getApiData()
    // Gets the userdata from api.backlog.rip
    // -----
    // Created on Fri Nov 17 2023
    // Updated on Thu Aug 01 2024 - Update Cloud data
    //+-------------------------------------------------
    async getApiData() {
      if (!this.bearer) return
      if (this.bearer && this.jwt) return

      try {
        const xhr = await $nuxt.$axios.get('me')

        if (xhr?.status === 200 && xhr?.data) {
          this.api = xhr.data
          let provider = xhr.data.providers.find((p) => p.provider === 'steam')

          // Assign account/user data
          this.me.steam = xhr.data.steam || this.me.steam
          this.me.avatar = this.me.avatar || xhr.data.avatar

          // Assign cloud data
          this.cloud.jwt = xhr.data.jwt
          this.cloud.sub = xhr.data.uuid
          this.setJWT(this.cloud?.jwt)

          // prettier-ignore
          this.me.username = (this.me.username == 'Traveler')
            ? xhr.data.username
            : this.me.username

          $log('[User] Userdata from API', xhr.data)
        }
      } catch (e) {
        debugger
        console.warn(e)
        return e.response
      }
    },

    //+-------------------------------------------------
    // setBearer()
    // Sets the token value and configures axios
    // -----
    // Created on Mon Nov 20 2023
    // Updated on Fri Dec 29 2023 - Dont use cookies anymore
    //+-------------------------------------------------
    async setBearer(token = false) {
      if (!token) return
      const { $axios } = this.$nuxt

      this.bearer = token
      this.me.bearer = token

      $axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    },

    //+-------------------------------------------------
    // setJWT()
    // Sets the JWT token for cloud sync
    // -----
    // Created on Tue Jul 30 2024
    //+-------------------------------------------------
    async setJWT(token = false) {
      if (!token) return
      $cloud ??= useBackupStore()

      this.jwt = token
      this.cloud.jwt = token
    },

    //+-------------------------------------------------
    // generateJWT()
    // Requests a new JWT from the API
    // Stores on the user and reinitializes the supabase client
    // -----
    // Created on Mon Sep 29 2025
    //+-------------------------------------------------
    async generateJWT() {
      const xhr = await $nuxt.$axios.get('generateJWT')
      let jwt = xhr?.data?.jwt

      if (xhr?.status === 200 && jwt) {
        $log('🔑 New JWT generated')

        this.setJWT(jwt)
        await this.putAccount(this.cloud, 'cloud')
        $nuxt.$mitt.emit('notification:show', {
          mode: 'dialog',
          title: 'A new session token has been generated',
          message:
            'Your session token expired and a new one has been generated automatically. You should reload the page to ensure proper functionality.',
        })
      }
    },

    //+-------------------------------------------------
    // register()
    // Stores the user data after the first login
    // -----
    // Created on Sat Jun 29 2024
    // Updated on Thu Aug 01 2024 - Store cloud credentials
    //+-------------------------------------------------
    async register() {
      await this.putAccount(this.me, 'me')
      await this.putAccount(this.cloud, 'cloud')

      this.user = { ...this.api, ...this.me }

      $log(`[ User ] Registered user ${this.user.username}`)
      console.debug('User', this.user)
      console.debug('Config', this.config)

      this.is.checked = true
      if (this.bearer) this.is.logged = true
    },

    //+-------------------------------------------------
    // update()
    // serves as a common entry point to update any account
    // Accounts are rows under $db.account (me, cloud, guild, lib:xxx)
    // based on the field, the update is performed with one or another method
    // -----
    // Created on Fri Dec 27 2024
    //+-------------------------------------------------
    async update(field, value) {
      const me = ['slug', 'username']
      const guild = ['guild', 'slug', 'username']
      const config = ['guild', 'debug', 'two']

      if (me.includes(field)) {
        this.updateMe(field)
      }
    },

    //+-------------------------------------------------
    // putAccount()
    // Writes an account object to the database
    // Use updateMe() to update a single field instead
    // -----
    // Created on Mon Aug 19 2024
    //+-------------------------------------------------
    putAccount(json, uuid) {
      let data = JSON.parse(JSON.stringify(json))
      return $db.account.put({
        ...data,
        uuid,
        updated_at: dates.now(),
      })
    },

    //+-------------------------------------------------
    // updateMe()
    // updates an account row a single field at a time
    // To ensure integrity, the account is loaded from the database first
    // -----
    // Created on Fri Dec 29 2023
    // Updated on Mon Aug 26 2024 - Integrate with cloud
    // Updated on Thu Mar 13 2025 - Replaced cloud with an event
    //+-------------------------------------------------
    async updateMe(field = null) {
      if (!field) return
      $log(`[User] Update $db.account.me.${field}`)
      console.debug(`↪ ${JSON.stringify(this.me[field])}`)

      let account = await $db.account.get('me')
      let data = { ...account }

      if (field) data[field] = this.me[field]
      if (this.user[field]) this.user[field] = this.me[field]
      // this.user = { ...this.api, ...this.me }

      $db.account.put(data)
      $nuxt.$mitt.emit('account:updated', {
        account: 'me',
        field,
        value: this.me[field],
      })
    },

    //+-------------------------------------------------
    // setConfig()
    // Updates $config store and this.config data
    // -----
    // Created on Sun Feb 18 2024
    // Created on Thu Mar 13 2025 - Emit an event
    //+-------------------------------------------------
    async setConfig(field) {
      if (!field) return

      let value = JSON.parse(JSON.stringify(this.config[field]))

      $log(`Update $db.config.${field}`)
      console.debug(`↪ ${JSON.stringify(value)}`)

      await $db.config.put({
        key: field,
        value,
      })

      if (field == 'debug') {
        $nuxt.$app.dev = value
      }

      // if (field !== 'cloud') await $cloud.update('account')
      $nuxt.$mitt.emit('config:updated', {
        field,
        value: this.config[field],
      })
    },

    //+-------------------------------------------------
    // isCronDue()
    // Checks if a cron job is due to run based on the interval
    // -----
    // Created on Thu Oct 10 2025
    //+-------------------------------------------------
    isCronDue(key, interval) {
      const lastRun = this.cron[key]
      if (!lastRun) return true

      return dates.isDue(lastRun, interval, 'hours')
    },

    //+-------------------------------------------------
    // updateCron()
    // Updates a cron timestamp and saves to config
    // -----
    // Created on Thu Oct 10 2025
    //+-------------------------------------------------
    async updateCron(cronKey) {
      if (!this.config.cron) {
        this.config.cron = {}
      }

      this.config.cron[cronKey] = dates.stamp()
      await this.setConfig('cron')
    },

    //+-------------------------------------------------
    // init()
    // Assign references
    // -----
    // Created on Tue Sep 30 2025
    //+-------------------------------------------------
    async init() {
      $nuxt ??= useNuxtApp()

      $log ??= $nuxt.$log
      $db ??= $nuxt.$db

      $cloud ??= useBackupStore()
      $library ??= useLibraryStore()
    },
  },

  getters: {
    //+-------------------------------------------------
    // cron()
    // Getter for the cron object
    //+-------------------------------------------------
    cron() {
      return this.config.cron || {}
    },

    //+-------------------------------------------------
    // menu()
    // Getter for the menu object
    //+-------------------------------------------------
    menu() {
      let menu = this.config.menu || {}
      menu.pinned = this.config.pinned
      menu.favorites = this.config.favorites

      return menu
    },

    //+-------------------------------------------------
    // hasApi()
    // Getter to check if the user has a Bearer token
    // -----
    // Created on Thu Jan 30 2025
    //+-------------------------------------------------
    hasApi() {
      return !!this.bearer
    },

    //+-------------------------------------------------
    // hasPassport()
    // Getter to check if the user has a JWT for Supabase
    // -----
    // Created on Thu Jan 30 2025
    //+-------------------------------------------------
    hasPassport() {
      return !!this.jwt
    },

    //+-------------------------------------------------
    // hasCloud()
    // Getter to check if the user has cloud connected and enabled
    // -----
    // Created on Thu Jan 30 2025
    //+-------------------------------------------------
    hasCloud() {
      return this.config?.cloud && this.cloud?.sub
    },

    latestLibraryUpdate() {
      let backlog = this.user?.lib_backlog_updated_at
      let steamBacklog = this.user?.lib_steamBacklog_updated_at
      debugger

      return Math.max(backlog || 0, steamBacklog || 0)
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
