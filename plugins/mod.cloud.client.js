/*
 * @file:    \plugins\mod.cloud.client.js
 * @desc:    The cloud plugin.
 * -------------------------------------------
 * Manages:
 * |- Backlog API
 * |- Backlog Worker
 * |- Supabase Backups
 * |- Supabase client (for community and user data)
 * |- Supabase real time channels
 *
 * Files:
 * |- /pages/account/sections/cloud
 * |- /components/cloud
 * |- /stores/cloud
 *
 * Events:
 * |- backup:restore
 * |- backup:conflict
 * -------------------------------------------
 * Created Date: 30th September 2025
 * Modified: 24th November 2025 - 05:06:33
 */

import supabase from '../modules/integrations/supabase.js'
import backlogrip from '../modules/integrations/backlogrip.js'

import cloudService from '../services/cloudService.js'
import synchronizationService from '../services/synchronizationService.js'

// Cloud plugin
//+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
let plugin = reactive({
  status: 'loading', // loading, online, offline
  process: 'booting', // current process code
  message: null, // current process message

  server: {
    api: null,
    worker: null,
    backups: null,
    supabase: null,
  },

  backup: {
    is: null,
  },
})

let services = {
  // Services
  api: null,
  backups: null,
  supabase: null,
}

let $backup = null

//+-------------------------------------------------
// connectCloudServices()
// Calls for initialization of cloud services
// After that, the synchronization service should emit ready
// -----
// Created on Tue Oct 07 2025
//+-------------------------------------------------
async function connectCloudServices() {
  // API and worker Status
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  await cloudService.APIStatus()
  await cloudService.workerStatus()

  // Init a Supabase connection
  // Requires user to be authenticated first
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  await supabase.init()
  await supabase.connect()
  // Commented out, maybe subscribe when is needed
  // await supabase.subscribe('public:queue')

  // Init the Backups service
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  await $backup.connect()
  plugin.backup = { ...$backup.local, is: $backup.status }

  // Init Community service
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  let $guild = useGuildStore()
  $guild.init()

  // Synchronization service
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  await synchronizationService.init()
  // await synchronizationService.prepare()
}

// Nuxt Plugin
// Created on Sat Oct 04 2025
//+-------------------------------------------------
export default defineNuxtPlugin((nuxtApp) => {
  let time = performance.now()
  let { $app, $mitt } = nuxtApp

  let $user = useUserStore()
  $backup = useBackupStore()

  // Register and provide the app object to Nuxt
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  $app.register('cloud', time)
  nuxtApp.provide('cloud', plugin)

  // User ready
  // User will always be ready before app
  // Use the user store set tokens
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  $mitt.on('user:ready', () => {
    supabase.authenticate($user)
  })

  // User has been registered
  // Re-initialize services for user and cloud
  // This is an edge case for login during app usage
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  $mitt.on('user:login', async () => {
    supabase.authenticate($user)
    connectCloudServices()
  })

  $mitt.on('app:ready', () => {
    connectCloudServices()
  })

  // Sync ready
  // Perform cloud synchronization
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  $mitt.on('sync:ready', () => {
    synchronizationService.synchronize()
  })

  // WIP
  // $mitt.on('sync:message', () => {
  //   console.log('Received message:', payload)
  //   if (payload.event == 'queue') {
  //     synchronizationService.syncAchievements()
  //   }
  // })
})
