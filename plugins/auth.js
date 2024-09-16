/*
 * @file:    \plugins\auth.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 26th October 2023
 * Modified: 30 July 2024 - 17:14:46
 */

export default defineNuxtPlugin(() => {
  const userStore = useUserStore()
  if (window) window.$auth = userStore

  return {
    provide: {
      auth: userStore,
    },
  }
})
