/*
 * @file:    \stores\UserStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 18th November 2023
 * Modified: Sun Nov 26 2023
 */

let app = null

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
    // Try to authenticate the current user
    // Retrieves the user from the api
    // Gets the local data from the browser
    // And sets this.user
    // -----
    // Created on Wed Mar 22 2023
    // Updated on Fri Nov 03 2023
    //+-------------------------------------------------
    async authenticate() {
      if (this.user?.id) return this.user

      if (!app) app = useNuxtApp()
      if (!this.bearer) this.setToken()

      await this.getLocalData()
      // await this.getApiData()

      let me = { ...this.api, ...this.local }
      delete me.settings
      delete me.providers
      this.storeAccount(me)

      me.config = this.config
      this.user = { ...me }

      log('🥸 User is authenticated', this.user)

      this.isLogged = true
      this.isChecked = true

      return true
    },

    //+-------------------------------------------------
    // setToken()
    // Loads the bearer token and adds it to pinia and axios
    // -----
    // Created on Mon Nov 20 2023
    //+-------------------------------------------------
    setToken(bearer = false) {
      if (!bearer) bearer = useCookie('auth._token.local').value
      else useCookie('auth._token.local').value = bearer

      this.bearer = bearer
      app.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + bearer
    },

    //+-------------------------------------------------
    // getLocalData()
    // Gets the local "account" database
    // -----
    // Created on Fri Nov 17 2023
    //+-------------------------------------------------
    async getLocalData() {
      let config = await app.$db.config.toArray()
      this.local = await app.$db.account.get('me')

      let _config = config.reduce((acc, row) => {
        acc[row.key] = row.value
        return acc
      }, {})

      this.config = _config
    },

    //+-------------------------------------------------
    // getApiData()
    // Gets the userdata from the API
    // -----
    // Created on Fri Nov 17 2023
    //+-------------------------------------------------
    async getApiData() {
      const jxr = await app.$axios.get('me').catch((e) => {
        console.warn(e)
        return e.response
      })

      if (jxr?.status === 200) {
        this.api = jxr.data

        let provider = jxr.data.providers.find((p) => p.provider === 'steam')
        this.local.steam_data = provider?.data || {}

        log('🧭 Userdata from API', jxr.data)
      }
    },

    //+-------------------------------------------------
    // storeAccount()
    // Store the resulting userdata in the local database
    // -----
    // Created on Fri Nov 17 2023
    //+-------------------------------------------------
    async storeAccount(me) {
      let json = JSON.parse(JSON.stringify(me))
      await app.$db.account.put({
        ...json,
        uuid: 'me',
      })

      // me.updated_at = dates.now()
    },

    logout() {
      this.user = {}
      this.isLogged = false
      this.bearer = null

      useCookie('auth._token.local').value = null
      delete app.$axios.defaults.headers.common['Authorization']
      navigateTo('/login')
    },
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
