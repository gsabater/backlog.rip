<template>
  <div class="page page-center">
    <div class="container container-tight py-4">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  setup() {
    useHead({
      title: 'Backlog.rip',
      bodyAttrs: {
        class: 'updater d-flex flex-column',
      },
    })
  },

  mounted() {
    document.body.setAttribute('data-bs-theme', 'light')
  },
}
</script>
<style>
.updater #__nuxt {
  height: 100%;
}
</style>
