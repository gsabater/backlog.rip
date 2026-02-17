/*
 * @file:    \stores\guild.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 9th November 2024
 * Modified: 27th December 2025 - 17:42:03
 */

let $log = null
let $nuxt = null
let $user = null

export const useGuildStore = defineStore('guild', {
  // state: () => ({
  //   _community: [],
  //   loaded: [],
  // }),
  // getters: {
  //   profile() {
  //     return $user.guild ?? {}
  //   },
  //   community() {
  //     if (this._community.length == 0) this.getCommunity()
  //     return this._community
  //   },
  // },
  // actions: {
  //   setTime(time) {
  //     this.stats[time] = performance.now()
  //     if (time !== 'start') return
  //     this.stats.end = 0
  //     this.stats.api_end = 0
  //     this.stats.api_start = 0
  //   },
  //   //+-------------------------------------------------
  //   // setProfile()
  //   // Set a value in the profile.
  //   // And checks-in the user if the value is changed
  //   // -----
  //   // Created on Fri Dec 27 2024
  //   //+-------------------------------------------------
  //   async setProfile(field, value) {
  //     // let current = this.profile[field]
  //     // if (current == value) return
  //     await delay(300)
  //     this.ping()
  //   },
  //   //+-------------------------------------------------
  //   // function()
  //   //
  //   // -----
  //   // Created on Wed Dec 18 2024
  //   //+-------------------------------------------------
  //   async getCommunity() {
  //     if (this.loaded.includes('community')) return this.community
  //     const xhr = await $nuxt.$axios.get(`/community`)
  //     if (xhr.status) this._community = xhr.data
  //     $log(`[Guild] loaded community`)
  //     this.loaded.push('community.json')
  //     return xhr.data
  //   },
  //   //+-------------------------------------------------
  //   // init()
  //   // Initializes the guild store
  //   // -----
  //   // Created on Thu Sep 26 2024
  //   //+-------------------------------------------------
  //   init() {
  //     $nuxt ??= useNuxtApp()
  //     $log = $nuxt.$log
  //     $user ??= useUserStore()
  //   },
  // },
})
