<template>
  <ClientOnly>
    <div class="card mb-3" style="padding: 0.5rem">
      <div class="card-body">
        <div>
          <div class="d-flex mb-3">
            <h1 class="m-0">Integrations</h1>
          </div>
        </div>
        <p>
          With your backlog.rip account, you can link your profiles from Steam and Steam-Backlog.
          This allows you to bring together your game library in one convenient location, making it
          easier to stay on top of your collection.
        </p>
        <p>
          Simplify the way you manage your games by centralizing your library from these platforms.
          Keep everything organized and accessible with just a few clicks, so you can focus on what
          matters—playing and planning your backlog.
        </p>
      </div>
    </div>

    <template v-for="account in accounts">
      <div class="card mb-3">
        <div class="list-group card-list-group">
          <!--
            *+---------------------------------
            *| Main integration row
            *| has logo, platform name, description, and connect button
            *+--------------------------------- -->
          <div
            class="list-group-item px-3 text-decoration-none control-hover"
            style="padding-top: 0.8rem; padding-bottom: 0.8rem">
            <div class="row g-3 align-items-center">
              <div class="col-auto">
                <div style="display: flex; align-items: center; gap: 8px">
                  <div
                    style="
                      width: 48px;
                      height: 48px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      background: #2d2c33;
                      border-radius: 3px;
                      box-shadow: 0 0 0 1px #3d3c43;
                    ">
                    <img
                      v-if="modules[account]"
                      :src="modules[account].manifest.source.logo"
                      style="max-width: 36px; max-height: 36px" />
                  </div>
                  <template v-if="libraryStore.isLinked(account)">
                    <Icon name="tabler:arrows-right-left" size="18" class="text-secondary" />
                    <span
                      v-if="linked[account].avatar"
                      class="avatar"
                      :style="{
                        backgroundImage: `url(${linked[account].avatar})`,
                        width: '40px',
                        height: '40px',
                      }"></span>
                  </template>
                </div>
              </div>
              <div class="col">
                <div class="mb-0 font-serif">
                  {{ modules[account].manifest.source.name }}
                </div>
                <div class="v-list-item-subtitle">
                  <div class="small text-secondary">
                    {{ text[account].description }}
                  </div>
                </div>
              </div>
              <div class="col-auto ms-auto text-secondary text-right" style="min-width: 200px">
                <div class="d-flex align-items-center" style="justify-content: flex-end">
                  <div class="small text-success font-mono" v-if="libraryStore.isLinked(account)">
                    <span class="status-dot status-dot-animated status-green"></span>
                    Connected
                  </div>
                  <template v-else>
                    <template v-if="account === 'steam' || account === 'steamBacklog'">
                      <common-login-button style="width: 200px"></common-login-button>
                    </template>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!--
            *+---------------------------------
            *| Connected information
            *| With account ID and sync button
            *+--------------------------------- -->
          <div
            v-if="libraryStore.isLinked(account)"
            class="list-group-item px-3 text-decoration-none control-hover"
            style="padding-top: 0.6rem; padding-bottom: 0.6rem; nopebackground: rgb(36, 35, 42)">
            <div class="row g-3 align-items-center">
              <div class="col-auto text-center ms-2 me-1 text-muted">
                <Icon name="tabler:chevron-right" size="16" />
              </div>
              <div class="col">
                <div class="mb-0 font-serif small">
                  {{ linked[account].username }}
                </div>
                <div class="v-list-item-subtitle">
                  <div class="small label font-mono text-secondary">
                    SteamID
                    <kbd>
                      {{ linked[account].account }}
                    </kbd>
                    <!-- {{ linked[account].games }} games &middot; Last synchronized
                    {{ linked[account].created_at }} -->
                  </div>
                </div>
              </div>
              <div class="col-auto">
                <v-btn
                  variant="tonal"
                  size="small"
                  color="secondary"
                  :to="`/import/${account}`"
                  @click="unlinkAccount(account)">
                  Sync now
                  <Icon
                    name="tabler:arrows-transfer-down"
                    size="12"
                    class="ms-1"
                    style="transform: translateY(1px)" />
                </v-btn>
              </div>
            </div>
          </div>

          <!--
            *+---------------------------------
            *| Syncronization details (only if connected)
            *+--------------------------------- -->
          <div
            v-if="libraryStore.isLinked(account)"
            class="list-group-item px-3 text-decoration-none control-hover"
            style="padding-top: 0.6rem; padding-bottom: 0.6rem; nopebackground: rgb(36, 35, 42)">
            <div class="row g-3 align-items-center">
              <div class="col-auto text-center ms-2 me-1 text-muted">
                <Icon name="tabler:chevron-right" size="16" />
              </div>
              <div class="col">
                <div class="mb-0 font-serif small">{{ linked[account].games }} games</div>
                <div class="v-list-item-subtitle">
                  <div class="small label text-secondary">
                    Last synchronized
                    {{ dates.timeAgo(linked[account].updated_at) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="libraryStore.isLinked(account)"
          class="card-footer d-flex justify-content-between align-items-center"
          style="padding-top: 0.5rem; padding-bottom: 0.5rem">
          <em class="small text-muted">
            Linked {{ $moment(linked[account].created_at).format('LLL') }}
          </em>
          <div class="col-auto">
            <v-btn
              variant="text"
              size="small"
              color="red"
              style="opacity: 0.8"
              @click="unlinkAccount(account)">
              Unlink account
            </v-btn>
          </div>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script>
/**
 * @file:    \pages\account\sections\accounts.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 3rd January 2024
 * Modified: 19th February 2026 - 17:26:50
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
              more: 'With completion status, and unlock date',
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

    modules() {
      return this.libraryStore?.module ?? null
    },
  },

  methods: {
    linkAccount(account) {
      // TODO: Implement link account logic
      console.log('Linking account:', account)
      this.$notify.info(`Linking ${account} account...`)
    },

    unlinkAccount(account) {
      // TODO: Implement unlink account logic
      console.log('Unlinking account:', account)
      this.$notify.warning(`Unlink ${account} account - not implemented yet`)
    },
  },
}
</script>
