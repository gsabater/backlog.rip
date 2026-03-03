/*
 * @file:    \utils\helpers.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 28th January 2025
 * Modified: 22nd January 2026 - 18:13:21
 */

export default {
  capitalize(str) {
    if (!str || typeof str !== 'string') return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
  },

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
