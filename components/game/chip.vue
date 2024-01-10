<template>
  <span
    v-tippy="manager ? 'Click to change' : ''"
    class="status text-black"
    :class="{ 'cursor-pointer': manager }"
    style="border-radius: 4px"
    @click="manage($event)">
    {{ item.name || 'Unknown' }}
    <slot />
  </span>
</template>

<script>
/**
 * @file:    \components\game\chip.vue
 * @desc:    ...
 * -------------------------------------------
 * Can be used as
 * <GameChip :state="state"></GameChip>
 * -------------------------------------------
 * Created Date: 7th January 2024
 * Modified: Sun Jan 07 2024
 **/

export default {
  name: 'Chip',
  props: {
    app: {
      type: String,
      default: null,
    },

    state: {
      type: Boolean,
      default: false,
    },

    manager: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      item: {},
      // states: [],
    }
  },

  computed: {
    ...mapStores(useDataStore),
  },

  methods: {
    //+-------------------------------------------------
    // manage()
    // Invoques the game manager
    // -----
    // Created on Sat Jan 06 2024
    //+-------------------------------------------------
    manage($event) {
      if (!this.manager) return

      this.$mitt.emit('game:manager', {
        $ev: $event,
        app: this.app,
      })
    },

    getData() {
      this.item = this.dataStore.get(this.app) || {}
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
