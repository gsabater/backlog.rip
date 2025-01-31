<template>
  <ClientOnly>
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
  </ClientOnly>
</template>

<script>
/**
 * @file:    \pages\account\[section].vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 16th November 2023
 * Modified: Thu 30 January 2025 - 14:30:47
 **/

import me from './sections/me'
import logs from './sections/logs'
import cloud from './sections/cloud'
import lists from './sections/lists'
import states from './sections/states'
import linked from './sections/linked'
import history from './sections/history'
import database from './sections/database'
import community from './sections/community.vue'
import preferences from './sections/preferences'

export default {
  name: 'AccountPages',
  components: {
    me,
    logs,
    cloud,
    lists,
    states,
    linked,
    history,
    database,
    community,
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
