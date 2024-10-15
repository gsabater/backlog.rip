<template>
  <v-dialog v-model="ui.show" max-width="725">
    <v-card :loading="ui.loading">
      <template v-slot:title>
        <Icon>Background</Icon>
        <span class="font-serif mx-2">States</span>
      </template>

      <v-form ref="form" v-model="ui.isValid">
        <v-card-text style="padding: 0px 24px 16px">
          <div class="row">
            <div class="col-12 col-md-6">
              <div class="mb-3">
                <div class="form-label">Name</div>
                <!-- <h4 class="card-title mb-2">Username2</h4> -->
                <v-text-field
                  ref="name"
                  v-model="item.name"
                  npersistent-hint
                  nhint="This is only you display name"
                  :rules="[(v) => !!v || 'This field is required']" />
              </div>

              <div class="mb-3">
                <label class="form-label">Additional info</label>
                <textarea
                  v-model="item.description"
                  class="form-control"
                  rows="4"></textarea>
              </div>

              <!-- <div class="mb-3">
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
            </div>
            <div class="col-12 col-md-6 d-flex">
              <v-color-picker
                v-model="item.color"
                elevation="3"
                nhide-sliders
                hide-inputs
                :modes="['rgb']"
                :style="`border: 5px solid ${item.color}`"></v-color-picker>
            </div>
          </div>
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

        <v-card-actions
          v-if="!ui.loading"
          style="padding: 16px 24px; background: #00000015">
          <!-- <v-spacer></v-spacer> -->
          <!-- <v-btn
            variant="plain"
            class="mx-2"
            @click="ui.show = false"
            :disabled="ui.loading">
            Close
          </v-btn> -->
          <v-btn
            block
            :disabled="ui.loading"
            color="primary"
            variant="tonal"
            @click="submit"
            style="text-transform: uppercase">
            Save changes
          </v-btn>
        </v-card-actions>
        <v-card-actions v-else>
          <v-progress-linear
            color="deep-purple accent-4"
            indeterminate
            rounded
            height="6"></v-progress-linear>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
/**
 * @file:    \components\dialog\crud\states.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 13th June 2024
 * Modified: Fri 11 October 2024 - 15:54:08
 **/

export default {
  data: () => ({
    name: 'StatesCrudDialog',
    item: {},
    base: {
      color: null,
      name: 'My state',
      description: '',
    },

    ui: {
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
    ...mapStores(useStateStore),
  },

  methods: {
    //+-------------------------------------------------
    // create()
    // Creates a new item and displays the modal
    // -----
    // Created on Thu Jan 18 2024
    //+-------------------------------------------------
    create() {
      const maxOrder = Math.max(...this.stateStore.states.map((item) => item.order))
      const nextOrder = maxOrder + 1

      const randomColor = Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')

      this.item = { ...this.base, order: nextOrder, color: '#' + randomColor }
      this.item.action = 'create'

      this.ui.show = true
      this.$nextTick(() => {
        this.$refs.name.focus()
        this.$refs.name.select()
      })
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
    // delete()
    // Deletes a state
    // -----
    // Created on Tue Jun 11 2024
    //+-------------------------------------------------
    async delete(item) {
      await this.stateStore.delete(item.id)

      this.$emit('deleted', {
        item,
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
    // validate()
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
    // Async API crud actions
    //+-------------------------------------------------

    async store() {
      this.ui.loading = true

      let index = this.item.index || 0
      let action = this.item.action
      let payload = { ...this.item }
      payload.slug = format.stringToSlug(payload.name)

      try {
        if (action == 'create') await this.stateStore.create(payload)
        if (action == 'update') await this.stateStore.update(payload)

        this.$emit('stored', {
          index,
          action,
          item: payload,
        })

        this.ui.show = false
      } catch (e) {
        console.info(e)
        this.$toast.warning('Something happened', {
          description: 'The state could not be saved. Please try again.',
        })
      } finally {
        this.ui.loading = false
      }
    },
  },
}
</script>
