/**
 * @project: KAAM
 * @file:    \plugins\dayjs.js
 * @desc:    https://kas.kim/blog/using-dayjs-in-nuxt-3-as-plugin/
 * -------------------------------------------
 * Created Date: 28th February 2023
 * Last Modified: Fri May 19 2023
 **/

import dayjs from 'dayjs'
// import * as isLeapYear from 'dayjs/plugin/isLeapYear'
// import relativeTime from 'dayjs/plugin/relativeTime.js'
// import customParseFormat from 'dayjs/plugin/customParseFormat'
import localizedFormat from 'dayjs/plugin/localizedFormat.js'
import 'dayjs/locale/es'

dayjs.locale('es')
// dayjs.extend(isLeapYear)
// dayjs.extend(relativeTime)
// dayjs.extend(customParseFormat)
dayjs.extend(localizedFormat)

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      now: dayjs,
      day: dayjs,
      dayjs: dayjs,
      moment: dayjs,
    },
  }
})
