/*
 * @file:    \services\steamAPIService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 25th February 2025
 * Modified: Wed 26 February 2025 - 17:02:09
 */
let $nuxt

export default {
  //+-------------------------------------------------
  // GetPlayerAchievements()
  //
  // -----
  // Created on Tue Feb 25 2025
  //+-------------------------------------------------
  async GetPlayerAchievements(key, steamid, appid) {
    $nuxt ??= useNuxtApp()

    let url = 'https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1'
    url += '?key=' + key
    url += `&steamid=${steamid}&appid=${appid}&l=en`

    let xhr = await $nuxt.$axios.get(url)
    debugger
    console.warn('GetPlayerAchievements() not implemented')
  },
}
