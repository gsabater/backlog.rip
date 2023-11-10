export default defineNuxtPlugin((nuxtApp) => {
  // const app = useNuxtApp()
  const userStore = useUserStore()

  return {
    provide: {
      auth: userStore,
    },
  }
})
