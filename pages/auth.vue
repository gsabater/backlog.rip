<template>
  <div class="page-body">
    <div class="container-xl">
      <div class="row row-cards">
        <div class="col-lg-8 mx-auto mt-4">
          <!-- <pre>
            Token: {{ token }}
            Auth:
            {{ auth }}
          </pre> -->
          <div class="card">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-8">
                  <h3 class="card-title mb-1">Loading your account, please wait...</h3>
                  <div class="mt-3">
                    <div class="row g-2 align-items-center">
                      <div class="col">
                        <div class="progress progress-sm">
                          <div
                            class="progress-bar progress-bar-indeterminate"
                            role="progressbar"
                            aria-valuemin="0"
                            aria-valuemax="100"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * @file:    \pages\auth.vue
 * @desc:    Receives the token from the backend and stores it
 *           this token identifies the user in the backlog.rip database
 * -------------------------------------------
 * Created Date: 21st March 2023
 * Modified: 18th November 2025 - 12:17:51
 **/

export default {
  name: 'Auth',

  data() {
    return {
      jwt: '',
      auth: '',
      token: '',

      ui: {
        loading: false,
      },
    }
  },

  computed: {
    ...mapStores(useUserStore),
  },

  methods: {
    async authenticate() {
      this.ui.loading = true
      window.setTimeout(() => {
        this.setUserCredentials()
      }, 1000)
    },

    //+-------------------------------------------------
    // setUserCredentials()
    // Sets the token and loads the user data
    // -----
    // Created on Fri Dec 29 2023
    //+-------------------------------------------------
    async setUserCredentials() {
      try {
        const redirect = null

        // Set tokens received to the user
        this.userStore.setJWT(this.jwt)
        this.userStore.setBearer(this.token)

        // And load current user
        await this.userStore.getApiData()

        // And update the local ddbb
        await this.userStore.register()

        // Notify the application
        $nuxt.$mitt.emit('user:login', this.userStore.user)

        // Redirect to welcome or to the original page
        this.$router.push(redirect ? redirect : '/welcome')
      } catch (e) {
        // errors.value = e
        console.error(e)
        alert('ERROR STORING THE USER, THIS SHOULD NOT HAPPEN!')
      } finally {
        this.ui.loading = false
      }
    },

    //+-------------------------------------------------
    // init()
    // When the page is loaded, take the token from the URL
    // and authenticate the user
    // -----
    // Created on Fri Dec 29 2023
    //+-------------------------------------------------
    async init() {
      const route = this.$route
      const { token, jwt } = route.query

      this.jwt = jwt
      this.token = token
      this.auth = this.$auth

      // TODO: can show a message if no token is found
      if (!token) return
      this.authenticate()
    },
  },

  mounted() {
    this.init()
  },
}
</script>
