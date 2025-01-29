/*
 * @file:    \utils\helpers.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 28th January 2025
 * Modified: Tue 28 January 2025 - 17:01:34
 */

export default {
  //+-------------------------------------------------
  // sortedStringify()
  // Sorts the keys of an object and returns the string
  // -----
  // Created on Tue Jan 28 2025
  //+-------------------------------------------------
  sortedStringify(obj, ignore = []) {
    if (!obj) return ''

    const ordered = Object.keys(obj)
      .sort()
      .filter((key) => {
        return !ignore.includes(key)
      })
      .reduce((acc, key) => {
        acc[key] = obj[key]
        return acc
      }, {})

    return JSON.stringify(ordered)
  },
}
