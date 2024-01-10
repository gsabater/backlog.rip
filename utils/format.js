/*
 * @file:    \utils\format.js
 * @desc:    All format functions not related to dates
 * -------------------------------------------
 * Created Date: 12th November 2023
 * Modified: Wed Dec 27 2023
 */

export default {
  //+-------------------------------------------------
  // num()
  // Format a number with thousands
  // -----
  // Created on Tue Jun 21 2022
  // Updated on Fri Jul 08 2022
  //+-------------------------------------------------
  num(num) {
    if (num === null || num === undefined) return 0
    return num.toLocaleString('de-DE')
  },

  round(num, decimals = 2) {
    let n = parseFloat(num)
    if (isNaN(n)) return num

    return num.toFixed(decimals)
  },

  //+-------------------------------------------------
  // stringToslug()
  // Returns a slug from a given string
  // -----
  // Created on Tue Jul 27 2021
  // Updated on Fri Aug 26 2022
  //+-------------------------------------------------
  stringToslug(str) {
    if (str === null || str === undefined) return ''
    if (typeof str !== 'string') return ''

    str = str.replace(/^\s+|\s+$/g, '') // trim
    str = str.toLowerCase()

    // remove accents, swap ñ for n, etc
    var from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;'
    var to = 'aaaaeeeeiiiioooouuuunc------'
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
    }

    str = str
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-') // collapse dashes

    return str
  },
}
