<template>
  <!-- https://selemondev.hashnode.dev/nuxt-content -->
  <!-- <ul class="steps steps-vertical">
    <ContentSlot :use="$slots.default" unwrap="ul" />
  </ul> -->

  <!-- <ul class="p-0">
    <li
      v-for="(item, index) of flatUnwrap($slots.default(), ['ul '])"
      :key="index"
      class="flex space-x-2"></li>
    <ContentSlot ref="pep" unwrap="ul" />
  </ul> -->
  xxx
  <ul>
    <li v-for="(item, index) of flatUnwrap($slots.default!(), ['ul'])" :key="index">
      ☑︎
      <span><ContentSlot :use="() => item" unwrap="li" /></span>
    </li>
  </ul>
  zzz
</template>

<script setup lang="ts">
const { flatUnwrap } = useUnwrap()
</script>
