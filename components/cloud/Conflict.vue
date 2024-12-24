<template>
  <v-dialog v-model="ui.show" max-width="650">
    <v-card>
      <template #title>
        <Icon class="me-2">CloudExclamation</Icon>
        Cloud conflict
      </template>

      <v-card-text class="px-5 mb-2">
        <div class="text-secondary mb-4">
          Your local saved data conflicts with what is stored on the cloud. The version
          you choose to keep will be synced in this device and the cloud, and the other
          will be overwritten.
        </div>

        <div
          v-if="$cloud.backup"
          class="mb-4"
          style="
            background-color: rgba(0, 0, 0, 0.2);
            border: 2px solid rgb(0 0 0 / 20%);
            border-radius: 4px;
          ">
          <table class="table card-table table-vcenter">
            <thead>
              <tr>
                <th>Dimension</th>
                <th>Local</th>
                <th>Cloud</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Date and time</td>
                <td>
                  <small class="d-block">
                    {{ $moment($auth.cloud.updated_at).format('LLL') }}
                  </small>
                </td>
                <td>
                  <small class="d-block">
                    {{ $moment($cloud.backup.updated_at).format('LLL') }}
                  </small>
                </td>
              </tr>

              <tr>
                <td>Versioning</td>
                <td>
                  <code class="me-2">v.{{ $cloud.b['cli.v'] }}</code>
                </td>
                <td>
                  <code class="me-2">v.{{ $cloud.b['hash.v'] }}</code>
                </td>
              </tr>

              <tr>
                <td>Games</td>
                <td>
                  {{ format.num(indexed?.lib?.length ?? 0) }}
                  <small
                    v-if="$auth.cloud?.library"
                    v-tippy="
                      'This signature hash verifies the integrity of your data. You can detect any conflicts by comparing their hashes'
                    "
                    class="text-muted d-inline-block cursor-help"
                    :class="{
                      'text-red': $auth.cloud?.library !== $cloud.backup.sign_library,
                    }">
                    <Icon size="14" class="ms-2">Signature</Icon>

                    {{ $auth.cloud?.library?.slice(-6) }}
                  </small>
                  <!-- <small class="text-muted d-inline-block cursor-help" v-tippy="'This signature hash verifies the integrity of your data. You can detect any conflicts by comparing their hashes'">
                    <Icon size="14" class="ms-2">Signature</Icon>
                  </small> -->
                </td>
                <td>
                  {{ format.num($cloud.backup.games) }}
                  <small
                    v-tippy="
                      'This signature hash verifies the integrity of your data. You can detect any conflicts by comparing their hashes'
                    "
                    class="text-muted d-inline-block cursor-help"
                    :class="{
                      'text-red': $auth.cloud?.library !== $cloud.backup.sign_library,
                    }">
                    <Icon size="14" class="ms-2">Signature</Icon>
                    {{ $cloud.backup?.sign_library?.slice(-6) }}
                  </small>
                  <!-- <small class="text-muted d-inline-block cursor-help" v-tippy="'This signature hash verifies the integrity of your data. You can detect any conflicts by comparing their hashes'">
                    <span class="badge bg-purple-lt">
                      {{ $cloud.backup.sign_library }}
                    </span>
                    <Icon size="14" class="ms-2">Signature</Icon>
                  </small> -->
                </td>
              </tr>
              <tr>
                <td>States</td>
                <td>
                  {{ states.length }}
                  <small
                    v-if="$auth.cloud?.states"
                    v-tippy="
                      'This signature hash verifies the integrity of your data. You can detect any conflicts by comparing their hashes'
                    "
                    class="text-muted d-inline-block cursor-help"
                    :class="{
                      'text-red':
                        $cloud.b['states.cli.hash'] !== $cloud.b['states.clo.hash'],
                    }">
                    <Icon size="14" class="ms-2">Signature</Icon>
                    {{ $auth.cloud?.states?.slice(-6) }}
                  </small>
                </td>
                <td>
                  {{ $cloud.backup.states || 0 }}
                  <small
                    v-tippy="
                      'This signature hash verifies the integrity of your data. You can detect any conflicts by comparing their hashes'
                    "
                    class="text-muted d-inline-block cursor-help"
                    :class="{
                      'text-red':
                        $cloud.b['states.cli.hash'] !== $cloud.b['states.clo.hash'],
                    }">
                    <Icon size="14" class="ms-2">Signature</Icon>
                    {{ $cloud.backup?.sign_states?.slice(-6) }}
                  </small>
                </td>
              </tr>

              <tr>
                <td>Account and settings</td>
                <td>
                  <small
                    v-if="$auth.cloud?.account"
                    v-tippy="
                      'This signature hash verifies the integrity of your data. You can detect any conflicts by comparing their hashes'
                    "
                    class="text-muted d-inline-block cursor-help"
                    :class="{
                      'text-red':
                        $cloud.b['account.cli.hash'] !== $cloud.b['account.clo.hash'],
                    }">
                    <Icon size="14">Signature</Icon>
                    {{ $auth.cloud?.account?.slice(-6) }}
                  </small>
                  <small v-else class="text-muted d-inline-block">Never synced</small>
                </td>
                <td>
                  <small
                    v-tippy="
                      'This signature hash verifies the integrity of your data. You can detect any conflicts by comparing their hashes'
                    "
                    class="text-muted d-inline-block cursor-help"
                    :class="{
                      'text-red':
                        $cloud.b['account.cli.hash'] !== $cloud.b['account.clo.hash'],
                    }">
                    <Icon size="14">Signature</Icon>
                    {{ $cloud.backup?.sign_account?.slice(-6) }}
                  </small>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="ui.complete" class="row g-4">
          <div class="col-10 mx-auto text-center">
            <div class="text-secondary mb-3">
              Your local data has been syncronized with the cloud. You can close this
              window, but it's recommended to reload the application.
            </div>
            <v-btn
              color="green-darken-2 mb-3"
              block
              variant="tonal"
              @click="ui.show = false">
              <Icon size="16" width="1" class="mx-2">Checks</Icon>
              Accept changes
            </v-btn>
            <small class="text-muted d-block mb-2">
              If you have any issues, please contact me on
              <a href="https://discord.gg/F2sPE5B" target="_blank" class="text-primary">
                Discord
              </a>
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
              Download cloud data
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
/**
 * @file:    \components\dialog\CloudConflicts.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 23rd August 2024
 * Modified: Tue 24 December 2024 - 10:46:35
 **/

export default {
  name: 'CloudConflict',
  data: () => ({
    ui: {
      action: '',

      show: false,
      loading: false,
      complete: false,
    },
  }),

  computed: {
    ...mapStores(useCloudStore),
    ...mapState(useStateStore, ['states']),
    ...mapState(useDataStore, {
      indexed: 'index',
    }),
  },

  methods: {
    async download() {
      this.ui.action = 'Downloading...'
      this.ui.loading = true
      await this.cloudStore.resolve('download')
      this.ui.complete = true
    },

    async upload() {
      this.ui.action = 'Uploading...'
      this.ui.loading = true
      await this.cloudStore.resolve('upload')
      this.ui.complete = true
    },
  },

  mounted() {
    this.$mitt.on('cloud:conflict', (payload) => {
      this.ui.show = true
    })
  },
}
</script>
