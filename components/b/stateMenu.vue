<template>
  <slot />
  <b-menu ref="menu">
    <label
      v-for="(state, i) in states"
      :key="'state' + i"
      class="dropdown-item me-2"
      @click="setState(state)">
      <Icon v-if="isFav(state.name)">Heart</Icon>
      <span
        v-else
        class="badge me-3"
        :style="{ 'background-color': state.color || '' }"></span>

      {{ state.name }}
      <!-- <span class="badge bg-primary text-primary-fg ms-auto">12</span> -->
    </label>
  </b-menu>
</template>
<script>
import { useJournalStore } from '../../stores/journalStore'

/**
 * @file:    \components\b\stateMenu.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 29th November 2023
 * Modified: Tue Dec 26 2023
 **/

export default {
  name: 'StateMenu',
  props: {
    app: {
      type: String,
      default: null,
    },
  },

  emits: ['set'],

  data() {
    return {
      states: [],

      // app: {
      //   name: 'Game',
      //   uuid: 'uuid',
      //   state: 'NPL',
      // },
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

    setState(state) {
      this.$emit('set', state)
      this.$parent.app.state = state.id
      this.dataStore.update(this.$parent.app, 'state')

      this.$toast.success('Added to ' + state.name, {
        description: 'Monday, January 3rd at 6:00pm',
      })

      this.journalStore.add({
        event: 'state',
        ref: this.$parent.app.uuid,
        data: {
          state: state.id,
          old: state.id,
        },
      })
    },

    getData() {
      this.states = this.dataStore.states()
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
