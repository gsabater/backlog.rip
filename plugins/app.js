export default defineNuxtPlugin((nuxtApp) => {
  let app = {
    v: '0.0.1',
    api: {},
  }

  return {
    provide: {
      app,
    },
  }
})
