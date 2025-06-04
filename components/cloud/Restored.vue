<template>
  <v-dialog v-model="ui.show" max-width="650">
    <v-card>
      <template #title>
        <Icon class="me-2">Cloud</Icon>
        Backup restored
      </template>

      <v-card-text class="px-5 mb-2">
        <div
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
                <th class="text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Date and time</td>
                <td class="text-right">
                  <small class="d-block">
                    {{ $moment(backup.updated_at).format('LLL') }}
                  </small>
                </td>
              </tr>

              <tr>
                <td>Versioning</td>
                <td class="text-right">
                  <code class="me-2">v.{{ backup.version }}</code>
                </td>
              </tr>

              <tr>
                <td>Games</td>

                <td class="text-right">
                  {{ format.num(backup.games) }}
                  <small
                    v-tippy="
                      'This signature hash verifies the integrity of your data. You can detect any conflicts by comparing their hashes'
                    "
                    class="text-muted d-inline-block cursor-help">
                    <Icon size="14" class="ms-2">Signature</Icon>
                    {{ backup.sign_library?.slice(-6) }}
                  </small>
                </td>
              </tr>
              <tr>
                <td>States</td>

                <td class="text-right">
                  {{ backup.states || 0 }}
                  <small
                    v-tippy="
                      'This signature hash verifies the integrity of your data. You can detect any conflicts by comparing their hashes'
                    "
                    class="text-muted d-inline-block cursor-help">
                    <Icon size="14" class="ms-2">Signature</Icon>
                    {{ backup.sign_states?.slice(-6) }}
                  </small>
                </td>
              </tr>

              <tr>
                <td>Account and settings</td>
                <td class="text-right">
                  <small
                    v-tippy="
                      'This signature hash verifies the integrity of your data. You can detect any conflicts by comparing their hashes'
                    "
                    class="text-muted d-inline-block cursor-help">
                    <Icon size="14">Signature</Icon>
                    {{ backup.sign_account?.slice(-6) }}
                  </small>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="row g-4">
          <div class="col-11 mx-auto text-center">
            <div class="text-secondary mb-3">
              Your local data has been restored with the cloud backup. Now you should
              reload the window to avoid issues with previously loaded data.
            </div>
            <v-btn color="green-darken-2 mb-3" block variant="tonal" @click="reload">
              <Icon size="16" width="1" class="mx-2">Refresh</Icon>
              Reload page
            </v-btn>
            <small class="text-muted d-block mb-2">
              If you have any issues, please contact me on
              <a href="https://discord.gg/F2sPE5B" target="_blank" class="text-primary">
                Discord
              </a>
            </small>
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
 * Modified: Tue 01 April 2025 - 12:12:26
 **/

export default {
  name: 'CloudConflict',
  data: () => ({
    backup: {},
    ui: {
      action: '',

      show: false,
      loading: false,
      complete: false,
    },
  }),

  computed: {
    ...mapStores(useCloudStore),
  },

  methods: {
    show(backup) {
      this.backup = backup
      this.backup.version = backup.hash.split('.')[0]

      this.ui.show = true
    },

    async reload() {
      window.location.reload()
    },
  },
}
</script>
