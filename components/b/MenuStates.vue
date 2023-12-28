<template>
  <slot v-if="$slots.default" />
  <b-menu ref="menu">
    <label
      v-for="(state, i) in db.states"
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

      {{ state.name }}
      <!-- <span class="badge bg-primary text-primary-fg ms-auto">12</span> -->
    </label>
    <div class="w-100 border-top my-1"></div>
    <label class="dropdown-item justify-center" style="zoom: 0.9">Clear filter</label>
  </b-menu>
</template>

<script>
import { useJournalStore } from '../../stores/journalStore'

/**
 * @file:    \components\b\stateMenu.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 29th November 2023
 * Modified: Thu Dec 28 2023
 **/

export default {
  name: 'StateMenu',
  props: {
    modelValue: {
      type: String,
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

  emits: ['set', 'update:modelValue'],

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
  },

  methods: {
    isFav(state) {
      const favs = ['favorite', 'favourite', 'fav', 'favourites', 'favorites']
      return favs.includes(state.toLowerCase())
    },

    doAction(state) {
      this.value = state.id
      this.onChange(state)
      // this.setState(state)
    },

    onChange() {
      // console.warn('onChange', value, this.modelValue)
      this.$emit('update:modelValue', this.value)
    },

    // TODO: Move this to a store
    // setState(state) {
    //   this.$emit('set', state)
    //   // this.$parent.app.state = state.id
    //   // this.dataStore.update(this.$parent.app, 'state')

    //   this.$toast.success('Added to ' + state.name, {
    //     description: 'Monday, January 3rd at 6:00pm',
    //   })

    //   this.journalStore.add({
    //     event: 'state',
    //     ref: this.$parent.app.uuid,
    //     data: {
    //       state: state.id,
    //       old: state.id,
    //     },
    //   })
    // },

    getData() {
      this.db.states = this.dataStore.states()
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
