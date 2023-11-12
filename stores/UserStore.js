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

      await this.getApiData()
      await this.getLocalData()

      let me = { ...this.api, ...this.local }
      me.updated_at = dates.now()
      delete me.providers
      delete me.settings

      app.$db.config.put({
        key: 'me',
        value: me,
      })

      this.user = { ...me }
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

    async getApiData() {
      if (!this.bearer) this.setToken()

      const jxr = await app.$axios.get('me').catch((e) => {
        console.warn(e)
        return e.response
      })

      if (jxr?.status === 200) {
        log('Userdata from API', jxr)

        this.api = jxr.data

        // auth.value.user = jxr.data
        // auth.value.loggedIn = true
        // this.meta.time = new Date().getTime()
      }
    },

    async getLocalData() {
      this.local = await app.$db.value('config', 'me')
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
      return this.count * 3 || 0
    },

    // upper() {
    //   return this.message.toUpperCase();
    // },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
