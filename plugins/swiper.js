/*
 * @file:    \plugins\swiper.js
 * @desc:    ...
 * -------------------------------------------
 * https://swiperjs.com/get-started
 * -------------------------------------------
 * Created Date: 12th January 2024
 * Modified: Fri Jan 12 2024
 */

import Swiper from 'swiper'
import 'swiper/css'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      swiper: Swiper,
    },
  }
})
