import { defineStore } from "pinia";

export const useTestStore = defineStore("test", {
  state: () => ({
    count: 5,
    message: "Hello ",
  }),
  actions: {
    increment() {
      this.count++;
    },

    setMessage(message) {
      this.message = message;
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
