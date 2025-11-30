/*
 * @file:    \plugins\mod.queue.client.js
 * @desc:    The queue plugin
 * -------------------------------------------
 * Files:
 * |- /
 *
 * Events:
 * - data:deleted
 * - config:updated
 * - account:updated
 * -------------------------------------------
 * Created Date: 6th October 2025
 * Modified: 7th November 2025 - 10:46:11
 */

import { useThrottleFn } from '@vueuse/core'

/*
// Access the reactive queue object directly
console.log($nuxt.$queue.queue.add)  // reactive array
console.log($nuxt.$queue.queue.delete)  // reactive array

// Use the new method names
$nuxt.$queue.add(uuid, 'add')
$nuxt.$queue.remove(uuid)

// Or use legacy names (still work)
$nuxt.$queue.queue(uuid, 'add')
$nuxt.$queue.unqueue(uuid)

// Access other methods
$nuxt.$queue.get('add')
$nuxt.$queue.swap(data)
$nuxt.$queue.run()
*/

let $log = null
let $nuxt = null
let $data = null
let $backup = null

// Timer for the queue runner
let runner = null

// Reactive queue object
let queue = reactive({
  add: [],
  swap: [],
  cloud: [],
  delete: [],
})

//+-------------------------------------------------
// run()
// Runs the queue to persist data
// -----
// Created on Thu Jan 30 2025
// Updated on Wed Mar 12 2025 - Handle backups queue
//+-------------------------------------------------
async function run() {
  // Handle queue "add"
  // This queue is used to store items in $db.games
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  if (queue.add.length > 0) {
    $log(`[Queue] ⇢ Persisting ${queue.add.length} items`)
    await $data.store(queue.add)
    queue.add = []
  }

  // Handle queue "delete"
  // This queue is used to delete items from $db.games
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  if (queue.delete.length > 0) {
    $log(`[Queue] ⇢ Deleting ${queue.delete.length} items`)
    await $data.delete(queue.delete)
    queue.delete = []
  }

  // Handle queue "swap"
  // Change the uuid of a game by creating a new record and deleting the old one
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  if (queue.swap.length > 0) {
    $log(`[Queue] ⇢ Swapping ${queue.swap.length} items`)
    queue.swap.forEach(async (uuid) => {
      await queueAPI.swap(uuid)
    })

    queue.swap = []
  }

  // Handle cloud sync
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  if (queue.cloud.length > 0) {
    $log(`[Queue] ⇢ Cloud syncing ${queue.cloud.join(', ')}`)
    console.debug('↪ Cloud queue:', queue.cloud)

    queue.cloud.forEach((dimension) => {
      $backup.action[dimension] = 'upload'
    })

    queue.cloud = []
    $backup.backupToCloud()
  }
}

let queueAPI = {
  // Expose the reactive queue object
  items: queue,

  //+-------------------------------------------------
  // add()
  // Adds an item to the queue
  // -----
  // Created on Wed Dec 11 2024
  // Updated on Fri Dec 13 2024 - Use JS queue
  //+-------------------------------------------------
  async add(uuid, action = 'add') {
    if (queue.add.includes(uuid)) return

    if (action == 'add') queue.add.push(uuid)
    if (action == 'swap') queue.swap.push(uuid)
    if (action == 'delete') queue.delete.push(uuid)

    if (action == 'cloud') queue.cloud.push(uuid)
    else queue.cloud.push('library')

    $log(`[Queue] ⇢ ${action} (${queue[action].length} items in queue.${action})`, uuid)
    // if (action == 'cloud') log('⛓️ Queueing ' + uuid + ' to the cloud')
    // else log(`⛓️ ${uuid} `, `${queue.add.length}/${queue.delete.length} items`)

    clearTimeout(runner)
    runner = setTimeout(() => queueAPI.run(), 3000)
  },

  remove(uuid) {
    const index = queue.add.indexOf(uuid)
    if (index > -1) queue.add.splice(index, 1)
  },

  //+-------------------------------------------------
  // swap()
  // swaps a game uuid by creating a new record and deleting
  // -----
  // Created on Wed Feb 05 2025
  //+-------------------------------------------------
  async swap(data) {
    let [db, uuid] = data
    $nuxt ??= useNuxtApp()

    // Check that the db record exists using Dexie.js
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let game = await $nuxt.$db.games.get(db)

    if (!game) return

    // Swap the uuids
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    game.uuid = uuid
    game.dates = game.dates || {}
    game.dates.swapped = dates.stamp()

    // Save the game
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    await $nuxt.$db.games.put(game)
    await $nuxt.$db.games.delete(db)
    console.warn('Swapped', db, 'to', uuid)
  },

  //+-------------------------------------------------
  // run()
  // Queue runner as a thottledFn
  // -----
  // Created on Wed Jan 15 2025
  //+-------------------------------------------------
  run: useThrottleFn(run, 2000, true),

  //+-------------------------------------------------
  // storeQueue()
  // A debounced call to store()
  // -----
  // Created on Sun Feb 25 2024
  // Created on Thu Dec 12 2024 - Handle deletes
  //+-------------------------------------------------
  async storeQueue(amount) {
    debugger
    return
    await delay(1000, true)

    let length = queue.add.length
    let toDelete = queue.delete.length
    if (length == 0 && toDelete == 0) return

    if (!amount || amount !== length) {
      queueAPI.storeQueue(length)
      return
    }

    log(`⛓️ Persisting queue on ${amount} games`)
    queueAPI.store(queue.add)
    queue.add = []

    if (toDelete > 0) {
      log(`⛓️ Clearing queue of deletes ${toDelete}`)
      debugger
      // $nuxt.$db.games
      // queue.delete = []
    }

    $backup.update('library')
    // let text = 'Details have been updated in ' + amount
    // text += amount > 1 ? ' games' : ' game'
    // $nuxt.$toast.success(text, {
    //   // description: 'Monday, January 3rd at 6:00pm',
    // })

    await delay(1000, true)
    queueAPI.storeQueue()
  },
}

// Nuxt Plugin
// Created on Mon Oct 06 2025
//+-------------------------------------------------
export default defineNuxtPlugin((nuxtApp) => {
  // nuxtApp.$log('✨✅ [ Queue ]')

  let { $mitt } = nuxtApp
  $log ??= nuxtApp.$log

  $data ??= useDataStore()
  $backup ??= useBackupStore()

  // Register and provide the queue API to Nuxt
  // Provides both methods and reactive queue object
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  nuxtApp.provide('queue', queueAPI)

  // Event handling
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  $mitt.on('data:deleted', () => {
    console.warn('🔥 wip data deleted')
    // $data.countLibrary()
    // queueAPI.add('library', 'cloud')
  })

  // Backup user data and configuration
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  $mitt.on('config:updated', () => {
    queueAPI.add('account', 'cloud')
  })

  $mitt.on('account:updated', () => {
    queueAPI.add('account', 'cloud')
  })

  // Backup states
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  $mitt.on('state:created', () => {
    queueAPI.add('states', 'cloud')
  })

  $mitt.on('state:updated', () => {
    queueAPI.add('states', 'cloud')
  })

  $mitt.on('state:deleted', () => {
    queueAPI.add('states', 'cloud')
  })
})
