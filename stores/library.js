/*
 * @file:    \stores\library.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 9th November 2024
 * Modified: Wed 19 March 2025 - 16:06:09
 */

let $nuxt = null

import steam from '~/modules/importers/steam'
import steamBacklog from '~/modules/importers/steam-backlog'

// Available integration modules
const INTEGRATIONS = ['steam', 'steamBacklog']

export const useLibraryStore = defineStore('library', {
  state: () => ({
    linked: {},
    module: {},
    integrations: INTEGRATIONS,

    base: {
      data: {},
      games: 0,
      avatar: null,
      account: null,
      username: null,
      created_at: null,
      updated_at: null,
    },
  }),

  getters: {
    // WIP -> change for steamModule ??
    steam: (state) => state.module.steam,
  },

  actions: {
    //+-------------------------------------------------
    // connect()
    // Connects modules with their respective links
    // Appends the bearer token from the user to enable API calls
    // -----
    // Created on Wed Feb 26 2025
    //+-------------------------------------------------
    connect(modules) {
      modules.forEach((module) => {
        const account = this.linked[module]
        if (!account) return

        account.bearer = $nuxt.$auth.user.bearer

        if (this.module[module]?.connect) {
          this.module[module].connect(account)
        }
      })
    },

    //+-------------------------------------------------
    // autoLinkAccounts()
    // Automatically links existing credentials from auth providers
    // -----
    // Created on Tue Nov 26 2024
    //+-------------------------------------------------
    autoLinkAccounts() {
      this._autolinkSteam()
      this._autolinkSteamBacklog()
    },

    _autolinkSteam() {
      const user = $nuxt.$auth.user
      if (!user.steam) return
      if (this.linked.steam) return

      const provider = user.providers.find((p) => p.provider == 'steam')
      if (!provider) {
        console.warn('Steam provider not found')
        return
      }

      this.registerLib('steam', {
        ...provider.data,
      })

      delete $nuxt.$auth.user.steam_data
      delete $nuxt.$auth.user.steam_updated_at
    },

    _autolinkSteamBacklog() {
      const user = $nuxt.$auth.user
      if (!user.steam) return
      if (this.linked.steamBacklog) return

      this.registerLib('steamBacklog', {
        steamid: $nuxt.$auth.user.steam,
      })
    },

    //+-------------------------------------------------
    // registerLib()
    // Registers a platform with account data
    // Registering means storing the account data into $db
    // -----
    // Created on Tue Nov 26 2024
    //+-------------------------------------------------
    async registerLib(source, value) {
      if (!value) return

      // prettier-ignore
      let item = this.module[source].linkAccount(
        { ...this.base}, value
      )

      item.uuid = 'lib:' + source
      await $nuxt.$db.account.put({
        ...item,
      })

      this.link(source, item)
      log('🔗 Platform linked', source, this.linked)
    },

    //+-------------------------------------------------
    // updateLib()
    // Updates a linked library. Takes values from this.linked
    // -----
    // Created on Tue Mar 11 2025
    //+-------------------------------------------------
    async updateLib(source) {
      const data = JSON.parse(JSON.stringify(this.linked[source]))
      delete data.manifest
      await $nuxt.$db.account.put({
        ...data,
      })
    },

    //+-------------------------------------------------
    // link()
    // Links a $db library to their module into this.linked
    // This is the main object used by the app
    // -----
    // Created on Sat Mar 08 2025
    //+-------------------------------------------------
    link(source, data) {
      data.uuid = 'lib:' + source
      data.manifest = this.module[source].manifest

      // Dynamic fields on Steam Backlog
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (source == 'steamBacklog') {
        data.avatar = this.linked.steam.avatar
        data.username = this.linked.steam.username
      }

      this.linked[source] = data
    },

    //+-------------------------------------------------
    // isLinked()
    // Returns true if the platform is linked
    // -----
    // Created on Wed Nov 27 2024
    //+-------------------------------------------------
    isLinked(source) {
      return this.linked[source] != null
    },

    //+-------------------------------------------------
    // loadRegisteredPlatforms()
    // Loads registered platforms from database
    // This "accounts" are not loaded on user store because
    // They are specific to the library modules.
    // -----
    // Created on Tue Nov 26 2024
    //+-------------------------------------------------
    async loadRegisteredPlatforms() {
      if (this.loaded) return
      this.loaded = true

      // Only load active integrations
      const activeIntegrations = this.integrations.filter((source) => this.module[source])

      await Promise.all(
        activeIntegrations.map(async (source) => {
          const db = await $nuxt.$db.account.get('lib:' + source)
          if (!db) return

          this.link(source, db)
        })
      )

      // WIP improve this
      // log(
      //   '🧩 Libraries loaded',
      //   `${Object.keys(this.linked).length} platforms`,
      //   this.linked
      // )
    },

    //+-------------------------------------------------
    // loadModules()
    // Loads integration module implementations
    // -----
    // Created on Tue Nov 26 2024
    //+-------------------------------------------------
    async loadModules() {
      this.module.steam = steam
      this.module.steamBacklog = steamBacklog
    },

    //+-------------------------------------------------
    // init()
    // Initializes the library store
    // -----
    // Created on Tue Nov 26 2024
    //+-------------------------------------------------
    async init() {
      $nuxt ??= useNuxtApp()

      await this.loadModules()
      await this.loadRegisteredPlatforms()

      this.autoLinkAccounts()
      this.connect(['steam'])

      if (window)
        window.$library = {
          x: this,
          l: this.linked,
        }
    },
  },
})

//+-------------------------------------------------
//| 🔃 HMR
//| https://pinia.vuejs.org/cookbook/hot-module-replacement.html
//+-------------------------------------------------
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLibraryStore, import.meta.hot))
}
