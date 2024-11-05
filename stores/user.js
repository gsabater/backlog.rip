/*
 * @file:    \stores\UserStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 18th November 2023
 * Modified: Thu 24 October 2024 - 15:01:09
 */

let $nuxt = null
let $cloud = null

//+-------------------------------------------------
// User auth and flow
// ~~~~~~~~~~~~~~~~~~
// - Anonymous user is created on first load
// - The user data and configuration can live on localDB
// - On page load, call authenticate()
// > - $auth.user.config from $db.config
// > - $auth.user.me from $db.account.get('me')
// > - $auth.user.cloud from $db.account.get('cloud')
//
// > - $auth.user.bearer from $db.account.me.bearer
// > - $auth.user.jwt from $db.account.cloud.jwt
//+-------------------------------------------------

export const useUserStore = defineStore('user', {
  state: () => ({
    user: { username: 'Traveler' },

    jwt: null, // JWT token to sync data with the cloud
    bearer: null, // Determines if the user is logged in with the API

    me: {},
    api: {},
    cloud: {},
    config: {},

    is: {
      guest: false,
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

      if (!$nuxt) $nuxt = useNuxtApp()
      if (!$cloud) $cloud = useCloudStore()

      await this.loadMe()
      await this.getApiData()

      this.user = { ...this.api, ...this.me }
      log('🥸 User logged in as ' + this.user.username, this.user)

      this.is.checked = true
      // if (this.jwt) this.is.cloud = true -- replaced by user.has_cloud
      if (this.bearer) this.is.logged = true

      return true
    },

    //+-------------------------------------------------
    // loadMe()
    // Gets the local "account" database
    // -----
    // Created on Fri Nov 17 2023
    // Updated on Thu Aug 15 2024 - load cloud data
    //+-------------------------------------------------
    async loadMe() {
      let config = await $nuxt.$db.config.toArray()

      this.me = (await $nuxt.$db.account.get('me')) || {}
      this.cloud = (await $nuxt.$db.account.get('cloud')) || {}

      this.setBearer(this.me?.bearer)
      this.setJWT(this.cloud?.jwt)

      // prettier-ignore
      let _config = config.reduce((acc, row) =>
        ({ ...acc, [row.key]: row.value }),
        {})

      this.config = _config
    },

    //+-------------------------------------------------
    // getApiData()
    // Gets the userdata from the API
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

          this.me.steam = xhr.data.steam || this.me.steam
          this.me.avatar = this.me.avatar || xhr.data.avatar
          this.me.steam_data = provider?.data || null
          // this.me.steam_updated_at = provider.updated_at

          this.cloud.jwt = xhr.data.jwt
          this.cloud.sub = xhr.data.uuid
          this.setJWT(this.cloud?.jwt)

          // prettier-ignore
          this.me.username = (this.me.username == 'Traveler')
            ? xhr.data.username
            : this.me.username

          log('🧭 Userdata from API', xhr.data)

          // Try to persist the user data
          // and avoid the need to login again
          await this.register()

          // Connect to the cloud if the user has it enabled
          if (this.config.cloud && $cloud.is == 'local') $cloud.connect()
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

      this.bearer = token
      this.me.bearer = token

      $nuxt.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    },

    //+-------------------------------------------------
    // setJWT()
    // Sets the JWT token for cloud sync
    // -----
    // Created on Tue Jul 30 2024
    //+-------------------------------------------------
    async setJWT(token = false) {
      if (!token) return
      if (!$cloud) $cloud = useCloudStore()

      this.jwt = token
      this.cloud.jwt = token
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
    },

    //+-------------------------------------------------
    // putAccount()
    // Writes an account object to the database
    // Use updateAccount() to update a single field instead
    // -----
    // Created on Mon Aug 19 2024
    //+-------------------------------------------------
    putAccount(json, uuid) {
      let data = JSON.parse(JSON.stringify(json))
      return $nuxt.$db.account.put({
        ...data,
        uuid,
        updated_at: dates.now(),
      })
    },

    //+-------------------------------------------------
    // updateAccount()
    // updates $account store and this.me data
    // -----
    // Created on Fri Dec 29 2023
    // Created on Mon Aug 26 2024 - Integrate with cloud
    //+-------------------------------------------------
    async updateAccount(field = null) {
      let account = await $nuxt.$db.account.get('me')

      let data = { ...account }
      if (field) data[field] = this.me[field]
      this.user = { ...this.api, ...this.me }

      await $cloud.update('account')
      await $nuxt.$db.account.put(data)
    },

    //+-------------------------------------------------
    // storeConfig()
    // Updates $config store and this.config data
    // -----
    // Created on Sun Feb 18 2024
    //+-------------------------------------------------
    async storeConfig(field) {
      let value = JSON.parse(JSON.stringify(this.config[field]))
      await $nuxt.$db.config.put({
        key: field,
        value: value,
      })

      $nuxt.$app.dev = this.config.debug
      if (field !== 'cloud') await $cloud.update('account')
    },
  },

  getters: {
    //+-------------------------------------------------
    // menu()
    // Getter for the menu object
    // -----
    // Created on Fri Jul 19 2024
    //+-------------------------------------------------
    menu() {
      let menu = this.config.menu || {}
      menu.pinned = this.config.pinned
      menu.favorites = this.config.favorites

      return menu
    },

    //+-------------------------------------------------
    // canUpdateSteamLibrary()
    // Returns true if the user is a guest
    // NOTE: We set 1h of cooldown while we test the feature
    // -----
    // Created on Sat Jun 29 2024
    //+-------------------------------------------------
    canUpdateSteamLibrary() {
      return true
      let last_sync = this.user.steam_updated_at
      if (!last_sync) return true

      return dates.hoursAgo(last_sync) > 24
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
