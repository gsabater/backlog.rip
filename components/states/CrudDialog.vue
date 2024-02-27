<template>
  <b-dialog v-model="ui.show" :header="false" title="Manage states">
    <div class="row mb-3 align-items-end">
      <div class="col col-10">
        <label class="form-label">Name</label>
        <pre>
          {{ item.name }}
        </pre>
        <b-input
          v-model="item.name"
          type="text"
          class="form-control"
          :v$="v$.item.name" />
        <span>{{ v$.item.name.$params }}</span>
      </div>
      <div class="col col-2">
        <label class="form-label">Color</label>
        <input
          v-model="item.color"
          type="color"
          class="form-control form-control-color"
          title="Choose your color"
          style="padding: 5px" />
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">Additional info</label>
      <textarea v-model="item.description" class="form-control" rows="4"></textarea>
    </div>

    <div v-if="item.key">
      <label class="form-label">Special category</label>
      <small class="form-hint">
        <span class="badge">{{ item.key }}</span>
        This is a special and unique state utilized for generating personalized
        recommendations and statistics. Is becuase of this that it cannot be deleted.
      </small>
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
 * @file:    \components\states\CrudDialog.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 17th January 2024
 * Modified: Fri Jan 19 2024
 **/

import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  props: [],

  setup() {
    return {}
  },

  data() {
    return {
      v$: useVuelidate(),
      item: { name: '' },
      action: 'create',

      ui: {
        show: false,
        loading: false,
      },
    }
  },

  validations() {
    return {
      item: { name: { required } },
    }
  },

  computed: {
    ...mapState(useStateStore, ['states']),

    isNew() {
      return this.action === 'create'
    },
  },

  watch: {
    'ui.show': function () {
      this.reset()
    },
  },

  methods: {
    //+-------------------------------------------------
    // create()
    // Creates a new item and displays the modal
    // -----
    // Created on Thu Jan 18 2024
    //+-------------------------------------------------
    create() {
      const maxOrder = Math.max(...this.states.map((item) => item.order))
      const nextOrder = maxOrder + 1

      const randomColor = Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')

      this.action = 'create'
      this.item = {
        order: nextOrder,
        color: '#' + randomColor,
        name: 'My new state',
        description: '',
      }

      this.ui.show = true
    },

    //+-------------------------------------------------
    // edit()
    // Gives an item and displays the modal
    // -----
    // Created on Wed Mar 29 2023
    //+-------------------------------------------------
    edit(item) {
      this.item = { ...item }
      this.action = 'update'

      this.ui.show = true
    },

    reset() {},

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
