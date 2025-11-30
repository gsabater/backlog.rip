/*
 * @file:    \plugins\photoswipe.client.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 15th November 2024
 * Modified: 6th October 2025 - 05:56:37
 */

import PhotoSwipe from 'photoswipe'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'

export default defineNuxtPlugin((nuxtApp) => {
  // Provide the plugin to the Nuxt instance
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  nuxtApp.provide('Photoswipe', {
    core: PhotoSwipe,
    lightbox: PhotoSwipeLightbox,
  })
})
