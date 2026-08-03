<template>
  <component
    :is="href ? 'NuxtLink' : 'div'"
    :to="href || undefined"
    class="card"
    style="border: none; text-decoration: none; color: inherit; display: block">
    <div class="card-body py-3">
      <v-skeleton-loader v-if="value == null" type="heading" style="background: transparent" />
      <template v-else>
        <div class="d-flex align-items-center justify-content-between">
          <small class="font-serif text-muted">{{ label }}</small>
          <Icon v-if="href" name="tabler:chevron-right" size="16" class="text-muted" />
        </div>
        <div class="h1 mb-0 mt-1">{{ value }}</div>
        <slot name="sub">
          <small v-if="sub" class="text-muted">{{ sub }}</small>
        </slot>
      </template>
    </div>
  </component>
</template>

<script>
/**
 * @file:    \components\stats\Kpi.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 13th April 2026
 * Modified: 1st June 2026 - 15:30:14
 **/

export default {
  name: 'StatsKpi',
  props: {
    label: {
      type: String,
      required: true,
    },
    href: {
      type: String,
      default: null,
    },
    value: {
      default: null,
    },
    sub: {
      type: String,
      default: null,
    },
  },
}
</script>
