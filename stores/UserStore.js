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

    isLogged: false,
    isChecked: false,
    redirectTo: null,
  }),

  actions: {
    setToken(bearer = false) {
      if (!app) app = useNuxtApp()

      if (!bearer) bearer = useCookie('auth._token.local').value
      else useCookie('auth._token.local').value = bearer

      this.bearer = bearer
      app.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + bearer
    },

    //+-------------------------------------------------
    // authenticate()
    // Try to authenticate the current user
    // Returns the user from the API
    // -----
    // Created on Wed Mar 22 2023
    // Updated on Fri Nov 03 2023
    //+-------------------------------------------------
    async authenticate() {
      // this.initAxios()

      if (!this.bearer) this.setToken()
      if (this.user?.id) return this.user

      // let auth = useState('auth')
      const jxr = await app.$axios.get('me').catch((e) => {
        console.warn(e)
        return e.response
      })

      if (jxr?.status === 200) {
        log('Response from authentication', jxr)

        this.user = jxr.data
        this.isLogged = true
        this.isChecked = true

        // auth.value.user = jxr.data
        // auth.value.loggedIn = true
        // this.meta.time = new Date().getTime()
      }

      let me = { ...this.user }
      delete me.providers
      delete me.settings
      me.username = 'pepito'
      app.$db.config.put({
        key: 'me',
        value: me,
      })

      return this.user
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
