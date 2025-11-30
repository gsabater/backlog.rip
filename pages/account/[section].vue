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
 * Modified: 4th November 2025 - 01:39:09
 **/

import me from './sections/me'
import logs from './sections/logs'
import lists from './sections/lists'
import states from './sections/states'
import history from './sections/history'
import backups from './sections/backups'
import database from './sections/database'
import community from './sections/community.vue'
import preferences from './sections/preferences'
import integrations from './sections/integrations'

export default {
  name: 'AccountPages',
  components: {
    me,
    logs,
    lists,
    states,
    history,
    backups,
    database,
    community,
    preferences,
    integrations,
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
