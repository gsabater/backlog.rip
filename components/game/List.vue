<template>
  <div class="row row-deck row-cards" v-bind="$attrs">
    <template v-for="(app, i) in items" :key="'card' + i">
      <div class="col col-2">
        <b-game :key="app" :appid="app" :body="false"></b-game>
      </div>
    </template>
    <slot />
  </div>
</template>

<script>
/**
 * @file:    \components\game\list.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 8th January 2024
 * Modified: Mon Jan 08 2024
 **/

export default {
  name: 'List',
  props: {
    apps: {
      type: String,
      default: null,
    },

    max: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {}
  },

  computed: {
    items() {
      if (!this.apps) return []

      let items = this.apps
      if (this.max > 0) items = items.slice(0, this.max)
      return items
    },
  },

  methods: {
    init() {},
  },

  mounted() {
    this.init()
  },
}
</script>
