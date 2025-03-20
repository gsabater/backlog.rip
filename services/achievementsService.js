let $data = null
export default {
  //+-------------------------------------------------
  // findToUpdate()
  // Returns items that need their achievements to be updated
  // -----
  // NOTE: there are multiple checks for update, maybe
  // i can move them to an updateService
  // -----
  // Created on Wed Mar 19 2025
  //+-------------------------------------------------
  findToUpdate() {
    $data ??= useDataStore()

    let IDs = $data
      .library()
      .sort((a, b) => {
        return (a.playtime?.steam_last ?? 0) - (b.playtime?.steam_last ?? 0)
      })
      .filter((item) => {
        if (!item.is.lib) return false
        if (!item.id.steam) return false

        // Check if the game has been recently played
        if (item.playtime?.steam_last) {
          if (dates.isStale(item.playtime?.steam_last, 14, 'd')) return true
        }

        // Check if the game has achievements recently updated
        if (dates.isStale(item.dates?.achievements, 180, 'd')) return true

        return false
      })
      .map((item) => {
        return item.id.steam
      })

    return IDs
  },
}
