<template>
  <v-dialog v-model="ui.show" :max-width="item.games?.length ? '800' : '550'">
    <div class="d-flex" style="gap: 16px">
      <div class="w-100">
        <!-- Main Card -->
        <v-card :loading="ui.loading" style="flex: 1">
          <template v-slot:title>
            <Icon>Mist</Icon>
            <span class="font-serif mx-2">
              {{ item.action === 'update' ? 'Edit list' : 'Create a new list' }}
            </span>
          </template>

          <v-form ref="form" v-model="ui.isValid" @submit.prevent="submit">
            <v-card-text style="padding: 0px 24px 16px">
              <div class="row gy-3">
                <div class="col-12">
                  <div class="form-label">Name your list</div>
                  <v-text-field
                    ref="name"
                    v-model="item.name"
                    counter
                    maxlength="50"
                    persistent-hint
                    :rules="[
                      (v) => v?.length <= 50 || 'Name must be less than 50 characters',
                      (v) => !!v || 'Name is required',
                      (v) => v?.length > 0 || 'Name cannot be empty',
                    ]" />
                </div>

                <div v-if="item.action === 'update' && item.slug" class="col-12">
                  <div class="form-label">URL Slug</div>
                  <v-text-field
                    v-model="item.slug"
                    counter
                    maxlength="100"
                    hint="Changing this will break current links to the list"
                    persistent-hint
                    :rules="[
                      (v) => v?.length <= 100 || 'Slug must be less than 100 characters',
                      (v) => !!v || 'Slug is required',
                      (v) => v?.length > 0 || 'Slug cannot be empty',
                      (v) =>
                        /^[a-z0-9-]+$/.test(v) ||
                        'Slug can only contain lowercase letters, numbers, and hyphens',
                    ]" />

                  <!-- <v-alert type="warning" variant="tonal" density="compact" class="mt-2">
                  <small>
                    ⚠️ Changing the URL will break existing links and bookmarks to this
                    list. Old links will show a 404 error.
                  </small>
                </v-alert> -->
                </div>

                <div class="col-12">
                  <label class="form-label">Short description</label>
                  <v-textarea
                    v-model="item.description"
                    counter
                    maxlength="150"
                    :rules="[
                      (v) =>
                        !v || v.length <= 150 || 'Description must be less than 150 characters',
                      (v) => !v || v.length > 0 || 'Description cannot be empty if provided',
                    ]"
                    rows="2"></v-textarea>
                </div>

                <div class="col-12 cursor-pointer" @click="ui.showMore = !ui.showMore">
                  <small class="text-muted">
                    Show more options
                    <Icon>ChevronDown</Icon>
                  </small>
                </div>

                <template v-if="ui.showMore">
                  <div class="col-6">
                    <label class="form-label">Default order</label>
                    <v-select
                      v-model="item.sortBy"
                      :items="[
                        { value: 'none', title: 'My own order' },
                        { value: 'name', title: 'Name' },
                        { value: 'score', title: 'Median score' },
                        { value: 'date.released', title: 'Release date' },
                        { value: 'hltb', title: 'How long to beat' },
                      ]"
                      item-title="title"
                      item-value="value"></v-select>
                  </div>

                  <div class="col-6">
                    <label class="form-label">&nbsp;</label>
                    <v-select
                      :disabled="item.sortBy == 'none'"
                      v-model="item.sortDir"
                      :items="[
                        { value: 'asc', title: 'Ascending, A → Z' },
                        { value: 'desc', title: 'Descending, Z → A' },
                      ]"
                      item-title="title"
                      item-value="value"></v-select>
                  </div>

                  <!-- <div class="col-12">
                    <label class="form-label">Share the list</label>
                    <label
                      class="form-check form-switch form-switch-lg mb-1"
                      style="display: flex; align-items: center; gap: 15px">
                      <input
                        v-model="$auth.config.debug"
                        class="form-check-input"
                        type="checkbox"
                        @change="update('config', 'debug')" />
                      <span class="form-check-label form-check-label-on">
                        Public
                        <small class="text-muted d-block">
                          Anyone one the internet can view the list
                        </small>
                      </span>
                      <span class="form-check-label form-check-label-off">
                        Developer mode is off
                        <small class="text-muted d-block">
                          Lists can only be private and local only while in beta
                        </small>
                      </span>
                    </label>
                  </div> -->
                </template>

                <!-- type: list, dynamic, challenge
          <br />
          layout: ordered, null -->

                <!-- <div v-if="item.key">
                <label class="form-label">Special category</label>
                <small class="form-hint">
                  <span class="badge">{{ item.key }}</span>
                  This is a special and unique state utilized for generating personalized
                  recommendations and statistics. Is becuase of this that it cannot be
                  deleted.
                </small>
              </div> -->
              </div>
            </v-card-text>
            <v-card-actions style="padding: 16px 24px; nope-background: #00000015">
              <v-progress-linear
                v-if="ui.loading"
                class="mx-3"
                color="deep-purple accent-4"
                indeterminate
                rounded
                height="6"></v-progress-linear>
              <template v-else>
                <div class="d-flex w-100 gap-2">
                  <v-btn
                    :disabled="ui.loading"
                    color="primary"
                    variant="tonal"
                    @click="submit"
                    style="flex: 1">
                    Save list
                  </v-btn>
                </div>
              </template>
            </v-card-actions>
          </v-form>
        </v-card>
        <!-- Beta Message - Outside main card but inside dialog -->
        <div class="card" style="border-radius: 4px; margin-top: 5px">
          <v-list-item
            append-icon="mdi-chevron-right"
            lines="two"
            density="comfortable"
            class="text-decoration-none"
            link
            href="https://discord.gg/F2sPE5B"
            target="_blank">
            <!-- <template v-slot:prepend>
          <div class="p-2">
            <Icon size="18" width="1.5" class="text-muted">Flask</Icon>
          </div>
        </template> -->
            <template v-slot:title>
              <span class="text-body-2 px-1 font-serif">Lists are currently in beta</span>
            </template>
            <template v-slot:subtitle>
              <small class="text-muted px-1">Share what you think and report bugs on Discord</small>
            </template>
          </v-list-item>
        </div>
      </div>
      <!-- List Preview - Outside card but inside dialog -->
      <div
        v-if="item.games?.length"
        class="list-preview"
        style="width: 280px; padding: 24px 0; margin-top: 38px">
        <v-card
          class="preview-card"
          style="
            border: 1px solid rgba(255, 255, 255, 0.12);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          ">
          <v-card-text class="text-center">
            <list-cover :games="listGamesForPreview" :list-data="item" class="mb-3" />
            <h3 class="mb-1 font-serif">{{ item.name || 'Your list' }}</h3>
            <p class="text-muted mb-0">
              {{ item.games?.length || 0 }}
              {{ item.games?.length === 1 ? 'game' : 'games' }}
            </p>
            <small v-if="item.description" class="d-block text-muted mt-2">
              {{ item.description }}
            </small>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </v-dialog>
</template>

<script>
/**
 * @file:    \components\dialog\crud\lists.vue
 * @desc:    This component sits at the bottom of the default layout
 *           and is used as a crud proxy for listStore via $mitt events
 * ----------------------------------------------
 * Created Date: 20th September 2024
 * Modified: 4th November 2025 - 10:14:29
 **/

export default {
  name: 'ListsCrudDialog',

  data: () => ({
    item: {},
    base: {
      name: 'My new list',
      visibility: 'private',
      sortBy: 'user',
      sortDir: 'desc',
      description: '',
    },

    db: {
      types: [],
      visibility: [
        { value: 'public', title: 'Public' },
        { value: 'private', title: 'Private' },
        { value: 'shared', title: 'Shared' },
      ],
    },

    ui: {
      show: false,
      showMore: false,
      loading: false,
      isValid: false,
      isPublic: false,
    },
  }),

  watch: {
    'ui.show': function (visibility) {
      if (visibility === false) this.reset()
    },

    'ui.isPublic': function (isPublic) {
      // Update the item visibility based on switch state
      this.item.visibility = isPublic ? 'public' : 'private'
    },
  },
  computed: {
    ...mapStores(useListStore, useDataStore),

    //+-------------------------------------------------
    // listGamesForPreview()
    // Prepares the games data for the cover preview
    // -----
    // Created on Dec 13 2024
    //+-------------------------------------------------
    listGamesForPreview() {
      if (!this.item.games?.length) return []

      return this.item.games.map((game) => {
        // If it's already a full game object, return it
        if (game.uuid && game.name) {
          return game
        }

        // If it's just a uuid string, try to get the full data
        const data = this.dataStore?.get(game.uuid || game)
        return data || game
      })
    },
  },

  methods: {
    //+-------------------------------------------------
    // create()
    // Creates a new item and show the modal
    // -----
    // Created on Tue Oct 08 2024
    //+-------------------------------------------------
    create() {
      this.item = { ...this.base }
      this.item.action = 'create'
      this.ui.show = true
      this.ui.showMore = false

      this.$nextTick(() => {
        // this.$refs.name.focus()
        // this.$refs.name.select()
      })
    },

    //+-------------------------------------------------
    // edit()
    // Takes an item and show the modal
    // -----
    // Created on Thu Oct 10 2024
    //+-------------------------------------------------
    edit(item, modal = true) {
      this.item = { ...item }
      this.item.action = 'update'
      if (modal) this.ui.show = true
      this.ui.showMore = false

      this.$nextTick(() => {
        // this.$refs.name.focus()
        // this.$refs.name.select()
      })
    },

    //+-------------------------------------------------
    // submit()
    // Submit the form
    // -----
    // Created on Mon Jun 10 2024
    //+-------------------------------------------------
    async submit() {
      if (!(await this.validate())) {
        this.$toast.warning('The form is not valid', {
          description: 'Please review the fields and try again',
        })

        return
      }

      await this.store()
    },

    //+-------------------------------------------------
    // delete()
    // Calls for deletion on the store and notifies
    // -----
    // Created on Wed Nov 06 2024
    //+-------------------------------------------------
    async delete(item) {
      if (!item.uuid) return
      await this.listStore.delete(item.uuid)
      this.$toast.success('The list has been deleted')
    },

    //+-------------------------------------------------
    // validate()
    // Validates, using only vuetify form and rules
    // -----
    // Created on Mon Jun 10 2024
    //+-------------------------------------------------
    async validate() {
      await this.$refs.form.resetValidation()
      await this.$refs.form.validate()

      if (this.ui.isValid) return true

      console.warn('🔴', this.$refs.form?.errors)
      return false
    },

    //+-------------------------------------------------
    // reset()
    // Resets the form to its initial state
    // -----
    // Created on Wed Oct 01 2025
    //+-------------------------------------------------
    async reset() {
      await delay(1000)
      if (this.$refs.form) {
        this.$refs.form.reset()
        this.$refs.form.resetValidation()
      }
    },

    //+-------------------------------------------------
    // store()
    // Save the list and optionally redirect to edit mode
    // -----
    // Created on Tue Oct 08 2024
    //+-------------------------------------------------
    async store() {
      this.ui.loading = true
      try {
        let action = this.item.action
        let payload = { ...this.item }

        if (action == 'create') await this.listStore.create(payload)
        if (action == 'update') await this.listStore.update(payload)

        this.$emit('stored', {
          action,
          item: payload,
        })

        this.$toast.success('The list has been stored successfully')

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
  },

  mounted() {
    this.$mitt.on('list:create', (payload) => {
      this.create()
    })

    this.$mitt.on('list:edit', (payload) => {
      this.edit(payload.item)
    })

    this.$mitt.on('list:delete', (payload) => {
      this.delete(payload.item)
    })
  },
}
</script>

<style scoped>
/* Enhanced preview card styling */
.preview-card {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
}

/* Dark theme preview card border */
.theme--dark .preview-card {
  border-color: rgba(255, 255, 255, 0.08) !important;
}

/* Light theme preview card border */
.theme--light .preview-card {
  border-color: rgba(0, 0, 0, 0.08) !important;
}
</style>
