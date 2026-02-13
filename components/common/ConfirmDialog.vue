<template>
  <v-dialog v-model="ui.show" width="auto" min-width="450px">
    <v-card style="background: rgb(32, 34, 43); border: 2px solid rgb(61 54 67)">
      <template v-slot:title>
        <Icon name="tabler:checkbox" />
        <span class="font-serif mx-2">
          {{ event.title || 'Confirm' }}
        </span>
      </template>

      <v-card-text>
        {{ event.message || 'Are you sure that you want to do that?' }}
        <template v-if="event">
          <div v-if="event.item && event.item.name" class="d-block p-2">
            <h4 style="font-weight: 200">{{ event.item.name }}</h4>
          </div>
        </template>
      </v-card-text>
      <v-card-actions style="padding: 12px; background: #00000015">
        <v-btn
          variant="text"
          class="text-secondary flex-grow-1"
          :disabled="ui.loading"
          @click="ui.show = false">
          Cancel
        </v-btn>
        <v-btn
          :disabled="ui.loading"
          variant="tonal"
          @click="confirm"
          color="rgb(135 140 195)"
          class="flex-grow-1"
          style="
            filter: drop-shadow(0 0 1rem rgba(174, 62, 201, 0.2));
            outline: 1px solid #9e58581c;
            outline-offset: -1px;
          ">
          Confirm
        </v-btn>
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
 * Modified: 29th January 2026 - 17:15:17
 **/

/*+-------------------------------------------------
  $mitt.emit('ask:confirm', {
    item,
    title: 'Delete list',
    message: 'Are you sure you want to delete this list?',
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
}
</script>
