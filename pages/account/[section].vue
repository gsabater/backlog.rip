<template>
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
import linked from './sections/linked'
import history from './sections/history'
import database from './sections/database'
import preferences from './sections/preferences'

export default {
  name: 'AccountPages',
  components: {
    me,
    states,
    linked,
    history,
    database,
    preferences,
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
