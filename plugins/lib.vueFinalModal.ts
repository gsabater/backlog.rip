/*
 * @file:    \plugins\modal.client.ts
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 14th February 2024
 * Modified: Thu Feb 15 2024
 */


import { ModalsContainer ,createVfm, VueFinalModal } from 'vue-final-modal'
import 'vue-final-modal/style.css'

export default defineNuxtPlugin((nuxtApp) => {
  const vfm = createVfm() as any
  nuxtApp.vueApp.use(vfm)
  nuxtApp.vueApp.component('VueFinalModal', VueFinalModal)
  nuxtApp.vueApp.component('ModalsContainer', ModalsContainer)
})
