<template>
  <div class="page-body">
    <div class="container-xl">
      <div class="row row-cards">
        <template v-for="(mod, platform) in libraryStore.module" :key="platform">
          <div v-if="mod && mod.manifest" class="col-4">
            <import-card :module="mod" :integration="integration(platform)">
              <template #card:action>
                <template v-if="libraryStore.isLinked(platform)">
                  <NuxtLink
                    :to="'/import/' + platform"
                    class="btn btn-primary w-100 mb-2">
                    <Icon class="me-3">ArrowsTransferDown</Icon>
                    Syncronize your library
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
                    This is a safe process, and only your account ID will be shared with
                    us.

                    <!-- <div class="hr-text">See also</div> -->
                  </div>

                  <template v-if="mod.manifest.requires == 'steamID'">
                    <a
                      class="btn btn-github w-100"
                      href="https://api.backlog.rip/auth/steam">
                      <img
                        src="/img/logos/steam.png"
                        style="max-height: 16px"
                        class="me-2" />
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
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\import\index.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 25th November 2024
 * Modified: Thu 12 December 2024 - 16:50:44
 **/

export default {
  name: 'LibraryPicker',

  setup() {
    definePageMeta({
      ssr: false,
    })
  },

  data() {
    return {
      logs: [], // log array for the whole process

      ui: {
        error: null,

        saving: false,
        loading: false,
      },
    }
  },

  computed: {
    ...mapStores(useLibraryStore),

    //+-------------------------------------------------
    // appsToIgnore()
    // -----
    // Created on Thu Dec 14 2023
    //+-------------------------------------------------
    appsToIgnore() {
      const items = []

      this.data.appsToReview
        .filter((el) => el.will_ignore === true)
        .forEach((el) => {
          items.push({
            name: el.name,
            [this.platform + '_id']: el.appid,
            // is: {
            //   owned: true,
            //   ignored: true,
            // },
          })
        })

      return items
    },
  },

  methods: {
    integration(platform) {
      return this.libraryStore?.linked[platform] ?? {}
    },
  },

  mounted() {},
}
</script>
