/*
 * @file:    \plugins\photoswipe.client.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 15th November 2024
 * Modified: Fri 15 November 2024 - 14:20:57
 */

import PhotoSwipe from 'photoswipe'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      PhotoSwipe,
      PhotoSwipeLightbox,
    },
  }
})
