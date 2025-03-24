/*
 * @file:    \services\synchronizationService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 19th March 2025
 * Modified: Mon 24 March 2025 - 15:50:13
 */

import dataService from './dataService'
import achievementsService from './achievementsService'

let $nuxt = null
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
    $cloud ??= useCloudStore()
    debugger
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Connect with the cloud
    // Check if the cloud is synced before continue
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if ($cloud.is == 'local') {
      await $cloud.connect()
    }

    if ($cloud.is == 'conflict') {
      $nuxt.$app.background.running = false
      return
    }

    // Sync the steam library
    // using the steam module
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // await this.syncLibrary()

    // Update the library
    // And fetch updated metadata for new or stale games
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    $nuxt.$app.background.running = 'updatingLibrary'
    await dataService.updateBatch(['empty', ':outdated'])

    // Sync the achievements
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    $nuxt.$app.background.running = 'achievements'
    await this.syncAchievements()

    // $nuxt.$app.background.running = false
  },

  syncLibrary() {},

  //+-------------------------------------------------
  // syncAchievements()
  // Syncs the achievements using the API
  // -----
  // Created on Wed Mar 19 2025
  //+-------------------------------------------------
  async syncAchievements() {
    // Check the state of other previous requests
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let status = await supabaseService.getQueueStatus()

    if (status?.completed?.length) {
      await achievementsService.processSync(status.completed)
      this.endSynchronization()
      return
    }

    // Get achievements worth syncing
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let missing = achievementsService.findToUpdate()
    if (!missing.length) {
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

  endSynchronization() {
    $nuxt.$app.background.running = false
    $nuxt.$sync.unsubscribe('queue')
  },
}
