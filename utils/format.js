/*
 * @file:    \utils\format.js
 * @desc:    All format functions not related to dates
 * -------------------------------------------
 * Created Date: 12th November 2023
 * Modified: Mon 16 December 2024 - 16:28:43
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

  compactNum(num) {
    // Handle invalid inputs
    if (num === null || num === undefined) return '0'
    if (isNaN(num)) return '0'

    const value = Number(num)
    const absValue = Math.abs(value)

    // Format millions
    if (absValue >= 1000000) {
      const formatted = (value / 1000000).toFixed(1)
      const cleaned = formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted
      return `${cleaned}M`
    }

    // Format thousands
    if (absValue >= 1000) {
      const formatted = (value / 1000).toFixed(1)
      const cleaned = formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted
      return `${cleaned}K`
    }

    return value.toString()
  },

  //+-------------------------------------------------
  // stringToSlug()
  // Returns a slug from a given string
  // -----
  // Created on Tue Jul 27 2021
  // Updated on Fri Aug 26 2022
  //+-------------------------------------------------
  stringToSlug(str) {
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
      .replace(/^-+|-+$/g, '') // Remove dashes from the start and end

    return str
  },

  //+-------------------------------------------------
  // scoreToHuman()
  // Returns human values  from a given score
  // -----
  // Created on Mon Mar 11 2024
  //+-------------------------------------------------
  scoreToHuman(score, source, response) {
    let ratings = {
      meta: [
        { breakpoint: 75, color: '#54a72b', label: 'Universal acclaim' },
        { breakpoint: 50, color: '#b59023', label: 'Generally favorable' },
        { breakpoint: 20, color: '#ff0000', label: 'Mixed or average' },
        { breakpoint: 0, color: '#ff0000', label: 'Generally unfavorable' },
      ],
      steam: [
        { breakpoint: 80, color: '#454e89ef', label: 'Universal acclaim' },
        { breakpoint: 70, color: '#454e89ef', label: 'Generally favorable' },
        { breakpoint: 40, color: '#454e89ef', label: 'Mixed or average' },
        { breakpoint: 0, color: '#454e89ef', label: 'Generally unfavorable' },
      ],
      oc: [
        { breakpoint: 84, color: '#fc430a', label: 'mighty' },
        { breakpoint: 75, color: '#9e00b4', label: 'strong' },
        { breakpoint: 67, color: '#4aa1ce', label: 'fair' },
        { breakpoint: 0, color: '#80b06a', label: 'weak' },
      ],
    }

    for (let rating of ratings[source]) {
      if (score >= rating.breakpoint) {
        return response === 'color' ? rating.color : rating.label
      }
    }

    return response === 'color' ? ratings[source][3].color : 'Overwhelming dislike'
  },
}
