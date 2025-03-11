/*
 * @file:    \services\queueService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 15th January 2025
 * Modified: Tue 11 March 2025 - 15:52:05
 */

import { useThrottleFn } from '@vueuse/core'

let $nuxt = null
let $data = null
let runner = null

let queue = {
  add: [],
  swap: [],
  cloud: [],
  delete: [],
}

//+-------------------------------------------------
// run()
// Runs the queue to persist data
// -----
// Created on Thu Jan 30 2025
//+-------------------------------------------------
async function run() {
  $data ??= useDataStore()

  // WIP: cloud queue
  // debugger

  // Handle queue "add"
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  if (queue.add.length > 0) {
    log(`⛓️ Persisting queue on ${queue.add.length} games`)
    await $data.store(queue.add)
    queue.add = []
  }

  // Handle queue "delete"
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  if (queue.delete.length > 0) {
    log(`⛓️ Clearing queue of deletes ${queue.delete.length}`)
    await $data.delete(queue.delete)
    queue.delete = []
  }

  // Handle queue "swap"
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  if (queue.swap.length > 0) {
    queue.swap.forEach(async (uuid) => {
      await this.swap(uuid)
    })
  }

  if (queue.cloud.length > 0) debugger
}

export default {
  get(key) {
    if (key) return queue[key]
    return queue
  },

  //+-------------------------------------------------
  // queue()
  // Adds an item to the queue
  // -----
  // Created on Wed Dec 11 2024
  // Updated on Fri Dec 13 2024 - Use JS queue
  //+-------------------------------------------------
  async queue(uuid, action = 'add') {
    if (queue.add.includes(uuid)) return

    if (action == 'add') queue.add.push(uuid)
    if (action == 'swap') queue.swap.push(uuid)
    if (action == 'cloud') queue.cloud.push(uuid)
    if (action == 'delete') queue.delete.push(uuid)

    log(`⛓️ Queueing to ${action} (${queue[action].length})`, uuid)
    // if (action == 'cloud') log('⛓️ Queueing ' + uuid + ' to the cloud')
    // else log(`⛓️ ${uuid} `, `${queue.add.length}/${queue.delete.length} items`)

    clearTimeout(runner)
    runner = setTimeout(() => this.run(), 3000)
  },

  unqueue(uuid) {
    if (queue.add[uuid]) delete queue.add[uuid]
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
      this.storeQueue(length)
      return
    }

    log(`⛓️ Persisting queue on ${amount} games`)
    this.store(queue.add)
    queue.add = []

    if (toDelete > 0) {
      log(`⛓️ Clearing queue of deletes ${toDelete}`)
      debugger
      // $nuxt.$db.games
      // queue.delete = []
    }

    $cloud.update('library')
    // let text = 'Details have been updated in ' + amount
    // text += amount > 1 ? ' games' : ' game'
    // $nuxt.$toast.success(text, {
    //   // description: 'Monday, January 3rd at 6:00pm',
    // })

    await delay(1000, true)
    this.storeQueue()
  },
}
