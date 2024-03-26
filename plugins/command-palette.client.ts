import { Command } from 'vue-command-palette'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Command', Command)
  nuxtApp.vueApp.component('Command.Input', Command.Input)
  nuxtApp.vueApp.component('Command.Item', Command.Item)
  nuxtApp.vueApp.component('Command.List', Command.List)
  nuxtApp.vueApp.component('Command.Empty', Command.Empty)
  nuxtApp.vueApp.component('Command.Separator', Command.Separator)
  nuxtApp.vueApp.component('Command.Group', Command.Group)
  nuxtApp.vueApp.component('Command.Dialog', Command.Dialog)

})
