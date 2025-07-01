<template>
  <div
    v-if="f && f.show && f.show.perPage"
    class="col-12 d-flex justify-content-center flex-column align-items-center my-3">
    <div class="d-flex align-items-center gap-2 my-3 w-100 justify-content-center">
      <!--
        *+---------------------------------
        *| Pagination style
        *| Navigate pages
        *+--------------------------------- -->
      <v-pagination
        v-if="shouldShowPagination && pages > 1"
        v-model="f.show.page"
        :length="pages"
        :total-visible="5"
        size="small"
        next-icon="mdi-menu-right"
        prev-icon="mdi-menu-left"
        @update:model-value="handlePageChange" />

      <!--
      *+---------------------------------
      *| Load more button
      *| Add pages to results
      *+--------------------------------- -->
      <v-btn
        v-if="shouldShowLoadMore"
        variant="tonal"
        class="btn w-50"
        @click="addPage"
        color="rgb(110 116 180)"
        style="border: 1px solid rgb(110 116 180 / 40%)">
        Show
        <!-- {{ stats.nextPage }} -->
        more games
      </v-btn>

      <v-btn
        v-if="stats.nextPage > 0"
        v-tippy="'Change pagination settings'"
        icon
        variant="text"
        size="small"
        color="blue-grey-lighten-1"
        @click="$refs.settings.show()">
        <Icon width="1.2" size="16" class="mx-1">Settings2</Icon>
      </v-btn>
    </div>

    <!--
      *+---------------------------------
      *| Stats overview
      *| Display current page results and total results
      *+--------------------------------- -->
    <p class="text-muted text-center w-50">
      <template v-if="stats.results > 0">
        Showing
        <strong>{{ currentPageText }}</strong>
        of {{ format.num(stats.results) }} games
      </template>
      <br />
      <small v-if="stats.filtered > 0">
        {{ format.num(stats.filtered) }} results excluded based on your filters
      </small>
    </p>
  </div>

  <account-pagination-settings ref="settings" @updated="updatePaginationSettings" />
</template>

<script>
/**
 * @file:    \components\search\Pagination.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 12th June 2025
 * Modified: 1st July 2025 - 11:03:06
 **/

export default {
  name: 'SearchPagination',
  emits: ['page-changed'],

  data() {
    return {
      maxVisiblePages: 5,
    }
  },
  computed: {
    ...mapState(useSearchStore, ['f', 'stats']),

    config() {
      return (
        $auth?.config?.pagination || {
          style: 'pages',
          perPage: 42,
        }
      )
    },

    pages() {
      return this.stats?.pages
    },

    // shouldShowPagination()
    // Returns true when pagination should be shown
    shouldShowPagination() {
      return this.config.style === 'pages' && this.stats.results > this.f.show.perPage
    },

    //+-------------------------------------------------
    // shouldShowLoadMore()
    // Returns true when load more button should be shown
    // -----
    // Created on Tue Jul 01 2025
    //+-------------------------------------------------
    shouldShowLoadMore() {
      return this.config.style === 'loadMore' && this.stats.nextPage > 0
    },

    //+-------------------------------------------------
    // currentPageText()
    // Returns formatted text for current page results
    //+-------------------------------------------------
    currentPageText() {
      if (!this.stats.results || !this.f.show) return '0'

      const start = (this.f.show.page - 1) * this.f.show.perPage + 1
      const end = Math.min(this.f.show.page * this.f.show.perPage, this.stats.results)

      if (start === end) {
        return start.toString()
      }

      if (this.config.style === 'loadMore') {
        return `${end}`
      }

      return `${start} to ${end}`
    },
  },

  methods: {
    //+-------------------------------------------------
    // addPage()
    // Adds another page to the current view (load more functionality)
    // -----
    // Created on Mon Jun 16 2025
    //+-------------------------------------------------
    addPage() {
      this.f.show.page++
      this.$emit('page-changed', this.f.show.page)
    },

    //+-------------------------------------------------
    // handlePageChange()
    // Called when the v-pagination component changes pages
    // -----
    // Created on Thu Jun 20 2025
    //+-------------------------------------------------
    handlePageChange(page) {
      if (page < 1 || page > this.pages) {
        return
      }

      this.$emit('page-changed', page)
      this.$nextTick(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    },

    //+-------------------------------------------------
    // updatePaginationSettings()
    // -----
    // Created on Tue Jun 17 2025
    //+-------------------------------------------------
    updatePaginationSettings() {
      let { style, perPage } = this.config

      this.f.show.page = 1
      this.f.show.perPage = perPage
      this.f.show.pagination = style

      this.$emit('page-changed')
    },
  },
}
</script>
