<template>
  <v-dialog v-model="ui.show" max-width="450">
    <v-card :loading="ui.loading">
      <template v-slot:title>
        <Icon>Mist</Icon>
        <span class="font-serif mx-2">Create a new list</span>
      </template>

      <v-form ref="form" v-model="ui.isValid">
        <v-card-text style="padding: 0px 24px 16px">
          <div class="row gy-2">
            <div class="col-12 mb-1">
              <div class="form-label">Name your list</div>
              <v-text-field
                ref="name"
                v-model="item.name"
                counter
                maxlength="50"
                :rules="[
                  (v) => v?.length <= 50 || 'Name must be less than 50 characters',
                  (v) => !!v || 'Name is required',
                  (v) => v?.length > 0 || 'Name cannot be empty',
                ]" />
            </div>

            <div class="col-12 mb-1">
              <label class="form-label">Short description</label>
              <v-textarea
                v-model="item.description"
                counter
                maxlength="150"
                :rules="[
                  (v) =>
                    !v ||
                    v.length <= 150 ||
                    'Description must be less than 150 characters',
                  (v) => !v || v.length > 0 || 'Description cannot be empty if provided',
                ]"
                rows="2"></v-textarea>
            </div>

            <div class="col-12 mb-3">
              <label class="form-label">Visibility</label>
              <v-select
                v-model="item.visibility"
                :items="db.visibility"
                disabled
                hint="Lists can only be private and local only while in beta"
                persistent-hint
                item-title="title"
                item-value="value"></v-select>
            </div>

            <div
              v-if="$app.wip"
              class="col-12 cursor-pointer"
              @click="ui.showMore = !ui.showMore">
              <small class="text-muted">
                Additional settings
                <Icon>ChevronDown</Icon>
              </small>
            </div>

            <div v-if="ui.showMore" class="col-6 mt-3">
              <label class="form-label">Default order</label>
              <v-select
                v-model="item.sortBy"
                :items="[
                  { value: 'user', title: 'My own order' },
                  { value: 'name', title: 'Name' },
                  { value: 'score', title: 'Median score' },
                  { value: 'released', title: 'Release date' },
                  { value: 'hltb', title: 'How long to beat' },
                ]"
                item-title="title"
                item-value="value"></v-select>
            </div>

            <div v-if="ui.showMore" class="col-6 mt-3">
              <label class="form-label">&nbsp;</label>
              <v-select
                v-model="item.sortDir"
                :items="[
                  { value: 'asc', title: 'Ascending' },
                  { value: 'desc', title: 'Descending' },
                ]"
                item-title="title"
                item-value="value"></v-select>
            </div>
          </div>

          <!-- <div class=">
                <label class="form-label">Show on sidebar</label>
                <div class="m-0">
                  <label class="form-check form-switch form-switch-lg">
                    <input
                      v-model="$auth.config.debug"
                      class="form-check-input"
                      type="checkbox"
                      @change="update('config', 'debug')" />
                    <span class="form-check-label form-check-label-on">
                      Debugging enabled
                    </span>
                    <span class="form-check-label form-check-label-off">
                      Developer mode is off
                    </span>
                  </label>
                </div>
              </div> -->

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
            <v-btn
              block
              :disabled="ui.loading"
              color="primary"
              variant="tonal"
              @click="submit"
              style="text-transform: uppercase">
              Save list
            </v-btn>
          </template>
        </v-card-actions>

        <!-- <v-divider class="m-0"></v-divider> -->
      </v-form>
    </v-card>
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
          <small class="text-muted px-1">
            Share what you think and report bugs on Discord
          </small>
        </template>
        <!-- <template v-slot:append>
        <v-btn icon>
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template> -->
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
 * Modified: Thu 07 November 2024 - 11:56:34
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
      description: '', // Add this to ensure the field is initialized
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
    },
  }),

  watch: {
    'ui.show': function (value) {
      this.reset()
    },
  },

  computed: {
    ...mapStores(useListStore),
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
        this.$refs.name.focus()
        this.$refs.name.select()
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
        this.$refs.name.focus()
        this.$refs.name.select()
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

    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset()
        this.$refs.form.resetValidation()
      }
    },

    //+-------------------------------------------------
    // store()
    //
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
