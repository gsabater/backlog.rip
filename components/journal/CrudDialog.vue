<template>
  <b-dialog
    ref="dialog"
    v-model="ui.show"
    title="New journal entry"
    subtitle="Lorem ipsum dolor"
    :loading="ui.loading"
    @save="submit">
    <div class="mb-3 align-items-end">
      <label class="form-label">Title</label>
      <b-input v-model="item.title" type="text" class="form-control" />
    </div>
    <div>
      <label class="form-label">Additional info</label>
      <textarea v-model="item.note" class="form-control" name="note" rows="3"></textarea>
    </div>
  </b-dialog>
</template>

<script>
/**
 * @file:    \components\journal\CrudDialog.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 20th January 2024
 * Modified: Sun Jan 21 2024
 **/

import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  props: [],
  emits: ['stored'],

  data() {
    return {
      v$: useVuelidate(),
      item: {},
      action: 'create',

      ui: {
        show: false,
        loading: false,
      },
    }
  },

  // validations() {
  //   return {
  //     item: { title: { required }, note: { required } },
  //   }
  // },

  computed: {
    ...mapStores(useJournalStore),

    isNew() {
      return this.action === 'create'
    },
  },

  methods: {
    //+-------------------------------------------------
    // create()
    // Creates a new item and displays the modal
    // -----
    // Created on Sat Jan 20 2024
    //+-------------------------------------------------
    create() {
      this.action = 'create'
      this.item = {
        title: 'New entry',
        note: '',
      }

      this.ui.show = true
    },

    //+-------------------------------------------------
    // edit()
    // Gives an item and displays the modal
    // -----
    // Created on Wed Mar 29 2023
    //+-------------------------------------------------
    // edit(item) {
    //   this.item = { ...item }
    //   this.action = 'update'

    //   this.ui.show = true
    // },

    //+-------------------------------------------------
    // submit()
    // Validates, stores, notifies and closes the modal
    // -----
    // Created on Sun Jan 21 2024
    //+-------------------------------------------------
    async submit() {
      let step = false
      // 1 . Form validations
      step = 'valid'
      // if (await this.v$.$validate()) step = 'valid'

      // 2. Perform store of data
      if (step == 'valid') await this.store()
    },

    //+-------------------------------------------------
    // store()
    //
    // -----
    // Created on Sun Jan 21 2024
    //+-------------------------------------------------
    async store() {
      this.ui.loading = true

      const action = this.action
      const payload = { ...this.item }

      // payload.tipo = 'evaluador'

      try {
        // if (action == 'create') await this.evaluadoresStore.create(payload)
        // if (action == 'update') await this.evaluadoresStore.update(payload)

        this.journalStore.add({
          event: 'note',
          ref: null,
          data: {
            title: payload.title,
            note: payload.note,
          },
        })

        this.$emit('stored', {
          action,
          item: payload,
        })

        this.ui.show = false
        this.$refs.dialog.hide()
      } catch (e) {
        console.info(e)
      } finally {
        this.ui.loading = false
      }
    },
  },
}
</script>
