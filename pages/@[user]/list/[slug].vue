<template>
  <div class="page-body">
    <div class="container-xl">
      <div v-if="ui.loading == false && list.not_found" class="col-md-8 mx-auto my-5 py-5">
        <div
          class="empty"
          style="border: 1px dashed #cccccc73; border-radius: 4px; height: auto; padding: 2rem">
          <div class="empty-subtitle text-secondary">
            <h2 class="empty-title mb-2 font-serif" style="font-weight: 300">List not found</h2>
            <p class="mb-4">
              The list you are looking for does not exist. It may have been removed or the URL is
              incorrect.
              <br />
              Please check the URL
              <strong>https://backlog.rip{{ $route.path }}</strong>
              and try again.
            </p>
            <p class="mb-4">
              If you believe this is an error, tell us about it on
              <a href="https://discord.gg/F2sPE5B" target="_blank" rel="noopener noreferrer">
                Discord
              </a>
            </p>
            <v-btn
              variant="tonal"
              color="rgb(135 140 195)"
              style="
                filter: drop-shadow(0 0 1rem rgba(174, 62, 201, 0.2));
                outline: 1px solid #9e58581c;
                outline-offset: -1px;
              "
              @click="$mitt.emit('list:create')">
              You can create a new list
            </v-btn>
          </div>
        </div>
      </div>

      <div v-if="list && list.id" class="row row-cards">
        <div class="col-lg-9">
          <list-viewer v-if="list && list.games.length" />
        </div>
        <div class="col-lg-3">
          <div style="position: sticky; top: 20px">
            <list-cover :list="list" class="my-3" />

            <!-- <div class="text-center">
              <h2 class="mb-1">{{ list.name }}</h2>
            </div> -->
            <div class="card">
              <div class="card-body">
                <h2 class="lh-1">{{ list.name }}</h2>

                <div class="text-secondary mb-2" v-if="list.description">
                  {{ list.description }}
                </div>
              </div>

              <div
                class="card-footer small"
                style="display: flex; flex-direction: column; line-height: 23px">
                <span v-if="list.author">
                  <Icon name="tabler:user" class="me-1" style="transform: translateY(1px)" />
                  By @{{ list.author.username }}
                </span>

                <span>
                  <Icon
                    name="tabler:calendar-week"
                    class="me-1"
                    style="transform: translateY(1px)" />
                  Created
                  {{ $moment(list.created_at).format('MMMM, YYYY') }}
                </span>

                <span>
                  <Icon
                    name="tabler:rotate-clockwise-2"
                    class="me-1"
                    style="transform: translateY(1px)" />
                  Last updated
                  {{ $moment(list.updated_at).format('LL') }}
                </span>
              </div>
              <div v-if="isMyList" class="card-footer p-2">
                <v-btn
                  class="my-2"
                  block
                  variant="tonal"
                  color="rgb(135 140 195)"
                  @click="goToList(list, true)">
                  Edit games
                </v-btn>
                <v-btn
                  class="my-2"
                  block
                  variant="tonal"
                  color="rgb(135 140 195)"
                  @click.stop="$refs.crud.edit(list)">
                  List details
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <list-crud-dialog ref="crud" @stored="$forceUpdate()" @deleted="$forceUpdate()" />
</template>

<script>
/**
 * @file:    \pages\@[user]\lists\[slug].vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 30th September 2024
 * Modified: 27th February 2026 - 13:56:13
 **/

export default {
  data() {
    return {
      ui: {
        loading: true,
      },
    }
  },

  computed: {
    ...mapStores(useDataStore, useStateStore, useListStore),
    ...mapState(useStateStore, ['states', 'pinnedStates', 'unPinnedStates']),
    ...mapState(useListStore, ['list']),

    //+-------------------------------------------------
    // isMyList()
    // Check if the list is owned by the current user
    // -----
    // Created on Fri Feb 06 2026
    //+-------------------------------------------------
    isMyList() {
      let listID = this.list.id
      let listUUID = this.list.uuid
      if (!listID && !listUUID) return false

      return this.listStore.lists.some((list) => {
        return list.id === listID || list.uuid === listUUID
      })
    },
  },

  watch: {
    '$app.ready': function () {
      this.init()
    },
  },

  methods: {
    //+-------------------------------------------------
    // goToList()
    // -----
    // Created on Fri Oct 11 2024
    //+-------------------------------------------------
    goToList(item, edit = false) {
      const slug = item.slug || item.uuid
      navigateTo('/my/list/' + slug + (edit ? '/edit' : ''))
    },

    //+-------------------------------------------------
    // getList()
    // Calls for the list data
    // -----
    // Created on Tue Jan 20 2026
    //+-------------------------------------------------
    async getList() {
      const { user, slug } = this.$route.params
      await this.listStore.loadPublic(user, slug)

      this.ui.loading = false
    },

    init() {
      if (!this.$app.ready) return
      this.listStore.reset()
      this.getList()
    },
  },

  mounted() {
    this.init()
  },
}
</script>
