/*
 * @file:    \stores\stats.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 26th March 2025
 * Modified: Wed 26 March 2025 - 17:24:58
 */

let $nuxt = null
let $data = null

export const useStatsStore = defineStore('stats', {
  state: () => ({
    _hot: [],
  }),

  getters: {},

  actions: {
    async init() {},
  },
})

// HMREnabled
// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStatsStore, import.meta.hot))
}
