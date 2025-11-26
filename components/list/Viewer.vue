<template>
  <!-- <div class="page-header d-print-none m-0">
    <div class="container-xl">
      <div class="row g-2 align-items-center">
        <div class="col">
          <ol class="breadcrumb breadcrumb-arrows" aria-label="breadcrumbs">
            <li class="breadcrumb-item">
              <a href="#">Lists</a>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              <a href="#">List</a>
            </li>
          </ol>

          <h2 class="page-title">All games</h2>
        </div>
        <div class="col-auto ms-auto">
          <div class="text-secondary mt-1 text-right small" style="text-align: right">
            About ~{{ format.num($app.count.api) }} games
            <br />
            <span class="text-muted" style="zoom: 0.8">(0.19 seconds)</span>
          </div>
        </div>
      </div>
    </div>
  </div> -->

  <div class="page-body mt-3">
    <div class="container-xl">
      <search-interface
        :source="listGames"
        :filters="{
          sortBy: list.sortBy,
          sortDir: list.sortDir,
        }"
        :config="{
          disabled: true,
        }">
        <!--
          *+---------------------------------
          *| Empty block
          *| Message when there are no results
          *+--------------------------------- -->
        <template #empty>
          <div
            class="empty"
            style="border: 1px dashed #cccccc73; border-radius: 4px; height: auto; padding: 4rem">
            <p class="empty-title mb-3 font-serif" style="font-weight: 300">This list is empty</p>
            <p class="empty-subtitle text-secondary">
              There is nothing here. To start, try adding some games to it.
              <br />
              You can add most games, even if it's not in your library.
            </p>
          </div>
        </template>
      </search-interface>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \components\list\viewer.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 8th October 2024
 * Modified: 26th November 2025 - 09:45:23
 **/

export default {
  name: 'ListViewer',

  data: () => ({}),

  computed: {
    ...mapStores(useListStore, useDataStore),
    ...mapState(useListStore, ['list']),

    listGames() {
      const games = []
      this.list.games.forEach((item) => {
        const app = this.dataStore.get(item.uuid)
        if (app) games.push(app)
      })

      return games
    },
  },

  methods: {},
}
</script>
