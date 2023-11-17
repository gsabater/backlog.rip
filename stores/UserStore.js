/**
 * @project: backlog
 * @file:    \stores\UserStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 8th December 2022
 * Last Modified: Thu Dec 08 2022
 **/

let app = null

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {},
    bearer: null,

    api: {},
    local: {},

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

      await this.getLocalData()
      await this.getApiData()

      let me = { ...this.api, ...this.local }
      delete me.providers
      delete me.settings

      // me.updated_at = dates.now()
      // if(this.local.updated_at !== this.api.updated_at) {
      //   this.syncLocal()
      // }
      // debugger

      // app.$db.config.put({
      //   key: 'me',
      //   value: me,
      // })

      this.user = { ...me }
      console.warn('👤 User is authenticated', this.user)
      debugger
      this.isLogged = true
      this.isChecked = true

      return this.user
    },

    setToken(bearer = false) {
      if (!app) app = useNuxtApp()

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
      this.local = await app.$db.account.toArray()

      let _config = config.reduce((acc, row) => {
        acc[row.key] = row.value
        return acc
      }, {})

      this.local.config = _config
    },

    //+-------------------------------------------------
    // getApiData()
    // Gets the userdata from the API
    // -----
    // Created on Fri Nov 17 2023
    //+-------------------------------------------------
    async getApiData() {
      if (!this.bearer) this.setToken()

      const jxr = await app.$axios.get('me').catch((e) => {
        console.warn(e)
        return e.response
      })

      if (jxr?.status === 200) {
        this.api = jxr.data.steam_data = t

        this.local.log('🌐 Userdata from API', jxr)
      }
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
