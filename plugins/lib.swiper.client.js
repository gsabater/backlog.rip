/*
 * @file:    \plugins\swiper.client.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 6th March 2025
 * Modified: Thu 06 March 2025 - 15:53:13
 */

import { Swiper, SwiperSlide } from 'swiper/vue'
// import { Scrollbar } from 'swiper/modules'
import { Pagination } from 'swiper/modules'
import { Navigation } from 'swiper/modules'

import 'swiper/css'
// import 'swiper/css/scrollbar'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Swiper', Swiper)
  nuxtApp.vueApp.component('SwiperSlide', SwiperSlide)

  return {
    provide: {
      swiperModules: [Pagination, Navigation], //Scrollbar
    },
  }
})
