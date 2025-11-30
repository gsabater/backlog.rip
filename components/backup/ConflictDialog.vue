<template>
  <v-dialog v-model="ui.show" max-width="750">
    <v-card>
      <template #title>
        <Icon class="me-2">CloudExclamation</Icon>
        Cloud conflict
      </template>

      <v-card-text class="px-5 mb-2">
        <div v-if="latest && !ui.complete" class="text-secondary mb-4">
          Looks like there is a newer backup in the cloud than your local saved data. Resolve the
          conflict choosing the version you want to keep. The version you choose to keep will be
          synced in this device and the cloud, and the other will be overwritten.
        </div>

        <div
          v-if="latest && !ui.complete"
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
                  <small>v.{{ control.cloud.version }}</small>
                </td>
              </tr>

              <tr>
                <td>Date of backup</td>
                <td>
                  <small class="d-block">
                    {{ $moment($auth.cloud.updated_at).format('LLL') }}
                    <span class="text-muted d-block">
                      {{ dates.timeAgo($auth.cloud.updated_at) }}
                    </span>
                  </small>
                </td>
                <td>
                  <small class="d-block">
                    {{ $moment(latest.updated_at).format('LLL') }}
                    <span class="text-muted d-block">
                      {{ dates.timeAgo(latest.updated_at) }}
                    </span>
                  </small>
                </td>
              </tr>
              <!-- <tr>
                <pre>
    {{ latest }}
  </pre
                >
              </tr> -->
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

                    {{ local.library?.slice(-6) }}
                  </small>
                </td>
                <td>
                  {{ format.num(latest.games) }}
                  <small
                    v-tippy="hashText"
                    class="text-muted d-inline-block cursor-help"
                    :class="{ 'text-red': hasLibraryChanges }">
                    <Icon size="18" class="ms-2">Signature</Icon>
                    {{ latest?.sign_library?.slice(-6) }}
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
                    {{ local.states?.slice(-6) }}
                  </small>
                </td>
                <td>
                  {{ latest.states || 0 }}
                  <small
                    v-tippy="hashText"
                    class="text-muted d-inline-block cursor-help"
                    :class="{ 'text-red': hasStatesChanges }">
                    <Icon size="18" class="ms-2">Signature</Icon>
                    {{ latest?.sign_states?.slice(-6) }}
                  </small>
                </td>
              </tr>

              <tr>
                <td>Account and settings</td>
                <td>
                  <small
                    v-if="local.account"
                    v-tippy="hashText"
                    class="text-muted d-inline-block cursor-help"
                    :class="{ 'text-red': hasAccountChanges }">
                    <Icon size="18">Signature</Icon>
                    {{ local.account?.slice(-6) }}
                  </small>
                  <small v-else class="text-muted d-inline-block">Never synced</small>
                </td>
                <td>
                  <small
                    v-tippy="hashText"
                    class="text-muted d-inline-block cursor-help"
                    :class="{ 'text-red': hasAccountChanges }">
                    <Icon size="18">Signature</Icon>
                    {{ latest?.sign_account?.slice(-6) }}
                  </small>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="ui.complete" class="row g-4">
          <div class="col-11 mx-auto text-center">
            <div class="text-secondary mb-3">
              Your local data has been synchronized with the cloud. You can close this window, but
              it's recommended to reload the application.
            </div>
            <v-btn color="green-darken-2 mb-3" block variant="tonal" @click="ui.show = false">
              <Icon size="16" width="1" class="mx-2">Checks</Icon>
              Accept changes
            </v-btn>
            <small class="text-muted d-block mb-2">
              If you have any issues, please contact me on
              <a href="https://discord.gg/F2sPE5B" target="_blank" class="text-primary">Discord</a>
            </small>
          </div>
        </div>

        <div v-else class="row g-4">
          <div v-if="ui.loading" class="col-12">
            <v-progress-linear
              color="deep-purple accent-4"
              indeterminate
              rounded
              height="6"></v-progress-linear>
            <div class="my-2"></div>
            <small class="text-muted">{{ ui.action }}</small>
          </div>
          <div class="col-6">
            <v-btn
              :disabled="ui.loading"
              color="deep-purple-lighten-2"
              block
              variant="tonal"
              @click="upload">
              <Icon size="18" width="1" class="mx-2">WorldUpload</Icon>
              Upload local
            </v-btn>
          </div>
          <div class="col-6">
            <v-btn
              :disabled="ui.loading"
              color="deep-purple-lighten-2"
              block
              variant="tonal"
              @click="download">
              <Icon size="18" width="1" class="mx-2">WorldDownload</Icon>
              Download cloud Backup
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapStores } from 'pinia'

/**
 * @file:    \components\dialog\CloudConflicts.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 23rd August 2024
 * Modified: 21st October 2025 - 06:08:56
 **/

export default {
  name: 'CloudConflict',
  data: () => ({
    hashText:
      'This signature hash verifies the integrity of your data. You can detect any conflicts by comparing their hashes',

    ui: {
      action: '',

      show: false,
      loading: false,
      complete: false,
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
      latest: 'latest',
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
    async download() {
      this.ui.loading = true
      this.ui.action = 'Downloading...'

      await this.backupStore.applyBackup(this.latest, 'manually')
      this.ui.complete = true
    },

    async upload() {
      this.ui.loading = true
      this.ui.action = 'Uploading...'

      await this.backupStore.resolve('upload')
      this.ui.complete = true
    },
  },

  mounted() {
    this.$mitt.on('backup:conflict', (payload) => {
      this.ui.show = true
    })
  },
}
</script>
