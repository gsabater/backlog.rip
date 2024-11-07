<template>
  <template v-if="list.games.length">
    <div class="card mb-3">
      <draggable
        tag="div"
        :list="list.games"
        class="list-group card-list-group games-group games--list"
        handle=".handle"
        :item-key="(element) => element.uuid">
        <template #item="{ element, index }">
          <div data-helper="draggable-required-to-drag">
            <b-game
              type="list"
              :uuid="element"
              :display="['name', 'score']"
              :key="element.uuid"
              :action="null"
              style="padding-top: 0.65rem; padding-bottom: 0.65rem">
              <template #game:prepend>
                <div
                  class="col col-auto text-center px-1 handle cursor-move"
                  style="min-width: 33px">
                  <div
                    class="font-serif"
                    style=""
                    :class="{
                      'list-gold': index == 0,
                      'list-silver': index == 1,
                      'list-bronze': index == 2,
                      'text-muted': index > 2,
                    }">
                    {{ index + 1 }}
                  </div>
                </div>
              </template>

              <template #details>
                <!-- <small>This game cannot be added to the list</small> -->
              </template>

              <template #actions>
                <div class="col-auto">
                  <!-- <v-btn
                    icon
                    variant="text"
                    size="x-small"
                    color="grey-lighten-1"
                    v-tippy="'Move up'"
                    @click="move(element, 'up')">
                    <Icon size="16">ChevronUp</Icon>
                  </v-btn>
                  <v-btn
                    icon
                    variant="text"
                    size="x-small"
                    color="grey-lighten-1"
                    v-tippy="'Move down'"
                    @click="move(element, 'down')">
                    <Icon size="16">ChevronDown</Icon>
                  </v-btn> -->

                  <v-btn
                    icon
                    class="handle cursor-move"
                    variant="text"
                    size="x-small"
                    color="grey-lighten-1"
                    v-tippy="'Drag to reorder'">
                    <Icon size="16" width="1">GripVertical</Icon>
                  </v-btn>

                  <v-btn
                    icon
                    variant="text"
                    size="x-small"
                    color="grey-lighten-1"
                    v-tippy="'Remove from the list'"
                    @click="removeFromList(element)">
                    <Icon size="18">TrashX</Icon>
                  </v-btn>

                  <!-- <v-btn
                    variant="text"
                    icon="mdi-chevron-right"
                    size="x-small"
                    color="grey-lighten-1">
                    <Icon size="18" width="2">DotsVertical</Icon>
                  </v-btn> -->
                </div>
              </template>
            </b-game>
          </div>
        </template>
      </draggable>
    </div>

    <div
      class="hr-text font-serif w-75 mx-auto"
      style="margin-top: 2rem !important; margin-bottom: 2rem !important">
      ◈ ◈ ◈
    </div>
  </template>

  <div class="row mb-3">
    <div class="col-12">
      <h2>Search something to add</h2>
    </div>

    <div class="col-8">
      <v-text-field
        @update:modelValue="search"
        v-model="f.string"
        placeholder="Search by name..."
        clearable
        density="comfortable">
        <template v-slot:prepend-inner>
          <Icon size="16" class="text-secondary mx-1" style="min-width: 1em">Search</Icon>
        </template>
      </v-text-field>
    </div>
    <div class="col-auto ms-auto">
      <!-- <v-btn
                variant="tonal"
                color="secondary"
                class="me-2"
                style="min-width: 20px; width: 40px; padding: 0">
                <Icon>Trash</Icon>
              </v-btn> -->

      <!-- <v-btn
        variant="tonal"
        color="secondary"
        class="me-2"
        style="min-width: 20px; width: 40px; padding: 0">
        <Icon>Badge</Icon>
      </v-btn>

      <v-btn
        @click="f.sortBy = 'rand'"
        color="secondary"
        variant="tonal"
        style="min-width: 20px; width: 40px; padding: 0">
        <Icon>Dice5</Icon>
      </v-btn> -->
    </div>
  </div>

  <!--
    *+---------------------------------
    *| Recommendations and results
    *| Display items to add to the list
    *+--------------------------------- -->
  <div class="card mb-3">
    <div class="list-group card-list-group games-group games--list">
      <template v-for="(item, i) in _games" :key="item.uuid">
        <div
          class="d-none list-group-item px-3 text-decoration-none"
          :class="{
            'disabled opacity-25 cursor-not-allowed': !hasAPIUUID(item),
            'opacity-50': listHasApp(item),
          }"
          style="padding-top: 0.8rem; padding-bottom: 0.8rem">
          <div class="row g-3 align-items-center">
            <div class="col-auto text-secondary">
              <div
                style="
                  z-index: 1;
                  border: 1px solid black;
                  outline: 1px solid rgba(255, 255, 255, 0.15);
                  outline-offset: -2px;
                  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.36);
                  max-width: 100px;
                  background-position: center top;
                  background-size: cover;
                  max-height: 46px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  overflow: hidden;
                ">
                <game-asset
                  :app="item"
                  asset="banner"
                  fallback="cover"
                  :priority="['steam', 'igdb']"
                  style="object-fit: cover" />
              </div>
            </div>
            <div class="col">
              <span class="font-serif">{{ item.name }}</span>
              <div class="v-list-item-subtitle">
                <small v-if="!hasAPIUUID(item)">
                  This game cannot be added to the list
                </small>

                <small v-else-if="listHasApp(item)">Already in the list</small>

                <template v-else>
                  <small class="text-muted">
                    {{ item._.released_at ?? '--' }}
                  </small>
                </template>
              </div>
            </div>

            <div v-if="listHasApp(item)" class="col-auto">
              <v-btn
                variant="text"
                icon
                size="x-small"
                v-tippy="'Remove from the list'"
                @click="removeFromList(item)">
                <Icon>TrashX</Icon>
              </v-btn>
            </div>

            <div class="col-auto" v-else-if="hasAPIUUID(item)">
              <v-btn
                variant="text"
                icon="mdi-chevron-right"
                size="x-small"
                color="grey-lighten-1"
                v-tippy="'Add to the top of the list'"
                @click="addToList(item, 'top')">
                <Icon size="16">ChevronsUp</Icon>
              </v-btn>

              <v-btn
                variant="text"
                icon="mdi-chevron-right"
                size="x-small"
                color="grey-lighten-1"
                v-tippy="'Add to the bottom of the list'"
                @click="addToList(item, 'bottom')">
                <Icon size="16">ChevronsDown</Icon>
              </v-btn>
            </div>

            <!-- <div class="col-auto text-secondary">
            <v-btn variant="tonal" icon="mdi-chevron-right" size="x-small">
              <Icon>ChevronsDown</Icon>
            </v-btn>
          </div> -->
          </div>
        </div>
        <b-game
          type="list"
          :uuid="item"
          :display="['name', 'score']"
          :action="null"
          style="padding-top: 0.65rem; padding-bottom: 0.65rem"
          class="px-3"
          :class="{
            'disabled opacity-25 cursor-not-allowed': !hasAPIUUID(item),
            'opacity-50': listHasApp(item),
          }">
          <template v-if="listHasApp(item)" #details>
            <small>This game is already in the list</small>
          </template>

          <template v-if="!hasAPIUUID(item)" #details>
            <small>This game cannot be added to the list</small>
          </template>

          <template #actions>
            <div class="col-auto">
              <v-btn
                v-if="listHasApp(item)"
                variant="text"
                icon
                size="x-small"
                v-tippy="'Remove from the list'"
                @click="removeFromList(item)">
                <Icon>TrashX</Icon>
              </v-btn>
              <template v-else-if="hasAPIUUID(item)">
                <v-btn
                  variant="text"
                  icon="mdi-chevron-right"
                  size="x-small"
                  color="grey-lighten-1"
                  v-tippy="'Add to the top of the list'"
                  @click="addToList(item, 'top')">
                  <Icon size="16">ChevronsUp</Icon>
                </v-btn>

                <v-btn
                  variant="text"
                  icon="mdi-chevron-right"
                  size="x-small"
                  color="grey-lighten-1"
                  v-tippy="'Add to the bottom of the list'"
                  @click="addToList(item, 'bottom')">
                  <Icon size="16">ChevronsDown</Icon>
                </v-btn>
              </template>
            </div>
          </template>
        </b-game>
      </template>
    </div>
  </div>

  <search-results
    ref="results"
    :disabled="false"
    :filters="f"
    @search:ready="search"
    @search:end="ui.ping++">
    <template #body>
      <div></div>
    </template>
  </search-results>
</template>

<script>
/**
 * @file:    \components\list\editor.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 8th October 2024
 * Modified: Wed 06 November 2024 - 17:13:31
 **/

// import { useAsyncData } from 'nuxt/app' // Import useAsyncData from Nuxt 3
import draggable from 'vuedraggable'

export default {
  name: 'ListEditor',
  components: {
    draggable,
  },

  emits: ['stored'],

  data: () => ({
    searched: null,
    dragging: false,

    f: {
      string: '',
      source: 'all',
      sortBy: 'score',
      sortDir: 'desc',
      show: {
        page: 1,
        perPage: 42,
      },
    },

    ui: {
      ping: 0,
      show: false,
      loading: false,
      isValid: false,
    },
  }),

  watch: {
    'ui.show': function (value) {
      this.reset()
    },
  },

  computed: {
    ...mapStores(useListStore, useDataStore),
    ...mapState(useListStore, ['list']),

    library() {
      return this.dataStore.library().slice(0, 5)
    },

    //+-------------------------------------------------
    // games()
    // Computed property to get games from the $ref
    // -----
    // Created on Fri Mar 22 2024
    //+-------------------------------------------------
    _games() {
      if (!this.$app.ready) return []
      if (this.ui.ping == 0) return this.library
      if (!this.$refs.results?.items) return this.library
      // if (!this.searchString.length) return this.placeholder
      // if (!this.$refs.results?.items) return this.placeholder

      const games = []
      this.$refs.results.items?.forEach((uuid) => {
        games.push(this.dataStore.get(uuid))
      })

      let amount = this.searchString?.length ? 15 : 5
      return games.slice(0, amount)
    },
  },

  methods: {
    //+-------------------------------------------------
    // search()
    // Performs a search
    // -----
    // Created on Fri Mar 22 2024
    //+-------------------------------------------------
    search() {
      if (this.f.string == this.searched) return

      this.searched = this.f.string
      this.$nextTick(() => {
        console.warn('search', this.$refs)

        // if (!this.f.string.length) return
        if (!this.$refs.results) return
        this.$refs.results.search('palettex')
      })
    },

    hasAPIUUID(app) {
      return app.id?.api
    },

    //+-------------------------------------------------
    // listHasApp()
    // Looks if a list has an app
    // -----
    // Created on Fri Oct 25 2024
    //+-------------------------------------------------
    listHasApp(app) {
      return this.listStore.hasApp(this.list, app)
    },

    //+-------------------------------------------------
    // addToList()
    // Adds a game to a list
    // -----
    // Created on Wed Oct 02 2024
    //+-------------------------------------------------
    addToList(app, position) {
      this.listStore.addToList(this.list, app, position)
    },

    //+-------------------------------------------------
    // removeFromList()
    // Removes an item searching the uuid
    // -----
    // Created on Tue Oct 22 2024
    //+-------------------------------------------------
    removeFromList(app) {
      this.listStore.removeFromList(this.list, app)
    },

    // //+-------------------------------------------------
    // // move()
    // //
    // // -----
    // // Created on Fri Oct 25 2024
    // //+-------------------------------------------------
    // move(app, position) {
    //   debugger
    //   const index = this.list.games.findIndex((game) => game.uuid == app.uuid)
    //   // if (!this.list.games.some((item) => item.uuid === app.uuid)) return
    //   // let index = this.list.games.indexOf(app.uuid)

    //   if (index == -1) return
    //   if (position == 'up' && index == 0) return
    //   if (position == 'down' && index == this.list.games.length - 1) return

    //   this.list.games.splice(index, 1)

    //   if (position == 'up') this.list.games.splice(index - 1, 0, app.uuid)
    //   else this.list.games.splice(index + 1, 0, app.uuid)
    // },

    // moveUp(app) {
    //   debugger
    //   if (this.list.games.some((item) => item.uuid === app.uuid)) return

    //   let index = this.list.games.indexOf(app.uuid)
    //   if (index == 0) return

    //   this.list.games.splice(index, 1)
    //   this.list.games.splice(index - 1, 0, app.uuid)
    // },

    // moveDown(app) {
    //   debugger
    //   if (this.list.games.some((item) => item.uuid === app.uuid)) return

    //   let index = this.list.games.indexOf(app.uuid)
    //   if (index == this.list.games.length - 1) return

    //   this.list.games.splice(index, 1)
    //   this.list.games.splice(index + 1, 0, app.uuid)
    // },

    //+-------------------------------------------------
    // edit()
    // Gives an item and displays the modal
    // -----
    // Created on Tue May 30 2023
    //+-------------------------------------------------
    edit(item, index, modal = true) {
      this.item = { ...item }
      this.item.index = index
      this.item.action = 'update'

      if (modal) this.ui.show = true
      this.$nextTick(() => {
        this.$refs.name.focus()
        this.$refs.name.$el.select()
      })
    },

    //+-------------------------------------------------
    // submit()
    // Store the list
    // -----
    // Created on Wed Oct 16 2024
    //+-------------------------------------------------
    async submit() {
      if (this.list.games.length == 0) {
        this.$toast.warning('The list is empty', {
          description: 'You need to add some games to it before saving',
        })

        return
      }

      await this.store()
    },

    // Validate - kept in case i need to validate more than just games.length
    // //+-------------------------------------------------
    // // validate()
    // // -----
    // // Created on Mon Jun 10 2024
    // //+-------------------------------------------------
    // async validate() {
    //   await this.$refs.form.resetValidation()
    //   await this.$refs.form.validate()

    //   if (this.ui.isValid) return true

    //   console.warn('🔴', this.$refs.form?.errors)
    //   return false
    // },

    //+-------------------------------------------------
    // store()
    // Stores the list in both the local and the cloud
    // -----
    // Created on Wed Oct 16 2024
    //+-------------------------------------------------
    async store() {
      this.ui.loading = true
      try {
        let payload = { ...this.list }

        payload.slug = format.stringToSlug(payload.name)
        await this.listStore.update(payload)

        this.$emit('stored', {
          item: payload,
        })

        this.ui.show = false
      } catch (e) {
        console.info(e)
        this.$toast.warning('Something happened', {
          description: 'The list could not be saved. Please try again.',
        })
      } finally {
        this.ui.loading = false
      }
    },

    init() {
      this.search()
    },
  },

  mounted() {
    this.init()
  },
}
</script>
