<template>
  <v-dialog
      v-model="ui.dialog"
      persistent
      width="auto"
      min-width="450px">
      <v-card>
        <v-card-title class="text-h6 pa-3 text-center"
          style="background-color: #efefef">
          {{ event.title || 'Confirmar' }}
        </v-card-title>
        <v-card-text class="text-center">
          {{ event.message || '¿Estás seguro de realizar esta acción?' }}
          <template v-if="event">

            <div class="text-disabled text-muted d-block pt-3 pb-0"
             v-if="event.item && event.item.nombre"
              style="font-size: 13px">Se eliminará <strong>"{{ formatHelper.fullName(event.item) }}"</strong></div>

              <div v-if="itemID"
                class="text-disabled text-muted d-block py-1"
                style="font-size: 13px">
                Con registro ID {{ itemID  }}
              </div>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-btn
          color="red-darken-1"
          variant="text"
          @click="ui.dialog = false">
          Cancelar
        </v-btn>
        <v-spacer></v-spacer>
          <v-btn
            color="green-darken-1"
            variant="text"
            @click="confirm">
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
/**
 * @project: KAAM
 * @file:    \components\helpers\Confirm.vue
 * @desc:    Usage

  $emit('confirm:show', {
    title: 'Confirmar',
    message: '¿Estás seguro de eliminar este registro?',
    onConfirm: () => {
      dosomething(123)
    },
  })

 * -------------------------------------------
 * Created Date: 20th March 2023
 * Last Modified: Tue Jun 06 2023
 **/

export default {
  name: 'ConfirmDialog',
  data() {
    return {
      event: {},

      ui: {
        dialog: false,
      },
    }
  },

  computed: {
    itemID() {
      let ID = global.ID(this.event.item)
      return ID
      return false
    },
  },

  methods: {
    open(payload) {
      this.event = payload
      this.ui.dialog = true
    },

    confirm() {
      this.ui.dialog = false

      if (this.event.onConfirm) this.event.onConfirm(this.event)

      useNuxtApp().$emit('confirm:confirmed', this.event)
    },

    async init() {
      this.$on('confirm:show', (payload) => {
        this.open(payload)
      })
    },
  },

  mounted() {
    this.init()
  },

  beforeDestroy() {
    // this.$event.$off('documents:open')
  },
}
</script>
