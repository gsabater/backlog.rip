<template>
  <div
    v-if="isKeyboard || !ui.showFilterValues"
    class="b-menu dropdown-menu show"
    style="
      min-width: 300px;
      letter-spacing: normal;
      overflow: visible;
      position: relative;
      z-index: 23333;
    ">
    <!--
      *+---------------------------------
      *| Keyboard layout
      *| offer for raw search and suggestions
      *+--------------------------------- -->
    <template v-if="isKeyboard">
      <span class="dropdown-header">Search options</span>

      <div
        v-if="offerToSearch || offerToClean"
        class="dropdown-item control-hover"
        :class="{ active: cursor == -1 }">
        <template v-if="offerToSearch">Raw search "{{ f.box }}"</template>
        <template v-if="offerToClean">Clear search "{{ f.string }}"</template>

        <small
          v-if="isKeyboard"
          class="text-muted ms-auto text-end show-hover"
          style="min-width: 40px">
          <kbd>Enter</kbd>
          <!-- <code>Enter</code> -->
        </small>
      </div>

      <div v-if="suggestions.length" class="dropdown-divider"></div>
      <template v-for="(option, i) in suggestions" :key="option.path + i">
        <div
          class="dropdown-item control-hover"
          :class="{ active: cursor == i }"
          @click="addFilter(option)">
          <div>
            {{ option.path }}{{ suggestedValue }}
            <div
              v-if="!option.base"
              class="text-muted show-hover"
              style="font-size: 0.75rem">
              {{ filterMods[option.mod]?.desc }}
            </div>
          </div>
          <kbd class="text-muted ms-auto text-end show-hover" style="min-width: 40px">
            Tab
          </kbd>
        </div>
      </template>
    </template>

    <!--
      *+---------------------------------
      *| Menu layout
      *| offer for raw search and suggestions
      *+--------------------------------- -->
    <template v-else-if="!ui.showFilterValues">
      <span class="dropdown-header">Search filters</span>
      <label
        v-for="(option, i) in menuOptions"
        :key="option.filter + i"
        class="dropdown-item ps-1"
        :class="{
          'active': f.sortBy == 'oc',
          'disabled cursor-not-allowed': f.source == 'all',
        }"
        @click="showFilterValues(option)">
        <div class="d-flex justify-center" style="width: 30px">
          <Icon size="16" class="me-1">{{ filterConf[option.filter].icon }}</Icon>
          <!-- <b-logo name="opencritic" size="14" class="me-1" style="opacity: 0.6" /> -->
        </div>
        <div>
          {{ filterConf[option.filter].label }}
          <small v-if="f.source == 'all'" class="d-block text-muted">
            Not available yet on
            <strong>all games</strong>
          </small>

          <div v-else-if="f.sortBy == 'oc'" class="text-muted" style="font-size: 0.75rem">
            {{ f.sortDir == 'asc' ? 'Ascending' : 'Descending' }}
            <Icon size="14" width="2" class="mx-1">Repeat</Icon>
          </div>
        </div>
        <tippy
          v-if="filterConf[option.filter].desc"
          class="text-muted ms-auto cursor-help ps-4"
          :content="filterConf[option.filter].desc">
          <Icon width="2" style="background: rgb(0 0 0 / 20%); border-radius: 50%">
            HelpSmall
          </Icon>
        </tippy>
      </label>
    </template>
  </div>

  <search-filter-menu
    v-else
    ref="filterMenu"
    :filter="filterSelected.filter"
    @created=""
    @reset="resetFilter" />
</template>

<script>
/**
 * @file:    \components\search\FiltersMenu.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 27th March 2025
 * Modified: Thu 03 April 2025 - 19:22:13
 **/

import filterService from '../../services/filterService'

export default {
  name: 'FiltersMenu',
  props: {
    // Mode
    // Used to display elements
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    mode: {
      type: String,
      default: 'menu',
      options: ['menu', 'keyboard'],
    },
  },

  emits: ['selected'],

  data() {
    return {
      cursor: 0,
      filterSelected: null,

      ui: {
        showFilterValues: false,
      },
    }
  },

  computed: {
    ...mapStores(useStateStore),
    ...mapState(useStateStore, ['states', 'pinnedStates', 'unPinnedStates']),
    ...mapState(useSearchStore, ['f']),

    isKeyboard() {
      return this.mode == 'keyboard'
    },

    filterConf() {
      return filterService.config
    },

    filterMods() {
      return filterService.mods
    },

    offerToClean() {
      return this.f.box.length == 0 && this.f.string.length > 0
    },

    offerToSearch() {
      return this.f.box.length > 0
    },

    //+-------------------------------------------------
    // suggestions()
    // Suggestions available for the current search
    // Suggestions are strings like 'score.gt.'
    // -----
    // Created on Thu Mar 27 2025
    //+-------------------------------------------------
    suggestions() {
      if (!this.f) return []

      return this.allOptions.filter((option) => {
        const { path, base, filter, mod } = option
        const string = this.f.box

        // If the filter is empty,
        // Return only the base options
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (!string || string.length < 2) return base

        // If the filter is not empty,
        // Return only the options that match the filter
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        return !base && (path.includes(string) || string.includes(path))
      })
    },

    //+-------------------------------------------------
    // suggestedValue()
    // The value is the remaining text after the second "."
    // -----
    // Created on Tue Apr 01 2025
    //+-------------------------------------------------
    suggestedValue() {
      const string = this.f.box
      const parts = string.split('.')

      if (parts.length > 2) {
        const lastPart = parts.pop()
        if (lastPart.length > 0) {
          return lastPart
        }
      }

      return null
    },

    //+-------------------------------------------------
    // allOptions()
    // All matched and / or available options to choose
    // This is just a helper array for this.suggestions
    // -----
    // Created on Fri Mar 28 2025
    //+-------------------------------------------------
    allOptions() {
      let groups = []
      let options = []
      let filters = filterService.filters

      for (const key in filters) {
        const option = filters[key]

        // base options
        // Those are just little helpers for the base filters
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        options.push({
          base: true,
          path: key,
          filter: key,
          mod: option.mods[0],
        })

        // Add the groups
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // if(!groups.includes(option.group)){
        //   groups.push(option.group)
        // }

        for (const mod of option.mods) {
          options.push({
            path: `${key}.${mod}.`,
            filter: key,
            mod,
          })

          // Add !is as an advanced alias of not
          // if (mod == 'not') {
          //   options.push({
          //     alias: true,
          //     path: `${key}.!is.`,
          //     filter: key,
          //     mod,
          //   })
          // }
        }
      }

      return options
    },

    //+-------------------------------------------------
    // menuOptions()
    // Like suggestions, but for the menu dropdown
    // -----
    // Created on Tue Apr 01 2025
    //+-------------------------------------------------
    menuOptions() {
      let options = []
      let filters = filterService.filters

      for (const key in filters) {
        const option = filters[key]

        // base options
        // Those are just little helpers for the base filters
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        options.push({
          path: key,
          filter: key,
          mods: option.mods,
        })
      }

      return options
    },
  },

  watch: {
    //+-------------------------------------------------
    // Watch the suggestions and reset the cursor
    // when the length changes to avoid out of bounds
    //+-------------------------------------------------
    suggestions(newVal, oldVal) {
      if (newVal.length == 0) {
        this.cursor = -1
      } else if (newVal.length !== oldVal.length) {
        this.cursor = 0
      }
    },
  },

  methods: {
    //+-------------------------------------------------
    // showFilterValues()
    // Displays the options for the selected filter
    // This is used for the menu mode as a classic dropdown
    // -----
    // Created on Tue Apr 01 2025
    //+-------------------------------------------------
    showFilterValues(option) {
      this.filterSelected = option
      this.ui.showFilterValues = true
    },

    //+-------------------------------------------------
    // move()
    // Moves the cursor across the suggestions
    // This is used for keyboard navigation from the parent input
    // -----
    // Created on Thu Mar 27 2025
    //+-------------------------------------------------
    move(dir) {
      let max = this.suggestions.length - 1

      if (dir == 'up') this.cursor--
      if (dir == 'down') this.cursor++
      if (this.cursor > max) this.cursor = max

      // if (this.offerToSearch && this.cursor < -1) this.cursor = -1
      if (!this.offerToSearch && !this.offerToClean && this.cursor < 0) this.cursor = 0
      if (!this.suggestions.length) this.cursor = -1
    },

    writePath() {
      if (this.offerToClean && this.cursor == -1) {
        this.resetSearchString()
        return
      }

      this.f.box = this.suggestions[this.cursor].path
    },

    //+-------------------------------------------------
    // addFilter()
    // Pushes a new filter to the store
    // -----
    // Created on Sat Mar 29 2025
    //+-------------------------------------------------
    addFilter() {
      let selected = this.suggestions[this.cursor] ?? null

      // If there is no selected filter, we just run the search
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (!selected) {
        this.f.string = this.f.box
        this.$mitt.emit('search:run')
        return
      }

      // Create a new filter
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let toAdd = {
        filter: selected.filter,
        mod: selected.mod,
        value: this.suggestedValue,
      }

      this.f.box = ''
      this.f.filters.push(toAdd)
      this.$emit('selected', selected)

      // if (typeof this.$parent.hide == 'function') this.$parent.hide()
    },

    resetFilter() {
      this.filterSelected = null
      this.ui.showFilterValues = false
    },

    resetSearchString() {
      this.f.box = ''
      this.f.string = ''
      this.$mitt.emit('search:run')
    },
  },

  mounted() {
    this.move()
  },
}
</script>
