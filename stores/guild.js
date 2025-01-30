/*
 * @file:    \stores\guild.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 9th November 2024
 * Modified: Thu 30 January 2025 - 14:19:53
 */

let $nuxt = null
let $user = null

export const useGuildStore = defineStore('guild', {
  state: () => ({
    // profile: {
    //   disabled: null,

    //   username: null,
    //   avatar: null,
    //   games: null,
    //   slug: null,
    // },

    _community: [],
    loaded: [],
  }),

  getters: {
    profile() {
      return $user.guild ?? {}
    },

    community() {
      if (this._community.length == 0) this.getCommunity()
      return this._community
    },
  },

  actions: {
    setTime(time) {
      this.stats[time] = performance.now()

      if (time !== 'start') return
      this.stats.end = 0
      this.stats.api_end = 0
      this.stats.api_start = 0
    },

    //+-------------------------------------------------
    // setProfile()
    // Set a value in the profile.
    // And checks-in the user if the value is changed
    // -----
    // Created on Fri Dec 27 2024
    //+-------------------------------------------------
    async setProfile(field, value) {
      // let current = this.profile[field]
      // if (current == value) return

      await delay(300)
      this.ping()
    },

    //+-------------------------------------------------
    // build()
    // Makes a new profile object
    // and returns if the object is diff or stale
    // -----
    // Created on Tue Jan 28 2025
    //+-------------------------------------------------
    build() {
      let profile = {
        uuid: 'guild',

        disabled: !($user.config.guild ?? true),
        games: $nuxt.$app.count.library,

        slug: $user.me?.slug,
        avatar: $user.me?.avatar,
        username: $user.me?.username,

        ping_at: dates.now(),
      }

      // Compare the objects for changes
      let data1 = helpers.sortedStringify(profile, ['ping_at'])
      let data2 = helpers.sortedStringify(this.profile, ['ping_at'])

      // Check if the object is stale (6h)
      let stale = $nuxt.$dayjs().diff($nuxt.$dayjs(this.profile?.ping_at), 'hours') > 6

      return {
        data: profile,
        stale: stale,
        updated: stale || data1 !== data2,
      }
    },

    //+-------------------------------------------------
    // ping()
    // Check-in the user in the community. This is used to
    // track the user's activity and library
    // -----
    // Created on Wed Dec 18 2024
    //+-------------------------------------------------
    async ping() {
      let profile = this.build()

      if (!$user.hasApi) return
      if (!profile.updated) return
      if (profile.data.disabled) return

      const xhr = await $nuxt.$axios.post(`/ping`, profile.data)

      if (xhr?.status === 200 && xhr?.data) {
        log(`[Guild] checked in`)

        if (xhr.data?.user?.slug) $user.me.slug = xhr.data.user.slug
        if (xhr.data?.user?.username) $user.me.username = xhr.data.user.username
        // if (xhr.data.user.avatar) $user.avatar = xhr.data.user.avatar

        // NOTE: Here we probably need to updateAccount
        await $nuxt.$db.account.put(profile.data)
      }
    },

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Wed Dec 18 2024
    //+-------------------------------------------------
    async getCommunity() {
      if (this.loaded.includes('community')) return this.community

      const xhr = await $nuxt.$axios.get(`/community`)
      if (xhr.status) this._community = xhr.data

      log(`[Guild] loaded community`)
      this.loaded.push('community.json')

      return xhr.data
    },

    //+-------------------------------------------------
    // init()
    // Initializes the guild store
    // -----
    // Created on Thu Sep 26 2024
    //+-------------------------------------------------
    init(ping = false) {
      $nuxt ??= useNuxtApp()
      $user ??= useUserStore()

      if (ping) this.ping()
      if (window) window.$guild = this
    },
  },
})

//+-------------------------------------------------
//| 🔃 HMR
//| https://pinia.vuejs.org/cookbook/hot-module-replacement.html
//+-------------------------------------------------
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGuildStore, import.meta.hot))
}
