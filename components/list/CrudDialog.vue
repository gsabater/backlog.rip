<template>
  <v-dialog v-model="ui.show" max-width="650px">
    <v-card
      :loading="ui.loading"
      style="background: rgb(32, 34, 43); border: 2px solid rgb(61 54 67)">
      <template #title>
        <Icon name="tabler:mist" />
        <div class="font-serif mx-2">List details</div>
      </template>

      <!-- <template #subtitle>
            Lists are organized collections of games created by the community.
          </template> -->

      <v-form ref="form" v-model="ui.isValid" @submit.prevent="submit">
        <v-card-text style="padding: 0px 24px 16px">
          <div class="row gy-2">
            <div class="col-12">
              <div class="form-label font-serif mb-1">Name your list</div>
              <v-text-field
                ref="name"
                v-model="item.name"
                counter
                maxlength="50"
                persistent-hint
                placeholder="Ex. My first collection of games"
                :rules="[
                  (v) => v?.length <= 50 || 'Name must be less than 50 characters',
                  (v) => !!v || 'Name is required',
                  (v) => v?.length > 0 || 'Name cannot be empty',
                ]" />
            </div>

            <div class="col-12" v-if="item.is_public && item.slug && item._.action === 'update'">
              <div
                class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                <div class="form-label font-serif mb-1">List slug</div>

                <span
                  class="text-caption cursor-pointer font-mono"
                  style="letter-spacing: unset !important"
                  @click="ui.editSlug = !ui.editSlug">
                  Modify the list URL
                </span>
              </div>

              <v-text-field
                ref="slug"
                v-model="item.slug"
                counter
                maxlength="100"
                persistent-hint
                :append="`https://backlog.rip/@${$auth.user.slug}/list/${item.slug}`"
                :disabled="!ui.editSlug"
                :rules="[
                  (v) => !!v || 'The URL slug is required',
                  (v) => v?.length > 0 || 'The URL slug cannot be empty',
                ]"
                @keydown="item._.make_slug = true" />

              <v-card v-if="ui.editSlug" class="mb-3" color="surface-variant" variant="tonal">
                <v-card-text class="text-medium-emphasis text-caption">
                  Warning: Changing the list URL will break any existing links to this list. Make
                  sure to update any bookmarks or shared links accordingly.
                </v-card-text>
              </v-card>
            </div>

            <div class="col-12">
              <label class="form-label font-serif mb-1">
                Description
                <small
                  class="text-muted float-right font-mono"
                  style="letter-spacing: unset !important">
                  Optional
                </small>
              </label>
              <v-textarea
                v-model="item.description"
                counter
                placeholder="What is this list about?"
                maxlength="250"
                :rules="[
                  (v) => !v || v.length <= 250 || 'Description must be less than 150 characters',
                  (v) => !v || v.length > 0 || 'Description cannot be empty if provided',
                ]"
                rows="2"></v-textarea>
            </div>

            <div class="col-12">
              <div class="d-flex row row-cards row-deck mb-3">
                <div class="col-6">
                  <v-card
                    @click="item.is_public = false"
                    color="secondary"
                    variant="tonal"
                    class="w-100"
                    :style="
                      !item.is_public
                        ? 'color: white; background: #1c1922; box-shadow: 0 0 0 2px #7d83b7;'
                        : 'opacity: 0.4;'
                    ">
                    <v-card-text class="d-flex align-items-center">
                      <Icon name="tabler:lock-square-rounded-filled" size="20" class="me-3" />
                      <div>
                        <div class="font-serif">Private</div>
                        <span class="text-caption">Only you can see it</span>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>

                <div class="col-6">
                  <v-card
                    v-if="$auth.is.logged"
                    @click="item.is_public = true"
                    color="secondary"
                    variant="tonal"
                    class="w-100"
                    :style="
                      item.is_public
                        ? 'color: white; background: #1c1922; box-shadow: 0 0 0 2px #7d83b7;'
                        : 'opacity: 0.4;'
                    ">
                    <v-card-text class="d-flex align-items-center">
                      <Icon name="tabler:cloud-upload" size="20" class="me-3" />
                      <div>
                        <div class="font-serif">Public</div>
                        <span class="text-caption">Shared with everyone</span>
                      </div>
                    </v-card-text>
                  </v-card>
                  <v-card
                    v-else
                    color="secondary"
                    variant="tonal"
                    class="w-100"
                    style="opacity: 0.4">
                    <v-card-text class="d-flex align-items-center">
                      <Icon name="tabler:cloud-upload" size="20" class="me-3" />
                      <div>
                        <div class="font-serif">Public</div>
                        <span class="text-caption">Shared with everyone</span>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>

                <small v-if="!$auth.is.logged" class="text-muted mt-2">
                  To create public lists, you need to be logged in.
                  <NuxtLink to="/auth" class="text-decoration-none">
                    Sign in or create an account
                  </NuxtLink>
                </small>
              </div>
            </div>
            <div></div>

            <div class="col-6">
              <label class="form-label font-serif mb-1">Default order</label>
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

            <div class="col-6" v-if="item.sortBy !== 'none'">
              <label class="form-label text-serif mb-1">&nbsp;</label>
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

            <!-- type: list, dynamic, challenge -->
          </div>
        </v-card-text>
        <v-card-actions style="padding: 16px 24px; background: #00000015">
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
                variant="tonal"
                @click="submit('redirect')"
                color="rgb(135 140 195)"
                style="
                  flex: 1;

                  filter: drop-shadow(0 0 1rem rgba(174, 62, 201, 0.2));
                  outline: 1px solid #9e58581c;
                  outline-offset: -1px;
                ">
                Save list and add games
              </v-btn>
            </div>
            <v-btn
              variant="tonal"
              class="small text-secondary px-4"
              :disabled="ui.loading"
              @click="submit">
              Only save the list
            </v-btn>
          </template>
        </v-card-actions>
      </v-form>
    </v-card>
    <!-- Beta Message - Outside main card but inside dialog -->
    <div class="card" style="border-radius: 4px; margin-top: 5px">
      <v-list-item
        lines="two"
        density="comfortable"
        class="text-decoration-none"
        link
        href="https://discord.gg/F2sPE5B"
        target="_blank">
        <template v-slot:append>
          <Icon name="tabler:chevron-right" />
        </template>
        <template v-slot:title>
          <span class="text-body-2 px-1 font-serif">Lists are currently in beta</span>
        </template>
        <template v-slot:subtitle>
          <small class="text-muted px-1">Share what you think and report bugs on Discord</small>
        </template>
      </v-list-item>
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
 * Modified: 17th February 2026 - 17:04:42
 **/

export default {
  name: 'ListsCrudDialog',

  data: () => ({
    item: {},

    ui: {
      show: false,
      action: false,
      loading: false,
      isValid: false,
      editSlug: false,
    },
  }),

  watch: {
    'ui.show': function (visibility) {
      if (visibility === false) this.reset()
    },
  },

  computed: {
    ...mapStores(useListStore, useDataStore),
  },

  methods: {
    //+-------------------------------------------------
    // create()
    // Creates a new item and show the dialog
    // -----
    // Created on Tue Oct 08 2024
    // Updated on Fri Jan 02 2026
    //+-------------------------------------------------
    create() {
      this.item = { ...this.listStore.model }
      this.item._.action = 'create'

      this.ui.show = true
    },

    //+-------------------------------------------------
    // edit()
    // Takes an item and show the modal
    // -----
    // Created on Thu Oct 10 2024
    // Updated on Fri Jan 02 2026
    //+-------------------------------------------------
    edit(item, modal = true) {
      this.item = { ...item }

      this.item._ = { ...this.listStore.model._ }
      this.item._.action = 'update'

      if (modal) this.ui.show = true
    },

    //+-------------------------------------------------
    // submit()
    // Submit and validate the form
    // -----
    // Created on Mon Jun 10 2024
    // Updated on Wed Jan 07 2026 - Added action after storing
    //+-------------------------------------------------
    async submit(action = 'save') {
      if (!(await this.validate())) {
        this.$toast.warning('There are some issues', {
          description: 'Please review errors in the form',
        })

        return
      }

      this.ui.action = action
      await this.store()
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
      this.ui.editSlug = false

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
    // Updated on Wed Jan 07 2026 - Improved logic with redirect and result handling
    //+-------------------------------------------------
    async store() {
      this.ui.loading = true

      try {
        let payload = { ...this.item }
        let result = await this.listStore[this.item._.action](payload)

        this.ui.show = false
        this.$toast.success('The list has been saved')

        if (this.ui.action == 'redirect') {
          this.$router.push(`/my/list/${result.slug}/edit`)
        }
      } catch (e) {
        console.info(e)
        this.$toast.warning('Something happened', {
          description: 'The list could not be saved. Please try again.',
        })
      } finally {
        this.ui.loading = false
      }
    },

    //+-------------------------------------------------
    // delete()
    // Calls for deletion on the store and notifies
    // -----
    // Created on Wed Nov 06 2024
    //+-------------------------------------------------
    async delete(list) {
      if (!list.uuid) return

      await this.listStore.delete(list)
      this.$toast.success('The list has been deleted')
    },
  },

  mounted() {
    this.$mitt.on('list:create', () => {
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
