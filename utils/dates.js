/*
 * @file:    \utils\dates.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 10th November 2023
 * Modified: Thu 26 September 2024 - 16:03:54
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

  timestamp() {
    let $nuxt = useNuxtApp()
    let date = $nuxt.$dayjs()
    return date.format('YYYY-MM-DD HH:mm:ss')
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
    if (empty && !min) return empty
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

  hoursAgo(time) {
    if (!time) return false
    if (!$nuxt) $nuxt = useNuxtApp()

    const ref = $nuxt.$dayjs(time)
    return $nuxt.$dayjs().diff(ref, 'hours')
  },

  //+-------------------------------------------------
  // dynamicTimeAgo()
  // like this.hoursAgo() but works with seconds until years
  // -----
  // Created on Wed Aug 21 2024
  //+-------------------------------------------------
  dynamicTimeAgo(time) {
    if (!time) return false
    if (!$nuxt) $nuxt = useNuxtApp()

    const now = $nuxt.$dayjs()
    const ref = $nuxt.$dayjs(time)

    let seconds = now.diff(ref, 'seconds')
    if (seconds < 60) return `${seconds}s`

    let minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`

    let hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`

    let days = Math.floor(hours / 24)
    if (days < 30) return `${days}d`

    let months = Math.floor(days / 30)
    if (months < 12) return `${months}mo`

    let years = Math.floor(months / 12)
    return `${years}y`
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
    return timeAgo ?? 'xxx'
  },

  //+-------------------------------------------------
  // microTime()
  // Gets milliseconds, and returns a rounded value
  // with "ms" or "s" suffix
  // -----
  // Created on Thu Sep 26 2024
  //+-------------------------------------------------
  microTime(ms) {
    if (ms > 1000) return format.round(ms / 1000, 2) + 's'
    return format.round(ms, 0) + 'ms'
  },
}
