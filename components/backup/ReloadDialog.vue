<template>
  <v-dialog v-model="ui.show" max-width="500px" persistent>
    <v-card>
      <v-card-text class="pt-4 pb-0">
        <div class="text-center">
          <h2>Application reload</h2>
          <p>The application will now reload to apply the latest changes</p>
        </div>
      </v-card-text>

      <v-card-actions class="p-4">
        <v-btn color="deep-purple" variant="flat" @click="reload" block>Reload now</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
/**
 * @file:    \components\backup\ReloadDialog.vue
 * @desc:    Diálogo para recargar la aplicación
 * ----------------------------------------------
 * Created Date: 23rd August 2024
 * Modified: 19th November 2025 - 10:23:35
 **/

export default {
  name: 'BackupReloadDialog',
  data: () => ({
    ui: {
      show: false,
    },
  }),

  methods: {
    reload() {
      window.location.reload()
    },
  },

  mounted() {
    this.$mitt.on('reload:show', () => {
      this.ui.show = true
    })
  },
}
</script>
