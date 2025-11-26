<template>
  <div class="card mb-3" style="padding: 0.5rem">
    <div class="card-body">
      <div>
        <div class="d-flex mb-3">
          <h1 class="m-0">
            <!-- <Icon class="me-2" style="transform: translateY(-2px)">CloudNetwork</Icon> -->
            Integrations
          </h1>
        </div>
      </div>
      <p>
        With your backlog.rip account, you can link your profiles from Steam and Steam-Backlog. This
        allows you to bring together your game library in one convenient location, making it easier
        to stay on top of your collection.
      </p>
      <p>
        Simplify the way you manage your games by centralizing your library from these platforms.
        Keep everything organized and accessible with just a few clicks, so you can focus on what
        matters—playing and planning your backlog.
      </p>
    </div>
  </div>

  <div class="row mb-3">
    <div class="col-6">
      <v-btn to="/import" variant="tonal" color="primary">Sync your library now</v-btn>
    </div>
  </div>

  <template v-for="account in accounts">
    <div class="card mb-3" style="outline: solid 1px #413231">
      <div class="list-group card-list-group">
        <div
          v-if="linked[account]"
          class="list-group-item px-3 text-decoration-none"
          style="padding-top: 0.8rem; padding-bottom: 0.8rem">
          <div class="row g-3 align-items-center">
            <div class="col-auto">
              <img
                :src="linked[account].manifest.source.logo"
                style="max-width: 40px; max-height: 40px" />
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
                variant="text"
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
          </div>
        </div>
        <div class="list-group-item px-3 text-decoration-none" style="background: #24232a">
          <div class="row g-3 align-items-center">
            <div class="col-auto text-secondary">
              <span
                v-if="linked[account].avatar"
                class="avatar"
                :style="{
                  backgroundImage: `url(${linked[account].avatar})`,
                }"></span>
            </div>
            <div class="col">
              <div>
                <span class="status-dot status-dot-animated status-green me-2"></span>
                <span class="font-serif">{{ linked[account].username }}</span>
              </div>
              <div class="v-list-item-subtitle">
                <small class="text-muted">
                  Linked {{ dates.timeAgo(linked[account].created_at) }}
                  <!-- <Icon size="16" width="1" style="transform: translateY(-1px)">Cards</Icon>
                  {{ linked[account].games }} games -->
                </small>
              </div>
            </div>
          </div>
        </div>
        <template v-for="item in text[account].features">
          <div
            class="list-group-item px-3 text-decoration-none"
            style="padding-top: 0.4rem; padding-bottom: 0.8rem; background: #24232a">
            <div class="row g-2 align-items-center">
              <div class="col-auto text-secondary">
                <Icon size="16" width="1.5" class="mx-3" style="color: #2fb344">Checks</Icon>
              </div>
              <div class="col">
                <span>{{ item.text }}</span>

                <div class="v-list-item-subtitle">
                  <small>
                    {{ item.more }}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div v-if="$app.wip && libraryStore.isLinked(account)" class="card-footer">
        <small v-if="linked[account].updated_at" class="text-muted">
          Last updated {{ $moment(linked[account].updated_at).format('LL') }}
        </small>
        <small v-else class="text-muted">Not yet synchronized</small>
      </div>
    </div>
  </template>
</template>

<script>
/**
 * @file:    \pages\account\sections\accounts.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 3rd January 2024
 * Modified: 6th November 2025 - 02:03:02
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
  },

  methods: {},
}
</script>
