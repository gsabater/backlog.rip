<template>
  <div class="filter-tag" @click.stop.prevent="prevent" @mousedown.stop @focus.stop>
    <div class="tag-section filter-name">
      {{ filterName }}
    </div>
    <!-- <div>
      {{ index }}
      {{ JSON.stringify(current) }}
    </div> -->

    <!-- <div class="tag-section filter-name d-block">
      <code>{{ index }} - {{ cursor }}</code>
    </div> -->

    <div class="tag-section tag-action filter-mod">
      {{ filterMod }}
      <b-tippy-sheety :autoclose="120" trigger="click">
        <search-filter-mod-menu
          mod="gt"
          :mods="['is', 'gt', 'lt', 'gte', 'lte', 'not']" />
      </b-tippy-sheety>
    </div>
    <div class="tag-section tag-action filter-value">
      <input
        v-if="searchStore && searchStore.f.filters[index]"
        placeholder="..."
        v-model="searchStore.f.filters[index].value"
        ref="inputField"
        @mousedown.stop
        @input="runSearch"
        @keydown="handleKeydown"
        :style="`width: ${5 + filterValue.length * 8}px`" />
      <!-- n@click.stop.prevent="showTippy"
        n@focus.stop="showTippy"  -->

      <b-tippy-sheety
        v-if="!isKeyboard"
        ref="optionsTippy"
        :autoclose="120"
        trigger="focusin"
        placement="bottom">
        <search-filter-menu
          ref="filterMenu"
          :index="index"
          :filter="current.filter"
          :searchable="false" />
      </b-tippy-sheety>
    </div>
    <div class="tag-section tag-action filter-clear" @click="clear">
      <Icon size="14">X</Icon>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \components\search\FilterTag.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 27th March 2025
 * Modified: Wed 02 April 2025 - 22:18:39
 **/

import filterService from '../../services/filterService'

export default {
  name: 'FilterTag',

  props: {
    // The index of the filter
    // Used to access this.f.filters[index]
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    index: {
      type: Number,
      default: 0,
    },

    // The current filter
    // Should be used only for easy access
    // and should not be modified
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    current: {
      type: Object,
      default: () => ({}),
    },

    // Mode
    // Used to display elements
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    mode: {
      type: String,
      default: 'menu',
      options: ['menu', 'keyboard'],
    },
  },

  emits: ['change'],

  data() {
    return {
      cursor: 0,
      value: '',

      ui: {
        expanded: false,
      },
    }
  },

  computed: {
    ...mapStores(useSearchStore),
    ...mapState(useSearchStore, ['f', 'available', 'stats', 'loading', 'time']),

    isKeyboard() {
      return this.mode == 'keyboard'
    },

    hook() {
      return this.searchStore.f?.filters[this.index]
    },

    filterName() {
      return filterService.config[this.current?.filter]?.name ?? this.current.filter
    },

    filterMod() {
      let mod = this.current.mod
      return filterService.mods[mod]?.short ?? mod
      let modNames = {
        gt: '>',
        is: 'is',
        isNot: 'is not',
        has: 'has',
        hasNot: 'has not',
        contains: 'contains',
        containsNot: 'does not contain',
      }
      return modNames[mod] ?? mod
    },

    // filterType() {
    //   let filter = this.current.filter
    //   return filterService.filters[filter]?.type ?? 'text'
    // },

    filterValue() {
      return this.hook?.value ?? ''
    },

    //+-------------------------------------------------
    // inputMode()
    // Can be 'value' or 'search'
    // Value is the filter value sent to the filters obj.
    // Search is the string to search in the options list in tippy
    // -----
    // Created on Fri Mar 28 2025
    //+-------------------------------------------------
    inputMode() {
      return 'value'
    },

    // filter() {
    //   let hook = this.available[this.index]
    //   return this.f[this.index]
    // },

    // hook() {
    //   let current = this.f.filters[this.index]
    //   return this.available[current.filter]
    // },

    options() {
      let data = this.hook.data
      return this[data] ?? ['pikachu']
    },
  },

  methods: {
    handleKeydown(e) {
      let action = false

      if (e.key == 'ArrowUp') {
        action = true
        // this.$refs.filtersMenu.move('up')
      }

      if (e.key == 'ArrowDown') {
        action = true
        // this.$refs.filtersMenu.move('down')
      }

      if (e.key == 'Enter') {
        action = true
        // this.$refs.searchBox.blur()
        // this.$refs.filtersMenu.select()
        // this.$refs.filtersTippy.hide()
      }

      if (e.key == 'Escape') {
        action = true
        // this.$refs.filtersTippy.hide()
        // action = true
        // e.target.blur()
      }

      // if (!action) this.setFilterValue()
      if (!action) return

      e.preventDefault()
      e.stopPropagation()
      return false
    },

    //+-------------------------------------------------
    // runSearch()
    // Runs for a search using mitt events
    // Only when there is a value
    // -----
    // Created on Tue Apr 01 2025
    //+-------------------------------------------------
    runSearch(e) {
      if (!this.hook?.value) {
        console.warn('searching but no value')
        return
      }

      this.$mitt.emit('search:run')
    },

    showTippy() {
      this.$nextTick(() => {
        let isOpen = document.getElementsByClassName('b-filter-menu')
        if (isOpen.length == 0) {
          this.$refs.inputField.focus()
        }
        // this.$refs.optionsTippy.show()
      })
    },

    //+-------------------------------------------------
    // function()
    // Prevents focusing the input and stops propagation
    // -----
    // Created on Thu Mar 27 2025
    //+-------------------------------------------------
    prevent(e) {
      e.preventDefault()
      e.stopPropagation()

      return false
    },

    setFilterValue() {
      this.$nextTick(() => {
        this.searchStore.setFilter(this.index, this.current.mod, this.value)
      })
    },

    //+-------------------------------------------------
    // clear()
    // -----
    // Created on Thu Mar 27 2025
    //+-------------------------------------------------
    clear() {
      this.searchStore.clearFilter(this.index)
      this.$mitt.emit('search:run')
    },
  },

  mounted() {
    this.showTippy()
    this.runSearch()
    // this.$nextTick(() => {
    //   this.$refs.inputField.focus()
    // })
  },
}
</script>
