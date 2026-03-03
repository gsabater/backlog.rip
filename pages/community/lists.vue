<template>
  <ClientOnly>
    <div class="page-body">
      <div class="container-xl">
        <div class="row gx-lg-5 mx-auto">
          <div class="d-none d-lg-block col-lg-2">
            <community-sidebar></community-sidebar>
          </div>
          <div class="col-lg-9">
            <div class="row row-cards">
              <div class="col-8">
                <h2 class="mb-1">Community Lists</h2>
                <p class="card-subtitle">
                  Lists are organized collections of games created by the community.
                </p>
              </div>

              <div class="col-auto ms-auto">
                <v-btn
                  variant="tonal"
                  color="rgb(135 140 195)"
                  style="
                    filter: drop-shadow(0 0 1rem rgba(174, 62, 201, 0.2));
                    outline: 1px solid #9e58581c;
                    outline-offset: -1px;
                  "
                  @click="$mitt.emit('list:create')">
                  Create a new list
                </v-btn>
              </div>

              <!-- Popular Section -->
              <!-- <div class="col-12 mb-4">
                <h2>Popular</h2>
                <div class="card">
                  <div class="card-body">
                    <p class="text-muted">Placeholder for Popular Lists</p>
                    <pre>
                      {{ popularLists }}
                    </pre>
                    <pre>
                      {{ newLists }}
                    </pre>
                  </div>
                </div>
              </div> -->

              <!--
                *+---------------------------------
                *| Recently Created
                *+--------------------------------- -->
              <div class="col-8">
                <h2 class="mb-0">Recently created</h2>
                <p class="card-subtitle m-0">Fresh lists just created by the community.</p>
              </div>

              <div class="col-auto ms-auto" style="display: flex; align-items: flex-end">
                <small class="text-muted me-1 d-inline-block" style="padding-bottom: 4px">
                  Showing {{ displayedNewLists.length }} lists
                </small>
                <v-btn
                  v-if="newLists.length > 8 && !showAllNew"
                  size="small"
                  variant="text"
                  color="secondary"
                  @click="showAllNew = true">
                  Show more
                </v-btn>
              </div>
              <div class="col-12 mb-4">
                <div class="card mb-3">
                  <div v-if="!newLists.length" class="card-body">
                    <v-skeleton-loader
                      boilerplate
                      type="list-item-avatar-two-line@2"
                      color="transparent" />
                  </div>
                  <div v-else class="list-group card-list-group">
                    <template v-for="list in displayedNewLists" :key="list.uuid">
                      <community-list-item :list="list"></community-list-item>
                    </template>
                  </div>
                </div>
              </div>

              <!--
                *+---------------------------------
                *| Recently Updated
                *+--------------------------------- -->
              <div class="col-8">
                <h2 class="mb-0">Updated lists</h2>
                <p class="card-subtitle m-0">Changed</p>
              </div>

              <div class="col-auto ms-auto" style="display: flex; align-items: flex-end">
                <small class="text-muted me-1 d-inline-block" style="padding-bottom: 4px">
                  Showing {{ displayedUpdatedLists.length }} lists
                </small>
                <v-btn
                  v-if="updatedLists.length > 8 && !showAllUpdated"
                  size="small"
                  variant="text"
                  @click="showAllUpdated = true">
                  Show more
                </v-btn>
              </div>
              <div class="col-12 mb-4">
                <div class="card mb-3">
                  <div v-if="!updatedLists.length" class="card-body">
                    <v-skeleton-loader
                      boilerplate
                      type="list-item-avatar-two-line@2"
                      color="transparent" />
                  </div>
                  <div v-else class="list-group card-list-group">
                    <template v-for="list in displayedUpdatedLists" :key="list.uuid">
                      <community-list-item :list="list"></community-list-item>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script>
/**
 * @file:    /pages/community/lists.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 26th December 2025
 * Modified: 15th February 2026 - 17:23:18
 **/

export default {
  data() {
    return {
      showAllNew: false,
      showAllUpdated: false,
    }
  },

  computed: {
    ...mapStores(useCommunityStore, useJournalStore),
    ...mapState(useCommunityStore, ['popularLists', 'newLists', 'updatedLists']),

    displayedNewLists() {
      if (this.showAllNew) {
        return this.newLists
      }
      return this.newLists.slice(0, 5)
    },

    displayedUpdatedLists() {
      if (this.showAllUpdated) {
        return this.updatedLists
      }
      return this.updatedLists.slice(0, 5)
    },
  },

  methods: {
    //+-------------------------------------------------
    // goToList()
    // -----
    // Created on Sat Jan 17 2026
    //+-------------------------------------------------
    goToList(item) {
      const slug = item.slug || item.uuid
      const author = item.author?.slug || 'unknown'

      navigateTo(`/@${author}/list/${slug}`)
    },
  },
}
</script>
