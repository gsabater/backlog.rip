/**
 * @project: backlog
 * @file:    \stores\UserStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 8th December 2022
 * Last Modified: Thu Dec 08 2022
 **/

// import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: {},
    isLogged: false,
  }),

  actions: {
    increment() {
      // this.count++;
    },

    setMessage(message) {
      // this.message = message;
    },
  },

  getters: {
    doubleCount() {
      return this.count * 3;
    },

    upper() {
      return this.message.toUpperCase();
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
