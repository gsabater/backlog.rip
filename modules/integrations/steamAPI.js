/*
 * @file:    \modules\integrations\steamAPI.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 25th February 2025
 * Modified: 7th October 2025 - 03:51:02
 */

let $nuxt
let domain = 'https://api.steampowered.com'

export default {
  //+-------------------------------------------------
  // GetGlobalAchievementPercentagesForApp()
  // NOTE: Not used because this endpoint has cors even if it does not require a key
  // -----
  // Created on Fri Mar 14 2025
  //+-------------------------------------------------
  async GetGlobalAchievementPercentagesForApp(appid) {
    return
    $nuxt ??= useNuxtApp()

    let url = domain + '/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2'
    url += `?gameid=${appid}`

    let xhr = await $nuxt.$axios.get(url)
    if (xhr.data.status == 200) {
      return xhr.data.achievementpercentages.achievements
    }
  },
}
