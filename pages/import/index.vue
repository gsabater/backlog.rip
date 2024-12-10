<template>
  <div class="page-body">
    <div class="container-xl">
      <div class="row row-cards">
        <template v-for="(mod, platform) in libraryStore.module" :key="platform">
          <div class="col-4" v-if="mod && mod.manifest">
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
                  <p class="text-secondary px-4 mx-3 mb-4">
                    Before you can syncronize your library with
                    {{ mod.manifest.source.name }}, you need to link your account.
                    <br />
                    <br />
                    This is a safe process, and only your account ID will be shared with
                    us.

                    <!-- <div class="hr-text">See also</div> -->
                  </p>

                  <template v-if="mod.manifest.requires == 'steamID'">
                    <a class="btn btn-github" href="https://api.backlog.rip/auth/steam">
                      <Icon class="me-3">BrandSteam</Icon>
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
 * Modified: Tue 10 December 2024 - 17:45:55
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
