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

  <v-dialog v-model="ui.dialog" persistent width="auto" min-width="450px">
    <v-card>
      <v-card-title class="text-h6 pa-3 text-center" style="background-color: #efefef">
        {{ event.title || 'Confirmar' }}
      </v-card-title>
      <v-card-text class="text-center">
        {{ event.message || '¿Estás seguro de realizar esta acción?' }}
        <template v-if="event && event.item && event.item.id">
          <div
            class="text-disabled text-muted d-block pt-3 pb-0"
            v-if="event.item.nombre"
            style="font-size: 13px">
            Se eliminará
            <strong>"{{ formatHelper.fullName(event.item) }}"</strong>
          </div>

          <div class="text-disabled text-muted d-block py-1" style="font-size: 13px">
            Con registro ID {{ event.item.id }}
          </div>
        </template>
        <!-- <pre v-if="event.details">
          {{ event.details }}
        </pre> -->
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green-darken-1" variant="text" @click="ui.dialog = false">
          Aceptar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
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
