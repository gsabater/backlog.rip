/*
 * @file:    \stores\UserStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 18th November 2023
 * Modified: Tue Feb 20 2024
 */

let $nuxt = null

export const useUserStore = defineStore('user', {
  state: () => ({
    user: { username: 'Traveler' },
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

      await this.loadLocal()
      // await this.getApiData()

      let me = { ...this.api, ...this.local }
      // delete me.settings
      // delete me.providers
      // this.storeAccount(me)

      // me.config = this.config
      this.user = { ...me }

      log('🥸 User is authenticated as ' + this.user.username, this.user)
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
    // loadLocal()
    // Gets the local "account" database
    // -----
    // Created on Fri Nov 17 2023
    //+-------------------------------------------------
    async loadLocal() {
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
    // updateAccount()
    // updates $account store and this.local data
    // -----
    // Created on Fri Dec 29 2023
    //+-------------------------------------------------
    async updateAccount(field) {
      let account = await $nuxt.$db.account.get('me')

      let data = { ...account }
      data[field] = this.local[field]

      await $nuxt.$db.account.put(data)
      this.user = { ...this.api, ...this.local }
    },

    //+-------------------------------------------------
    // updateConfig()
    // Updates $config store and this.config data
    // -----
    // Created on Sun Feb 18 2024
    //+-------------------------------------------------
    async updateConfig(field) {
      await $nuxt.$db.config.put({
        key: field,
        value: this.config[field],
      })

      $nuxt.$app.dev = this.config.debug
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
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
