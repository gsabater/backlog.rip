/*
 * @file:    \plugins\auth.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 26th October 2023
 * Modified: 22nd October 2025 - 05:58:55
 */

export default defineNuxtPlugin((nuxtApp) => {
  // nuxtApp.$log('⩫ [ Auth ]')

  const userStore = useUserStore()

  // Provide the app object to the Nuxt instance
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  nuxtApp.provide('auth', userStore)
})
