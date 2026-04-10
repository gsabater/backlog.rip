<template>
  <span class="d-flex align-items-center gap-2">
    <span
      class="status-dot"
      :class="{ 'status-dot-animated': animated }"
      :style="{ backgroundColor: color }"></span>
    <small
      v-if="label"
      class="text-muted text-capitalize"
      style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em">
      {{ server }}
    </small>
  </span>
</template>

<script>
/**
 * @file:    \components\common\ServerStatus.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 10th April 2026
 * Modified: 10th April 2026 - 18:56:22
 **/

// TODO: Move this to constants
const STATUS_COLORS = {
  online: '#2fb344',
  degraded: '#f76707',
  offline: '#d63939',
  unknown: '#6c757d',
}

export default {
  name: 'CommonServerStatus',

  props: {
    server: {
      type: String,
      required: true,
    },
    label: {
      type: Boolean,
      default: false,
    },
    animated: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    status() {
      return this.$cloud?.server?.[this.server] ?? 'unknown'
    },

    color() {
      return STATUS_COLORS[this.status] ?? STATUS_COLORS.unknown
    },
  },
}
</script>
