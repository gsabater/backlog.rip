<template>
  <v-autocomplete
    ref="select"
    label="Pais"
    v-model="selected"
    :items="items"
    item-title="nombre"
    item-value="@id"
    :rules="rules"
    :required="required"
    :disabled="disabled"
    :variant="variant"

    :hide-details="hideDetails"


    :error="error"
    :error-messages="errorMessages"
    no-data-text="Listado vacío"
    @change="emitChange()"
  ></v-autocomplete>
</template>

<script>
/**
 * @project: KAAM
 * @file:    \components\select\pais.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 13th March 2023
 * Last Modified: Mon Mar 13 2023
 **/

export default {
  name: 'SelectPais',
  props: {
    value: [String, Object],
    dense: { type: Boolean, default: false },
    filled: { type: Boolean, default: false },
    variant: { type: String, default: 'outlined' },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    errorMessages: { type: String, default: '' },
    hideDetails: { type: String, default: 'auto' },
  },

  data: (ctx) => ({
    selected: ctx.value,
    items: [],
  }),

  computed: {
    ...mapStores(useLugaresStore),

    rules() {
      return this.required ? [(v) => !!v || 'Obligatorio'] : []
    },
  },

  watch: {
    value(val) {
      if (!val && this.$refs.select) this.$refs.select.resetValidation()
      this.selected = val
    },
  },

  methods: {
    emitChange() {
      this.$emit('input', this.selected)
      this.$emit('change', this.selected)
    },

    //+-------------------------------------------------
    // autoSelectSpain()
    // If this contact has no pais, select Spain
    // -----
    // Created on Tue Dec 21 2021
    //+-------------------------------------------------
    autoSelectSpain() {
      if (this.contact.pais.uuid !== '') return
      let spain = this.db.paises.find((p) => p.iso2 == 'ES')
      this.contact.pais.uuid = spain.uuid
    },

    async getPaises() {
      let xhr = await this.lugaresStore.listPaises()
      this.items = xhr
      //   this.autoSelectSpain()
    },

    async init() {
      await this.getPaises()
    },
  },

  created() {
    this.init()
  },
}
</script>

<style scoped>
</style>
