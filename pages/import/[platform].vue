<template>

    <!-- Page header -->
    <!-- <div class="page-header d-print-none">
      <div class="container-xl">
        <div class="row g-2 align-items-center">
          <div class="col">
            <h2 class="page-title">
              Importing games
            </h2>
          </div>
        </div>
      </div>
    </div> -->
    <!-- Page body -->
    <div class="page-body">
      <div class="container-xl">
        <div class="row row-cards">
          <div class="col-lg-8">

<ul>
  <li><h4>Steps:</h4></li>
  <!-- <li>detect: detect if plugin is present.</li> -->
  <!-- <li>Check: getUserdata, getGames, getWishlist...</li> -->
  <!-- <li>Connect: Read manifest and give methods to the module.</li> -->
  <!-- <li>Receive plugin manifest: name, description, author, repository url , steps (things is going to do), requeriments, what it does, what it does not</li> -->
  <!-- <li>Give: vue instance?, axios instance, log(info, warning, error), error event, success event</li> -->
  <!-- <li>----</li> -->
  <!-- <li>initialize: get userdata</li>
  <li>onclick: getgames</li> -->



  <li>store each in every category</li>
  <li>get game data from api</li>
  <li>end</li>
</ul>
            <div class="steps mb-4">
              <span href="#" class="step-item active" data-bs-toggle="tooltip" title="Step 4 description"></span>
              <span
                class="step-item"
                v-for="(el, i) in importer.steps" :key="i"
                :class="{'active': i == ui.step}">
                {{ el.name }}
              </span>
              <span href="#" class="step-item" data-bs-toggle="tooltip" title="Step 4 description"></span>
            </div>

<h1 v-if="process.ready == false">Preparing...</h1>
<h1 v-if="process.ready">Prepared</h1>

<div class="card" style="border: 2px solid #d63939"
              v-if="ui.error">
              <div class="card-body">
                <h3 class="card-title">There has been an error</h3>
                <p class="text-muted">{{ ui.error }}</p>
              </div>
              <!-- Card footer -->
              <div class="card-footer">
                <div class="d-flex">
                  <a href="#" class="btn btn-link">Cerrar</a>
                  <a href="#" class="btn btn-primary ms-auto">Notify on Github </a>
                  <a href="#" class="btn btn-primary ms-auto">Notify on Discord </a>
                </div>
              </div>
            </div>



            <div class="col-lg-8 mx-auto mt-4"
              v-if="ui.loading">
              <div class="card">
                <div class="card-body">
                  <div class="row align-items-center">
                    <div class="col-3">
                      <div class="avatar avatar-md bg-purple-lt">
                        <div class="spinner-border" role="status"></div>
                      </div>
                    </div>
                    <div class="col">
                      <h3 class="card-title mb-1">
                        <a href="#" class="text-reset">Food Deliver UI dashboards</a>
                      </h3>
                      <div class="text-muted">
                        Updated 2 hours ago
                        {{ watchToHuman }}
                      </div>
                      <div class="mt-3">
                        <div class="row g-2 align-items-center">
                          <!-- <div class="col-auto">
                            25%
                          </div> -->
                          <div class="col">
                            <div class="progress progress-sm">
                              <div class="progress-bar progress-bar-indeterminate" role="progressbar" aria-valuemin="0"
                                aria-valuemax="100">
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-auto">
                      <div class="dropdown">
                        <a href="#" class="btn-action" data-bs-toggle="dropdown" aria-expanded="false">
                          <!-- Download SVG icon from http://tabler-icons.io/i/dots-vertical -->
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
                            viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="12" cy="19" r="1"></circle>
                            <circle cx="12" cy="5" r="1"></circle>
                          </svg>
                        </a>
                        <div class="dropdown-menu dropdown-menu-end">
                          <a href="#" class="dropdown-item">Import</a>
                          <a href="#" class="dropdown-item">Export</a>
                          <a href="#" class="dropdown-item">Download</a>
                          <a href="#" class="dropdown-item text-danger">Delete</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="container container-tight py-4"
              v-if="process.ready">
              <div class="card card-md">
                <div class="card-body text-center">
                  <div class="mb-4">
                    <h2 class="card-title mb-0">Import Steam games</h2>
                    <p class="text-muted">Click to begin to updating process</p>
                  </div>
                  <div class="mb-4">
                    <span class="avatar avatar-xl mb-3"
                      :style="`background-image: url('${account.provider?.data?.avatarfull || ''}')`"></span>
                    <h3 class="mb-0">{{ account.username }}</h3>
                    <p class="text-muted">Steam ID <code>{{ account.steam }}</code></p>
                  </div>
                  <div>
                    <div class="btn btn-primary w-100" @click="doImport">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrows-transfer-down"
                        width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M17 3v6"></path>
                        <path d="M10 18l-3 3l-3 -3"></path>
                        <path d="M7 21v-18"></path>
                        <path d="M20 6l-3 -3l-3 3"></path>
                        <path d="M17 21v-2"></path>
                        <path d="M17 15v-2"></path>
                      </svg>
                      Update your {{ importer.store }} library
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <pre>
              {{ ui }}
            </pre>
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="me-3">
                    <!-- Download SVG icon from http://tabler-icons.io/i/scale -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-md" width="24" height="24"
                      viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <line x1="7" y1="20" x2="17" y2="20"></line>
                      <path d="M6 6l6 -1l6 1"></path>
                      <line x1="12" y1="3" x2="12" y2="20"></line>
                      <path d="M9 12l-3 -6l-3 6a3 3 0 0 0 6 0"></path>
                      <path d="M21 12l-3 -6l-3 6a3 3 0 0 0 6 0"></path>
                    </svg>
                  </div>
                  <div>
                    <small class="text-muted">tabler/tabler is licensed under the</small>
                    <h3 class="lh-1">{{ importer.name }}</h3>
                  </div>
                </div>
                <div class="text-muted mb-3">
                  {{ importer.description }}
                </div>
                <h4>What is imported</h4>
                <ul class="list-unstyled space-y-1">
                  <li v-for="(el, i) in importer.does" :key="i">
                    <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon text-green" width="24" height="24"
                      viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M5 12l5 5l10 -10"></path>
                    </svg>
                    {{ el }}
                  </li>
                </ul>
                <h4>What is not imported</h4>
                <ul class="list-unstyled space-y-1">
                  <li v-for="(el, i) in importer.doesnot" :key="i">
                    <!-- Download SVG icon from http://tabler-icons.io/i/x -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon text-red" width="24" height="24"
                      viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    {{ el }}
                  </li>
                  <li>
                    <!-- Download SVG icon from http://tabler-icons.io/i/x -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon text-red" width="24" height="24"
                      viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Warranty
                  </li>
                </ul>
                <h4>Conditions</h4>
                <ul class="list-unstyled space-y-1">
                  <li>
                    <!-- Download SVG icon from http://tabler-icons.io/i/info-circle -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon text-blue" width="24" height="24"
                      viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <circle cx="12" cy="12" r="9"></circle>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      <polyline points="11 12 12 12 12 16 13 16"></polyline>
                    </svg>
                    License and copyright notice
                  </li>
                </ul>
              </div>
              <div class="card-body">
                <ul class="steps steps-vertical">
                      <li
                      class="step-item"
                      v-for="(el, i) in importer.steps" :key="i"
                      :class="{'active': i == ui.step}">
                        <div class="h4 m-0">{{ el.name }}</div>
                        <div class="text-muted" v-if="el.description">{{ el.description }}</div>
                      </li>

                      <li class="step-item">
                        <div class="h4 m-0">Finalized</div>
                        <div class="text-muted">Lorem ipsum dolor sit amet.</div>
                      </li>
                    </ul>
                <!-- <ul class="list-unstyled space-y-1">
                  <li v-for="(el, i) in importer.steps" :key="i">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon text-green" width="24" height="24"
                      viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M5 12l5 5l10 -10"></path>
                    </svg>
                    {{ el }}
                  </li>
                </ul> -->
              </div>
              <div class="card-footer text-muted">
                This importer is open source. If you want to know more or are concerned about your privacy and security,
                you can <a href="#" target="_blank">review the code on Github</a>
              </div>
            </div>

            <div class="card" style="border: 2px solid #d63939"
              v-if="ui.showlogs">
              <div class="card-body">
                <h3 class="card-title">There has been an error</h3>
                <p class="text-muted">We could not import your profile. Check your logs and try again or report the issue</p>
                <p><pre>{{ logs }}</pre></p>
              </div>
              <!-- Card footer -->
              <div class="card-footer">
                <div class="d-flex">
                  <a href="#" class="btn btn-link">Cerrar</a>
                  <a href="#" class="btn btn-primary ms-auto">Notify on Github </a>
                  <a href="#" class="btn btn-primary ms-auto">Notify on Discord </a>
                </div>
              </div>
            </div>

            <pre>
            {{ importer.manifest }}
            </pre>
          </div>
        </div>
      </div>
    </div>

</template>

<script>
/**
 * @file:    \pages\import\[platform].vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 27th November 2022
 * Modified: Mon Nov 06 2023
 **/

import steam from '~/modules/importers/steam'
import axios from 'axios'

let importer = null
const _axios = axios.create({
  timeout: 60000,
  headers: {
    // accept: 'application/ld+json',
  },
})

export default {
  name: 'Importer',
  data() {
    return {
      account: {}, // The user account -> store to import
      importer: {}, // the importer instance, plugin or module
      logs: [], // log array for the whole process

      data: {
        user: {}, // result of the user import
        games: [], // result of the games import
        wishlist: [], // result of the wishlist import
      },

      // helper object to control ui
      process: {
        step: 0,
        time: 0,
        ready: true,

        progress: 0,
      },

      ui: {
        error: null,

        step: null,
        watch: null,
        loading: false,
        showlogs: true,
      },
    }
  },

  computed: {
    watchToHuman() {
      if (this.process.time === 0) return '0s'
      // return tools.secondsToHuman(this.process.time)

      if (this.process.time < 60) return `${this.process.time} seconds`
      if (this.process.time < 3600) return `${Math.floor(this.process.time / 60)} minutes`
    },
  },

  methods: {
    //+-------------------------------------------------
    // _log()
    // Utility method that logs a message to the console
    // And adds it to the logs array for debugging
    // This can be called from the importer and from the module
    // When the logs are shown on the page, it will group it by
    // info, warning, error -- When an error is shown, the process is interrupted
    // -----
    // Created on Fri Dec 02 2022
    //+-------------------------------------------------
    _log(message, type = 'info', data) {
      let now = new Date().getTime()
      log(`${message}`)

      if (type === 'error') {
        this.ui.error = message
        this.ui.showlogs = true
      }

      this.logs.unshift({
        type,
        time: now,
        message,
        data,
      })
    },

    //+-------------------------------------------------
    // doImport()
    // Main call that will execute the importing methods
    // available on the module
    // -----
    // Created on Thu Dec 01 2022
    //+-------------------------------------------------
    async doImport() {
      log(`🧶 Starting data import...`)
      this.ui.loading = true

      try {
        this.data.user = await steam.getUserdata()
        this._log(`👩‍🚀 Account store userdata received`)

        this.data.games = await steam.getGames()
        this._log(`🎮 Games received`)

        // this.data.wishlist = await steam.getWishlist()
        // this._log(`🎁 Wishlist received`)
      } catch (e) {
        this._log('Error getting user data', 'error', e)
        return false
      }

      this._log(`🎉 Import process completed!`)
      console.warn(this.data)
    },

    //+-------------------------------------------------
    // detect()
    // First contact with the importer, called automatically on mount.
    // - Detects if the platform is valid
    // - Detects that the requested importer is present and available
    // - Detect if the user is logged in
    // - Also detects the browser has support for IndexedDB
    // - And finally detects that the importer has the required methods
    // -----
    // Created on Sat Oct 28 2023
    //+-------------------------------------------------
    detect() {
      log('importer', 'detect()')

      let { platform } = this.$route.params
      this._log(`🎨 Platform ID: ${platform}`)

      if (this.$stores.ready == false) {
        this._log('IndexedDB is not supported', 'error')
        return false
      }

      if (this.$auth.user.isLogged || this.$auth.user.id == undefined) {
        this._log('You need to login first', 'error')
        return false
      }

      this.account = { ...this.$auth.user }
      this.account.provider = this.account.providers.find((el) => el.provider === platform)
      this.account.bearer = this.$auth.bearer

      if (this.$route.params.platform !== 'steam') return false

      if (steam == undefined) {
        this._log('The Steam instance is not available', 'error')
        return false
      }

      if (
        steam.getUserdata === undefined ||
        steam.getGames === undefined ||
        steam.getWishlist === undefined
      ) {
        console.warn(steam)
        this._log('The Steam instance is not complete, some methods are not present', 'error')
        return false
      }

      return true
    },

    //+-------------------------------------------------
    // connect()
    // Receives the module manifest, and gives the module
    // some data and methods to work with
    // -----
    // Created on Sat Oct 28 2023
    //+-------------------------------------------------
    async connect() {
      log('importer', 'connect()')

      let connected = false
      this.importer = steam.manifest
      importer = steam

      try {
        connected = importer.connect(this.account, _axios, this._log)
      } catch (e) {
        this._log('Error connecting to the importer', 'error', e)
        return false
      }

      if (connected) {
        this._log('🆗 Importer ready to use')
        this.process.ready = true
      }
    },

    async init() {
      log('importer', 'init()')
      this._log('✨ Initializing the importer')

      if (this.detect()) await this.connect()

      this.ui.watch = setInterval(() => {
        this.process.time++
        if (this.process.time <= 3) log(this.process.time)
      }, 1000)
    },
  },

  mounted() {
    this.init()
  },

  unmounted() {
    log('importer', 'unmounted()')
    clearInterval(watch)
  },
}

// import tools from '~/utils/tools'

// let route = useRoute()
// let router = useRouter()
// const app = useNuxtApp()
// // console.warn(this.$route, this.$route.params)
// // console.warn(router, JSON.stringify(route), route.params)
// // console.warn(steam)

// //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// // Data
// //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// let watch = null

// let importer = reactive({})
// let logs = reactive([])
// let ui = reactive({
//   step: null,

//   loading: false,
//   progress: 0,
//   time: 0,
// })

// //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// // Computed
// //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// const step = computed(() => {
//   return importer.steps[ui.step]
// })

// //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// // Methods
// //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// //+-------------------------------------------------
// // complete()
// // Method called from the importer when
// // the import process is complete
// // -----
// // Created on Thu Dec 08 2022
// //+-------------------------------------------------
// let complete = async () => {
//   log(`🎉 Import process completed!`)

//   ui.step = 'complete'
// }

// //+-------------------------------------------------
// // setStep()
// // UI utilty method
// // -----
// // Created on Thu Dec 08 2022
// //+-------------------------------------------------
// let setStep = (step) => {
//   ui.step = step
//   ui.time = 0
// }

// let onError = (error, data) => {
//   ui.error = true
//   console.warn('🚨', 'error', error, data)
//   log(error, 'error', data)
// }

// //+-------------------------------------------------
// // init()
// // Loads and registers the route importer
// // And calls first register method in it
// // -----
// // Created on Fri Dec 02 2022
// //+-------------------------------------------------
// let init = () => {

//   steam.register({
//     $axios: app.$axios,
//     log,
//     setStep,
//     onError,
//     complete,
//   })

//   importer = {
//     name: steam.name,
//     icon: steam.icon,
//     author: steam.author,
//     version: steam.version,
//     description: steam.description,

//     steps: steam.steps,
//     imports: steam.imports,
//     not_imports: steam.not_imports,
//   }

//   ui.step = 0
//   log('🆗 Importer ready to use')
//   console.warn(importer)

//   watch = setInterval(() => {
//     ui.time++
//     if (ui.time <= 3) console.warn(ui.time)
//   }, 1000)
// }
</script>
