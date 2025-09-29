<template>
  <v-snackbar
    z-index="9999"
    v-model="ui.show"
    :color="event.color || 'green-darken-3'"
    location="bottom right"
    multi-line
    :timeout="event.timeout || 5000">
    <v-icon class="mr-2">{{ event.icon || 'mdi-information-outline' }}</v-icon>
    {{ event.text || 'Ha ocurrido algo' }}

    <template v-slot:actions>
      <v-btn variant="text" @click="ui.show = false">Aceptar</v-btn>
    </template>
  </v-snackbar>

  <v-dialog v-model="ui.dialog" persistent min-width="450px" max-width="650">
    <v-card>
      <template #title>
        <Icon class="me-2">Mist</Icon>
        <span class="font-serif mx-2">
          {{ event.title || 'Information' }}
        </span>
      </template>
      <v-card-text class="text-center">
        {{ event.message || '...' }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green-darken-1" variant="text" @click="ui.dialog = false">
          Accept
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
/**
 * @file:    \components\common\Notification.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 8th November 2024
 * Modified: 29th September 2025 - 04:51:29
 **/

/*+-------------------------------------------------
  $mitt.emit('notification:show', {

  })
//+------------------------------------------------- */
export default {
  name: 'Notification snackbar',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    event: {},

    ui: {
      show: false,
      dialog: false,
    },
  }),

  methods: {
    display(payload) {
      this.event = { ...payload }

      if (payload.type == 'warning') {
        this.event.color = 'orange-darken-2'
        this.event.icon = 'mdi-alert-circle'
      }

      if (payload.type == 'error') {
        this.event.color = 'red-darken-2'
        this.event.icon = 'mdi-alert-circle'
      }

      //mdi-check-bold

      if (payload.mode == 'dialog') this.ui.dialog = true
      else this.ui.show = true
    },

    init() {
      this.$mitt.on('notification:show', (payload) => {
        this.display(payload)
      })

      if (this.$route.query.hasOwnProperty('saved')) {
        this.ui.show = true

        if (window.history.replaceState) {
          window.history.replaceState(
            'Clean URL',
            'Clean',
            window.location.href.split('?')[0]
          )
        }
      }
    },
  },

  mounted() {
    this.init()
  },
}
</script>

<style>
.snackbar-saved .v-snackbar__wrapper {
  border: 2px solid #4faf54;
}
</style>
