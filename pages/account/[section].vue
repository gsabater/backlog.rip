<template>
  <!-- <div class="page-header d-print-none">
    <div class="container-xl">
      <div class="row g-2 align-items-center">
        <div class="col">
          <h2 class="page-title">Account and settings</h2>
        </div>
      </div>
    </div>
  </div> -->

  <div class="page-body">
    <div class="container-xl">
      <div class="row gx-lg-5 mx-auto">
        <div class="d-none d-lg-block col-lg-2">
          <account-sidebar></account-sidebar>
        </div>
        <div class="col-lg-8">
          <component :is="section" ref="section"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import me from './sections/me'
import states from './sections/states'
import history from './sections/history'
import connected from './sections/connected'

export default {
  name: 'AccountSection',
  components: {
    me,
    states,
    history,
    connected,
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
