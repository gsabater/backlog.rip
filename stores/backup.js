/*
 * @file:    \stores\backupStore.js
 * @desc:    The cloud store manages the synchronization
 * of data with the Supabase service.
 * ----------------------------------------------
 * Created Date: 30th July 2024
 * Modified: 19th November 2025 - 03:59:12
 */

import { consoleWarn } from 'vuetify/lib/util/console.mjs'
import supabase from '../modules/integrations/supabase'
import backupService from '../services/backupService'

let $db = null
let $log = null
let $moment = null

let $nuxt = null
let $data = null
let $user = null
let $guild = null
let client = null

//+-------------------------------------------------
// Cloud states
//+-------------------------------------------------
// - local
// - online
// - uploading
// - downloading
// - conflict
// - error
//+-------------------------------------------------
export const useBackupStore = defineStore('backup', {
  state: () => ({
    // Backup status
    status: 'local',

    // Array of backups from cloud
    backups: [],

    // Current backup being handled
    backup: {
      hash: null,
      user_id: null,

      sign_account: null,
      sign_states: null,
      sign_library: null,

      games: null,
      states: null,
    },

    // Action state
    // Track changes to be made
    action: {
      states: null,
      account: null,
      library: null,

      update: null,
      conflict: null,
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
  }),

  //+-------------------------------------------------
  // Entry points
  //+-------------------------------------------------
  // - connect
  // - syncFromCloud
  // - backupToCloud
  //+-------------------------------------------------
  actions: {
    //+-------------------------------------------------
    // sync()
    // Starts the synchronization process for every object
    // -----
    // Created on Mon Aug 19 2024
    // Updated on Thu Mar 13 2025
    //+-------------------------------------------------
    // async sync() {
    //   debugger
    //   if ($nuxt.$auth.config.cloud == false) return
    //   if ($nuxt.$cloud.process) return

    //   console.groupCollapsed('🔸 ⚡Cloud sync')
    //   $nuxt.$cloud.process = 'backup:start'

    //   // Prepare and analyze the backup
    //   //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //   await this.prepareAndAnalyze()

    //   // Everything is all right
    //   //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //   if (this.isAllOk) {
    //     console.groupEnd()
    //     $log('⚡✅ Synchronization is ok')

    //     this.status = 'sync:done'
    //     $mitt.emit('sync:done')
    //     return
    //   }

    //   // Whoops, we have a conflict
    //   //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //   if (this.b.conflict) {
    //     this.conflict()
    //     return
    //   }

    //   // Synchronize local account
    //   //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //   await this.doSync('account')

    //   // Synchronize states
    //   //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //   await this.doSync('states')

    //   // Synchronize library
    //   //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //   await this.doSync('library')

    //   // Finalize the backup
    //   //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //   if (this.backup.enabled) await this.storeBackup()

    //   console.groupEnd()
    //   log('⚡✅ Synchronization complete')

    //   this.status = 'sync:done'
    //   $mitt.emit('sync:done')
    // },

    //+-------------------------------------------------
    // syncFromCloud()
    // Downloads latest backup from cloud to restore it
    // -----
    // Created on Wed Oct 08 2025
    //+-------------------------------------------------
    async syncFromCloud() {
      // We should be ready to get the cloud data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      this.backups = await supabase.getBackups()

      // ⇢ Prepare the selected backup to download
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      await this.prepareToDownload()

      // ⇢ Display a dialog to resolve the conflict manually
      // ⇢ EDGE: Sometimes, the conflict is detected but not resolved,
      // in this case, ask for manual resolution
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (this.action.conflict == 'manual' || this.action.conflict === true) {
        $mitt.emit('backup:conflict', { backup: this.backup })
        return
      }

      // ⇢ Restore the conflict automatically
      // if there is newer data in the cloud
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (this.action.conflict == 'download') {
        await this.applyBackup(this.backup)
      }

      // Update the local hash on DDBB
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (this.action.updateIndexedDB) {
        await this.storeBackup()
        $mitt.emit('reload:show')
        // $mitt.emit('backup:restored')
      }
    },

    //+-------------------------------------------------
    // prepareToDownload()
    // Prepares and checks if there is a backup to download
    // -----
    // Created on Sun Oct 12 2025
    //+-------------------------------------------------
    async prepareToDownload() {
      // I take the local info from $user.cloud instead of this.local
      // Because sometimes the computed is not updated on time...
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let local = $user.cloud

      // ⇢ No backups found in the cloud
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (this.backups.length == 0) {
        return $log('[Backups] No backups in the cloud')
      }

      // ⇢ Hashes match
      // Verify data integrity to download or upload
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (this.latest.hash == local.hash) {
        $log('[Backups] Cloud and local backups match')
        console.debug(`↪ Client ${local.hash} ⇢ Cloud ${this.latest.hash}`)
        return
      }

      // ⇢ Hashes differ between cloud and local
      // Prepare the latest backup and try to resolve it
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      $log('[Backups] Diff found between cloud and local backups')
      await this.prepareBackup('latest')

      // Analyze the backup
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      await this.analyze()

      // Try to resolve an arised conflict
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      await this.conflictAutoResolution()
    },

    //+-------------------------------------------------
    // backupToCloud()
    // Check data integrity and uploads a new backup to the cloud
    // -----
    // Created on Mon Oct 20 2025
    //+-------------------------------------------------
    async backupToCloud() {
      if (this.status == 'local') return
      $nuxt.$cloud.process = 'sync:backup'

      // ⇢ Prepare this.backup to be uploaded
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      await this.prepareToUpload()

      // ⇢ Upload the data to the cloud
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      await this.makeBackup()
      await this.storeBackup()
      await supabase.storeBackup(this.backup)

      $nuxt.$cloud.process = null
    },

    //+-------------------------------------------------
    // prepareToUpload()
    // Prepares this.backup for a new upload to the cloud
    // -----
    // Created on Mon Oct 20 2025
    //+-------------------------------------------------
    async prepareToUpload() {
      // ⇢ No backups found in the cloud
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (this.backups.length == 0) {
        $log('[Backups] No backups in the cloud, creating a new one...')
        await this.prepareBackup('new')
      }

      // ⇢ Hashes match
      // Verify data integrity to download or upload
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (this.latest.hash !== this.local.hash) {
        $log('[Backups] Cloud and local backups differ')
        console.debug(`↪ Client ${this.local.hash} ⇢ Cloud ${this.latest.hash}`)

        // Should not happen, emit conflict from here
        debugger
        return
      }

      // ⇢ Hashes match
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      await this.prepareBackup('connected')

      // Analyze the backup
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      await this.analyze()
    },

    //+-------------------------------------------------
    // prepareAndAnalyze()
    // Prepares and checks the versioning and hash of
    // both local and cloud backups
    // -----
    // Created on Fri Aug 30 2024
    //+-------------------------------------------------
    // async prepareAndAnalyze() {
    //   debugger

    //   // Case 0: No backups found in the cloud
    //   // Action: Create a new backup and upload local
    //   //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //   if (this.backups.length == 0) {
    //     $log('[Backups] No backups found in the cloud, creating a new one...')
    //     await this.prepareBackup('new')
    //     // await this.analyze()
    //     // return
    //   }

    //   // Case 1: Local does not have a tracked backup
    //   // Verify data integrity to download or conflict
    //   //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //   else if (!this.local.hash) {
    //     $log('[Backups] No hash found locally, analyzing...')
    //     await this.prepareBackup('latest')
    //     // await this.analyze()
    //     // return
    //   }

    //   // Case 2: Hashes differ between cloud and local
    //   // This can be a conflict. Trying autosolve
    //   //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //   else if (this.latest.hash !== this.local.hash) {
    //     $log('[Backups] Versions are different')
    //     await this.prepareBackup('latest')
    //   }

    //   // Case 3: Hashes match
    //   // Verify data integrity to download or upload
    //   //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //   else {
    //     $log('[Backups] Cloud and local backups match')
    //     return
    //     console.warn('🔥 WIP - SHOULD NOT DO ANYTHING ELSE')
    //     await this.prepareBackup('connected')
    //   }

    //   // Analyze the backup
    //   //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //   await this.analyze()

    //   // Try to resolve an arised conflict
    //   //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //   await this.conflictAutoResolution()
    // },

    //+-------------------------------------------------
    // analyze()
    // Checks the integrity of the backups for each dimension
    // -----
    // Created on Fri Aug 30 2024
    // Updated on Mon Dec 23 2024 - Moved logic to prepare()
    //+-------------------------------------------------
    async analyze() {
      // ⇢ Analyze the integrity of each dimension
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      for (let dimension of Object.keys(this.dimensions)) {
        this.integrityCheck(dimension)
      }

      let { account, states, library } = this.action
      $log(`[ Backups.analyze ] Acc. ${account}, Sta. ${states}, Lib. ${library}`, this.action)
      $log(`↪ Backup integrity`, this.control)
    },

    //+-------------------------------------------------
    // integrityCheck()
    // -----
    // Created on Fri Aug 30 2024
    // Updated on Fri Oct 24 2025
    //+-------------------------------------------------
    integrityCheck(dimension) {
      const local = this.local?.[dimension]
      const action = this.action[dimension]
      const signed = this.backup?.['sign_' + dimension]

      // Extract parts from local and backup dimensions
      const [cloudAt = 0, cloudHash] = signed?.split('.') || []
      const [localAt = 1, localHash] = local?.split('.') || []

      // Priority 1: Force actions (download/upload/update)
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (['download', 'upload', 'update'].includes(localHash)) {
        const perform = localHash === 'download' ? 'down' : 'up'
        $log(`↪ ${dimension} ⇢ forced ${perform}`)
        this.action[dimension] = perform
        return
      }

      if (['download', 'upload'].includes(action)) {
        const perform = this.action[dimension] === 'download' ? 'down' : 'up'
        $log(`↪ ${dimension} ⇢ forced ${perform} by action`)
        this.action[dimension] = perform
        return
      }

      // Priority 2: Signatures match - no action needed
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (signed && local === signed) {
        // $log(`↪ ${dimension} is synchronized (ok)`)
        this.action[dimension] = 'ok'
        return
      }

      // Priority 3: No cloud backup exists - upload
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (!signed) {
        $log(`↪ ${dimension} ⇢ no cloud backup (up)`)
        this.action[dimension] = 'up'
        return
      }

      // Priority 4: Empty local library - download
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (dimension === 'library' && $data.library().length === 0) {
        $log(`↪ ${dimension} ⇢ empty library (down)`)
        this.action[dimension] = 'down'
        return
      }

      // Priority 5: Local is newer - upload
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (local && localAt > cloudAt) {
        $log(`↪ ${dimension} ⇢ local newer (up)`, localAt, cloudAt)
        this.action[dimension] = 'up'
        return
      }

      // Priority 6: Cloud is newer - potential conflict
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (cloudAt > localAt) {
        $log(`↪ ${dimension} ⇢ Cloud backup is newer`)
        $log(`↪ ${dimension} from ${dates.timeAgo(cloudAt)}, local ${dates.timeAgo(localAt)}`)
        this.action.conflict = true
        this.action[dimension] = 'conflict'
        return
      }

      // Default: Same timestamp but different hashes - conflict
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      $log(`↪ ${dimension} ⇢ hash mismatch (conflict)`)
      this.action.conflict = true
      this.action[dimension] = 'conflict'
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
      $log(`↪ Data on device: ${this.local.hash}, ${dates.timeAgo(this.local.updated_at)}`)

      // ⇢ Make a new backup
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (type == 'new') {
        this.backup.hash = backupService.makeHash()
        this.backup.created_at = dates.timestamp()
        $log(`↪ Making a new backup: ${this.latest.hash} -> ${this.backup.hash}`)
      }

      // ⇢ Take the latest backup in cloud
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (type == 'latest') {
        this.backup = { ...this.latest }
        this.action.updateIndexedDB = true
        $log(`↪ Going to pull ${this.backup.hash}, from ${dates.timeAgo(this.backup.updated_at)}`)
      }

      // ⇢ Use the latest backup
      // And make a new iteration when stale
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (type == 'connected') {
        // Set this.backup with the data of the cloud backup matching hashes
        // let backup = this.backups.find((backup) => backup.hash == this.local.hash)

        this.backup = { ...this.latest }

        // If the backup is stale, make a new hash to upload
        let timeAgo = $moment().diff($moment(this.backup.created_at), 'hours')
        if (timeAgo > 24) {
          this.backup.hash = backupService.makeHash(this.backup)
          this.backup.created_at = dates.timestamp()

          $log(`[Backups] New hash: ${this.latest.hash} ⇢ ${this.backup.hash}, due ${timeAgo}h`)
        }
      }
    },

    // //+-------------------------------------------------
    // // uploadBackup()
    // // Stores the backup to the cloud and updates the local
    // // -----
    // // Created on Wed Aug 21 2024
    // // Updated on Tue Oct 21 2025
    // //+-------------------------------------------------
    // async uploadBackup() {
    //   delete this.backup.id
    //   // delete this.backup.enabled

    //   if (!this.backups.find((backup) => backup.hash == this.backup.hash)) {
    //     this.backups.unshift(this.backup)
    //   }

    //   $user.cloud.hash = this.backup.hash ?? $user.cloud.hash
    //   $user.cloud.states = this.backup.sign_states ?? $user.cloud.states
    //   $user.cloud.account = this.backup.sign_account ?? $user.cloud.config
    //   $user.cloud.library = this.backup.sign_library ?? $user.cloud.library

    //   $user.cloud.updated_at = dates.timestamp()
    //   this.backup.updated_at = dates.timestamp()

    //   if (this.latest?.hash !== this.backup.hash || !this.backup.created_at) {
    //     this.backup.created_at = dates.timestamp()
    //   }

    //   const { data, error } = await client
    //     .from('cloud')
    //     .upsert(this.backup, { onConflict: ['hash'] })

    //   if (error) {
    //     console.warn('storeBackup', error)
    //     return
    //   }

    //   $user.putAccount($user.cloud, 'cloud')
    //   // $nuxt.$toast.success('Your data has been synchronized')
    // },

    //+-------------------------------------------------
    // storeBackup()
    // Stores the backup to the local DDBB
    // -----
    // Created on Wed Aug 21 2024
    // Updated on Tue Oct 21 2025 - Split upload and store
    //+-------------------------------------------------
    async storeBackup() {
      $user.cloud.hash = this.backup.hash ?? $user.cloud.hash
      $user.cloud.states = this.backup.sign_states ?? $user.cloud.states
      $user.cloud.account = this.backup.sign_account ?? $user.cloud.account
      $user.cloud.library = this.backup.sign_library ?? $user.cloud.library
      $user.cloud.updated_at = dates.timestamp()

      // Update latest hashes
      this.backups[0] = { ...this.backups[0], ...this.backup }

      await $user.putAccount($user.cloud, 'cloud')

      $log(`↪ [Backups] Stored locally`, {
        hash: $user.cloud.hash,
        states: $user.cloud.states,
        account: $user.cloud.account,
        library: $user.cloud.library,
        updated_at: $user.cloud.updated_at,
      })

      $nuxt.$toast.success('Successfully synced')
    },

    //+-------------------------------------------------
    // conflictAutoResolution()
    // Takes values from config to determine a resolution
    // -----
    // Created on Mon Dec 23 2024
    //+-------------------------------------------------
    async conflictAutoResolution() {
      if (!this.action.conflict) return
      if (!$user.config.cloud_resolve) return false

      let local = this.control.local.version
      let cloud = this.control.cloud.version

      let action = $user.config.cloud_action
      let tolerance = $user.config.cloud_tolerance
      let versionDiff = Math.abs(cloud - local)

      if (versionDiff > tolerance) {
        this.action.updateIndexedDB = false
        this.action.conflict = 'manual'

        $log(`[Backups] Error resolving, versioning out of tolerance ${tolerance}`)
        return
      }

      // Resolve the conflict
      // Specifying the action
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (action == 'downloadAlways' || cloud > local) {
        $log(`↪ Resolved within tolerance ${versionDiff}/${tolerance} (${action})`)

        this.resolve('download')
        return
      }

      // The conflict could not be resolved automatically
      // Ask for the user for manual interaction
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      this.action.conflict = 'manual'
      $log(`[Backups] Error resolving, asking for manual interaction`)

      // switch (action) {
      //   case 'downloadAlways':
      //   case 'downloadIfNewer':
      //     if (action == 'downloadAlways' || cloud > local) {
      //       $log('[Backups] Downloading data from cloud…')
      //       $log(`↪ Resolved within tolerance ${versionDiff}/${tolerance} (${action})`)

      //       this.resolve('download', false)
      //     }
      //     break

      //   // This makes no sense, will be removed
      //   case 'uploadAlways':
      //     $log('[Backups] Uploading… Configured to always upload')
      //     this.resolve('upload', false)
      //     break
      // }
    },

    //+-------------------------------------------------
    // resolve()
    // Resolves the conflict by downloading or uploading
    // the data from the cloud
    // -----
    // Created on Fri Sep 13 2024
    // Updated on Thu Oct 09 2025 - Do not sync automatically
    //+-------------------------------------------------
    async resolve(action) {
      this.status = 'syncing:backup'

      if (action == 'upload') {
        debugger
        // let hash = backupService.makeHash('new')
        // this.backup.hash = hash
        // $user.cloud.hash = hash
      }

      if (action == 'download') {
        this.action.conflict = 'download'
        // this.prepareBackup('latest')
      }

      // let dimensions = Object.keys(this.dimensions)
      // for (let dimension of dimensions) {
      //   if (this.action[dimension] !== 'ok') {
      //     this.action[dimension] = action
      //     this.local[dimension] = `0.${action}`
      //   }
      // }

      // if (sync) {
      //   await this.sync()
      //   return true
      // }
    },

    //+-------------------------------------------------
    // doSync(dimension)
    // Checks both local and cloud account signature
    // Synchronizes the local account with the cloud
    // -----
    // Created on Mon Aug 19 2024
    //+-------------------------------------------------
    async doSync(dimension) {
      if (this.action[dimension] == 'ok') return

      if (this.action[dimension].includes('up')) {
        await this[this.dimensions[dimension]['up']]()
      }

      if (this.action[dimension].includes('down')) {
        await this[this.dimensions[dimension]['down']]()
      }
    },

    //+-------------------------------------------------
    // backupAccount()
    // Signs the local data, compares again the signature
    // and uploads to the cloud
    // -----
    // Created on Tue Aug 20 2024
    // Updated on Wed Oct 29 2025
    //+-------------------------------------------------
    async backupAccount() {
      let data = backupService.prepareAccountData($nuxt.$auth)
      data.sub = supabase.client.sub

      let signature = await backupService.makeSignature(data)
      if (signature.hash == this.control?.cloud?.account?.hash) {
        $log(`[Backups] ~ The account data hasn't changed (hash: ${signature.hash})`)
        return
      } else console.warn(signature.hash, this.control.cloud)

      // Upload to the server
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      this.backup.sign_account = signature.full
      await supabase.backupAccount(data, signature)
    },

    //+-------------------------------------------------
    // backupStates()
    // Signs and uploads to the cloud
    // -----
    // Created on Fri Aug 23 2024
    // Updated on Wed Oct 29 2025
    //+-------------------------------------------------
    async backupStates() {
      let data = await $db.states.toArray()
      let signature = await backupService.makeSignature(data)

      if (signature.hash == this.control?.cloud?.states?.hash) {
        $log(`[Backups] ~ The states data hasn't changed (hash: ${signature.hash})`)
        return
      } else console.warn(signature.hash, this.control.cloud)

      this.backup.states = data.length
      this.backup.sign_states = signature.full

      // Upload to the server
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      await supabase.backupStates(data, signature)
    },

    //+-------------------------------------------------
    // backupLibrary()
    // Backups the local library to the cloud
    // Has a control signature to prevent uploading the same data
    // -----
    // Created on Tue Aug 20 2024
    // Updated on Wed Oct 29 2025
    //+-------------------------------------------------
    async backupLibrary() {
      let data = $data.library()
      let json = backupService.prepareLibrary($data.library())

      let signature = await backupService.makeSignature(json)
      if (signature.hash == this.control?.cloud?.library?.hash) {
        $log(`[Backups] ~ The account data hasn't changed (hash: ${signature.hash})`)
        return
      } else console.warn(signature.hash, this.control.cloud)

      this.backup.games = data.length
      this.backup.sign_library = signature.full

      // Upload to the server
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      await supabase.backupLibrary(json, signature)

      // let { xhr, error } = await client.storage
      //   .from('libraries')
      //   .upload(`${this.backup.user_id}/${date}.json`, blob, {
      //     cacheControl: '3600',
      //     upsert: true,
      //   })

      // if (error) {
      //   console.error('Error uploading backup:', error)
      //   return
      // }
    },

    //+-------------------------------------------------
    // makeBackup()
    //
    // -----
    // Created on Fri Oct 24 2025
    //+-------------------------------------------------
    async makeBackup() {
      $log(`[Backups] Backing up data for #${this.backup.hash}`)

      let dimensions = Object.keys(this.dimensions)
      for (let dimension of dimensions) {
        // ⇢ Check if changes are needed
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (this.action[dimension] == 'ok') continue

        // ...
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        await this.doSync(dimension)
      }
    },

    //+-------------------------------------------------
    // applyBackup()
    // Apply the selected backup
    // -----
    // Created on Tue Apr 01 2025
    // Updated on Fri Oct 10 2025 - Improve hash tracking
    //+-------------------------------------------------
    async applyBackup(backup, manual = false) {
      $log(`[Backups] Applying backup #${backup.hash}`)

      // ⇢ This object includes the hashes to apply
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      this.action.apply = {}

      let dimensions = Object.keys(this.dimensions)
      for (let dimension of dimensions) {
        // ⇢ Check if changes are needed
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (!manual && this.action[dimension] == 'ok') continue

        const [time = 1, hash] = backup['sign_' + dimension]?.split('.') || []

        this.action[dimension] = 'download'
        this.action.apply[dimension] = hash
        this.action.apply[`${dimension}_at`] = time
        this.action.apply[`sign_${dimension}`] = backup['sign_' + dimension]

        // ...
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        await this.doSync(dimension)
      }
    },

    //+-------------------------------------------------
    // restoreAccount()
    // Downloads and applies the user account
    // -----
    // Created on Tue Aug 20 2024
    // Updated on Mon Oct 13 2025 - Use supabase integration
    //+-------------------------------------------------
    async restoreAccount() {
      let signature = this.action.apply.account
      $log(`[Backups] Downloading account (${this.action.account})`, signature)

      // ⇢ Fetch data with supabase
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let data = await supabase.getCloudAccount(signature)

      // ⇢ Restore and store data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      Object.assign($user.user, data.account)
      Object.assign($user.config, data.config)

      let object = JSON.parse(JSON.stringify($user.config))
      let config = Object.entries(object).map(([k, v]) => {
        return {
          key: k,
          value: v,
        }
      })

      $user.putAccount($user.user, 'me')
      $db.config.bulkPut(config)
    },

    //+-------------------------------------------------
    // restoreStates()
    // Downloads and applies states
    // -----
    // Created on Thu Sep 05 2024
    //+-------------------------------------------------
    async restoreStates() {
      let signature = this.action.apply.states
      $log(`[Backups] Downloading states (${this.action.states})`, signature)

      // ⇢ Fetch data with supabase
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let data = await supabase.getCloudStates(signature)

      // ⇢ Restore and store data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      await $db.states.clear()
      await $db.states.bulkPut(data)
    },

    //+-------------------------------------------------
    // restoreLibrary()
    // Downloads a json file from the user bucket
    // -----
    // Created on Thu Sep 05 2024
    //+-------------------------------------------------
    async restoreLibrary() {
      let signature = this.action.apply.library

      let time = this.action.apply.library_at
      let copy = $moment(time * 1000).format('YYYY-MM-DD')

      $log(`[Backups] Downloading library (${this.action.library}) from ${copy}`, signature)

      // ⇢ Fetch data with supabase
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let data = await supabase.getLibrary(copy)

      $data.emptyLibrary()
      await $db.games.bulkPut(data)

      await $data.loadDatabaseGames('again')
      $mitt.emit('data:ready')
    },

    // //+-------------------------------------------------
    // // makeSignature()
    // // Signs a json object and returns a signature
    // // -----
    // // Created on Fri Aug 30 2024
    // //+-------------------------------------------------
    // async makeSignature(json) {
    //   debugger
    //   let string = JSON.stringify(json)

    //   const encoder = new TextEncoder()
    //   const data = encoder.encode(string)

    //   // Hash using SHA-256
    //   const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    //   const hashArray = Array.from(new Uint8Array(hashBuffer))
    //   const hashHex = hashArray.map((bytes) => bytes.toString(16).padStart(2, '0')).join('')

    //   return {
    //     hash: `${hashHex}`,
    //     time: `${dates.stamp()}`,
    //     full: `${dates.stamp()}.${hashHex}`,
    //   }
    // },

    // //+-------------------------------------------------
    // // makeHash()
    // // Generates a hash and increments the version
    // // -----
    // // Created on Fri Sep 06 2024
    // //+-------------------------------------------------
    // makeHash(create = false) {
    //   debugger
    //   let old = this.backup.hash
    //   let version = old && old.includes('.') ? old.split('.')[0] : 0
    //   if (create) version = 0

    //   let versioned = parseInt(version) + 1
    //   let newHash = Math.random().toString(36).substring(2, 8)

    //   $log(`↪ Making a new backup: ${old} -> ${versioned}.${newHash}`)
    //   return `${versioned}.${newHash}`
    // },

    //+-------------------------------------------------
    // update()
    // Resets the source signature
    // And calls for a synchronization
    // -----
    // Created on Tue Aug 20 2024
    //+-------------------------------------------------
    // async update(source) {
    //   debugger
    //   if (!this.local[source]) return
    //   if ($nuxt.$auth.config.cloud == false) return

    //   debugger
    //   log(`⚡⌛ queue to Sync ~ ${source}`, this.local[source])
    //   if (this.local[source]) this.local[source] = '0.update'
    //   return

    //   if (this.status == 'syncing') return
    //   this.status = 'syncing'
    //   await delay(1000)
    //   this.sync()
    // },

    //+-------------------------------------------------
    // connect()
    // Initializes stores, checks online status and credentials
    // And creates the supabase client
    // -----
    // Created on Wed Jul 31 2024
    // Updated on Sun Oct 12 2025 - Improved booting
    //+-------------------------------------------------
    async connect() {
      $nuxt ??= useNuxtApp()

      $db = $nuxt.$db
      $log = $nuxt.$log
      $moment = $nuxt.$moment

      client = $nuxt.$cloud.supabase

      $data ??= useDataStore()
      $user ??= useUserStore()
      $guild ??= useGuildStore()

      if ($nuxt.$app.offline) {
        $log('[Backups] Disabled in offline mode')
        return
      }

      if ($nuxt.$auth.config.cloud == false) {
        $log('[Backups] Disabled in the user settings')
        return
      }

      if ($nuxt.$cloud.server.supabase !== 'online') {
        $log('[Backups] Connection cannot be established with supabase')
        return
      }

      this.status = 'online'
      $nuxt.$cloud.server.backups = 'online'
    },
  },

  getters: {
    //+-------------------------------------------------
    // latest
    // Is the latest backup object in the cloud
    // -----
    // Created on Mon Oct 20 2025
    //+-------------------------------------------------
    latest() {
      return this.backups[0] ?? null
    },

    //+-------------------------------------------------
    // local
    // References the latest backup object in the local device
    // Stored in the user store ($user.cloud)
    // -----
    // Created on Mon Aug 19 2024
    // Updated on Wed Oct 08 2025 - Renamed to "local"
    //+-------------------------------------------------
    local() {
      $user ??= useUserStore()
      return $user?.cloud ?? {}
    },

    //+-------------------------------------------------
    // control()
    // Quick access to local and cloud versioning and hashes
    // -----
    // Created on Wed Oct 29 2025
    //+-------------------------------------------------
    control() {
      console.warn("⚠️ [Backup Store] 'control'")
      let data = {
        localHash: this.local?.hash,
        backupHash: this.backup?.hash,
      }

      const [version, hash] = this.backup?.hash?.split('.') ?? [0, 'none']
      const [localVersion, localHash] = this.local?.hash?.split('.') ?? [0, 'none']

      data.local = {
        version: localVersion,
        hash: localHash,
        updated_at: this.local?.updated_at,
      }

      data.cloud = {
        version: version,
        hash: hash,
        updated_at: this.backup?.updated_at,
      }

      let dimensions = Object.keys(this.dimensions)
      for (let dimension of dimensions) {
        const [localAt = 1, localHash] = this.local[dimension]?.split('.') || []
        const [cloudAt = 0, cloudHash] = this.latest?.['sign_' + dimension]?.split('.') || []

        data.local[dimension] = {
          at: localAt,
          hash: localHash,
        }

        data.cloud[dimension] = {
          at: cloudAt,
          hash: cloudHash,
        }
      }

      return data
    },

    //+-------------------------------------------------
    // is()
    // -----
    // Created on Wed Aug 14 2024
    //+-------------------------------------------------
    is() {
      return this.status // == 'sync:done' ? 'ok' : this.status
    },
  },
})

//+-------------------------------------------------
//| 🔃 HMR
//| https://pinia.vuejs.org/cookbook/hot-module-replacement.html
//+-------------------------------------------------
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBackupStore, import.meta.hot))
}
