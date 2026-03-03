<template>
  <div class="card mb-3">
    <div class="card-body" style="padding: 1.6rem">
      <div>
        <div class="d-flex mb-3">
          <h1 class="m-0">Cloud Backups</h1>
        </div>
      </div>
      <p>
        All data used by the application, including your user information, library, settings, and
        game progress, is first stored locally in your browser.
      </p>

      <p>
        To share your account and library between devices, you can use cloud backups, which store
        your data securely in the cloud and allow you to synchronize and access your information in
        multiple devices, ensuring it's always up to date.
      </p>

      <p class="mb-3">
        Cloud backups are optional and can be enabled or disabled at any time. You can always choose
        to export your data manually in the database page. .
      </p>

      <div class="form-check-description" style="vertical-align: top">
        <Icon
          name="tabler:click"
          size="14"
          width="1.5"
          class="tabler-icon tabler-icon-click mt-1 me-2"
          style="vertical-align: top" />
        <div class="d-inline-block">
          To manually export or import your data
          <br />
          go to the
          <NuxtLink to="/account/database">database page</NuxtLink>
        </div>
      </div>

      <!-- <p>
        <a class="link-secondary link-underline-opacity-25 me-3 cursor-pointer">
          <Icon name="tabler:link" size="14" class="me-1" />
          How it works
        </a>
        <a class="link-secondary link-underline-opacity-25 me-2 cursor-pointer">
          Why is there a quota?
        </a>
      </p> -->
    </div>
    <div class="card-footer">
      <div class="row align-items-center">
        <div class="col-auto">
          <label class="form-check form-switch m-0">
            <input
              v-model="$auth.config.cloud"
              class="form-check-input position-static"
              type="checkbox"
              @change="setConfig('cloud')" />
            <span class="form-check-label form-check-label-on">Cloud Backups are enabled</span>
            <span class="form-check-label form-check-label-off">Cloud Backups are disabled</span>
          </label>
        </div>
      </div>
    </div>
  </div>

  <!-- <pre>
    $Backup {{ $backup }}
    $Cloud {{ $cloud }}
    Conf {{ $auth.config }}
  </pre> -->

  <div v-if="$auth.config.cloud && $backup.is !== 'local'" class="card mb-3">
    <div class="card-body">
      <h2 id="settings" class="card-title mb-2">Backup settings</h2>
      <!-- <p class="card-subtitle">Adjust your preferences</p> -->

      <div class="row">
        <div class="col-md-12">
          <div class="form-label">Conflict tolerance</div>
          <p class="text-secondary mb-1">
            A conflict occurs when backups from different devices contain different data. Conflict
            tolerance determines how these conflicts are resolved, allowing the application to
            handle them automatically based on your preferences.
          </p>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <div class="row">
        <div class="col-6">
          <label class="form-check form-switch cursor-pointer m-0">
            <input
              v-model="$auth.config.cloud_resolve"
              type="checkbox"
              class="form-check-input"
              @change="setConfig('cloud_resolve')" />
            <span class="form-check-label form-label mb-1">Automatic conflict resolution</span>

            <span class="form-check-description">
              When enabled, conflicts in synchronization conflicts will be resolved based on the
              version tolerance and action.
            </span>
          </label>
        </div>
        <div class="col-2">
          <div class="form-label">Tolerance</div>
          <!-- <h4 class="card-title mb-2">Username2</h4> -->
          <v-text-field
            v-model.number="$auth.config.cloud_tolerance"
            density="comfortable"
            type="number"
            @blur="setConfig('cloud_tolerance')" />
        </div>
        <div class="col-4">
          <label class="form-label">Action on conflict</label>
          <v-select
            v-model="$auth.config.cloud_action"
            :items="[
              { value: 'downloadIfNewer', title: 'Download if cloud is newer' },
              { value: 'downloadAlways', title: 'Always download' },
            ]"
            item-title="title"
            item-value="value"
            @update:model-value="setConfig('cloud_action')" />
        </div>
      </div>
    </div>
  </div>

  <div v-if="false && $auth.config.cloud && $backup.is !== 'local'" class="card mb-3">
    <div class="card-body">
      <h2 id="status" class="mb-3">Synchronization status</h2>

      <template>
        <h4 class="mb-1">Local-only database</h4>
        <p>
          Your data is stored directly in your browser's IndexedDB and is not synced to the cloud.
          This means it is only accessible on this device and by you.
          <!-- All your data lives directly in your browser's indexedDB and not in the
            cloud, so it is only accesible to you. -->
        </p>
      </template>

      <div class="row g-3">
        <div v-if="$backup.is == 'syncing'" class="d-flex align-items-center">
          <div class="avatar avatar-sm rounded-circle bg-green-lt" style="--tblr-bg-opacity: 0.3">
            <Icon name="tabler:cloud-rain" size="18" width="1.5" />
          </div>
          <div class="ms-3">
            <span class="text-body">Synchronizing...</span>
          </div>
        </div>

        <div v-if="$backup.is == 'sync:done'" class="d-flex align-items-center">
          <div class="avatar avatar-sm rounded-circle bg-green-lt" style="--tblr-bg-opacity: 0.3">
            <Icon name="tabler:cloud-check" size="18" width="1.5" />
          </div>
          <div class="ms-3">
            <span class="text-body">Connected and synchronized</span>
            <div class="text-secondary">
              Last backup
              {{ dates.dynamicTimeAgo($auth.cloud.updated_at) }} ago
            </div>
          </div>
        </div>

        <!-- <div class="col-md-12 nope-col-lg-8">
          <div class="form-check-description ms-1" style="vertical-align: top">
            <Icon
              size="14"
              width="1.5"
              class="tabler-icon tabler-icon-click mt-1 me-2"
              style="vertical-align: top">
              Click
            </Icon>
            <div class="d-inline-block">
              To change the states shown in the sidebar menu
              <br />
              go to the
              <NuxtLink to="/account/states">states configuration page</NuxtLink>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>

  <div v-if="$backup.is == 'local'" class="card mb-3">
    <div class="card-body">
      <h2 class="mb-2">Enable cloud saves</h2>
      <p class="card-subtitle">Enable cloud sync by logging in</p>
      <p>
        In order to enable cloud sync, you need to login with your Steam account.
        <br />
        This is a safe process, and only your SteamID will be shared with us.
      </p>
      <a class="btn btn-github" href="https://api.backlog.rip/auth/steam">
        <Icon name="tabler:brand-steam" class="me-2">BrandSteam</Icon>
        Sign in with Steam
      </a>
    </div>
  </div>

  <div v-if="$auth.config.cloud" class="card mb-3">
    <div class="card-body">
      <h2 id="quota" class="card-title mb-2">Cloud usage and quota</h2>
      <!-- <p class="card-subtitle">Amount of data stored in the cloud.</p> -->
      <div class="row">
        <div class="col-md-12">
          <div class="form-label">Why is there a limit?</div>
          <p class="text-secondary mb-1">
            Backup storage requires server resources, and to ensure fair usage and maintain
            performance for all users, there is a limit on the number of backups you can store in
            the cloud. For storage reasons, you can keep up to 3 backups in the cloud. Each backup
            contains all your data: games, states and account settings.
          </p>
        </div>
      </div>
    </div>
    <table class="table card-table table-vcenter">
      <thead>
        <tr>
          <th class="text-right" style="width: 20%">Dimension</th>
          <th class="text-center" style="width: 1%"></th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-right">Account data</td>
          <td class="text-center"><Icon name="tabler:check" size="14" class="text-success" /></td>
          <td class="text-secondary">Your username, account ID and other libraries linked</td>
        </tr>
        <tr>
          <td class="text-right">Preferences</td>
          <td class="text-center"><Icon name="tabler:check" size="14" class="text-success" /></td>
          <td class="text-secondary">
            Sidebar configuration, pinned states and other preferences.
          </td>
        </tr>
        <tr>
          <td class="text-right">Games</td>
          <td class="text-center">
            <kbd class="text-muted text-uppercase">
              {{ format.num($app.count.library) }}
            </kbd>
          </td>
          <td class="text-secondary">Games and metadata like state, playtime, etc...</td>
        </tr>

        <tr>
          <td class="text-right">Lists</td>
          <td class="text-center">
            <kbd class="text-muted text-uppercase">
              {{ format.num($app.count.lists) }}
            </kbd>
          </td>
          <td class="text-secondary">
            Every list is stored online individually after every update
          </td>
        </tr>

        <tr>
          <td class="text-right">States</td>
          <td class="text-center">
            <kbd class="text-muted text-uppercase">
              {{ format.num(Object.keys($app.count.states).length) }}
            </kbd>
          </td>
          <td class="text-secondary">
            States and their configuration, including which games are in each state and the order of
            states in the sidebar.
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="card mb-3">
    <div class="card-body">
      <h2 class="card-title mb-2">Synchronization history</h2>
      <p class="card-subtitle">Your latest backups</p>
    </div>
    <table class="table card-table table-vcenter">
      <thead>
        <tr>
          <th class="text-right">Version</th>
          <th>Date</th>
          <th>Account</th>
          <th>Games</th>
          <th>States</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(backup, i) in backups" :key="i">
          <tr>
            <td class="d-flex text-right">
              <small class="badge bg-primary-lt ms-auto font-mono me-2">
                v{{ backup.hash.split('.')[0] }}
              </small>
              <kbd class="text-muted text-uppercase">
                {{ backup.hash.includes('.') ? backup.hash.split('.')[1] : backup.hash }}
              </kbd>
              <!-- <code class="text-muted me-2"></code>
              <small v-if="$auth.cloud.hash == backup.hash" class="label">
                <span class="badge bg-success mx-1"></span>
                Active
              </small> -->
            </td>

            <td>
              <span class="text-secondary">
                {{
                  $moment(
                    $auth.cloud.hash == backup.hash ? $auth.cloud.updated_at : backup.updated_at
                  ).format('LLL')
                }}
                <small class="text-muted px-2">
                  {{
                    dates.dynamicTimeAgo(
                      $auth.cloud.hash == backup.hash ? $auth.cloud.updated_at : backup.updated_at
                    )
                  }}
                  ago
                </small>
              </span>
            </td>
            <td class="text-center"><Icon name="tabler:check" size="14" class="text-success" /></td>
            <td class="text-center">
              <kbd class="text-muted text-uppercase">
                {{ backup.games || 0 }}
              </kbd>
            </td>
            <td class="text-center">
              <kbd class="text-muted text-uppercase">
                {{ backup.states || 0 }}
              </kbd>
            </td>
            <td class="text-end">
              <v-btn size="x-small" variant="light" color="primary" @click="applyBackup(backup)">
                <Icon name="tabler:cloud-download" size="14" />
              </v-btn>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
/**
 * @file:    \pages\account\sections\cloud.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 15th August 2024
 * Modified: 14th February 2026 - 17:07:03
 **/

export default {
  name: 'AccountCloudSync',

  data() {
    return {}
  },

  computed: {
    ...mapStores(useBackupStore),
    ...mapState(useBackupStore, ['backups']),

    $backup() {
      return this.$cloud?.backup || {}
    },
  },

  methods: {
    //+-------------------------------------------------
    // setConfig()
    // Updates a field in the db via $auth
    // -----
    // Created on Mon Dec 18 2023
    //+-------------------------------------------------
    async setConfig(field) {
      this.$auth.setConfig(field)
      this.$toast.success('Your preferences have been saved')

      // Todo: reconnect using another method
      // await delay(333)
      // this.backupStore.connect()
    },

    //+-------------------------------------------------
    // applyBackup()
    // -----
    // Created on Tue Apr 01 2025
    //+-------------------------------------------------
    async applyBackup(backup) {
      // this.$refs.restore.show(backup)
      this.$mitt.emit('backup:restore', { backup })
    },
  },
}
</script>
