<template>
  <v-dialog v-model="ui.show" width="auto" min-width="450px">
    <v-card>
      <template v-slot:title>
        <Icon>Mist</Icon>
        <span class="font-serif mx-2">
          {{ event.title || 'Confirm' }}
        </span>
      </template>

      <v-card-text class="text-center">
        {{ event.message || 'Are you sure that you want to do that?' }}
        <template v-if="event">
          <div
            v-if="event.item && event.item.name"
            class="text-disabled text-muted d-block pt-3 pb-0"
            style="font-size: 13px">
            This will be deleted
            <br />
            <strong>{{ event.item.name }}</strong>
          </div>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="text" @click="ui.show = false">Cancelar</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="green-darken-1" variant="text" @click="confirm">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
/**
 * @file:    \components\common\ConfirmDialog.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 16th November 2023
 * Modified: Wed 06 November 2024 - 13:32:32
 **/

/** //+-------------------------------------------------
  $mitt.emit('ask:confirm', {
    item,
    title: 'Delete list',
    message: 'Are you sure you want to delete this list?',
    explanation: `List name ${item.name} `,
    btn: 'Delete',
    btnColor: 'red',
    onConfirm: () => $mitt.emit('list:delete', { item }),
  })
//+------------------------------------------------- */

export default {
  name: 'ConfirmDialog',

  data() {
    return {
      event: {},

      ui: {
        show: false,
      },
    }
  },

  methods: {
    show(payload) {
      this.event = payload
      this.ui.show = true
    },

    confirm() {
      this.ui.show = false

      if (this.event.onConfirm) this.event.onConfirm(this.event)
      this.$mitt.emit('confirm:confirmed', this.event)
    },

    async init() {
      this.$mitt.on('ask:confirm', (payload) => {
        this.show(payload)
      })
    },
  },

  mounted() {
    this.init()
  },

  beforeUnmount() {
    // this.$event.$off('documents:show')
  },
}
</script>
