/*
 * @file:    \utils\dates.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 10th November 2023
 * Modified: Wed Dec 13 2023
 */

export default {
  now() {
    return new Date().toISOString().replace('T', ' ').substring(0, 19)
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

  minToHours(min) {
    if (!min) return ''

    let hours = Math.floor(min / 60)
    let minutes = min % 60

    if (hours == 0) return `${minutes}m`
    if (minutes == 0) return `${hours}h`
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
}
