/*
 * @file:    \plugins\auth.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 26th October 2023
 * Modified: Tue Feb 27 2024
 */

export default defineNuxtPlugin(() => {
  const userStore = useUserStore()

  return {
    provide: {
      auth: userStore,
    },
  }
})
