<template>
  <div class="row" style="height: inherit; margin: 0;">
    <div class="col" style="background-image: url('https://source.unsplash.com/1600x900/?nature,water,architecture,pattern');
      background-size: cover;"></div>
    <div class="col" style="  background-color: purple; display: flex; align-items: center;">
      <v-card class="mx-auto pa-4" width="400">
            <v-card-text>
              <p class="text-h6 text-bold text--primary mb-0">
                Inicia sesión con tu cuenta
              </p>
              <div class="mb-7">Introduce tu usuario y contraseña</div>

              <form>
                <!-- <v-text-field
                  variant="underlined"
                  density="comfortable"
                  hide-details="auto"
                  v-model="username"
                  label="Usuario"
                  :error-messages="usernameErrors"
                  required
                  class="mb-6"
                ></v-text-field> -->
                <div class="form-floating mb-3">
                <input type="email" class="form-control" id="floating-input" autocomplete="off"
                  v-model="username">
                <label for="floating-input">Email address</label>
              </div>

                <v-text-field
                  variant="underlined"
                  density="comfortable"
                  hide-details="auto"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  name="input-10-1"
                  label="Contraseña"
                  @keyup.enter="submit()"
                  :error-messages="passwordErrors"
                  required
                  class="mb-3"
                >
                <template v-slot:append-inner>
                  <v-icon style="cursor: pointer"
                    @click="showPassword = !showPassword">
                    {{ showPassword ? 'mdi-eye-outline' : 'mdi-eye-remove-outline' }}
                  </v-icon>
                  <!-- <v-tooltip
                    activator="parent"
                    location="bottom">
                    Mostrar apellidos de contacto
                  </v-tooltip> -->
                </template>
              </v-text-field>
              <div class="form-floating mb-3">
                <input type="email" class="form-control" id="floating-input" autocomplete="off"
                  v-model="password">
                <label for="floating-input">Email address</label>
              </div>
              </form>
            </v-card-text>
            <v-card-actions>
                <v-btn block depressed large color="primary"
                :loading="loading"
                @click="submit()">
                Acceder
              </v-btn>
            </v-card-actions>
          </v-card>

          <hr>

          <div class="col"><a href="http://api.backlog.test/auth/steam" class="btn btn-github w-100">
                <!-- Download SVG icon from http://tabler-icons.io/i/brand-twitter -->
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-steam" width="40"
                  height="40" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path
                    d="M16.5 5a4.5 4.5 0 1 1 -.653 8.953l-4.347 3.009l0 .038a3 3 0 0 1 -2.824 2.995l-.176 .005a3 3 0 0 1 -2.94 -2.402l-2.56 -1.098v-3.5l3.51 1.755a2.989 2.989 0 0 1 2.834 -.635l2.727 -3.818a4.5 4.5 0 0 1 4.429 -5.302z">
                  </path>
                  <circle cx="16.5" cy="9.5" r="1" fill="currentColor"></circle>
                </svg>
                Login Steam
              </a></div>
            <div class="col"><a href="http://api.backlog.test/auth/xbox" class="btn btn-green w-100">
                <!-- Download SVG icon from http://tabler-icons.io/i/brand-twitter -->
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-google" width="40"
                  height="40" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M17.788 5.108a9 9 0 1 0 3.212 6.892h-8"></path>
                </svg>
                Login Xbox
              </a></div>
            <div class="col"><a href="http://api.backlog.test/auth/google" class="btn btn-google w-100">
                <!-- Download SVG icon from http://tabler-icons.io/i/brand-twitter -->
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-google" width="40"
                  height="40" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M17.788 5.108a9 9 0 1 0 3.212 6.892h-8"></path>
                </svg>
                Login Google
              </a></div>
    </div>
  </div>

  <!-- <v-layout align-center fill-height style="background-color: #f8f9fe">

    <v-flex class="d-none d-sm-flex" md5 fill-height
      >

        <div class="d-flex align-center justify-center" style="width: 100%; height: 100%; background-color: rgb(24 25 27 / 80%);">
          <div style="width: 310px; border-radius: 10px; background: linear-gradient(rgb(46, 50, 68), rgba(9, 32, 63, 0.62));">
            <img src="logo_texto_abajo.png" style="width: 310px; padding-top: 15px" title="Certiapp">
          </div>
        </div>
    </v-flex>

    <v-flex xs12 md7 class="d-flex align-center justify-center" style="height: 100vh">
        <div>
          <img v-if="customLogo" :src="customLogo" class="pb-5" style="max-width: 150px; max-height: 100px;" title="Certiapp">


        </div>
    </v-flex>

  </v-layout> -->
</template>

<script setup>
definePageMeta({
  // layout: 'blank',
})

const router = useRouter()

// const auth = useState('auth')
const userStore = useUserStore()
const { $sanctumAuth, $axios } = useNuxtApp()

let errors = ref([])
let loading = ref(false)
let username = ref('')
let password = ref('')
let showPassword = ref(false)

//+-------------------------------------------------
// submit()
// Use Sanctum Auth to get JWT token
// -----
// Created on Wed Mar 22 2023
//+-------------------------------------------------
let submit = async () => {
  loading.value = true
  try {
    await $sanctumAuth.login(
      {
        username: username.value,
        password: password.value,
      },

      (token) => {
        setUser(token)
        // router.push('/account')
      }
      // optional callback function
      // (data) => {
      //   console.log(data)
      //   router.push('/account')
      // }
    )
  } catch (e) {
    errors.value = e
    loading.value = false
    console.error(errors)
  }
}

//+-------------------------------------------------
// setUser()
// Get token, create cookie, set axios header, get user
// -----
// Created on Wed Mar 22 2023
//+-------------------------------------------------
let setUser = async (data) => {
  try {
    userStore.setToken(data.token)
    console.warn($axios.defaults)

    // let cookie = useCookie('auth._token.local')
    // cookie.value = data.token

    // Set the token in the axios header
    // And load current user
    let current = await userStore.current()
    console.warn(current)
    // console.warn(userStore.isLogged, userStore.user)
    // console.warn(auth)

    let redirect = userStore.redirectTo
    if (redirect == 'login') redirect = '/dashboard'
    if (redirect == '/login') redirect = '/dashboard'
    if (redirect == '/login/') redirect = '/dashboard'

    router.push(redirect ? redirect : '/dashboard')
  } catch (e) {
    errors.value = e
    console.error(errors)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.slider-content {
  border-top: 4px solid #fff;
  border-bottom: 4px solid #fff;
  border-left: 4px solid #fff;
  border-right: 4px solid #fff;
  display: inline-block !important;
  border-radius: 50% !important;
}
</style>
