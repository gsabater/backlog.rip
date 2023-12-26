/*
 * @file:    \stores\UserStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 18th November 2023
 * Modified: Tue Dec 19 2023
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
    // If api uuid is present, load data when required
    // -----
    // Created on Wed Mar 22 2023
    // Updated on Wed Dec 13 2023
    //+-------------------------------------------------
    async authenticate() {
      if (this.user?.uuid) return this.user

      if (!$nuxt) $nuxt = useNuxtApp()
      if (!this.bearer) this.setToken()

      await this.loadLocalData()
      // await this.getApiData()

      let me = { ...this.api, ...this.local }
      // delete me.settings
      // delete me.providers
      // this.storeAccount(me)

      me.config = this.config
      this.user = { ...me }

      log('🥸 User is authenticated', this.user)
      // log('⭕ Should check for providers', this.user.providers)

      // this.isLogged = false
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
      $nuxt.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + bearer
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
    //+-------------------------------------------------
    async getApiData() {
      const jxr = await $nuxt.$axios.get('me').catch((e) => {
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
      await $nuxt.$db.account.put({
        ...json,
        uuid: 'me',
        updated_at: dates.now(),
      })
    },

    logout() {
      this.user = {}
      this.isLogged = false
      this.bearer = null

      useCookie('auth._token.local').value = null
      delete $nuxt.$axios.defaults.headers.common['Authorization']
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
