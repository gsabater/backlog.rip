<template>
  <div class="card mb-3" style="padding: 0.5rem">
    <div class="card-body">
      <div>
        <div class="d-flex mb-3">
          <h1 class="m-0">Connected accounts</h1>
        </div>
      </div>
      <p>
        With your backlog.rip account, you can link your profiles from Steam and
        Steam-Backlog. This allows you to bring together your game library in one
        convenient location, making it easier to stay on top of your collection.
      </p>
      <p>
        Simplify the way you manage your games by centralizing your library from these
        platforms. Keep everything organized and accessible with just a few clicks, so you
        can focus on what matters—playing and planning your backlog.
      </p>
    </div>
  </div>

  <!-- <div class="row mb-3">
    <div class="col-6">
      <v-btn to="/import/steam" variant="tonal" color="primary">
        Sync your library now
      </v-btn>
    </div>
  </div> -->

  <template v-for="account in accounts">
    <div class="card mb-3">
      <div class="list-group card-list-group">
        <div
          v-if="linked[account]"
          class="list-group-item px-3 cursor-pointer text-decoration-none"
          style="padding-top: 0.8rem; padding-bottom: 0.8rem">
          <div class="row g-3 align-items-center">
            <!-- <div class="col-auto text-secondary">
            <v-btn variant="text" icon="mdi-chevron-right" size="small">
              <Icon>Badge</Icon>
            </v-btn>
          </div> -->

            <div class="col-auto">
              <span
                v-if="linked[account].avatar"
                class="avatar"
                style="
                  background-image: url(/img/logos/steam.png);
                  background-color: transparent;
                "
                :style="{
                  backgroundImage: `url(${linked[account].avatar})`,
                }">
                <span
                  v-if="libraryStore.isLinked(account)"
                  class="badge bg-success"></span>
                <span v-else class="badge bg-danger"></span>
              </span>
              <span v-else>
                <img
                  :src="linked[account].manifest.source.logo"
                  alt=""
                  style="max-height: 40px" />
              </span>
            </div>
            <div v-if="linked[account]" class="col">
              <span class="font-serif">{{ linked[account].manifest.source.name }}</span>
              <div class="v-list-item-subtitle">
                <small>{{ text[account].description }}</small>
              </div>
            </div>

            <div class="col-auto">
              <v-btn
                v-if="libraryStore.isLinked(account)"
                variant="tonal"
                size="small"
                color="green-darken-2">
                <span class="status-dot status-dot-animated status-green me-2"></span>
                {{ linked[account].username }}
              </v-btn>

              <v-btn v-else variant="text" size="small" color="blue-grey-lighten-3">
                Connect account
                <Icon size="12" width="1.5" class="ms-2">ExternalLink</Icon>
              </v-btn>
            </div>

            <!-- <div class="col-auto text-secondary" @click.prevent="() => {}">
            <div style="position: relative">
              <v-btn
                variant="text"
                icon="mdi-chevron-right"
                size="x-small"
                color="grey-lighten-1">
                <Icon size="18" width="2">DotsVertical</Icon>
              </v-btn>
              <b-dropdown
                trigger="mouseenter focus click hover manual"
                placement="bottom-end"
                :debounce="15"
                style="min-width: 180px">
                <div class="dropdown-item">
                  <Icon size="16" class="me-2 text-muted">Pencil</Icon>
                  Edit details
                </div>

                <div class="dropdown-item">
                  <Icon size="16" class="me-2 text-muted">Replace</Icon>
                  Modify list
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item text-red">
                  <Icon size="16" class="me-2 text-red">Trash</Icon>
                  Delete list
                </div>
              </b-dropdown>
            </div>
          </div> -->

            <!-- <div class="col-auto text-secondary">
            <v-btn variant="tonal" icon="mdi-chevron-right" size="small">
              <Icon>ChevronRight</Icon>
            </v-btn>
          </div> -->
          </div>
        </div>
        <div
          class="list-group-item px-3 text-decoration-none"
          style="
            padding-top: 0.4rem;
            padding-bottom: 0.8rem;
            background-color: rgb(0 0 0 / 25%);
          ">
          <div class="pt-2">
            <!-- <div class="col-auto text-secondary">
            <v-btn variant="text" icon="mdi-chevron-right" size="small">
              <Icon>Badge</Icon>
            </v-btn>
          </div> -->
            <div class="col">
              <!-- <h5 class="mt-2 mb-1">Syncronize</h5> -->
              <ul class="list-unstyled space-y mb-0">
                <template v-for="item in text[account].features">
                  <li class="row g-2">
                    <span class="col-auto">
                      <Icon size="14" width="1.5" class="me-1 text-success">
                        {{ item.icon }}
                      </Icon>
                    </span>
                    <span class="col">
                      <strong class="d-block">{{ item.text }}</strong>
                      <span class="d-block text-secondary">{{ item.more }}</span>
                    </span>
                  </li>
                </template>
              </ul>

              <!-- <div
                class="v-list-item-subtitle ps-1"
                style="font-size: 85.714285% !important">
                Update your library with your Steam games and playtime.
                <br />
                Unlock and track achievements automatically.
              </div>

              <h5 class="mt-3 mb-1">Requirements</h5>
              <div
                class="v-list-item-subtitle ps-1"
                style="font-size: 85.714285% !important">
                A public Steam profile or a Steam API Key is needed.
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <div v-if="$app.wip && libraryStore.isLinked(account)" class="card-footer">
        <small>
          Last updated {{ $moment(linked[account].updated_at).format('LL') }}
          <template v-if="$cloud.sub">
            🔸
            <span class="text-muted cursor-help">
              <Icon
                width="1.2"
                size="14"
                class="me-1"
                style="transform: translateY(-1px)">
                Cards
              </Icon>
              <strong>{{ linked[account].games }} games in this integration</strong>
            </span>
          </template>
        </small>
      </div>
    </div>
  </template>

  <div v-if="$app.wip" class="card mb-3">
    <div class="list-group card-list-group">
      <div
        class="list-group-item px-3 cursor-pointer text-decoration-none"
        style="padding-top: 0.8rem; padding-bottom: 0.8rem">
        <div class="row g-3 align-items-center">
          <!-- <div class="col-auto text-secondary">
            <v-btn variant="text" icon="mdi-chevron-right" size="small">
              <Icon>Badge</Icon>
            </v-btn>
          </div> -->
          <div class="col-auto">
            <span
              class="avatar"
              style="
                background-image: url(/img/logos/steam.png);
                background-color: transparent;
              ">
              <span class="badge bg-danger"></span>
            </span>
          </div>
          <div class="col">
            <span class="font-serif">Steam</span>
            <div class="v-list-item-subtitle">
              <small>Synchronize your Steam account with Backlog.rip</small>
            </div>
          </div>

          <div class="col-auto">
            <v-btn variant="text" size="small" color="blue-grey-lighten-3">
              Connect account
              <Icon size="12" width="1.5" class="ms-2">ExternalLink</Icon>
            </v-btn>
          </div>

          <!-- <div class="col-auto text-secondary" @click.prevent="() => {}">
            <div style="position: relative">
              <v-btn
                variant="text"
                icon="mdi-chevron-right"
                size="x-small"
                color="grey-lighten-1">
                <Icon size="18" width="2">DotsVertical</Icon>
              </v-btn>
              <b-dropdown
                trigger="mouseenter focus click hover manual"
                placement="bottom-end"
                :debounce="15"
                style="min-width: 180px">
                <div class="dropdown-item">
                  <Icon size="16" class="me-2 text-muted">Pencil</Icon>
                  Edit details
                </div>

                <div class="dropdown-item">
                  <Icon size="16" class="me-2 text-muted">Replace</Icon>
                  Modify list
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item text-red">
                  <Icon size="16" class="me-2 text-red">Trash</Icon>
                  Delete list
                </div>
              </b-dropdown>
            </div>
          </div> -->

          <!-- <div class="col-auto text-secondary">
            <v-btn variant="tonal" icon="mdi-chevron-right" size="small">
              <Icon>ChevronRight</Icon>
            </v-btn>
          </div> -->
        </div>
      </div>
      <div
        class="list-group-item px-3 text-decoration-none"
        style="
          padding-top: 0.4rem;
          padding-bottom: 0.8rem;
          background-color: rgb(0 0 0 / 25%);
        ">
        <div class="row g-3 align-items-center">
          <!-- <div class="col-auto text-secondary">
            <v-btn variant="text" icon="mdi-chevron-right" size="small">
              <Icon>Badge</Icon>
            </v-btn>
          </div> -->
          <div class="col">
            <h5 class="mt-2 mb-1">Syncronize</h5>
            <div
              class="v-list-item-subtitle ps-1"
              style="font-size: 85.714285% !important">
              Update your library with your Steam games and playtime.
              <br />
              Unlock and track achievements automatically.
            </div>

            <h5 class="mt-3 mb-1">Requirements</h5>
            <div
              class="v-list-item-subtitle ps-1"
              style="font-size: 85.714285% !important">
              A public Steam profile or a Steam API Key is needed.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="$app.wip" class="card mb-3">
    <div class="list-group card-list-group">
      <div
        class="list-group-item px-3 cursor-pointer text-decoration-none"
        style="padding-top: 0.8rem; padding-bottom: 0.8rem">
        <div class="row g-3 align-items-center">
          <!-- <div class="col-auto text-secondary">
            <v-btn variant="text" icon="mdi-chevron-right" size="small">
              <Icon>Badge</Icon>
            </v-btn>
          </div> -->
          <div class="col-auto">
            <span
              class="avatar"
              style="
                background-image: url(/img/logos/steam.png);
                background-color: transparent;
              ">
              <span class="badge bg-success"></span>
            </span>
          </div>
          <div class="col">
            <span class="font-serif">Steam</span>
            <div class="v-list-item-subtitle">
              <small>Synchronize your Steam account with Backlog.rip</small>
            </div>
          </div>

          <div class="col-auto">
            <v-btn variant="tonal" size="small" color="green-darken-2">
              <span class="status-dot status-dot-animated status-green me-2"></span>
              Gohrum
            </v-btn>
          </div>
        </div>
      </div>
      <div
        class="list-group-item px-3 text-decoration-none"
        style="
          padding-top: 0.4rem;
          padding-bottom: 0.8rem;
          background-color: rgb(0 0 0 / 25%);
        ">
        <div class="row g-3 align-items-center">
          <!-- <div class="col-auto text-secondary">
            <v-btn variant="text" icon="mdi-chevron-right" size="small">
              <Icon>Badge</Icon>
            </v-btn>
          </div> -->
          <div class="col">
            <h5 class="mt-2 mb-1">Provide your own API key (optional)</h5>
            <div
              class="v-list-item-subtitle ps-1"
              style="font-size: 85.714285% !important">
              Even if is not required, you can provide your own Steam API key to improve
              the synchronization process.
              <br />
              This will enable library synchronization for private profiles, and avoid
              limitations when synchronizing achievements.
            </div>

            <div class="row mt-3">
              <div class="col-md-12 nope-col-lg-8 mb-3">
                <h3>{{ libraryStore.module.steam }}</h3>
                <div class="form-label font-serif">API Key</div>
                <!-- <h4 class="card-title mb-2">Username2</h4> -->
                <v-text-field value="**********" density="comfortable" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="$app.wip" class="row row-cards">
    <template v-for="(mod, platform) in libraryStore.module" :key="platform">
      <div v-if="mod && mod.manifest" class="col-6">
        <import-card :module="mod" :integration="integration(platform)">
          <template #card:action>
            <template v-if="libraryStore.isLinked(platform)">
              <NuxtLink :to="'/import/' + platform" class="btn btn-primary w-100 mb-2">
                <Icon class="me-3">ArrowsTransferDown</Icon>
                Synchronize now
              </NuxtLink>
            </template>
            <template v-else>
              <div class="text-secondary mb-3">
                Before you can synchronize your library with
                <strong class="text-white font-serif">
                  {{ mod.manifest.source.name }}
                </strong>
                , you need to link your account.
                <br />
                <br />
                This is a safe process, and only your account ID will be shared with us.

                <!-- <div class="hr-text">See also</div> -->
              </div>

              <template v-if="mod.manifest.requires == 'steamID'">
                <a class="btn btn-github w-100" href="https://api.backlog.rip/auth/steam">
                  <img src="/img/logos/steam.png" style="max-height: 16px" class="me-2" />
                  Sign in with Steam
                </a>
              </template>
            </template>
          </template>
          <template #card:footer></template>
        </import-card>
      </div>
    </template>
  </div>
</template>

<script>
/**
 * @file:    \pages\account\sections\accounts.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 3rd January 2024
 * Modified: Thu 13 March 2025 - 16:05:14
 **/

export default {
  name: 'AccountLinked',

  data() {
    return {
      text: {
        steam: {
          description: 'Import your Steam library, playtime and achievements',
          features: [
            {
              icon: 'Check',
              text: 'Import your Steam games',
              more: 'Including your playtime and last date played',
            },

            {
              icon: 'Check',
              text: 'Synchronize your Achievements',
              more: 'Including the progress and date of each achievement',
            },
          ],
        },
        steamBacklog: {
          description: 'Import game statuses and progress from steam-backlog.com',
          features: [
            {
              icon: 'Check',
              text: 'Game state',
              more: 'Individual progress for each game',
            },
          ],
        },
      },
    }
  },

  computed: {
    ...mapStores(useLibraryStore),

    accounts() {
      return this.libraryStore?.integrations ?? {}
    },

    linked() {
      return this.libraryStore?.linked ?? {}
    },
  },

  methods: {
    integration(platform) {
      return this.libraryStore?.linked[platform] ?? {}
    },

    async update(store, field) {
      this.$auth.setConfig(field)
      this.$toast.success('Your preferences have been updated')
    },
  },
}
</script>
