<template>
  <div
    v-if="f && f.show && f.show.perPage"
    class="col-12 d-flex justify-content-center flex-column align-items-center my-3">
    <div class="d-flex align-items-center gap-2 my-2 w-100 justify-content-center">
      <!--
        *+---------------------------------
        *| Pagination style
        *| Navigate pages
        *+--------------------------------- -->
      <nav v-if="shouldShowPagination && pages > 1">
        <ul class="pagination justify-content-center mb-0">
          <!-- Previous button -->
          <li class="page-item" :class="{ disabled: currentPage <= 1 }">
            <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">
              <Icon size="14" width="1.5" style="transform: translateY(-2px)">
                ChevronLeft
              </Icon>
            </a>
          </li>

          <!-- First page -->
          <li
            v-if="showFirstPage"
            class="page-item"
            :class="{ active: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="goToPage(1)">1</a>
          </li>

          <!-- First ellipsis -->
          <li v-if="showFirstEllipsis" class="page-item disabled">
            <span class="page-link">...</span>
          </li>

          <!-- Visible page numbers -->
          <li
            v-for="page in visiblePages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }">
            <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
          </li>

          <!-- Last ellipsis -->
          <li v-if="showLastEllipsis" class="page-item disabled">
            <span class="page-link">...</span>
          </li>

          <!-- Last page -->
          <li
            v-if="showLastPage"
            class="page-item"
            :class="{ active: currentPage === pages }">
            <a class="page-link" href="#" @click.prevent="goToPage(pages)">
              {{ pages }}
            </a>
          </li>

          <!-- Next button -->
          <li class="page-item" :class="{ disabled: currentPage >= pages }">
            <a
              class="page-link"
              href="#"
              @click.prevent="goToPage(currentPage + 1)"
              :aria-disabled="currentPage >= pages">
              <Icon size="14" width="1.5" style="transform: translateY(-2px)">
                ChevronRight
              </Icon>
            </a>
          </li>
        </ul>
      </nav>

      <!--
      *+---------------------------------
      *| Load more button
      *| Add pages to results
      *+--------------------------------- -->
      <v-btn
        v-if="shouldShowLoadMore"
        variant="tonal"
        class="btn w-75"
        @click="addPage"
        color="rgb(110 116 180)"
        style="border: 1px solid rgb(110 116 180 / 40%)">
        Show
        <!-- {{ stats.nextPage }} -->
        more games
      </v-btn>

      <v-btn
        v-tippy="'Change pagination settings'"
        icon
        variant="tonal"
        size="small"
        density="compact"
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

  <!-- <div
    v-if="f && f.show && f.show.perPage"
    class="d-flex mt-4"
    style="flex-direction: column; align-items: center">
    <div v-if="stats.nextPage > 0" class="btn w-75 mb-3" @click="addPage">
      Show {{ stats.nextPage }} more games
    </div>

    <p class="text-muted text-center w-50">
      <template v-if="stats.results > 0">
        Showing
        <strong>{{ stats.showing }}</strong>
        games, from a total of {{ format.num(stats.results) }}
      </template>
      <br />
      <small v-if="stats.filtered > 0">
        {{ format.num(stats.filtered) }} results excluded based on your filters
      </small>
    </p>
  </div> -->

  <account-pagination-settings ref="settings" @updated="updatePaginationSettings" />
</template>

<script>
/**
 * @file:    \components\search\Pagination.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 12th June 2025
 * Modified: Tue Jun 17 2025
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

    currentPage() {
      return this.f?.show?.page || 1
    },

    // shouldShowPagination()
    // Returns true when pagination should be shown
    shouldShowPagination() {
      return this.config.style === 'pages' && this.stats.results > this.f.show.perPage
    },

    // shouldShowLoadMore()
    // Returns true when load more button should be shown
    shouldShowLoadMore() {
      return this.config.style === 'loadMore' && this.stats.nextPage > 0
    },

    // Calculate which page numbers should be visible
    visiblePages() {
      const pages = []
      const maxVisible = this.maxVisiblePages
      const current = this.currentPage
      const total = this.stats.pages

      if (total <= maxVisible) {
        // Show all pages if total is less than max visible
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        // Calculate start and end of visible range
        let start = Math.max(current - Math.floor(maxVisible / 2), 1)
        let end = Math.min(start + maxVisible - 1, total)

        // Adjust start if we're near the end
        if (end - start + 1 < maxVisible) {
          start = Math.max(end - maxVisible + 1, 1)
        }

        // Don't include first and last pages in visible range if they'll be shown separately
        if (start > 1) start = Math.max(start, 2)
        if (end < total) end = Math.min(end, total - 1)

        for (let i = start; i <= end; i++) {
          pages.push(i)
        }
      }

      return pages
    },

    showFirstPage() {
      return !this.visiblePages.includes(1) && this.pages > 1
    },

    showLastPage() {
      return !this.visiblePages.includes(this.pages) && this.pages > 1
    },

    showFirstEllipsis() {
      return this.showFirstPage && this.visiblePages[0] > 2
    },

    showLastEllipsis() {
      return (
        this.showLastPage &&
        this.visiblePages[this.visiblePages.length - 1] < this.pages - 1
      )
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
    // goToPage()
    // Sets the current page to the specified page number
    // -----
    // TODO: Update the URL query parameter for page
    // this.$router.push({ query: { ...this.$route.query, page } })
    // -----
    // Created on Mon Jun 16 2025
    //+-------------------------------------------------
    goToPage(page) {
      if (page < 1 || page > this.pages || page === this.currentPage) {
        return
      }

      this.f.show.page = page
      this.$emit('page-changed', page)
      this.$nextTick(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    },

    //+-------------------------------------------------
    // updatePaginationSettings()
    //
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
