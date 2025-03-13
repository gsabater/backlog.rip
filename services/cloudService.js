/*
 * @file:    \services\cloudService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 29th January 2025
 * Modified: Thu 13 March 2025 - 17:39:25
 */

export default {
  //+-------------------------------------------------
  // prepareAchievements()
  //
  // -----
  // Created on Thu Mar 13 2025
  //+-------------------------------------------------
  prepareAchievements(game) {
    if (!game.achievements) return false

    let prepared = []
    game.achievements.forEach((achievement) => {
      if (!achievement.is?.status) return
      prepared.push({
        steam_key: achievement.steam_key,
        is: achievement.is,
      })
    })

    return prepared
  },
}
