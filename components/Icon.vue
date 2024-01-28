<template>
  <component :is="theIcon" v-bind="$attrs" :size="size" :stroke-width="width" />
  <!-- <pre>{{ theIcon }}</pre> -->
</template>

<script>
// eslint-disable vue/no-unused-components
/* @vite-ignore */

/**
 * @file:    \components\Icon.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th November 2023
 * Modified: Mon Jan 22 2024
 **/

// import {
//   IconHome,
//   IconBrandSteam,
//   IconArrowsTransferDown,
//   IconCirclePlus,
// } from '@tabler/icons-vue'

import * as TablerIcons from '@tabler/icons-vue'

export default {
  name: 'TablerIcon',

  // components: {
  //   IconHome,
  //   IconBrandSteam,
  //   IconArrowsTransferDown,
  //   IconCirclePlus,
  // },

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
      let icon = this.icon || this.slotIcon
      if (!icon) return TablerIcons.IconFaceIdError
      if (icon?.startsWith('Icon')) icon.replace('Icon', '')

      icon = icon.replace(/\n/g, '').trim()
      icon = icon.replace(/\s*[\r\n]\s*/g, '').trim()
      icon = icon.replace(/^\s+|\s+$/g, '')
      // console.warn(icon)

      return TablerIcons[`Icon${icon}`] || TablerIcons.IconFaceIdError
      // return () => import(`@tabler/icons-vue/Icon${this.icon || this.slotIcon}`)
      // return 'Icon' + (this.icon || this.slotIcon)
    },
  },

  mounted() {
    if (this.$slots.default) {
      this.slotIcon = this.$slots.default()[0].children
    }
  },
}
</script>
