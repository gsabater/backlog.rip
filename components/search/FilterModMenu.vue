<template>
  <div class="b-menu dropdown-menu show" style="min-width: 280px; letter-spacing: normal">
    <pre class="d-block">
      {{ mods }}
    </pre>

    <span class="dropdown-header">
      <span class="text-muted">General sorting</span>
    </span>

    <!--
      *+---------------------------------
      *| Median score
      *+--------------------------------- -->
    <label
      class="dropdown-item ps-1"
      :class="{ active: f.sortBy == 'score' }"
      @click="sortBy('score', 'desc', true)">
      <div class="d-flex justify-center" style="width: 30px">
        <Icon size="16" class="me-1">Star</Icon>
      </div>
      <div>
        Median score
        <div v-if="f.sortBy == 'score'" class="text-muted" style="font-size: 0.75rem">
          {{ f.sortDir == 'asc' ? 'Ascending' : 'Descending' }}
          <Icon size="14" width="2" class="mx-1">Repeat</Icon>
        </div>
      </div>
      <tippy
        class="text-muted ms-auto cursor-help ps-4"
        :content="'Sorting by median will rank games based on their middle review score when arranged in order. This method avoids being skewed by extreme values, making it a fairer representation of overall sentiment.'">
        <Icon width="2" style="background: rgb(0 0 0 / 20%); border-radius: 50%">
          HelpSmall
        </Icon>
      </tippy>
    </label>
  </div>
</template>

<script>
/**
 * @file:    \components\search\FilterModMenu.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 28th March 2025
 * Modified: Fri 28 March 2025 - 15:34:13
 **/

export default {
  name: 'SortMenu',

  props: {
    // The current modifier
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    mod: {
      type: String,
      default: 'score',
    },

    // The mods array
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    mods: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['sort'],

  data() {
    return {
      f: {},

      ui: {
        dice: 4,
      },
    }
  },

  methods: {
    //+-------------------------------------------------
    // sortBy()
    // Notifies the parent to apply the new sorting
    // -----
    // Created on Tue Oct 22 2024
    //+-------------------------------------------------
    sortBy(by, dir = 'desc', toggle = false) {
      if (by == 'rand') {
        this.ui.dice = Math.floor(Math.random() * 6) + 1
      }

      if (by == 'rand' || by == 'user') {
        dir = null
      }

      this.$emit('sort', {
        by,
        dir,
        toggle,
      })

      // this.$refs.tippySort.hide()
    },
  },

  mounted() {},
}
</script>
