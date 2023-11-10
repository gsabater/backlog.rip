<template>
  <ul>
    <!-- <li>Params: {{ route.query }}</li> -->
    <li>Token: {{ token }}</li>
    <li>Auth:
      <pre>
      {{ auth }}
      </pre>
    </li>
  </ul>
  <b-btn @click="authorize">
    Authorize
  </b-btn>

  <h1 v-if="ui.loading">Loading</h1>
</template>
<script>
/**
 * @file:    \pages\auth.vue
 * @desc:    Receives the token from the backend and stores it
 *          this token identifies the user in the backlog.rip database
 * -------------------------------------------
 * Created Date: 21st March 2023
 * Modified: Fri Oct 27 2023
 **/

// import { mapStores } from 'pinia'
export default {
  name: 'Auth',
  // setup() {
  //   const route = useRoute()
  //   return { route }
  // },

  data() {
    return {
      token: '',
      auth: '',

      ui: {
        loading: false,
      },
    }
  },

  computed: {
    ...mapStores(useUserStore),
  },

  methods: {
    async authorize() {
      this.ui.loading = true
      this.setUser()
    },

    async setUser(data) {
      try {
        this.userStore.setToken(this.token)

        // Set the token in the axios header
        // And load current user
        let current = await this.userStore.current()

        log(this.userStore.isLogged, this.userStore.user)
        // console.warn(auth)

        let redirect = this.userStore.redirectTo
        if (redirect == 'login') redirect = '/dashboard'
        if (redirect == '/login') redirect = '/dashboard'
        if (redirect == '/login/') redirect = '/dashboard'

        this.$router.push(redirect ? redirect : '/dashboard')
      } catch (e) {
        // errors.value = e
        console.error(e)
        alert('ERROR')
      } finally {
        this.ui.loading = false
      }
    },

    async init() {
      let route = this.$route
      let { token } = route.query

      this.token = token
      this.auth = this.$auth
    },
  },

  mounted() {
    this.init()
  },
}

// let route = useRoute()
// let { token } = route.query
// let auth = useState('auth').value

// // http://backlog.rip:1337/auth?token=31|Wtg7QmcVIzNF6npXbymQXYEkbb2jlLyml9RXT0c2
// // http://backlog.rip:1337/auth?token=32|1Adv5EjlQGBgjzW1zZPtRYl7vHNMYPp0yXF3kztf

// // print all get params
// console.log(route, route.params, route.query, token)
</script>
