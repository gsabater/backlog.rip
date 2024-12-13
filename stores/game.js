/* eslint-disable no-unused-vars */

/*
 * @file:    \stores\gameStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 11th January 2024
 * Modified: Thu 12 December 2024 - 17:50:43
 */

let $nuxt = null
let $data = null

export const useGameStore = defineStore('game', {
  state: () => ({
    app: {
      is: {},
      id: {},
      genres: [],
    },
  }),

  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Index of methods
  //
  // Retrieve data
  // * load()
  // * getFromAPI()
  //
  // Modify data
  // * create()
  // * update()
  // * normalize()
  //
  // Getters
  // * _score()
  // * _playtime()
  //
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  actions: {
    //+-------------------------------------------------
    // load()
    // Loads an item from datastore and sets this.app
    // Calls update() to check if the app needs to be updated
    // -----
    // Created on Thu Jan 11 2024
    //+-------------------------------------------------
    async load(uuid) {
      const game = $data.get(uuid)

      this.app = game
      if (uuid == '5c1c9b5a-1c02-4a56-85df-f0cf97929a48') {
        game.id.epic = '1245620'
        game.id.gog = 'dqwdqwd'
        game.has_demo = true

        game.scores = {
          metascore: '92',
          igdb: 81,
          igdbCount: 748,
          steamscore: '85',
          steamCount: '1106232',
          steamscoreAlt: 'Very Positive',
          userscore: 86,
        }

        game.languages = 'en,fr,de,pl,pt_BR,ru,es_ES,ja,zh_CN'

        game.hltb = {
          main: 109380,
          extras: 215280,
          comp: 527040,
        }

        game.screenshots = {
          base: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/ss_',
          thumb: '.600x338.jpg',
          full: '.1920x1080.jpg',
          data: [
            '943bf6fe62352757d9070c1d33e50b92fe8539f1',
            'dcdac9e4b26ac0ee5248bfd2967d764fd00cdb42',
            '3c41384a24d86dddd58a8f61db77f9dc0bfda8b5',
            'e0316c76f8197405c1312d072b84331dd735d60b',
            'ef61b771ee6b269b1f0cb484233e07a0bfb5f81b',
            'b1b91299d7e4b94201ac840aa64de54d9f5cb7f3',
            '510a02cf3045e841e180f2b77fb87545e0c8b59d',
            'c494372930ca791bdc6221eca134f2270fb2cb9f',
            'fa6b881ef7c30522012ab2b2b83001e79baee093',
            'c2baf8aada6140beee79d701d14043899e91af47',
          ],
        }

        game.movies = [
          {
            webm: {
              480: 'http://video.akamai.steamstatic.com/store_trailers/256875470/movie480_vp9.webm?t=1646770161',
              max: 'http://video.akamai.steamstatic.com/store_trailers/256875470/movie_max_vp9.webm?t=1646770161',
            },
            mp4: {
              480: 'http://video.akamai.steamstatic.com/store_trailers/256875470/movie480.mp4?t=1646770161',
              max: 'http://video.akamai.steamstatic.com/store_trailers/256875470/movie_max.mp4?t=1646770161',
            },
          },
          {
            webm: {
              480: 'http://video.akamai.steamstatic.com/store_trailers/256860549/movie480_vp9.webm?t=1646817731',
              max: 'http://video.akamai.steamstatic.com/store_trailers/256860549/movie_max_vp9.webm?t=1646817731',
            },
            mp4: {
              480: 'http://video.akamai.steamstatic.com/store_trailers/256860549/movie480.mp4?t=1646817731',
              max: 'http://video.akamai.steamstatic.com/store_trailers/256860549/movie_max.mp4?t=1646817731',
            },
          },
          {
            webm: {
              480: 'http://video.akamai.steamstatic.com/store_trailers/256845672/movie480_vp9.webm?t=1646817747',
              max: 'http://video.akamai.steamstatic.com/store_trailers/256845672/movie_max_vp9.webm?t=1646817747',
            },
            mp4: {
              480: 'http://video.akamai.steamstatic.com/store_trailers/256845672/movie480.mp4?t=1646817747',
              max: 'http://video.akamai.steamstatic.com/store_trailers/256845672/movie_max.mp4?t=1646817747',
            },
          },
          {
            webm: {
              480: 'http://video.akamai.steamstatic.com/store_trailers/256875472/movie480_vp9.webm?t=1646770169',
              max: 'http://video.akamai.steamstatic.com/store_trailers/256875472/movie_max_vp9.webm?t=1646770169',
            },
            mp4: {
              480: 'http://video.akamai.steamstatic.com/store_trailers/256875472/movie480.mp4?t=1646770169',
              max: 'http://video.akamai.steamstatic.com/store_trailers/256875472/movie_max.mp4?t=1646770169',
            },
          },
          {
            webm: {
              480: 'http://video.akamai.steamstatic.com/store_trailers/256864455/movie480_vp9.webm?t=1646817701',
              max: 'http://video.akamai.steamstatic.com/store_trailers/256864455/movie_max_vp9.webm?t=1646817701',
            },
            mp4: {
              480: 'http://video.akamai.steamstatic.com/store_trailers/256864455/movie480.mp4?t=1646817701',
              max: 'http://video.akamai.steamstatic.com/store_trailers/256864455/movie_max.mp4?t=1646817701',
            },
          },
        ]

        game.ratings = {
          esrb: {
            rating: 'm',
            descriptors: 'Blood and Gore\r\nLanguage\r\nSuggestive Themes\r\nViolence',
          },
          pegi: {
            rating: '16',
            descriptors: 'Violence',
          },
          usk: {
            rating: '16',
            descriptors: '',
          },
        }

        game.languages = 'en,fr,it,de,es_ES,ja,ko,pl,pt_BR,ru,zh_CN,es_LA,th'
      }
      this.update(game)
    },

    //+-------------------------------------------------
    // create()
    // Creates a new item and normalizes it
    // -----
    // Created on Wed Apr 10 2024
    // Created on Wed Dec 04 2024 - Mark uuid as local
    //+-------------------------------------------------
    create(data = {}) {
      let app = {}

      app = this.normalize({ ...data })
      app.uuid = app.uuid || `local::${$nuxt.$uuid()}`
      app.is.lib = app.is.lib || dates.stamp()

      return app
    },

    //+-------------------------------------------------
    // update()
    // Updates local data from API data
    // To modify the data by the user, use modify()
    // -----
    // Created on Sun Feb 11 2024
    //+-------------------------------------------------
    async update(uuid, data) {
      let game = null
      if (uuid === true) {
        console.error('🔥', uuid, data)
      }

      // Load the game by reference
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (typeof uuid !== 'string') game = uuid
      else game = $data.get(uuid)
      if (game === true) {
        console.error('🔥🚫', uuid, data)
      }

      const update = this.needsUpdate(game, data)
      if (!update) return false

      // log(`🌠 Update as ${update} for ${game.name}`)
      // if (update == 'update:match') debugger

      // Update the game with the new data from the API
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (!data && update.indexOf(':api') > -1) {
        data = await this.getFromAPI()
        if (!data) return
      }

      // Create the new object with the updated data
      // And normalize removing unwanted data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let updated = {
        ...game,
        ...Object.fromEntries(
          Object.entries(data).filter(([key, value]) => value !== null)
        ),
      }

      updated.uuid = game.uuid
      updated = this.normalize(updated)
      // console.warn(JSON.stringify(updated, null, 2))
      // debugger

      // TODO: Add entry in app log

      // Update local data, store and indexes
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      $data.process(updated, update)
      if (this.app.uuid == updated.uuid) this.app = updated
    },

    //+-------------------------------------------------
    // needsUpdate()
    // Checks if the app needs to be updated
    // There are three possible outcomes
    // - false if update is not required
    // - true or update:field to get data from the api
    // - store:db if the app needs to be added to the store
    // -----
    // Created on Sun Feb 11 2024
    //+-------------------------------------------------
    needsUpdate(app, data) {
      if (!app) return false

      // This block is only when comparing
      // local data with the API data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (data) {
        // app matched with an api item
        if (app && !app.id?.api && (data?.id?.api || data?.api_id)) return 'update:match'

        // disabled as i havent decided if this should be
        // a match or update:api or what
        // app has older updated_at than api data
        // if (app.updated_at < data?.updated_at) return 'update:refresh'
      }

      // This block is only when checking app data
      // without a new object
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (!data) {
        // App has never been updated from the API
        if (!app.description) return 'update:api'
        if (!app.providers) {
          console.warn('should update and save providers')
        }
      }

      // For internal updates like changing data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // nunca ocurre
      // if (app.state !== data.state) return 'update:state'
      if (app?.is?.dirty || data?.is?.dirty) return 'store:db'

      return false
    },

    //+-------------------------------------------------
    // getFromAPI()
    // Gets more data from the API
    // -----
    // Created on Fri Feb 16 2024
    //+-------------------------------------------------
    async getFromAPI() {
      console.warn('🪝 Going to ask api for more data')

      let app = this.app.uuid
      let api = this.app.id.api

      if (this.app.is_api) api = this.app.uuid
      if (this.app.id.api?.length > 0 && app !== this.app.id.api) api = this.app.id.api

      if (!api) {
        console.error('🪝 No API ID found')
        return
      }

      let xhr = await $nuxt.$axios.get(`/get/${api}.json`)

      if (xhr.status == 200) {
        console.warn('🪝 Data received: Updating')
        return xhr.data
      } else {
        console.error('🪝 Error loading data from API', xhr)
      }
    },

    //+-------------------------------------------------
    // normalize()
    // Normalizes data for the game.
    // This is meant to be used when the game is used in the app
    // For preparing data to be stored, use process() or prepareToStore()
    // -----
    // Created on Tue Feb 20 2024
    // Created on Wed Dec 11 2024 - Normalize local uuids with API
    //+-------------------------------------------------
    normalize(game) {
      // game.v = $data.v

      game.id = game.id || {}
      game.is = game.is || {}
      game.log = game.log || []
      game.time = game.time || {}
      game.scores = game.scores || {}
      game.genres = game.genres || []
      game.playtime = game.playtime || {}

      if (game.epic_id) game.id.epic = game.epic_id
      if (game.steam_id) game.steam_id = Number(game.steam_id)
      if (game.id.steam) game.id.steam = Number(game.id.steam)

      if (game.api_id) game.id.api = game.api_id
      if (!game.uuid || game.uuid?.indexOf('local:') > -1) {
        if (game.id.api) {
          // game.uuid = game.id.api
          game.uuid = $data.reIndex(game.uuid, game.id.api)
        }
        // if (game.is_api) {
        //   game.api_id = game.uuid
        //   game.uuid = game.api_id
        // }
      }

      // game.updated_at = game.updated_at || 0

      delete game.epic_id
      delete game.trigger
      delete game.enabled
      delete game.data
      return game
    },

    //+-------------------------------------------------
    // _score()
    // Generates a new score by taking context into account
    // -----
    // Created on Tue Feb 20 2024
    // Updated on Fri 08 Nov 2024 - Score is now handled in the API
    //+-------------------------------------------------
    _score(app) {
      return app.score || 0
      // let score = app.score || 0

      // // Avoid very high scores not verified
      // //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // if (!app.scores) score = score - 25
      // if (app.score >= 96 && !app.scores) {
      //   score = 50
      // }

      // // Reduce the final score if the amount of reviews is low
      // //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // if (app.scores?.steamCount < 100) score *= 0.7
      // else if (app.scores?.steamCount < 1000) score *= 0.8
      // else if (app.scores?.steamCount < 3000) score *= 0.9

      // if (app.score >= 95 && app.scores?.steamCount < 16000) score *= 0.8

      // // On games outside of steam...
      // //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // if (app.scores.igdb > 0 && app.scores?.igdbCount < 90) score *= 0.8

      // // Only when there is only igdb
      // //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // // if (app.scores && !app.scores?.steamCount) {
      // //   if (app.scores?.igdb >= 90 && !app.scores.igdbCount) score *= 0.8
      // // }

      // return score
    },

    _playtime(app) {
      if (!app.playtime) return 0

      return Object.entries(app.playtime)
        .filter(([key]) => !key.endsWith('_last'))
        .reduce((total, [, num]) => total + num, 0)
    },

    _dateReleasedAt(app) {
      if (!app.released_at) return null
      return $nuxt.$moment(app.released_at * 1000).format('LL')
    },

    _dateCreatedAt(app) {
      if (!app.created_at) return null
      return $nuxt.$moment(app.created_at).format('LL')
    },

    _dateUpdatedAt(app) {
      if (!app.updated_at) return null
      return $nuxt.$moment(app.updated_at * 1000).format('LL')
    },

    // _dateOwned(app) {
    //   return app.is.lib * 1000 || false
    // },

    async init() {
      if (!$nuxt) $nuxt = useNuxtApp()
      if (!$data) $data = useDataStore()
    },
  },
})

//+-------------------------------------------------
//| 🔃 HMR
//| https://pinia.vuejs.org/cookbook/hot-module-replacement.html
//+-------------------------------------------------
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot))
}
