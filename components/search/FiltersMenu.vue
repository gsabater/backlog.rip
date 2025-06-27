<template>
  <div
    v-if="isKeyboard || !ui.showFilterValues"
    class="b-menu dropdown-menu show"
    style="min-width: 300px; letter-spacing: normal">
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
          @click="writePathOnClick(option)">
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

      <div
        v-if="showSuggestedKbdMenu"
        class="small px-3"
        style="
          max-height: 150px;
          margin: 8px;
          border: 1px dashed #ccc;
          opacity: 0.9;
          border-radius: 3px;
        ">
        <search-filter-menu ref="kbdMenu" :filter="suggestedFilter" :headless="true" />
      </div>

      <div v-if="suggestions.length" class="dropdown-item disabled text-muted">
        <Icon class="me-2" size="14">ArrowDown</Icon>
        <span class="me-4">Move with your arrows</span>
      </div>
    </template>

    <!--
      *+---------------------------------
      *| Menu layout
      *| offer for raw search and suggestions
      *+--------------------------------- -->
    <template v-else-if="!ui.showFilterValues">
      <span class="dropdown-header">Search filters</span>
      <template v-for="(option, i) in menuOptions" :key="option.filter + i">
        <label
          v-if="showAdvancedOption(option)"
          class="dropdown-item ps-1"
          @click="showFilterValues(option)">
          <div class="d-flex justify-center" style="width: 30px">
            <Icon
              v-if="filterConf[option.filter].icon"
              size="16"
              width="1.5"
              class="text-muted">
              {{ filterConf[option.filter].icon }}
            </Icon>

            <b-logo
              v-if="filterConf[option.filter].logo"
              :name="filterConf[option.filter].logo"
              size="14"
              color="#fff"
              style="opacity: 0.6" />
          </div>
          <div>
            {{ filterConf[option.filter].label }}

            <small v-if="filterConf[option.filter].advanced" class="text-muted">
              <Icon size="14" style="transform: translateY(-1px)">Sparkles</Icon>
            </small>
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

      <div
        v-if="!ui.showAdvanced"
        class="dropdown-item small text-muted"
        @click="ui.showAdvanced = true">
        <Icon size="14" class="me-2">Sparkles</Icon>
        Show advanced filters
      </div>
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
 * Modified: 26th June 2025 - 05:44:07
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
        showAdvanced: false,
      },
    }
  },

  computed: {
    ...mapStores(useStateStore, useSearchStore),
    ...mapState(useStateStore, ['states', 'pinnedStates', 'unPinnedStates']),
    ...mapState(useSearchStore, ['f']),

    isKeyboard() {
      return this.mode == 'keyboard'
    },

    filterDef() {
      return filterService.definitions
    },

    filterConf() {
      return filterService.configurations
    },

    filterMods() {
      return filterService.mods
    },

    filterParts() {
      const string = this.f.box
      const parts = string.split('.')

      if (parts.length == 0)
        return {
          mod: null,
          value: null,
          filter: null,
        }

      let filter = null
      let mod = null
      let value = null

      if (parts.length > 1) {
        filter = parts[0]
      }

      if (parts.length > 2) {
        mod = parts[1]
        value = parts[2]

        let definition = this.filterDef[filter]

        // Cleanup, split and normalize the array
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (definition?.type == 'array') {
          value = parts[2].split(',')

          value = value.filter(Boolean).map((v) => v.trim())
          const allNumeric = value.every((v) => !isNaN(v))

          if (allNumeric) {
            value = value.map((v) => Number(v))
          }
        }

        // Clean and parse numbers
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (definition?.type == 'number') {
          value = Number(value)
        }
      }

      // console.warn('🧩', parts, parts.length, filter, mod, value)
      return { filter, mod, value }
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

    suggestedFilter() {
      const { filter, mod } = this.filterParts
      if (!filter) return null

      return filter
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
      let definitions = this.filterDef

      for (const key in definitions) {
        const option = definitions[key]

        if (option.hidden) continue

        // base options
        // Those are just little helpers for the base definition
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
      let definitions = this.filterDef

      for (const key in definitions) {
        const option = definitions[key]

        if (option.hidden) continue

        // base options
        // Those are just little helpers for the base definition
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        options.push({
          path: key,
          filter: key,
          mods: option.mods,
        })
      }

      return options
    },

    showSuggestedKbdMenu() {
      if (!this.suggestedFilter) return false
      let definition = this.filterDef[this.suggestedFilter]
      if (definition?.type == 'array') return true
      return false
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

    showAdvancedOption(option) {
      if (this.ui.showAdvanced) return true
      return !this.filterConf[option.filter].advanced
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

    writePathOnClick(option) {
      this.f.box = option.path
    },

    writePath() {
      if (this.f.box.length && this.cursor == -1) {
        this.addFilter()
        return
      }

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
        this.$mitt.emit('search:run', 3)
        return
      }

      const { filter, mod, value } = this.filterParts

      // Create a new filter
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      this.f.box = ''
      // this.f.filters.push(toAdd)
      this.searchStore.addFilter({ filter, mod, value })

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
      this.$mitt.emit('search:run', 4)
    },
  },

  mounted() {
    this.move()
  },
}
</script>
