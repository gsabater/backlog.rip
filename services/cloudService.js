/*
 * @file:    \services\cloudService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 29th January 2025
 * Modified: 29th October 2025 - 03:48:34
 */

import backlogrip from '../modules/integrations/backlogrip.js'

let $nuxt = null

export default {
  //+-------------------------------------------------
  // APIStatus()
  // Call status endpoint on api.backlog.rip
  // -----
  // Created on Mon Oct 06 2025
  //+-------------------------------------------------
  async APIStatus() {
    $nuxt ??= useNuxtApp()
    let { $app, $log, $cloud } = $nuxt

    let status = await backlogrip.getApiStatus()
    if (!status) {
      $cloud.server.api = 'offline'
      $log('⚠️ [ Cloud ] API seems to be offline, working on offline mode')
      return
    }

    // $cloud.api = status
    $cloud.server.api = 'online'
    $app.count.api = status?.games?.total || 0
  },

  //+-------------------------------------------------
  // workerStatus()
  // Call status endpoint on api.backlog.rip
  // -----
  // Created on Mon Oct 06 2025
  //+-------------------------------------------------
  async workerStatus() {
    $nuxt ??= useNuxtApp()
    let { $app, $log, $cloud } = $nuxt

    let status = await backlogrip.getWorkerStatus()
    if (!status) {
      $cloud.server.worker = 'offline'
      $log('⚠️ [ Cloud ] Worker seems to be offline...')
      return
    }

    $cloud.server.worker = 'online'
  },
}
