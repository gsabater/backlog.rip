/*
 * @file:    \plugins\cloud.client.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 14th August 2024
 * Modified: Wed 14 August 2024 - 16:07:12
 */

export default defineNuxtPlugin(() => {
  const store = useCloudStore()
  if (window) window.$cloud = store

  return {
    provide: {
      cloud: store,
    },
  }
})
