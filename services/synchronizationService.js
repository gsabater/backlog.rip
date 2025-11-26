/*
 * @file:    \services\synchronizationService.js
 * @desc:    This service orchestrates the synchronization process
 * between the local client data and the cloud servers: Backups and workers
 * ----------------------------------------------
 * Created Date: 19th March 2025
 * Modified: 18th November 2025 - 12:24:30
 */

import dataService from './dataService'
import achievementsService from './achievementsService'

let $log = null
let $mitt = null
let $nuxt = null
let $user = null
let $libs = null
let $guild = null
let $backup = null

export default {
  //+-------------------------------------------------
  // synchronize()
  // Orchestrates the synchronization of cloud services
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // 0. Cloud backup download (if needed)
  // 1. Library syncronization (Steam lib)
  // 2. Library update (API)
  // 3. Achievements sync (workers)
  // 4. Guild (after steam sync)
  // 5. Backup upload
  // -----
  // Created on Wed Mar 19 2025
  // Updated on Wed Oct 08 2025
  //+-------------------------------------------------
  async synchronize() {
    try {
      // 0. Backup download
      // Check backups in the cloud and restore
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      await this.syncBackup()

      // 1. Library synchronization
      // Run the steam integration to sync the library
      // And update metadata (playtime, etc)
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // 🔔 Disabled until the script is better optimized
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // await this.syncLibrary()

      // 2. Library update
      // Updates the library metadata from the API
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // await this.updateLibrary()

      // 3. Achievements sync
      // Syncs the achievements using the workers
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // 🔔 Disabled until the worker is online
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // console.warn('3/6 Sync achievements (workers)')
      // await this.syncAchievements()

      // 4. Guild ping
      // Update public profile in the community
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // await this.pingCommunity()

      // 5. Backup upload
      // Upload a new backup to the cloud
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // await this.backup()

      // End the synchronization
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      this.endSynchronization()
    } catch (error) {
      console.error('Error during sync:', error)
      $log('❌ Synchronization error:', error)

      $nuxt.$cloud.process = null
      $nuxt.$cloud.status = 'error'
    }

    return

    // Sync the steam library
    // Disabled until the script is better optimized
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // await this.syncLibrary()

    // Update the library
    // ⇢ fetch updated metadata for new or stale games
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    await this.syncLibrary()

    // Sync the achievements
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    await this.syncAchievements()

    this.endSynchronization()
  },

  //+-------------------------------------------------
  // syncBackup()
  // Starts the backup process to check if there are
  // any newer backups to download and restore
  // -----
  // Created on Wed Oct 08 2025
  //+-------------------------------------------------
  async syncBackup() {
    // console.clear()
    $log('↻ Sync 0/6 ⇢ Checking cloud backups')
    if ($nuxt.$cloud?.server?.supabase !== 'online') {
      $log('⚠️ Supabase not connected, skipping backup download')
      return
    }

    // Restore any previous backups
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    $nuxt.$cloud.process = 'sync:download'
    await $backup.syncFromCloud()
  },

  //+-------------------------------------------------
  // updateLibrary()
  // Note: Use a flag at $user.cron to check frequency
  // -----
  // Created on Fri Oct 10 2025
  //+-------------------------------------------------
  async updateLibrary() {
    $log('↻ Sync 2/6 ⇢ Library update...')
    let isDue = $user.isCronDue('updateLibrary', 24)
    let toUpdate = await dataService.findAppsToUpdate(['empty', ':outdated'], 'return')

    if (!isDue) {
      $log(`[ updateLibrary ] Library already updated ${dates.timeAgo($user.cron.updateLibrary)}`)
      return
    }

    if (toUpdate.amount == 0) {
      $log('[ Sync.updateLibrary ] Library is empty')
      return
    }

    $nuxt.$cloud.process = 'update:library'
    await dataService.getBatch(toUpdate)
    $user.updateCron('updateLibrary')

    $log('[ Sync.updateLibrary ] Library updated')
  },

  //+-------------------------------------------------
  // pingCommunity()
  //
  // -----
  // Created on Thu Oct 09 2025
  //+-------------------------------------------------
  async pingCommunity() {
    $log('↻ Sync 4/6 ⇢ Community...')
    $nuxt.$cloud.process = 'community:ping'
    $guild.ping()

    return
  },

  //+-------------------------------------------------
  // syncLibrary()
  // Updates a batch of IDs against the API
  // Do that only once every 24h
  // -----
  // Created on Tue Mar 25 2025
  //+-------------------------------------------------
  async syncLibrary(check = true) {
    $nuxt.$cloud.process = 'sync:library'
    console.warn('🔔 Sync library', toUpdate, stale)
    await delay(1000, true)
    return
  },

  //+-------------------------------------------------
  // syncAchievements()
  // Sync achievements in games using the worker
  // - Achievements for games without data
  // - Achievements for games recently played
  // - Achievements for games recently released
  // -----
  // Created on Wed Mar 19 2025
  //+-------------------------------------------------
  async syncAchievements() {
    $nuxt.$cloud.process = 'sync:achievements'
    console.warn('🔔 Sync achievements', $nuxt.$cloud.process)
    await delay(6000, true)
    return true
    $nuxt.$app.background.running = 'achievements'

    // Check the status of other previous achievement requests
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let status = await supabaseService.getQueueAchievements()

    // Case A
    // There are achievements to process from the worker
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (status?.completed?.length) {
      await achievementsService.processSync(status.completed)

      // Update the cron values
      $user.config.cron.updateAchievements = dates.stamp()
      $user.setConfig('cron')

      this.endSynchronization()
      return
    }

    // Case B
    // Try to sync a new batch of achievements
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let stale = dates.isStale($user.cron.updateAchievements, 24, 'h')
    let missing = achievementsService.findToUpdate()

    if (!missing.length || !stale) {
      this.endSynchronization()
      return
    }

    // Request the achievements
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    $libs ??= useLibraryStore()
    if (!$libs.linked.steam) return
    let request = await $libs.module.steam.requestAchievements(missing)
    if (!request) {
      this.endSynchronization()
      return
    }

    // Subscribe to the queue
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    $nuxt.$sync.subscribe('queue')
  },

  //+-------------------------------------------------
  // backup()
  // Generates a new backup and uploads it to the cloud
  // -----
  // Created on Tue Oct 14 2025
  //+-------------------------------------------------
  async backup() {
    $log('↻ Sync 5/6 ⇢ Backup upload')
    if ($nuxt.$cloud?.server?.supabase !== 'online') {
      $log('⚠️ Supabase not connected, skipping backup download')
      return
    }

    $nuxt.$cloud.process = 'sync:backup'
    await $backup.backupToCloud()
  },

  //+-------------------------------------------------
  // endSynchronization()
  // Ends the syncronization process
  // -----
  // Created on Tue Mar 25 2025
  //+-------------------------------------------------
  endSynchronization() {
    $log('↻ Sync 6/6 ⇢ End synchronization...')

    $nuxt.$cloud.status = 'online'
    $nuxt.$cloud.process = null
    return

    if ($backup.status == 'blocked') $backup.status = 'sync:done'
    // $backup.sync()

    $nuxt.$sync.unsubscribe('queue')
    $nuxt.$app.background.running = false
  },

  processToHuman(process) {
    const CODES = {
      'sync:download': 'Downloading backup',
    }

    return CODES[process] || process
  },

  //+-------------------------------------------------
  // init()
  // Initializes the synchronization service
  // -----
  // Created on Wed Oct 08 2025
  //+-------------------------------------------------
  async init() {
    $nuxt ??= useNuxtApp()
    $log = $nuxt.$log
    $mitt = $nuxt.$mitt

    $user ??= useUserStore()
    $guild ??= useGuildStore()
    $backup ??= useBackupStore()

    // At this point, we should already have all cloud providers
    // - Online API at api.backlog.rip
    // - Supabase connected (with $user JWT and SUB)
    // - Online Workers at worker.backlog.rip
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    this.prepare()
  },

  //+-------------------------------------------------
  // prepare()
  // The service will check what online services can be used
  // -----
  // Created on Tue Mar 25 2025
  //+-------------------------------------------------
  async prepare() {
    // Check if $user is logged
    // Logged in and has a Bearer token required to call the API
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (!$user.is.logged) {
      $log('[ Sync Service ] Stopping because user is not logged in')

      $nuxt.$cloud.status = 'online'
      $nuxt.$cloud.process = null
      return false
    }

    // // Connect with the cloud
    // // Check if the cloud is synced before continue
    // //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // if ($backup.is == 'local') {
    //   await $backup.connect()
    // }

    // if ($backup.is == 'conflict') {
    //   return false
    // }

    // // Block the cloud status to avoid having
    // // Multiple syncs before ending
    // $backup.status = 'blocked'

    $mitt.emit('sync:ready')
    return true
  },
}
