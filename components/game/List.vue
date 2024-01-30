<template>
  <div class="row row-deck row-cards" v-bind="$attrs">
    <template v-for="(app, i) in items" :key="'card' + i">
      <div class="col col-2">
        <b-game :key="app" :uuid="app" :body="false"></b-game>
      </div>
    </template>

    <ul class="pagination justify-content-center">
      <li
        class="page-item cursor-pointer"
        :class="{ disabled: page <= 1 }"
        @click="page--">
        <div class="page-link">
          <Icon>ChevronLeft</Icon>
        </div>
      </li>

      <!-- <li class="page-item active"><a class="page-link" >2</a></li> -->
      <template v-if="pages <= 7">
        <li v-for="i in pages" :key="i" class="page-item">
          <a class="page-link">{{ i }}</a>
        </li>
      </template>

      <template v-for="i in pages" v-else :key="i">
        <li
          v-if="shouldShow(i)"
          class="page-item"
          :class="{ active: i == page }"
          @click="page = i">
          <div class="page-link cursor-pointer">{{ i }}</div>
        </li>
      </template>

      <li class="page-item cursor-pointer" @click="page++">
        <div class="page-link">
          <Icon>ChevronRight</Icon>
        </div>
      </li>
    </ul>
    <b-btn class="mt-3">
      <Icon class="text-secondary me-2">ArrowsMoveVertical</Icon>
      Show more
    </b-btn>
    <slot />
  </div>
</template>

<script>
/**
 * @file:    \components\game\list.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 8th January 2024
 * Modified: Tue Jan 30 2024
 **/

export default {
  name: 'List',
  props: {
    apps: {
      type: [String, Array],
      default: null,
    },

    max: {
      type: [Number, String],
      default: 12,
    },
  },

  data() {
    return {
      page: 1,
      offset: 3,
      perPage: 7,
    }
  },

  computed: {
    items() {
      if (!this.apps) return []

      let items = this.apps

      if (this.max > 0)
        items = items.slice(parseInt(this.max) * (this.page - 1), this.page * this.max)

      return items
    },

    pages() {
      return Math.ceil(this.apps.length / this.max)
    },
  },

  methods: {
    shouldShow(i) {
      if (this.page <= this.offset) return i <= this.offset * 2 + 1
      if (this.page >= this.pages - this.offset)
        return i >= this.pages - this.offset * 2 - 1
      return i >= this.page - this.offset && i <= this.page + this.offset
    },

    init() {},
  },

  mounted() {
    this.init()
  },
}
</script>
