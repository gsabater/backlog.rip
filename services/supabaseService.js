/*
 * @file:    \services\supabaseService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 24th March 2025
 * Modified: Tue 25 March 2025 - 10:01:20
 */

let $nuxt = null

let cred = null
let client = null

export default {
  //+-------------------------------------------------
  // getQueueAchievements()
  // -----
  // Note: .eq('user_id', cred.sub) is implicit in the JWT
  // -----
  // Created on Mon Mar 24 2025
  //+-------------------------------------------------
  async getQueueAchievements() {
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
  // clearQueueAchievements()
  // Clears completed jobs
  // -----
  // Created on Tue Mar 25 2025
  //+-------------------------------------------------
  async clearQueueAchievements(ids) {
    let jxr = await client.from('queue_achievements').delete().in('id', ids)

    return jxr
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
