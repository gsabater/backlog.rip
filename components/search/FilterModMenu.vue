<template>
  <div class="b-menu dropdown-menu show" style="min-width: 200px; letter-spacing: normal">
    <label
      v-for="option in mods"
      class="dropdown-item px-2"
      :class="{ active: option == mod }"
      @click="setMod(option)">
      <div class="d-flex justify-center" style="width: 30px">
        <Icon
          name="tabler:checks"
          v-if="option == mod"
          size="16"
          width="2"
          class="me-1 text-green" />
      </div>
      <div>
        {{ filterMods[option].label }} {{ filterMods[option].short }}...
        <small class="d-block text-muted">
          {{ filterMods[option].desc }}
        </small>
      </div>
    </label>
  </div>
</template>

<script>
/**
 * @file:    \components\search\FilterModMenu.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 28th March 2025
 * Modified: 23rd January 2026 - 23:11:50
 **/

import filterService from '../../services/filterService'

export default {
  name: 'SortMenu',

  props: {
    // The index of the filter
    // Used to access this.f.filters[index]
    // a value of -1 means the search string
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    index: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      ui: {},
    }
  },

  computed: {
    ...mapStores(useSearchStore),

    hook() {
      return this.searchStore.f?.filters[this.index]
    },

    current() {
      return filterService.definitions[this.hook.filter]
    },

    mod() {
      return this.hook.mod
    },

    mods() {
      return this.current.mods || []
    },

    filterMods() {
      return filterService.mods
    },
  },

  methods: {
    setMod(by) {
      this.searchStore.setFilter(this.index, by, null)
      this.$mitt.emit('search:run')
    },
  },
}
</script>
