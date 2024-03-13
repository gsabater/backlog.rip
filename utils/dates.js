/*
 * @file:    \utils\dates.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 10th November 2023
 * Modified: Mon Mar 11 2024
 */

let $nuxt = null

export default {
  stamp() {
    return Math.floor(Date.now() / 1000)
  },

  //+-------------------------------------------------
  // now()
  // returns a date string, mainly used to store
  // '2024-02-26T16:06:34.933Z'
  // -----
  // Created on Fri Jan 12 2024
  //+-------------------------------------------------
  now() {
    return new Date().toISOString()
  },

  //+-------------------------------------------------
  // unixToDate()
  // Takes an unix timestamp and returns a date string
  // -----
  // Created on Mon Dec 04 2023
  //+-------------------------------------------------
  unixToDate(unix) {
    if (!unix) return ''
    let $nuxt = useNuxtApp()

    // let date = new Date(unix * 1000)
    // return date.toLocaleDateString('es-ES')
    let date = $nuxt.$dayjs.unix(unix)
    return date.format('D MMM YYYY, HH:mm')
  },

  //+-------------------------------------------------
  // minToHours()
  // takes an amount of minutes, and returns hours
  // -----
  // Created on Fri Jan 12 2024
  //+-------------------------------------------------
  minToHours(min, empty = false) {
    if (!min) return ''

    let hours = Math.floor(min / 60)
    let minutes = min % 60

    if (hours == 0) return `${minutes}m`
    if (minutes == 0) return `${hours}h`

    if (empty && min == 0) return empty

    return `${hours}h ${minutes}m`
  },

  // mnow() {
  //   if (this.moment == null) {
  //     let app = useNuxtApp()
  //     this.moment = app.$dayjs()
  //   }

  //   return this.moment
  // },

  // unixToDiff(unix) {
  //   let date = this.mnow()
  // },

  //+-------------------------------------------------
  // function()
  //
  // -----
  // Created on Fri Jan 12 2024
  //+-------------------------------------------------
  format(theDate, format = 'L') {
    if (!$nuxt) $nuxt = useNuxtApp()
    if (!theDate) return ''

    let date = theDate.replace(/\//g, '-')
    let moment = null

    if (typeof date === 'string' && date.indexOf('-') > -1) {
      moment = $nuxt.$dayjs(date) // ['DD-MM-YYYY', 'YYYY-MM-DD', 'MM-DD-YYYY']
    }

    if (format == 'nice') format = 'D [de] MMMM, YYYY'
    if (format == 'nice time') format = 'DD [de] MMMM, YYYY [-] HH:mm:ss'
    if (format) return moment.format(format)
    return moment
  },

  //+-------------------------------------------------
  // timeAgo()
  // Displays a time ago string using dayjs
  // -----
  // Created on Sun Jan 14 2024
  //+-------------------------------------------------
  timeAgo(time) {
    if (!time) return ''
    if (!$nuxt) $nuxt = useNuxtApp()

    // const timeAgo = formatTimeAgo(time)
    const timeAgo = $nuxt.$dayjs(time).fromNow()
    return timeAgo
  },
}
