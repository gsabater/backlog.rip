// plugins/sonner.client.ts
import { Toaster, toast } from 'vue-sonner'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Toaster', Toaster)

  return {
    provide: {
      toast
    }
  }
})
