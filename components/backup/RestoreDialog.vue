<template>
  <v-dialog v-model="ui.show" max-width="750">
    <ClientOnly>
      <v-card>
        <template #title>
          <Icon class="me-2">CloudRain</Icon>
          Backup restoration
        </template>

        <v-card-text class="px-5 mb-2">
          <div v-if="ui.step == 'restore'" class="text-secondary mb-4">
            You are about to restore a cloud backup. This action will overwrite your current local
            data. Please, review the backup details below before applying it.
          </div>

          <div v-if="ui.step == 'conflict'" class="text-secondary mb-4">
            Looks like there is a newer backup in the cloud than your local saved data. Resolve the
            conflict choosing the version you want to keep. The version you choose to keep will be
            synced in this device and the cloud, and the other will be overwritten.
          </div>

          <div v-if="ui.step == 'complete'" class="text-center">
            <img
              src="/img/transhumans/experiments.png"
              class="img-fluid"
              style="
                max-height: 330px;
                object-fit: cover;
                filter: drop-shadow(1px 1px 0px currentcolor);
                color: #00fdcf;
              " />
          </div>

          <div
            v-if="ui.step == 'restore' || ui.step == 'conflict'"
            class="mb-4"
            style="
              background-color: rgba(0, 0, 0, 0.2);
              border: 2px solid rgb(0 0 0 / 20%);
              border-radius: 4px;
            ">
            <table class="table card-table table-vcenter">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Local</th>
                  <th>Cloud</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Versioning</td>
                  <td>
                    <small>v.{{ control.local.version }}</small>
                  </td>
                  <td>
                    <small>v.{{ backup.version }}</small>
                  </td>
                </tr>

                <tr>
                  <td>Date of backup</td>
                  <td>
                    <small class="d-block">
                      {{ $moment(local.updated_at).format('LLL') }}
                      <span class="text-muted d-block">
                        {{ dates.timeAgo(local.updated_at) }}
                      </span>
                    </small>
                  </td>
                  <td>
                    <small class="d-block">
                      {{ $moment(backup.updated_at).format('LLL') }}
                      <span class="text-muted d-block">
                        {{ dates.timeAgo(backup.updated_at) }}
                      </span>
                    </small>
                  </td>
                </tr>

                <tr>
                  <td>Games</td>
                  <td>
                    {{ format.num(indexed?.lib?.length ?? 0) }}
                    <small
                      v-if="local.library"
                      v-tippy="hashText"
                      class="text-muted d-inline-block cursor-help"
                      :class="{ 'text-red': hasLibraryChanges }">
                      <Icon size="18" class="ms-2">Signature</Icon>

                      {{ local.library?.slice(-8) }}
                    </small>
                  </td>
                  <td>
                    {{ format.num(backup.games) }}
                    <small
                      v-tippy="hashText"
                      class="text-muted d-inline-block cursor-help"
                      :class="{ 'text-red': hasLibraryChanges }">
                      <Icon size="18" class="ms-2">Signature</Icon>
                      {{ backup?.sign_library?.slice(-8) }}
                    </small>
                  </td>
                </tr>
                <tr>
                  <td>States</td>
                  <td>
                    {{ states.length }}
                    <small
                      v-if="local.states"
                      v-tippy="hashText"
                      class="text-muted d-inline-block cursor-help"
                      :class="{ 'text-red': hasStatesChanges }">
                      <Icon size="18" class="ms-2">Signature</Icon>
                      {{ local.states?.slice(-8) }}
                    </small>
                  </td>
                  <td>
                    {{ backup.states || 0 }}
                    <small
                      v-tippy="hashText"
                      class="text-muted d-inline-block cursor-help"
                      :class="{ 'text-red': hasStatesChanges }">
                      <Icon size="18" class="ms-2">Signature</Icon>
                      {{ backup?.sign_states?.slice(-8) }}
                    </small>
                  </td>
                </tr>

                <tr>
                  <td style="border-bottom: 0">Account and settings</td>
                  <td style="border-bottom: 0">
                    <small
                      v-if="local.account"
                      v-tippy="hashText"
                      class="text-muted d-inline-block cursor-help"
                      :class="{ 'text-red': hasAccountChanges }">
                      <Icon size="18">Signature</Icon>
                      {{ local.account?.slice(-8) }}
                    </small>
                    <small v-else class="text-muted d-inline-block">Never synced</small>
                  </td>
                  <td style="border-bottom: 0">
                    <small
                      v-tippy="hashText"
                      class="text-muted d-inline-block cursor-help"
                      :class="{ 'text-red': hasAccountChanges }">
                      <Icon size="18">Signature</Icon>
                      {{ backup?.sign_account?.slice(-8) }}
                    </small>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="row g-4">
            <div v-if="ui.loading" class="col-12">
              <v-progress-linear
                color="deep-purple accent-4"
                indeterminate
                rounded
                height="6"></v-progress-linear>
              <div class="my-2 text-center">
                <small class="text-muted">Applying, please wait</small>
              </div>
            </div>

            <template v-else>
              <template v-if="ui.step == 'complete'">
                <div class="col-11 mx-auto text-center">
                  <div class="text-secondary pb-3 mb-2">
                    Your local data has been synchronized with the cloud backup. Now it's
                    recommended to reload the application window to avoid issues with previously
                    loaded data.
                  </div>
                  <v-btn color="green-darken-2 my-2" block variant="tonal" @click="reload">
                    <Icon size="16" width="1" class="mx-2">Checks</Icon>
                    Accept changes and reload
                  </v-btn>
                  <small class="text-muted d-block py-2 my-1">
                    If you have any issues, please contact me on
                    <a href="https://discord.gg/F2sPE5B" target="_blank" class="text-primary">
                      Discord
                    </a>
                  </small>
                </div>
              </template>

              <template v-if="ui.step == 'conflict'">
                <div class="col-6">
                  <v-btn color="deep-purple-lighten-2" block variant="tonal" @click="upload">
                    <Icon size="18" width="1" class="mx-2">WorldUpload</Icon>
                    Upload local
                  </v-btn>
                </div>
                <div class="col-6">
                  <v-btn color="deep-purple-lighten-2" block variant="tonal" @click="applyBackup">
                    <Icon size="18" width="1" class="mx-2">WorldDownload</Icon>
                    Download cloud Backup
                  </v-btn>
                </div>
              </template>

              <template v-if="ui.step == 'restore'">
                <div class="col-11 mx-auto text-center">
                  <v-btn color="deep-purple-lighten-2" block variant="tonal" @click="applyBackup">
                    <Icon size="18" width="1" class="mx-2">WorldDownload</Icon>
                    Download cloud Backup
                  </v-btn>
                </div>
              </template>
            </template>
          </div>
        </v-card-text>
      </v-card>
    </ClientOnly>
  </v-dialog>
</template>

<script>
/**
 * @file:    \components\backup\RestoreDialog.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 23rd August 2024
 * Modified: 5th November 2025 - 03:44:59
 **/

export default {
  name: 'BackupRestoreDialog',
  data: () => ({
    backup: {},

    hashText:
      'This signature identifies data integrity. Comparing signatures helps to determine if data has changed.',

    ui: {
      // restore, conflict, complete
      step: 'restore',

      show: false,
      loading: false,
    },
  }),

  computed: {
    ...mapStores(useBackupStore),
    ...mapState(useStateStore, ['states']),
    ...mapState(useDataStore, {
      indexed: 'index',
    }),

    ...mapState(useBackupStore, {
      local: 'local',
      control: 'control',
    }),

    hasLibraryChanges() {
      return this.control.local.library.hash !== this.control.cloud.library.hash
    },

    hasStatesChanges() {
      return this.control.local.states.hash !== this.control.cloud.states.hash
    },

    hasAccountChanges() {
      return this.control.local.account.hash !== this.control.cloud.account.hash
    },
  },

  methods: {
    async reload() {
      window.location.reload()
    },

    //+-------------------------------------------------
    // show()
    //
    // -----
    // Created on Fri Oct 24 2025
    //+-------------------------------------------------
    show(backup, step = 'restore') {
      backup.version = backup.hash.split('.')[0]
      this.backup = backup

      this.ui.show = true
      this.ui.step = step
      this.ui.loading = false
    },

    //+-------------------------------------------------
    // applyBackup()
    // The user has accepted to apply the cloud backup
    // This should be a mirror And follow the same steps
    // as in the $cloud.syncFromCloud() method
    // -----
    // Created on Fri Oct 31 2025
    //+-------------------------------------------------
    async applyBackup() {
      this.ui.loading = true

      await this.backupStore.applyBackup(this.backup)
      await this.backupStore.storeBackup()
      $mitt.emit('backup:restored')

      this.ui.step = 'complete'
      this.ui.loading = false
    },
  },

  mounted() {
    this.$mitt.on('backup:restore', (payload) => {
      this.show(payload.backup, 'restore')
    })

    this.$mitt.on('backup:conflict', (payload) => {
      this.show(payload.backup)
    })
  },
}
</script>
