/*
 * @file:    \services\supabaseService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 24th March 2025
 * Modified: Mon 24 March 2025 - 11:17:20
 */

let $nuxt = null

let cred = null
let client = null

export default {
  //+-------------------------------------------------
  // function()
  // -----
  // Note: .eq('user_id', cred.sub) is implicit in the JWT
  // -----
  // Created on Mon Mar 24 2025
  //+-------------------------------------------------
  async getQueueStatus() {
    let jxr = await client.from('queue_achievements').select('*')

    if (!jxr.data.length) {
      return null
    }

    let queued = jxr.data.filter((item) => item.status == null)
    let completed = jxr.data.filter((item) => item.status == 'done')

    return {
      queued: queued,
      completed: completed,
    }
  },

  //+-------------------------------------------------
  // function()
  //
  // -----
  // Created on Mon Mar 24 2025
  //+-------------------------------------------------
  init() {
    $nuxt ??= useNuxtApp()

    cred = {
      jwt: $nuxt.$sync.jwt,
      sub: $nuxt.$sync.sub,
    }

    client = $nuxt.$sync.sb
  },
}
