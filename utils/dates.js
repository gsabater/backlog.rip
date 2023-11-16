/*
 * @file:    \utils\dates.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 10th November 2023
 * Modified: Mon Nov 13 2023
 */

let moment = null

export default {
  now() {
    return new Date().toISOString().replace('T', ' ').substring(0, 19)
  },

  mnow() {
    if (this.moment == null) {
      let app = useNuxtApp()
      this.moment = app.$dayjs()
    }

    return this.moment
  },

  unixToDate(unix) {
    if (!unix) return ''

    let date = new Date(unix * 1000)
    return date.toLocaleDateString('es-ES')
  },

  unixToDiff(unix) {
    let date = this.mnow()
  },
}
