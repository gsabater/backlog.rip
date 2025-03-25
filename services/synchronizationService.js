/*
 * @file:    \services\synchronizationService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 19th March 2025
 * Modified: Tue 25 March 2025 - 15:27:32
 */

import dataService from './dataService'
import achievementsService from './achievementsService'

let $nuxt = null
let $user = null
let $libs = null
let $cloud = null

export default {
  //+-------------------------------------------------
  // sync()
  // Orchestrates the synchronization process for the client
  // - check the cloud backup status

  // - Syncs the (steam) library
  // - Updates library from API (missing data)
  // - Syncs the achievements
  // - Backups with the cloud
  // -----
  // Created on Wed Mar 19 2025
  //+-------------------------------------------------
  async sync() {
    $nuxt ??= useNuxtApp()
    $user ??= useUserStore()
    $cloud ??= useCloudStore()

    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Check if the user is logged in
    // A not logged in user does not have a Bearer token to call the API
    // And also does not have JWT token to sync with Supabase
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (!$user.is.logged) {
      return
    }

    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Connect with the cloud
    // Check if the cloud is synced before continue
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if ($cloud.is == 'local') {
      await $cloud.connect()
    }

    if ($cloud.is == 'conflict') {
      return
    } else {
      $cloud.status = 'syncing'
    }

    // Sync the steam library
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // await this.syncLibrary()

    // Update the library
    // ⇢ fetch updated metadata for new or stale games
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    await this.syncLibrary()

    // Sync the achievements
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    $nuxt.$app.background.running = 'achievements'
    await this.syncAchievements()
  },

  //+-------------------------------------------------
  // syncLibrary()
  // Updates a batch of IDs against the API
  // Do that only once every 24h
  // -----
  // Created on Tue Mar 25 2025
  //+-------------------------------------------------
  async syncLibrary(check = true) {
    let stale = dates.isStale($user.cron.updateLibrary, 24, 'h')
    let toUpdate = await dataService.updateBatch(['empty', ':outdated'], 'return')

    if (!stale || toUpdate.amount == 0) return

    $nuxt.$app.background.running = 'updatingLibrary'
    await dataService.getBatch(toUpdate)

    // Update the cron values
    $user.config.cron.updateLibrary = dates.stamp()
    $user.setConfig('cron')
  },

  //+-------------------------------------------------
  // syncAchievements()
  // Syncs the achievements using the API
  // -----
  // Created on Wed Mar 19 2025
  //+-------------------------------------------------
  async syncAchievements() {
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

  backup() {},

  //+-------------------------------------------------
  // endSynchronization()
  // Ends the syncronization process
  // -----
  // NOTE: should this be an event?
  // -----
  // Created on Tue Mar 25 2025
  //+-------------------------------------------------
  endSynchronization() {
    if ($cloud.is == 'syncing') {
      $cloud.status = 'sync:done'
      $cloud.sync()
    }

    $nuxt.$sync.unsubscribe('queue')
    $nuxt.$app.background.running = false
  },
}
