<template>
  <v-dialog v-model="ui.show" max-width="650">
    <v-card>
      <template v-slot:title>
        <Icon class="me-2">CloudExclamation</Icon>
        Cloud conflict
      </template>

      <v-card-text class="px-5 mb-2">
        <div class="text-secondary mb-4">
          Your local saved data conflicts with what is stored on the cloud. The version
          you choose to keep will be synced in this device and the cloud, and the other
          will be overwritten.
        </div>

        <!-- <div class="row g-1 mb-3 align-items-center">
          <div class="col-6">
            <Icon
              size="18"
              width="2"
              class="text-azure me-2"
              style="transform: translateY(-1px)">
              Cloud
            </Icon>
            <h4 class="d-inline-block">Local</h4>
          </div>
          <div class="col-6 text-end text-secondary">
            Last updated {{ $moment($auth.cloud.updated_at).format('LLL') }}
          </div>
          <div class="col-6">
            <Icon
              size="18"
              width="2"
              class="text-lime me-2"
              style="transform: translateY(-1px)">
              DeviceFloppy
            </Icon>
            <h4 class="d-inline-block">Cloud</h4>
          </div>
          <div class="col-6 text-end text-secondary">
            Last updated
            {{ $moment($cloud.backup.updated_at).format('LLL') }}
          </div>
        </div> -->

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
                <td>Control code</td>
                <td>
                  <span v-if="$auth.cloud.hash">
                    {{ $auth.cloud.hash }}
                  </span>
                  <span v-else>Never synced</span>
                  <small class="text-muted d-block">
                    {{ $moment($auth.cloud.updated_at).format('LLL') }}
                  </small>
                </td>
                <td>
                  {{ $cloud.backup.hash }}
                  <small class="text-muted d-block">
                    {{ $moment($cloud.backup.updated_at).format('LLL') }}
                  </small>
                </td>
              </tr>

              <tr>
                <td>Games</td>
                <td>
                  {{ format.num($app.count.library) }}
                  <small
                    v-if="$auth.cloud?.library"
                    class="text-muted d-inline-block cursor-help"
                    v-tippy="
                      'This signature hash verifies the integrity of your data. You can detect any conflicts by comparing their hashes'
                    ">
                    <Icon size="14" class="ms-2">Signature</Icon>

                    {{ $auth.cloud?.library?.slice(-6) }}
                  </small>
                  <!-- <small class="text-muted d-inline-block cursor-help" v-tippy="'This signature hash verifies the integrity of your data. You can detect any conflicts by comparing their hashes'">
                    <Icon size="14" class="ms-2">Signature</Icon>
                  </small> -->
                </td>
                <td>
                  {{ $cloud.backup.games || 0 }}
                  <small
                    class="text-muted d-inline-block cursor-help"
                    v-tippy="
                      'This signature hash verifies the integrity of your data. You can detect any conflicts by comparing their hashes'
                    ">
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
                    class="text-muted d-inline-block cursor-help"
                    v-tippy="
                      'This signature hash verifies the integrity of your data. You can detect any conflicts by comparing their hashes'
                    ">
                    <Icon size="14" class="ms-2">Signature</Icon>
                    {{ $auth.cloud?.states?.slice(-6) }}
                  </small>
                </td>
                <td>
                  {{ $cloud.backup.states || 0 }}
                  <small
                    class="text-muted d-inline-block cursor-help"
                    v-tippy="
                      'This signature hash verifies the integrity of your data. You can detect any conflicts by comparing their hashes'
                    ">
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
                    class="text-muted d-inline-block cursor-help"
                    v-tippy="
                      'This signature hash verifies the integrity of your data. You can detect any conflicts by comparing their hashes'
                    ">
                    <Icon size="14">Signature</Icon>
                    {{ $auth.cloud?.account?.slice(-6) }}
                  </small>
                  <small v-else class="text-muted d-inline-block">Never synced</small>
                </td>
                <td>
                  <small
                    class="text-muted d-inline-block cursor-help"
                    v-tippy="
                      'This signature hash verifies the integrity of your data. You can detect any conflicts by comparing their hashes'
                    ">
                    <Icon size="14">Signature</Icon>
                    {{ $cloud.backup?.sign_account?.slice(-6) }}
                  </small>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="row g-4">
          <div class="col-12" v-if="ui.loading">
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
              @click="download"
              variant="tonal">
              <Icon size="18" width="1" class="ms-2">WorldDownload</Icon>
              Download cloud data
            </v-btn>
          </div>
          <div class="col-6">
            <v-btn
              :disabled="ui.loading"
              color="deep-purple-lighten-2"
              block
              @click="upload"
              variant="tonal">
              <Icon size="18" width="1" class="ms-2">WorldUpload</Icon>
              Upload local
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
 * Modified: Sat 07 September 2024 - 16:14:02
 **/

export default {
  name: 'CloudConflict',
  data: () => ({
    ui: {
      action: '',

      show: false,
      loading: false,
    },
  }),

  computed: {
    ...mapStores(useCloudStore),
    ...mapState(useStateStore, ['states']),
  },

  methods: {
    download() {
      this.ui.action = 'Downloading...'
      this.ui.loading = true
      this.stateStore.resolve('download')
    },

    upload() {
      this.ui.action = 'Uploading...'
      this.ui.loading = true
      this.stateStore.resolve('upload')
    },
  },

  mounted() {
    this.$mitt.on('cloud:conflict', (payload) => {
      this.ui.show = true
    })
  },
}
</script>
