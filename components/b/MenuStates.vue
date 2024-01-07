<template>
  <slot v-if="$slots.default" />
  <b-menu ref="menu">
    <label
      v-for="(state, i) in states"
      :key="'state' + i"
      class="dropdown-item ps-1"
      @click="doAction(state)">
      <div class="d-flex justify-center" style="width: 30px">
        <Icon v-if="isFav(state.name)" style="color: red; fill: pink">Heart</Icon>
        <span
          v-else
          class="badge"
          :style="{ 'background-color': state.color || '' }"></span>
      </div>

      <span class="pe-3">
        {{ state.name }}
        ({{ stateIndex[state.id].length }})
      </span>

      <tippy class="text-muted ms-auto cursor-help" :content="state.description">
        <Icon>HelpCircleFilled</Icon>
      </tippy>
    </label>
    <template v-if="clearable && value">
      <div class="w-100 border-top my-1"></div>
      <label
        class="dropdown-item justify-center"
        style="zoom: 0.9"
        @click="doAction(null)">
        Clear filter
      </label>
    </template>
  </b-menu>
</template>

<script>
import { useJournalStore } from '../../stores/journalStore'

/**
 * @file:    \components\b\stateMenu.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 29th November 2023
 * Modified: Sun Jan 07 2024
 **/

export default {
  name: 'StateMenu',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },

    app: {
      type: String,
      default: null,
    },

    clearable: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['set', 'clear', 'change', 'update:modelValue'],

  data() {
    return {
      value: '',
      item: {},
      db: {
        states: [],
      },
    }
  },

  computed: {
    ...mapStores(useDataStore, useJournalStore),
    ...mapState(useStateStore, {
      states: 'states',
      stateIndex: 'index',
    }),
  },

  methods: {
    isFav(state) {
      const favs = ['favorite', 'favourite', 'fav', 'favourites', 'favorites']
      return favs.includes(state.toLowerCase())
    },

    doAction(state) {
      this.value = state?.id || null
      this.onChange(state)
    },

    onChange() {
      // console.warn('onChange', value, this.modelValue)
      this.$emit('change', this.value)
      this.$emit('update:modelValue', this.value)
      if (this.value == null) this.$emit('clear', null)
    },

    // TODO: Move this to a store
    // setState(state) {
    //   this.$emit('set', state)
    //   // this.$parent.app.state = state.id
    //   // this.dataStore.update(this.$parent.app, 'state')

    //   this.$toast.success('Added to ' + state.name, {
    //     description: 'Monday, January 3rd at 6:00pm',
    //   })

    // },

    getData() {
      // this.db.states = this.dataStore.states()
    },

    init() {
      this.getData()
    },
  },

  mounted() {
    this.init()
  },
}
</script>
