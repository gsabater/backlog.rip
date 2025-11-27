<template>
  <div class="col ps-5">
    <div class="mb-3">
      <h5>Add games</h5>

      <v-text-field
        v-model="f.string"
        placeholder="Search by name..."
        clearable
        density="comfortable">
        <template #prepend-inner>
          <Icon size="16" class="text-secondary mx-1" style="min-width: 1em">Search</Icon>
        </template>
      </v-text-field>
    </div>

    <!--
      *+---------------------------------
      *| Recommendations and results
      *| Display items to add to the list
      *+--------------------------------- -->
    <div class="list-group card-list-group games-group games--list">
      <template v-for="(item, i) in _allGames" :key="item.uuid || Math.random()">
        <div class="card" style="border-radius: 1px; margin-bottom: 0.2rem">
          <b-game
            type="list"
            :uuid="item"
            :action="null"
            :showListDetails="false"
            class="px-3"
            style="padding-top: 0.65rem; padding-bottom: 0.65rem"
            :class="{
              'disabled opacity-25 cursor-not-allowed': !hasAPIUUID(item),
              'opacity-50': listHasApp(item),
            }">
            <template v-if="listHasApp(item)" #details>
              <small>Already in the list</small>
            </template>

            <template v-if="!hasAPIUUID(item)" #details>
              <small>Cannot be added to the list</small>
            </template>

            <template #actions>
              <div class="col-auto">
                <v-btn
                  v-if="listHasApp(item)"
                  v-tippy="'Remove from the list'"
                  variant="text"
                  icon
                  size="x-small"
                  @click="removeFromList(item)">
                  <Icon>TrashX</Icon>
                </v-btn>
                <template v-else-if="hasAPIUUID(item)">
                  <v-btn
                    v-tippy="'Add to the top of the list'"
                    variant="text"
                    icon="mdi-chevron-right"
                    size="x-small"
                    color="grey-lighten-1"
                    @click="addToList(item, 'top')">
                    <Icon size="16">ChevronsUp</Icon>
                  </v-btn>

                  <v-btn
                    v-tippy="'Add to the bottom of the list'"
                    variant="text"
                    icon="mdi-chevron-right"
                    size="x-small"
                    color="grey-lighten-1"
                    @click="addToList(item, 'bottom')">
                    <Icon size="16">ChevronsDown</Icon>
                  </v-btn>
                </template>
              </div>
            </template>
          </b-game>
        </div>
      </template>
    </div>
  </div>

  <!--
    *+---------------------------------
    *| Right side
    *| Contains list items
    *+--------------------------------- -->
  <div class="col-6 ps-5">
    <div class="col-12">
      <h5>&nbsp;</h5>
    </div>

    <template v-if="list.games.length">
      <div class="card mb-3">
        <draggable
          tag="div"
          :list="list.games"
          class="list-group card-list-group games-group games--list"
          handle=".handle"
          :item-key="(element) => element.uuid"
          @update="onDragUpdate">
          <template #item="{ element, index }">
            <div data-helper="draggable-required-to-drag">
              <b-game
                :key="element.uuid"
                type="list"
                :uuid="element"
                :display="['name', 'score']"
                :action="null"
                :showListDetails="true"
                style="padding-top: 0.65rem; padding-bottom: 0.65rem">
                <template #game:prepend>
                  <!-- <div
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
                  </div> -->
                  <!-- <v-text-field
                    variant="solo"
                    size="x-small"
                    class="handle p-0"
                    style="max-width: 50px; transform: scale(0.85)"
                    v-model.number="element._position"
                    @keyup.enter="updatePosition(element, element._position)">
                  </v-text-field> -->

                  <v-btn
                    icon
                    v-tippy="'Drag to reorder'"
                    class="handle cursor-move"
                    variant="text"
                    size="x-small"
                    color="grey-lighten-1"
                    style="transform: translateX(-4px)">
                    <Icon size="16" width="1">GripVertical</Icon>
                  </v-btn>
                </template>

                <template #actions>
                  <div class="col-auto d-flex align-items-center">
                    <v-number-input
                      class="list-position me-2"
                      :model-value="index + 1"
                      :min="1"
                      :max="list.games.length"
                      inset
                      hide-details
                      variant="solo filled"
                      @update:model-value="updatePosition(element, $event)" />

                    <v-btn
                      v-tippy="'Remove from the list'"
                      icon
                      variant="text"
                      size="x-small"
                      color="grey-lighten-1"
                      @click="removeFromList(element)">
                      <Icon size="18">TrashX</Icon>
                    </v-btn>
                  </div>
                </template>
              </b-game>
            </div>
          </template>
        </draggable>
      </div>
    </template>

    <div class="col-12">
      <search-results ref="results" :disabled="false" @search:end="ui.ping++">
        <template #body>
          <div></div>
        </template>
      </search-results>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \components\list\editor.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 8th October 2024
 * Modified: 27th November 2025 - 05:46:37
 **/

import draggable from 'vuedraggable'

export default {
  name: 'ListEditor',
  components: {
    draggable,
  },

  emits: ['stored'],

  data: () => ({
    ui: {
      ping: 0,
      show: false,
      loading: false,
      isValid: false,
    },
  }),

  computed: {
    ...mapStores(useListStore, useDataStore),
    ...mapState(useListStore, ['list']),
    ...mapState(useSearchStore, ['f', 'stats', 'loading', 'time']),

    library() {
      return this.dataStore.library().slice(0, 5)
    },

    //+-------------------------------------------------
    // _allGames()
    // Suggestions and search results for the list
    // This uses a hidden search-results component to perform the search
    // -----
    // Created on Fri Mar 22 2024
    //+-------------------------------------------------
    _allGames() {
      if (!this.$app.ready) return []
      if (this.ui.ping == 0) return this.library
      if (!this.$refs.results?.items) return this.library

      const games = []
      this.$refs.results.items?.forEach((uuid) => {
        games.push(this.dataStore.get(uuid))
      })

      const amount = this.f.string?.length ? 8 : 6
      return games.slice(0, amount)
    },
  },

  watch: {
    'ui.show': function (value) {
      this.reset()
    },
  },

  methods: {
    //+-------------------------------------------------
    // search()
    // Performs a search
    // -----
    // Created on Fri Mar 22 2024
    //+-------------------------------------------------
    // search() {
    //   if (this.f.string == this.searched) return

    //   this.searched = this.f.string
    //   this.$nextTick(() => {
    //     console.warn('search', this.$refs)

    //     // if (!this.f.string.length) return
    //     if (!this.$refs.results) return
    //     this.$refs.results.search('palettex')
    //   })
    // },

    hasAPIUUID(app) {
      return app.uuid && !app.uuid.includes('local:')
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

    //+-------------------------------------------------
    // updatePosition()
    // Updates the position of an item in the list
    // -----
    // Created on Wed Jun 11 2025
    //+-------------------------------------------------
    updatePosition(item, newIndex) {
      const currentIndex = this.list.games.findIndex((g) => g.uuid === item.uuid)
      if (currentIndex === -1) return

      // Clamp the new index to valid range
      newIndex = Math.max(1, Math.min(newIndex, this.list.games.length))

      if (newIndex - 1 === currentIndex) return // No change

      // Remove and insert at new position
      const [movedItem] = this.list.games.splice(currentIndex, 1)
      this.list.games.splice(newIndex - 1, 0, movedItem)
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

    onDragUpdate(evt) {
      console.log('Items reordered', evt)
    },

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
        const payload = { ...this.list }

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

    init() {},
  },

  mounted() {
    this.init()
  },
}
</script>
