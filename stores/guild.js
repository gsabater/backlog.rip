/*
 * @file:    \stores\guild.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 9th November 2024
 * Modified: Mon 30 December 2024 - 16:04:18
 */

let $nuxt = null
let $user = null

export const useGuildStore = defineStore('guild', {
  state: () => ({
    profile: {
      disabled: null,

      username: null,
      avatar: null,
      games: null,
      slug: null,
    },

    _community: [],

    loaded: [],
  }),

  getters: {
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
      this.checkIn()
    },

    //+-------------------------------------------------
    // checkIn()
    // Check-in the user in the community. This is used to
    // track the user's activity and library
    // -----
    // Created on Wed Dec 18 2024
    //+-------------------------------------------------
    async checkIn() {
      const xhr = await $nuxt.$axios.post(`/check-in`, {
        disabled: !($user.config.guild ?? true),
        games: $nuxt.$app.count.library,

        username: $user.user?.username,
        avatar: $user.user?.avatar,
        slug: $user.user?.slug,
      })

      if (xhr?.status === 200 && xhr?.data) {
        log(`[Guild] checked in`)

        if (xhr.data?.user?.slug) $user.me.slug = xhr.data.user.slug
        if (xhr.data?.user?.username) $user.me.username = xhr.data.user.username
        // if (xhr.data.user.avatar) $user.avatar = xhr.data.user.avatar

        // NOTE: Here we probably need to updateAccount
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
    init() {
      $nuxt ??= useNuxtApp()
      $user ??= useUserStore()

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
