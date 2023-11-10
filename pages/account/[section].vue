<template>

  <div class="page-header d-print-none">
    <div class="container-xl">
      <div class="row g-2 align-items-center">
        <div class="col">
          <h2 class="page-title">
            Account and settings
          </h2>
        </div>
      </div>
    </div>
  </div>

  <div class="page-body">
    <div class="container-xl">
      <div class="row gx-lg-5">
        <div class="d-none d-lg-block col-lg-2">
          <account-sidebar></account-sidebar>
        </div>
        <div class="col-lg-10">
          <component ref="section" :is="section"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import me from './sections/me'
import history from './sections/history'

export default {
  components: {
    me,
    history,
  },

  data() {
    return {}
  },

  computed: {
    section() {
      return this.$route.params.section
    },
  },
}
</script>
