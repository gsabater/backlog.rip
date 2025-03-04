/*
 * @file:    \stores\library.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 9th November 2024
 * Modified: Thu 27 February 2025 - 23:25:28
 */

let $nuxt = null

import steam from '~/modules/importers/steam'
import steamBacklog from '~/modules/importers/steam-backlog'

export const useLibraryStore = defineStore('library', {
  state: () => ({
    linked: {},
    module: {},
    integrations: ['steam', 'steamBacklog'],

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
    // Connects the module with its link (lib:[module])
    // Also appends the bearer from the user to enable API calls
    // -----
    // Created on Wed Feb 26 2025
    //+-------------------------------------------------
    connect(modules) {
      modules.forEach((module) => {
        let account = this.linked[module]
        account.bearer = $nuxt.$auth.user.bearer

        if (this.module[module].connect) {
          this.module[module].connect(account)
        }
      })
    },

    //+-------------------------------------------------
    // autoLink()
    // Quick method to autolink existing credentials
    // -----
    // Created on Tue Nov 26 2024
    //+-------------------------------------------------
    autoLink() {
      // Autolink Steam
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (
        $nuxt.$auth.user.steam &&
        (!this.linked.steam?.v || this.module.steam.manifest.v > this.linked.steam.v)
      ) {
        let provider = $nuxt.$auth.user.providers.find((p) => p.provider == 'steam')

        this.link('steam', {
          ...provider.data,
          updated_at: $nuxt.$auth.user.steam_updated_at,
        })

        delete $nuxt.$auth.user.steam_data
        delete $nuxt.$auth.user.steam_updated_at
      }

      // Autolink Steam Backlog
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (
        $nuxt.$auth.user.steam &&
        (!this.linked.steamBacklog?.v ||
          this.module.steamBacklog.manifest.v > this.linked.steamBacklog.v)
      ) {
        this.link('steamBacklog', {
          steamid: $nuxt.$auth.user.steam,
        })
      }
    },

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Tue Nov 26 2024
    //+-------------------------------------------------
    // WIP -> change to bind() ?? and linked to link[]
    async link(source, data) {
      if (!data) return

      // await $nuxt.$db.account.put({
      //   uuid: 'lib:' + source,
      //   ...data,
      // })

      // prettier-ignore
      let item = this.module[source].linkAccount({
        ...this.base}, data)

      this.linked[source] = item
      await $nuxt.$db.account.put({
        uuid: 'lib:' + source,
        ...item,
      })

      log('🔗 Platform linked', source, this.linked)
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
    // configure()
    // Load the library configuration values from $db
    // This "accounts" are not loaded on user store because
    // They are specific to the library modules.
    // -----
    // Created on Tue Nov 26 2024
    //+-------------------------------------------------
    async configure() {
      if (this.loaded) return
      this.loaded = true

      await Promise.all(
        Object.keys(this.module).map(async (source) => {
          let db = await $nuxt.$db.account.get('lib:' + source)
          if (!db) return

          if (source == 'steamBacklog' && this.linked.steam) {
            db.avatar = this.linked.steam.avatar
            db.username = this.linked.steam.username
          }

          this.linked[source] = db
        })
      )

      log(
        '🧩 Libraries loaded',
        `${Object.keys(this.linked).length} platforms`,
        this.linked
      )
    },

    //+-------------------------------------------------
    // load()
    // Assign module instances to this store
    // -----
    // Created on Tue Nov 26 2024
    //+-------------------------------------------------
    async load() {
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

      await this.load()
      await this.configure()

      this.autoLink()
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
