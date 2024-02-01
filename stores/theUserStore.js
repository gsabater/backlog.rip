/*
 * @file:    \stores\UserStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 18th November 2023
 * Modified: Wed Jan 31 2024
 */

let $nuxt = null

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {},
    bearer: null,

    api: {},
    local: {},
    config: {},

    isLogged: false,
    isChecked: false,
    redirectTo: null,
  }),

  actions: {
    //+-------------------------------------------------
    // authenticate()
    // Loads current user from local database
    // -----
    // Created on Wed Mar 22 2023
    // Updated on Wed Dec 13 2023
    //+-------------------------------------------------
    async authenticate() {
      if (this.user?.uuid) return this.user

      if (!$nuxt) $nuxt = useNuxtApp()

      await this.loadLocalData()
      // await this.getApiData()

      let me = { ...this.api, ...this.local }
      // delete me.settings
      // delete me.providers
      // this.storeAccount(me)

      // me.config = this.config
      this.user = { ...me }

      log('🥸 User is authenticated', this.user)
      if (this.user.username == 'Traveler') log('🥸 Traveler user', this.user)

      this.isChecked = true
      if (this.bearer) this.isLogged = true

      return true
    },

    //+-------------------------------------------------
    // setToken()
    // Loads the bearer token and adds it to pinia and axios
    // -----
    // Created on Mon Nov 20 2023
    // Updated on Fri Dec 29 2023 Dont use cookies anymore
    //+-------------------------------------------------
    async setToken(bearer = false) {
      // if (!bearer) bearer = useCookie('auth._token.local').value
      // else useCookie('auth._token.local').value = bearer
      this.bearer = bearer
      this.local.bearer = bearer

      $nuxt.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + bearer
      return

      this.user.bearer = bearer
      this.local.bearer = bearer

      this.update('local', 'account')

      // Dirty hack to reauthenticate with api
      await this.getApiData()
      this.user.uuid = null
      this.authenticate()
    },

    //+-------------------------------------------------
    // loadLocalData()
    // Gets the local "account" database
    // -----
    // Created on Fri Nov 17 2023
    //+-------------------------------------------------
    async loadLocalData() {
      let config = await $nuxt.$db.config.toArray()
      this.local = await $nuxt.$db.account.get('me')

      if (this.local?.bearer) this.setToken(this.local?.bearer)

      // prettier-ignore
      let _config = config.reduce((acc, row) =>
        ({ ...acc, [row.key]: row.value }),
        {})

      this.config = _config
    },

    //+-------------------------------------------------
    // getApiData()
    // Gets the userdata from the API
    // And then set values on local for future use
    // -----
    // Created on Fri Nov 17 2023
    //+-------------------------------------------------
    async getApiData() {
      if (!this.bearer) return

      const jxr = await $nuxt.$axios.get('me').catch((e) => {
        console.warn(e)
        return e.response
      })

      if (jxr?.status === 200) {
        if (!jxr.data) return

        this.api = jxr.data

        this.local.steam = jxr.data.steam || this.local.steam

        // prettier-ignore
        this.local.username = (this.local.username == 'Traveler')
          ? jxr.data.username
          : this.local.username

        // prettier-ignore
        this.local.avatar = !this.local.avatar
          ? jxr.data.avatar
          : this.local.avatar

        let provider = jxr.data.providers.find((p) => p.provider === 'steam')
        this.local.steam_data = provider?.data || null
        this.local.steam_updated_at = provider.updated_at

        log('🧭 Userdata from API', jxr.data)
      }
    },

    // //+-------------------------------------------------
    // // storeAccount()
    // // Store the resulting userdata in the local database
    // // -----
    // // Created on Fri Nov 17 2023
    // //+-------------------------------------------------
    // async storeAccount(me) {
    //   let json = JSON.parse(JSON.stringify(me))
    //   await $nuxt.$db.account.put({
    //     ...json,
    //     uuid: 'me',
    //     updated_at: dates.now(),
    //   })
    // },

    //+-------------------------------------------------
    // update()
    // Replaces a record in the journal
    // -----
    // Created on Fri Dec 29 2023
    //+-------------------------------------------------
    async update(field, store) {
      let me = { ...this.api, ...this.local }
      this.user = { ...me }

      log('🥸 Local userdata has been updated', this.user)

      let json = JSON.parse(JSON.stringify(this[field]))
      await $nuxt.$db[store].put({
        ...json,
        updated_at: dates.now(),
      })
    },

    // logout() {
    //   this.user = {}
    //   this.isLogged = false
    //   this.bearer = null

    //   useCookie('auth._token.local').value = null
    //   delete $nuxt.$axios.defaults.headers.common['Authorization']
    //   navigateTo('/login')
    // },
  },

  getters: {
    doubleCount() {
      return this.redirectTo + 'xxx' || 0
    },

    // upper() {
    //   return this.message.toUpperCase();
    // },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
