<template>
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
            style="border: 1px dashed #cccccc73; border-radius: 4px; height: auto; padding: 2rem">
            <div class="empty-subtitle text-secondary">
              <h3 class="empty-title mb-2 font-serif" style="font-weight: 300">
                This list is empty
              </h3>
              <p class="mb-3">
                There is nothing here. To start, try adding some games to it.
                <br />
                You can add most games, even if it's not in your library.
              </p>
              <v-btn
                variant="tonal"
                color="rgb(135 140 195)"
                style="
                  filter: drop-shadow(0 0 1rem rgba(174, 62, 201, 0.2));
                  outline: 1px solid #9e58581c;
                  outline-offset: -1px;
                "
                @click="$emit('showEditor')">
                Add games to the list
              </v-btn>
            </div>
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
 * Modified: 27th February 2026 - 13:57:48
 **/

export default {
  name: 'ListViewer',

  data: () => ({}),
  emits: ['showEditor'],

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
