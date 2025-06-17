<template>
  <v-dialog v-model="ui.show" max-width="650">
    <v-card :loading="ui.loading">
      <template v-slot:title>
        <Icon>Settings2</Icon>
        <span class="font-serif mx-2">Pagination Settings</span>
      </template>

      <v-form ref="form" v-model="ui.isValid">
        <v-card-text style="padding: 0px 24px 16px">
          <div class="row g-3">
            <div class="col-md-6 nope-col-lg-8 mb-3">
              <div class="form-label font-serif">Pagination style</div>
              <v-select
                v-model="$auth.config.pagination.style"
                :items="[
                  { title: 'Pages', value: 'pages' },
                  { title: 'Load more button', value: 'loadMore' },
                ]"
                item-title="title"
                item-value="value"
                hint="How to navigate through your results"
                persistent-hint
                @update:model-value="setConfig('pagination')" />
              <!-- @change="update('username', $auth.me.username)" -->
            </div>

            <div class="col-6">
              <div class="form-label font-serif">Items per page</div>

              <v-select
                v-model="$auth.config.pagination.perPage"
                :items="[
                  { title: '21 games (3 rows)', value: 21 },
                  { title: '42 games (6 rows)', value: 42 },
                  { title: '84 games (12 rows)', value: 84 },
                  { title: '168 games (24 rows)', value: 168 },
                ]"
                item-title="title"
                item-value="value"
                hint="How many games to display on each page"
                persistent-hint
                @update:model-value="setConfig('pagination')" />
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green-darken-1" variant="text" @click="ui.show = false">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
/**
 * @file:    \components\account\PaginationSettings.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th June 2025
 * Modified: Tue Jun 17 2025
 **/

export default {
  name: 'PaginationSettings',
  emits: ['updated'],

  data() {
    return {
      ui: {
        show: false,
        loading: false,
        isValid: true,
      },
    }
  },

  methods: {
    show() {
      this.ui.show = true
    },

    //+-------------------------------------------------
    // setConfig()
    // Updates a field in the db via $auth
    // -----
    // Created on Mon Dec 18 2023
    //+-------------------------------------------------
    async setConfig(field) {
      this.$auth.setConfig(field)
      this.$toast.success('Your preferences have been updated')
      this.$emit('updated')
    },
  },
}
</script>
