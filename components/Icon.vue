<template>
  <component :is="theIcon" :color="color" :size="size" :stroke-width="width" />
</template>

<script>
// eslint-disable vue/no-unused-components

/**
 * @file:    \components\Icon.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th November 2023
 * Modified: Sun Nov 19 2023
 **/

import { IconHome, IconBrandSteam, IconArrowsTransferDown } from '@tabler/icons-vue'

export default {
  name: 'TablerIcon',

  components: {
    IconHome,
    IconBrandSteam,
    IconArrowsTransferDown,
  },

  props: {
    icon: {
      type: String,
      default: '',
      required: false,
    },

    color: {
      type: String,
      default: 'currentColor',
      required: false,
    },

    size: {
      type: String,
      default: '20',
      required: false,
    },

    width: {
      type: String,
      default: '1.3',
      required: false,
    },
  },

  data() {
    return {
      slotIcon: null,
    }
  },

  computed: {
    theIcon() {
      return 'Icon' + (this.icon || this.slotIcon)
    },
  },

  mounted() {
    if (this.$slots.default) {
      this.slotIcon = this.$slots.default()[0].children
    }
  },
}
</script>
