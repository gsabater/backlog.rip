<template>
  <b-dialog v-model="ui.show" title="New entry">
    <div class="mb-3 align-items-end">
      <label class="form-label">Title</label>
      <b-input v-model="item.name" type="text" class="form-control" :v$="v$.item.name" />
      <span>{{ v$.item.$params }}</span>
    </div>
    <div class="mb-3">
      <label class="form-label">Additional info</label>
      <textarea v-model="item.description" class="form-control" rows="4"></textarea>
      <textarea
        v-model="item.note"
        class="form-control"
        name="note"
        rows="2"
        @blur="setNote"></textarea>
    </div>

    <pre>
      xxx
      {{ v$.item }}
      xxx
    </pre>
  </b-dialog>
</template>

<script>
/**
 * @file:    \components\journal\CrudDialog.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 20th January 2024
 * Modified: Sat Jan 20 2024
 **/

import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  props: [],

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

  validations() {
    return {
      item: { title: { required }, note: { required } },
    }
  },

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

    async submit() {
      let step = false

      // 1 . Form validations
      if (await this.validate()) step = 'valid'

      // 2. Do api requests
      if (step == 'valid') await this.store()
      else
        useNuxtApp().$emit('notifications:show', {
          type: 'error',
          text: 'Debes revisar los campos antes de continuar',
        })
    },

    async validate() {
      await this.$refs.form.resetValidation()
      await this.$refs.form.validate()

      if (this.ui.isValid) return true

      console.warn('🔴', this.$refs.form?.errors)
      return false
    },

    //+-------------------------------------------------
    // Async API crud actions
    //+-------------------------------------------------

    async store() {
      this.ui.loading = true

      const index = this.item.index || 0
      const action = this.action
      const payload = { ...this.item }

      payload.tipo = 'evaluador'
      payload.roles = ['ROLE_EVALUADOR']
      payload.empresa_id = this.$auth.user?.empresa?.id
      payload.plainPassword = payload.password

      try {
        // if (action == 'create') await this.evaluadoresStore.create(payload)
        // if (action == 'update') await this.evaluadoresStore.update(payload)

        this.$emit('stored', {
          index,
          action,
          item: payload,
        })

        notify.show({
          // type: 'error',
          text: 'Los cambios se han guardado correctamente',
        })

        this.ui.show = false
      } catch (e) {
        console.info(e)
        useNuxtApp().$emit('notifications:show', {
          type: 'error',
          text: 'Ha ocurrido un error al guardar. Revisa todos los campos',
        })
      } finally {
        this.ui.loading = false
      }
    },
  },
}
</script>
