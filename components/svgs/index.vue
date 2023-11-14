<template>
  <svg v-if="theIcon == 'clearable'"
    xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-x"
    width="24" height="24" viewBox="0 0 24 24"
    stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
    <path d="M10 10l4 4m0 -4l-4 4"></path>
  </svg>

  <svg v-if="theIcon == 'search'"
    xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-search"
    width="24" height="24" viewBox="0 0 24 24"
    stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
    <path d="M21 21l-6 -6"></path>
  </svg>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: '',
      required: false,
    },
  },

  data() {
    return {
      slotIcon: null
    }
  },

  computed: {
    theIcon() {
      return this.icon || this.slotIcon;
    },
  },

  mounted() {
    if (this.$slots.default) {
      this.slotIcon = this.$slots.default()[0].children;
    }
  },
}
</script>
