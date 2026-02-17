<template>
  <div class="page-body">
    <div class="container-xl">
      <div class="row row-cards">
        <ClientOnly>
          <template v-for="(mod, platform) in modules" :key="platform">
            <div v-if="mod && mod.manifest" class="col-4">
              <import-card :module="mod" :integration="integration(platform)">
                <template #card:action>
                  <template v-if="libraryStore.isLinked(platform)">
                    <v-btn
                      block
                      :to="'/import/' + platform"
                      variant="tonal"
                      color="rgb(135 140 195)"
                      style="
                        filter: drop-shadow(0 0 1rem rgba(174, 62, 201, 0.2));
                        outline: 1px solid #9e58581c;
                        outline-offset: -1px;
                      ">
                      <Icon name="tabler:arrows-transfer-down" class="me-3" />
                      Import your library from {{ mod.manifest.source.name }}
                    </v-btn>
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
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\import\index.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 25th November 2024
 * Modified: 17th February 2026 - 12:19:16
 **/

export default {
  name: 'LibraryPicker',

  data() {
    return {
      ui: {
        error: null,

        saving: false,
        loading: false,
      },
    }
  },

  computed: {
    ...mapStores(useLibraryStore),
    ...mapState(useLibraryStore, {
      modules: 'module',
    }),
  },

  methods: {
    integration(platform) {
      return this.libraryStore?.linked[platform] ?? {}
    },
  },

  mounted() {},
}
</script>
