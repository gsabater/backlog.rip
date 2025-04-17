<template>
  <div class="b-menu dropdown-menu show" style="min-width: 200px; letter-spacing: normal">
    <label
      v-for="option in mods"
      class="dropdown-item px-2"
      :class="{ active: option == mod }"
      @click="selectMod(mod)">
      <div class="d-flex justify-center" style="width: 30px">
        <Icon v-if="option == mod" size="16" width="2" class="me-1 text-green">
          Checks
        </Icon>
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
 * Modified: Tue 15 April 2025 - 17:19:26
 **/

import filterService from '../../services/filterService'

export default {
  name: 'SortMenu',

  props: {
    // The current modifier
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    mod: {
      type: String,
      default: '123',
    },

    // The mods array
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    mods: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['sort'],

  data() {
    return {
      f: {},

      ui: {
        dice: 4,
      },
    }
  },

  computed: {
    filterMods() {
      return filterService.mods
    },
  },

  methods: {
    selectMod(by) {
      this.$emit('sort', {
        by,
      })
    },
  },
}
</script>
