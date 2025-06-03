<template>
  <div
    class="filter-tag"
    @click.stop.prevent="prevent"
    @mousedown.stop
    @focus.stop
    :class="{ invalid: !hook.valid }">
    <!-- <pre class="d-block">
      {{ hook }} --
      {{ current }}
      {{ currentConf }}
    </pre> -->

    <div class="tag-section filter-name text-nowrap">
      <template v-if="!isKeyboard">
        <Icon
          v-if="currentConf.icon"
          size="12"
          width="1.3"
          class="text-muted"
          style="transform: translateY(-1px); margin-right: 2px">
          {{ currentConf.icon }}
        </Icon>

        <b-logo
          v-if="currentConf.logo"
          :name="currentConf.logo"
          size="12"
          color="#fff"
          style="opacity: 0.6; transform: translateY(-1px); margin-right: 2px" />
      </template>
      {{ currentConf.label }}
    </div>
    <!-- <div>
      {{ index }}
      {{ JSON.stringify(current) }}
    </div> -->

    <!-- <div class="tag-section filter-name d-block">
      <code>{{ index }} - {{ cursor }}</code>
    </div> -->

    <div class="tag-section tag-action filter-mod" v-if="current.mods.length">
      <span class="text-nowrap">
        {{ filterMod }}
      </span>
      <b-tippy-sheety :autoclose="120" trigger="click">
        <search-filter-mod-menu :index="index" />
      </b-tippy-sheety>
    </div>
    <div class="tag-section tag-action filter-value">
      <div v-if="isSearchString" class="text-nowrap px-1">
        {{ filterValue }}
      </div>

      <div v-else-if="isArray" class="text-nowrap px-1">
        <!-- <span class="badge" style="background-color: blue"></span>
        <span class="badge" style="background-color: blue"></span>
        <span class="badge" style="background-color: blue"></span> -->
        {{ filterValue.length }} {{ currentConf.plural ?? currentConf.label }}
      </div>

      <div v-else-if="isDate" class="text-nowrap px-1">
        <!-- <span class="badge" style="background-color: blue"></span>
        <span class="badge" style="background-color: blue"></span>
        <span class="badge" style="background-color: blue"></span> -->
        {{ dateValue }}
      </div>

      <div v-else-if="isTime" class="text-nowrap px-1">
        {{ dates.minToHours(filterValue) }}
      </div>

      <input
        v-else
        placeholder="..."
        v-model="searchStore.f.filters[index].value"
        ref="inputField"
        @mousedown.stop
        @input="runSearch"
        @keydown="handleKeydown"
        :style="`width: ${5 + filterValue.length * 9}px`" />

      <!-- n@click.stop.prevent="showTippy"
        n@focus.stop="showTippy"  -->

      <b-tippy-sheety
        v-if="!isKeyboard || isArray"
        ref="optionsTippy"
        :autoclose="120"
        :trigger="isInput ? 'focusin' : 'click'"
        placement="bottom">
        <search-filter-menu
          ref="filterMenu"
          :index="index"
          :filter="hook.filter"
          :searchable="false" />
      </b-tippy-sheety>
    </div>
    <div class="tag-section tag-action filter-clear px-1" @click="clear">
      <Icon size="15" width="2">X</Icon>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \components\search\FilterTag.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 27th March 2025
 * Modified: Tue 03 June 2025 - 13:51:21
 **/

import filterService from '../../services/filterService'

export default {
  name: 'FilterTag',

  props: {
    // The index of the filter
    // Used to access this.f.filters[index]
    // a value of -1 means the search string
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    index: {
      type: Number,
      default: 0,
    },

    // // The active filter object
    // // Should be used only for easy access
    // // and should not be modified.
    // //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // filter: {
    //   type: Object,
    //   default: () => ({}),
    // },

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

    isInput() {
      return this.hook.filter == 'score'
    },

    isArray() {
      return this.current.type == 'array'
    },

    isDate() {
      return this.current.type == 'date'
    },

    isTime() {
      return this.current.type == 'time'
    },

    isSearchString() {
      return this.index == -1
    },

    hook() {
      if (this.index == -1)
        return {
          filter: 'string',
          mod: 'is',
          value: this.f.string,
        }

      return this.searchStore.f?.filters[this.index]
    },

    current() {
      return filterService.definitions[this.hook.filter]
    },

    currentConf() {
      return filterService.configurations[this.hook.filter]
    },

    filterMod() {
      let mod = this.hook.mod
      return filterService.mods[mod]?.short ?? mod
    },

    // filterType() {
    //   let filter = this.current.filter
    //   return filterService.filters[filter]?.type ?? 'text'
    // },

    filterValue() {
      return this.hook?.value ?? ''
    },

    dateValue() {
      let date = this.filterValue
      return this.$moment(date).format('ll')
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

      this.$mitt.emit('search:run', 5)
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
      this.$mitt.emit('search:run', 6)
    },
  },

  mounted() {
    // this.showTippy()
    this.runSearch()
    // this.$nextTick(() => {
    //   this.$refs.inputField.focus()
    // })
  },
}
</script>
