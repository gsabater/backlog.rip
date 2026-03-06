/*
 * @file:    /stores/community.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 27th December 2025
 * Modified: 6th March 2026 - 13:01:13
 */

import supabaseService from '../services/supabaseService'

let users = []

let lists = {
  popular: [],
  created: [],
  updated: [],
}

let $log = null
let $nuxt = null
let $user = null

export const useCommunityStore = defineStore('community', {
  state: () => ({
    loaded: [],

    // Getter flags
    // Those flags are set when the community is loaded
    // triggering the getter again and returning the data
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    getLists: false,
    getNewLists: false,
    getCreatedLists: false,
    getUpdatedLists: false,

    getUsers: false,
  }),

  getters: {
    popularLists() {
      return [1, 2, 3, 4, 5]
    },

    //+-------------------------------------------------
    // newLists()
    // Lazy loads recently created lists
    // -----
    // Created on Mon Dec 29 2025
    //+-------------------------------------------------
    newLists() {
      if (!this.getCreatedLists) this.loadLists('created')
      return lists.created
    },

    //+-------------------------------------------------
    // function()
    // Lazy loads recently updated lists
    // -----
    // Created on Thu Jan 22 2026
    //+-------------------------------------------------
    updatedLists() {
      if (!this.getUpdatedLists) this.loadLists('updated')
      return lists.updated
    },
  },

  actions: {
    //+-------------------------------------------------
    // loadLists()
    //
    // -----
    // Created on Mon Dec 29 2025
    //+-------------------------------------------------
    async loadLists(type) {
      if (!this.$nuxt.$app.ready) return []
      if (this.loaded.includes(type)) return null

      this.loaded.push(type)

      let data = null
      if (type === 'created') data = await supabaseService.getNewLists()
      if (type === 'updated') data = await supabaseService.getUpdatedLists()

      lists[type] = data || []
      this[`get${helpers.capitalize(type)}Lists`] = true
    },

    //+-------------------------------------------------
    // ping()
    // Check-in the user in the community. This is used to
    // track the user's activity and library
    // -----
    // Created on Wed Dec 18 2024
    //+-------------------------------------------------
    async ping() {
      let profile = this.profileData()
      if (!$user.hasApi) return
      if (!profile.hasChanges) return
      if (profile.data.disabled) return
      const xhr = await $nuxt.$axios.post(`/ping`, profile.data)
      if (xhr?.status === 200 && xhr?.data) {
        $log(`[ Community ] checked in`)
        if (xhr.data?.user?.slug) $user.me.slug = xhr.data.user.slug
        if (xhr.data?.user?.username) $user.me.username = xhr.data.user.username
        // if (xhr.data.user.avatar) $user.avatar = xhr.data.user.avatar
        // NOTE: Here we probably need to updateAccount
        await $nuxt.$db.account.put(profile.data)
      }
    },

    //+-------------------------------------------------
    // profileData()
    // Makes a profile object
    // -----
    // Created on Tue Jan 28 2025
    //+-------------------------------------------------
    profileData() {
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
      // Check if the user has recently pinged the community
      // let stale = $nuxt.$dayjs().diff($nuxt.$dayjs(this.profile?.ping_at), 'hours') > 6
      let isDue = dates.isDue(this.profile?.ping_at, 6, 'hours')
      return {
        data: profile,
        isDue: isDue,
        hasChanges: isDue || data1 !== data2,
      }
    },

    //+-------------------------------------------------
    // init()
    // -----
    // Created on Sat Dec 27 2025
    //+-------------------------------------------------
    async init() {
      $nuxt ??= useNuxtApp()
      $log = $nuxt.$log

      $user ??= useUserStore()
    },
  },
})
