/*
 * @file:    \services\queueService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 15th January 2025
 * Modified: Thu 30 January 2025 - 15:25:31
 */

import { useThrottleFn } from '@vueuse/core'

let $data = null
let runner = null

let queue = {
  add: [],
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

  if (queue.cloud.length > 0) debugger
  log(`⛓️ Persisting queue on ${queue.add.length} games`)
  $data.store(queue.add)

  queue.add = []
  queue.delete = []
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
    if (action == 'cloud') queue.cloud.push(uuid)
    if (action == 'delete') queue.delete.push(uuid)

    if (action == 'cloud') log('⛓️ Queueing ' + uuid + ' to the cloud')
    else log(`⛓️ ${uuid} `, `${queue.add.length}/${queue.delete.length} items`)

    clearTimeout(runner)
    runner = setTimeout(() => this.run(), 2000)
  },

  unqueue(uuid) {
    if (queue.add[uuid]) delete queue.add[uuid]
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
