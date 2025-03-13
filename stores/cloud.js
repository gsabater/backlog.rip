/*
 * @file:    \stores\cloudStore.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 30th July 2024
 * Modified: Thu 13 March 2025 - 17:23:39
 */

import { createClient } from '@supabase/supabase-js'
import cloudService from '../services/cloudService'

let $nuxt = null
let $data = null
let $user = null
let $guild = null
let $state = null

//+-------------------------------------------------
// Cloud status
//+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// - local
// - connecting
// - conflict
// - error
// - syncing
// - sync:done
//+-------------------------------------------------

export const useCloudStore = defineStore('cloud', {
  state: () => ({
    status: 'local',
    connected: false,

    $sb: null, // Supabase client
    jwt: null, // JWT token identifying the user
    sub: null, // Subject uuid defined in supabase
    backups: [], // Array of backups

    b: {},
    backup: {
      enabled: false,

      hash: null,
      user_id: null,

      sign_account: null,
      sign_states: null,
      sign_library: null,

      games: null,
      states: null,
    },

    dimensions: {
      account: {
        up: 'backupAccount',
        down: 'restoreAccount',
      },
      states: {
        up: 'backupStates',
        down: 'restoreStates',
      },
      library: {
        up: 'backupLibrary',
        down: 'restoreLibrary',
      },
    },

    anon: {
      url: 'https://qmavxjmcknvrpdpczswh.supabase.co',
      head: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.',
      body: 'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtYXZ4am1ja252cnBkcGN6c3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU1OTcwNjEsImV4cCI6MjAyMTE3MzA2MX0.',
      sign: 'W4ucizFl9U0A_oIcZBpILsPXoP5cXbBi6l8LFeIS7e4',
    },
  }),

  actions: {
    //+-------------------------------------------------
    // sync()
    // Starts the synchronization process for every object
    // -----
    // Created on Mon Aug 19 2024
    // Updated on Thu Mar 13 2025
    //+-------------------------------------------------
    async sync() {
      if ($nuxt.$auth.config.cloud == false) return

      console.groupCollapsed('🔸 ⚡Cloud sync')
      this.status = 'syncing'

      // Prepare and analyze the backup
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      await this.prepareAndAnalyze()

      // Everything is all right
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (this.isAllOk) {
        console.groupEnd()
        log('⚡✅ Synchronization is ok')

        this.status = 'sync:done'
        $nuxt.$mitt.emit('sync:done')
        return
      }

      // Whoops, we have a conflict
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (this.b.conflict) {
        this.conflict()
        return
      }

      // Synchronize local account
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      await this.doSync('account')

      // Synchronize states
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      await this.doSync('states')

      // Synchronize library
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      await this.doSync('library')

      // Finalize the backup
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (this.backup.enabled) await this.storeBackup()

      console.groupEnd()
      log('⚡✅ Synchronization complete')

      this.status = 'sync:done'
      $nuxt.$mitt.emit('sync:done')
    },

    //+-------------------------------------------------
    // checkCredentials()
    // Checks the user credentials. Credentials are required
    // to connect to the cloud client and sync data
    // -----
    // Created on Thu Aug 15 2024
    //+-------------------------------------------------
    checkCredentials() {
      if (!$user.jwt) {
        log(
          '⚡ Unable to establish cloud connection due to missing credentials',
          $user.jwt,
          $user
        )
        this.status = 'local'
        return false
      }

      this.jwt = $user.jwt
      this.sub = $user.cloud.sub

      return true
    },

    //+-------------------------------------------------
    // prepareAndAnalyze()
    // Prepares and checks the versioning and hash of
    // both local and cloud backups
    // -----
    // Created on Fri Aug 30 2024
    //+-------------------------------------------------
    async prepareAndAnalyze() {
      let latest = this.backups[0]

      // Case 0: No backups found in the cloud
      // Action: Create a new backup and upload local
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (this.backups.length == 0) {
        log('⚡ 0.1 ~ No backups found in the cloud, creating a new one...')
        await this.prepareBackup('new')
        // await this.analyze()
        // return
      }

      // Case 1: Client does not have local tracking
      // Verify data integrity to download or conflict
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      else if (!this.client.hash) {
        log('⚡ 1.1 ~ No hash found locally, analyzing...')
        await this.prepareBackup('latest')
        // await this.analyze()
        // return
      }

      // Case 2: Hashes differ between cloud and client
      // This can be a conflict. Trying autosolve
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      else if (latest.hash !== this.client.hash) {
        log('⚡ 2.1. versions are different')
        await this.prepareBackup('latest')
        // await this.analyze()
        // return
      }

      // Case 3: Hashes match
      // Verify data integrity to download or upload
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      else {
        log('⚡ Incrementing the latest backup')
        this.prepareBackup('connected')
      }

      // Analyze the backup
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      await this.analyze()

      // Try to resolve an arised conflict
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      await this.conflictAutoResolution()
    },

    //+-------------------------------------------------
    // analyze()
    // Checks the integrity of the backups for each dimension
    // -----
    // Created on Fri Aug 30 2024
    // Updated on Mon Dec 23 2024 - Moved logic to prepare()
    //+-------------------------------------------------
    async analyze() {
      log(`⚡ cli:${this.client.hash} ⇢ clo:${this.backup.hash}`)

      // ⇢ Analyze the integrity of each dimension
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let dimensions = Object.keys(this.dimensions)
      for (let dimension of dimensions) {
        this.integrityCheck(dimension)
      }
    },

    //+-------------------------------------------------
    // prepareBackup()
    // Tries to find a valid backup in the array or
    // creates a new one to be used for the synchronization
    // -----
    // Created on Wed Aug 21 2024
    // Updated on Mon Dec 23 2024 - Prepare now means hashing and versioning
    //+-------------------------------------------------
    async prepareBackup(type = null) {
      this.backup.user_id = this.sub

      if (type == 'new') {
        this.backup.hash = this.makeHash()
        // this.backup.created_at = dates.timestamp()
      }

      if (type == 'latest') {
        this.backup = { ...this.backups[0] }
      }

      if (type == 'connected') {
        if (this.b.hash !== this.backup.hash) {
          let backup = this.backups.find((backup) => backup.hash == this.client.hash)
          this.backup = { ...backup }

          let timeAgo = $nuxt.$moment().diff($nuxt.$moment(backup.created_at), 'hours')
          if (timeAgo > 12) {
            this.backup.hash = this.makeHash()
            // this.backup.created_at = dates.timestamp()
          }
        }
      }

      // ⇢ Assign version from hash
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      this.b.hash = this.backup.hash

      if (this.backup?.hash) {
        const [version, hash] = this.backup.hash.split('.') ?? [0, 'xxx']
        this.b['hash.v'] = parseInt(version) ?? 0
        this.b['hash.h'] = hash || this.backup.hash
      }

      if (this.client?.hash) {
        const [version, hash] = this.client.hash.split('.') ?? [0, 'xxx']
        this.b['cli.v'] = parseInt(version) ?? 0
        this.b['cli.h'] = hash || this.client.hash
      }
    },

    //+-------------------------------------------------
    // storeBckp()
    // Pre stores the backup calling a debounced function
    // -----
    // Created on Wed Aug 21 2024
    //+-------------------------------------------------
    // async storeBckp() {
    //   log(`⚡ Storing the backup... (5s)`)
    //   clearTimeout(this._backupTimeout)
    //   this._backupTimeout = setTimeout(() => this.storeBackup(), 5000)
    // },

    //+-------------------------------------------------
    // storeBackup()
    // Stores the backup to the cloud and updates the local
    // -----
    // Created on Wed Aug 21 2024
    //+-------------------------------------------------
    async storeBackup() {
      delete this.backup.id
      delete this.backup.enabled

      let latest = this.backups[0]
      if (!this.backups.find((backup) => backup.hash == this.backup.hash)) {
        this.backups.unshift(this.backup)
      }

      $user.cloud.hash = this.backup.hash ?? $user.cloud.hash
      $user.cloud.states = this.backup.sign_states ?? $user.cloud.states
      $user.cloud.account = this.backup.sign_account ?? $user.cloud.config
      $user.cloud.library = this.backup.sign_library ?? $user.cloud.library

      $user.cloud.updated_at = dates.timestamp()
      this.backup.updated_at = dates.timestamp()

      if (latest?.hash !== this.backup.hash || !this.backup.created_at) {
        this.backup.created_at = dates.timestamp()
      }

      const { data, error } = await this.$sb
        .from('cloud')
        .upsert(this.backup, { onConflict: ['hash'] })

      if (error) {
        console.warn('storeBackup', error)
        return
      }

      $user.putAccount($user.cloud, 'cloud')
      // $nuxt.$toast.success('Your data has been synchronized')
    },

    //+-------------------------------------------------
    // conflict()
    // There has been a conflict that needs to be resolved
    // -----
    // Created on Mon Dec 23 2024
    //+-------------------------------------------------
    conflict() {
      if (!this.b.conflict) return

      this.status = 'conflict'
      $nuxt.$mitt.emit('cloud:conflict')
    },

    //+-------------------------------------------------
    // conflictAutoResolution()
    // Takes values from config to determine a resolution
    // -----
    // Created on Mon Dec 23 2024
    //+-------------------------------------------------
    async conflictAutoResolution() {
      if (!this.b.conflict) return
      if (!$user.config.cloud_resolve) return false

      let local = this.b['cli.v']
      let cloud = this.b['hash.v']
      let action = $user.config.cloud_action
      let tolerance = $user.config.cloud_tolerance

      if (Math.abs(cloud - local) > tolerance) {
        log('⚡ The conflict not within tolerance limits', cloud, local)
        return
      }

      switch (action) {
        case 'downloadAlways':
        case 'downloadIfNewer':
          if (action == 'downloadAlways' || cloud > local) {
            log('Downloading newer version from cloud…')
            log(`⇢ Resolving conflict (within tolerance ${tolerance}) `)

            this.resolve('download', false)
          }
          break

        case 'uploadAlways':
          log('Uploading to cloud (always)…')
          this.resolve('upload', false)
          break
      }
    },

    //+-------------------------------------------------
    // resolve()
    // Resolves the conflict by downloading or uploading
    // the data from the cloud
    // -----
    // Created on Fri Sep 13 2024
    //+-------------------------------------------------
    async resolve(action, sync = true) {
      this.status = 'syncing'
      this.b.conflict = null

      if (action == 'upload') {
        let hash = this.makeHash('new')
        this.backup.hash = hash
        $user.cloud.hash = hash
      }

      if (action == 'download') {
        this.prepareBackup('latest')
      }

      let dimensions = Object.keys(this.dimensions)
      for (let dimension of dimensions) {
        if (this.b[dimension] !== 'ok') {
          this.b[dimension] = action
          this.client[dimension] = `0.${action}`
        }
      }

      if (sync) {
        await this.sync()
        return true
      }
    },

    //+-------------------------------------------------
    // doSync(dimension)
    // Checks both local and cloud account signature
    // Synchronizes the local account with the cloud
    // -----
    // Created on Mon Aug 19 2024
    //+-------------------------------------------------
    async doSync(dimension) {
      if (this.b[dimension] == 'ok') return

      // console.warn(this.b[dimension + '.cli.hash'])
      // console.warn(this.b[dimension + '.clo.hash'])
      log(`⇢ Sync ${dimension} ${this.b[dimension]}`)

      if (this.b[dimension].includes('up')) {
        await this[this.dimensions[dimension]['up']]()
      }

      if (this.b[dimension].includes('down')) {
        await this[this.dimensions[dimension]['down']]()
      }
    },

    //+-------------------------------------------------
    // backupAccount()
    // Signs the local data, compares again the signature
    // and uploads to the cloud
    // -----
    // Created on Tue Aug 20 2024
    //+-------------------------------------------------
    async backupAccount() {
      let data = JSON.parse(
        JSON.stringify({
          account: { ...$nuxt.$auth.me },
          config: { ...$nuxt.$auth.config },
          sub: this.sub,
        })
      )

      // Remove fields and clean the data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      const cleanFields = {
        config: ['updated_at'],
        account: [
          'uuid',
          'bearer',
          'avatar',
          'updated_at',
          'steam_updated_at',
          'steam_data',
        ],
      }

      Object.entries(cleanFields).forEach(([key, fields]) => {
        fields.forEach((field) => delete data[key][field])
      })

      // Compare and assign signatures
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let sign = await this.makeSignature(data)

      this.backup.enabled = true
      this.backup.sign_account = sign.full

      if (sign.hash == this.b['account.clo.hash']) {
        log(
          '⚡ account ~ The integrity hash has been compared with the cloud and no synchronization is needed'
        )
        return
      }

      // Upload the data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      log('⚡ uploading account...', JSON.stringify(data))
      const { xhr, error } = await this.$sb.from('cloud_accounts').upsert(
        {
          user_id: this.sub,
          data: JSON.stringify(data),
          signature: sign.hash,
          updated_at: dates.timestamp(),
        },
        { onConflict: ['signature'] }
      )
    },

    //+-------------------------------------------------
    // backupStates()
    // Signs and uploads to the cloud
    // -----
    // Created on Fri Aug 23 2024
    //+-------------------------------------------------
    async backupStates() {
      let data = await $nuxt.$db.states.toArray()

      // Compare and assign signatures
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let sign = await this.makeSignature(data)

      this.backup.enabled = true
      this.backup.states = data.length
      this.backup.sign_states = sign.full

      if (sign.hash == this.b['states.clo.hash']) {
        log('⚡ states ~ The integrity hash has been compared and no sync')
        return
      }

      // Upload the data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      log('⚡ uploading states...')
      const { xhr, error } = await this.$sb.from('cloud_states').upsert(
        {
          user_id: this.sub,
          signature: sign.hash,
          data: JSON.stringify(data),
          updated_at: dates.timestamp(),
        },
        { onConflict: ['signature'] }
      )
    },

    //+-------------------------------------------------
    // backupLibrary()
    // Backups the local library to the cloud
    // Has a control signature to prevent uploading the same data
    // -----
    // Created on Tue Aug 20 2024
    //+-------------------------------------------------
    async backupLibrary() {
      let games = $data.library().map(this.cleanGame)

      // Blobify the library
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      const data = JSON.stringify(games)
      const blob = new Blob([data], { type: 'application/json' })
      // const url = URL.createObjectURL(blob)

      // Sign and control the blob
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let sign = await this.makeSignature(data)

      this.backup.enabled = true
      this.backup.games = games.length
      console.warn(sign.hash, this.b['library.clo.hash'])
      if (sign.hash == this.b['library.clo.hash']) {
        log('⚡ library ~ The integrity hash has been compared and no sync is required')
        return
      }

      // Upload the blob to the cloud
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      log('⚡ uploading library...')
      this.backup.sign_library = sign.full

      let date = $nuxt.$moment(sign.time * 1000).format('YYYY-MM-DD')
      let { xhr, error } = await this.$sb.storage
        .from('libraries')
        .upload(`${this.backup.user_id}/${date}.json`, blob, {
          cacheControl: '3600',
          upsert: true,
        })

      if (error) {
        console.error('Error uploading backup:', error)
        return
      }
    },

    //+-------------------------------------------------
    // cleanGame()
    // Takes a game object and returns a clean version
    // -----
    // Created on Tue Aug 20 2024
    //+-------------------------------------------------
    cleanGame(game) {
      let clean = {}
      let whitelist = [
        'uuid',
        'name',
        'id',
        'is',
        'state',
        'cover',
        'playtime',
        'achievements',
      ]

      for (const key in game) {
        if (key == 'achievements') {
          let ach = cloudService.prepareAchievements(game)
          if (ach) clean[key] = ach
        } else if (whitelist.includes(key)) clean[key] = game[key]
      }

      return clean
    },

    //+-------------------------------------------------
    // restoreAccount()
    // Restores the local data from the cloud
    // -----
    // Created on Tue Aug 20 2024
    //+-------------------------------------------------
    async restoreAccount() {
      log('⚡ Downloading account...')
      this.backup.enabled = true

      // ⇢ Fetch data from the cloud
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let xhr = await this.$sb
        .from('cloud_accounts')
        .select('data')
        .eq('signature', this.b['account.clo.hash'])
        .limit(1)
        .single()

      // ⇢ Decode and assign
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let json = xhr.data
      let data = JSON.parse(json.data)

      Object.assign($user.user, data.account)
      Object.assign($user.config, data.config)

      let object = JSON.parse(JSON.stringify($user.config))
      let config = Object.entries(object).map(([k, v]) => {
        // Autosync always off
        if (k == 'autosync_steam') v = false

        return {
          key: k,
          value: v,
        }
      })

      $user.putAccount($user.user, 'me')
      $nuxt.$db.config.bulkPut(config)

      // $user.putAccount($user.cloud, 'cloud')
    },

    //+-------------------------------------------------
    // restoreStates()
    //
    // -----
    // Created on Thu Sep 05 2024
    //+-------------------------------------------------
    async restoreStates() {
      log('⚡ Downloading states...')
      this.backup.enabled = true

      // ⇢ Fetch data from the cloud
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let xhr = await this.$sb
        .from('cloud_states')
        .select('data')
        .eq('signature', this.b['states.clo.hash'])
        .limit(1)
        .single()

      // ⇢ Decode and assign
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let json = xhr.data
      let data = JSON.parse(json.data)

      await $nuxt.$db.states.clear()
      await $nuxt.$db.states.bulkPut(data)
      await $state.load(true)
    },

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Thu Sep 05 2024
    //+-------------------------------------------------
    async restoreLibrary() {
      log('⚡ Downloading library...')
      this.backup.enabled = true

      // ⇢ Fetch data from the cloud
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let date = $nuxt.$moment(this.b['library.clo.at'] * 1000).format('YYYY-MM-DD')
      let { data, error } = await this.$sb.storage
        .from('libraries')
        .download(`${this.backup.user_id}/${date}.json`)

      // ⇢ Decode and assign
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let json = await this.parseJSONFromBlob(data)

      $data.emptyLibrary()
      await $nuxt.$db.games.bulkPut(json)

      await $data.loadGames(true)
      await $state.indexLibrary('all')
    },

    //+-------------------------------------------------
    // makeSignature()
    // Signs a json object and returns a signature
    // -----
    // Created on Fri Aug 30 2024
    //+-------------------------------------------------
    async makeSignature(json) {
      let string = JSON.stringify(json)

      const encoder = new TextEncoder()
      const data = encoder.encode(string)

      // Hash using SHA-256
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('')

      return {
        hash: `${hashHex}`,
        time: `${dates.stamp()}`,
        full: `${dates.stamp()}.${hashHex}`,
      }
    },

    //+-------------------------------------------------
    // makeHash()
    // Generates a hash and increments the version
    // -----
    // Created on Fri Sep 06 2024
    //+-------------------------------------------------
    makeHash(create = false) {
      let old = this.backup.hash
      let version = old && old.includes('.') ? old.split('.')[0] : 0
      if (create) version = 0

      let versioned = parseInt(version) + 1

      return `${versioned}.${Math.random().toString(36).substring(2, 10)}`
    },

    //+-------------------------------------------------
    // update()
    // Resets the source signature
    // And calls for a synchronization
    // -----
    // Created on Tue Aug 20 2024
    //+-------------------------------------------------
    async update(source) {
      if (!this.client[source]) return
      if ($nuxt.$auth.config.cloud == false) return

      debugger
      log(`⚡⌛ queue to Sync ~ ${source}`, this.client[source])
      if (this.client[source]) this.client[source] = '0.update'
      return

      if (this.status == 'syncing') return
      this.status = 'syncing'
      await delay(1000)
      this.sync()
    },

    //+-------------------------------------------------
    // integrityCheck()
    // To determine the integrity of a signature,
    // ⇢ They can be the same, so no action is needed
    // ⇢ The one with newer timestamp is the latest
    // -----
    // Created on Fri Aug 30 2024
    //+-------------------------------------------------
    integrityCheck(dimension) {
      const client = this.client?.[dimension]
      const signed = this.backup?.['sign_' + dimension]

      // Extract parts from client and backup dimensions
      const [cloudAt = 0, cloudHash] = signed?.split('.') || []
      const [clientAt = 1, clientHash] = client?.split('.') || []

      // Store hash values for further inspection
      this.b[`${dimension}.clo.at`] = cloudAt
      this.b[`${dimension}.clo.hash`] = cloudHash
      this.b[`${dimension}.cli.hash`] = clientHash

      // We're ok
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (signed && client === signed) {
        log(`⚡ ${dimension} ⇢ synchronized (ok)`)
        this.b[dimension] = 'ok'
        return 'ok'
      }

      // Backup (upload) data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (
        !signed ||
        (client && clientAt >= cloudAt) ||
        clientHash === 'update' ||
        clientHash == 'upload'
      ) {
        log(`⚡ ${dimension} ⇢ outdated (up)`, clientAt, cloudAt)
        this.b[dimension] = 'up'
        return 'up'
      }

      // Restore (download) the account
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (
        signed &&
        (dimension !== 'library' ||
          $data.library().length === 0 ||
          clientHash === 'download')
      ) {
        log(`⇢ ${dimension} out of sync (down)`, clientAt, cloudAt)
        this.b[dimension] = 'down'

        return 'down'
      }

      // 💣 Conflict detected 💣 💣 💣 💣
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      this.b[dimension] = 'conflict'
      this.b.conflict = true
      return 'conflict'
    },

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Thu Sep 05 2024
    //+-------------------------------------------------
    async parseJSONFromBlob(blob) {
      try {
        const text = await blob.text() // Read the blob content as text
        const json = JSON.parse(text) // Parse the text into JSON
        return json
      } catch (error) {
        console.error('Error parsing JSON:', error)
        throw error
      }
    },

    //+-------------------------------------------------
    // connect()
    // Initializes stores, checks online status and credentials
    // And creates the supabase client
    // -----
    // Created on Wed Jul 31 2024
    //+-------------------------------------------------
    async connect() {
      $nuxt ??= useNuxtApp()
      $data ??= useDataStore()
      $user ??= useUserStore()
      $state ??= useStateStore()
      $guild ??= useGuildStore()

      if ($nuxt.$app.offline) {
        log('⚡ Cloud sync is disabled in offline mode')
        this.status = 'offline'
        return
      }

      if ($nuxt.$auth.config.cloud == false) {
        log('⚡ Cloud sync is disabled in the user settings')
        this.status = 'disabled'
        return
      }

      log('⚡ cloud:connecting')
      this.status = 'connecting'

      if (!this.checkCredentials()) return

      this.$sb = createClient(
        this.anon.url,
        this.anon.head + this.anon.body + this.anon.sign,
        {
          // auth: {
          //   autoRefreshToken: false,
          //   persistSession: false,
          //   detectSessionInUrl: false,
          // },

          global: {
            headers: {
              Authorization: `Bearer ${this.jwt}`,
            },
          },
        }
      )

      const { data } = this.$sb.auth.onAuthStateChange((event, session) => {
        // log(event, session)

        if (event === 'INITIAL_SESSION') {
          // handle initial session
        } else if (event === 'SIGNED_IN') {
          // handle sign in event
        } else if (event === 'SIGNED_OUT') {
          // handle sign out event
        } else if (event === 'PASSWORD_RECOVERY') {
          // handle password recovery event
        } else if (event === 'TOKEN_REFRESHED') {
          // handle token refreshed event
        } else if (event === 'USER_UPDATED') {
          // handle user updated event
        }
      })

      const { data: backups, error } = await this.$sb
        .from('cloud')
        .select('*')
        .order('id', { ascending: false })

      if (error) {
        this.status = 'error'
        log('⚡ Fatal error retrieving cloud backups', error.message)
        return
      }

      this.backups = backups
      this.sync()
    },
  },

  getters: {
    //+-------------------------------------------------
    // is()
    // Returns "ok" or this.status
    // -----
    // Created on Wed Aug 14 2024
    //+-------------------------------------------------
    is() {
      return this.status // == 'sync:done' ? 'ok' : this.status
    },

    isAllOk() {
      let dimensions = Object.keys(this.dimensions)
      for (let dimension of dimensions) {
        if (this.b[dimension] !== 'ok') return false
      }

      return true
    },

    //+-------------------------------------------------
    // enabled()
    // boolean to check if the user has cloud enabled
    // -----
    // Created on Thu Oct 24 2024
    //+-------------------------------------------------
    enabled() {
      return this.jwt && this.status !== 'local' && this.status !== 'offline'
    },

    //+-------------------------------------------------
    // client
    // References the cloud object in the user store
    // -----
    // Created on Mon Aug 19 2024
    //+-------------------------------------------------
    client() {
      return $user?.cloud ?? null
    },
  },
})

//+-------------------------------------------------
//| 🔃 HMR
//| https://pinia.vuejs.org/cookbook/hot-module-replacement.html
//+-------------------------------------------------
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCloudStore, import.meta.hot))
}
