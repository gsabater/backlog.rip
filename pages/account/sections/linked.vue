<template>
  <div class="card mb-3" style="padding: 0.5rem">
    <div class="card-body">
      <div>
        <div class="d-flex mb-3">
          <h1 class="m-0">Linked libraries</h1>
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

  <div class="row row-cards">
    <template v-for="(mod, platform) in libraryStore.module" :key="platform">
      <div v-if="mod && mod.manifest" class="col-6">
        <import-card :module="mod" :integration="integration(platform)">
          <template #card:action>
            <template v-if="libraryStore.isLinked(platform)">
              <NuxtLink :to="'/import/' + platform" class="btn btn-primary w-100 mb-2">
                <Icon class="me-3">ArrowsTransferDown</Icon>
                Syncronize now
              </NuxtLink>
            </template>
            <template v-else>
              <div class="text-secondary mb-3">
                Before you can syncronize your library with
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
 * Modified: Mon 27 January 2025 - 17:16:08
 **/

export default {
  name: 'AccountLinked',

  data() {
    return {}
  },

  computed: {
    ...mapStores(useLibraryStore),

    section() {
      return this.$route.params.section
    },
  },

  methods: {
    integration(platform) {
      return this.libraryStore?.linked[platform] ?? {}
    },

    async update(store, field) {
      this.$auth.storeConfig(field)
      this.$toast.success('Your preferences have been updated')
    },
  },
}
</script>
