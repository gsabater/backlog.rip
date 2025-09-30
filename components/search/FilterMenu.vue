<template>
  <div
    ref="menu"
    :class="headless ? '' : 'b-menu dropdown-menu show b-filter-menu'"
    :style="headless ? '' : 'min-width: 300px; letter-spacing: normal; overflow: visible'"
    v-bind="$attrs">
    <!--
      *+---------------------------------
      *| Mod selector
      *+--------------------------------- -->
    <div
      v-if="!headless && !ui.showMods"
      class="dropdown-item active"
      @click="ui.showMods = true">
      <div>
        {{ currentConf.label }} {{ filterMods[item.mod].short }}...
        <small class="d-block text-muted">
          {{ filterMods[item.mod].desc }}
        </small>
      </div>
      <div class="ms-auto">
        <Icon>ChevronDown</Icon>
      </div>
    </div>

    <template v-if="ui.showMods">
      <div
        v-for="(mod, key) in current.mods"
        :key="key"
        class="dropdown-item px-2"
        :class="{
          active: item.mod == mod,
        }"
        @click="selectMod(mod)">
        <div class="d-flex justify-center" style="width: 30px">
          <Icon v-if="item.mod == mod" size="16" width="2" class="me-1 text-green">
            Checks
          </Icon>
        </div>
        <div>
          {{ currentConf.label }} {{ filterMods[mod].short }}...
          <small class="d-block text-muted">
            {{ filterMods[mod].desc }}
          </small>
        </div>
      </div>
    </template>

    <template v-else>
      <!--
      *+---------------------------------
      *| Quick filter search
      *+--------------------------------- -->
      <template v-if="!headless && isSearchEnabled">
        <div class="dropdown-item" :class="{ disabled: ui.showMods }">
          <input
            ref="findOption"
            v-model="ui.findOption"
            type="text"
            class="form-control form-control-flush"
            :class="{ disabled: ui.showMods }"
            placeholder="Search..." />
        </div>
        <div class="dropdown-divider"></div>
      </template>

      <!--
      *+---------------------------------
      *| Filter type: number
      *| Range values
      *+--------------------------------- -->
      <template v-if="current && current.type == 'number'">
        <v-row class="my-4 px-2" justify="space-between">
          <v-col class="text-center py-1">
            <span class="text-h2 font-weight-light">
              {{ item.value || '0' }}
            </span>
            <div
              class="font-weight-light text-muted d-inline-block ps-1"
              style="font-size: 1.9rem">
              {{ currentConf.menuAppend }}
            </div>
          </v-col>
          <v-col cols="12" class="text-muted text-center py-1">
            <small>
              {{ currentConf.menuSubtitle }}
            </small>
          </v-col>
        </v-row>

        <v-slider
          v-model="item.value"
          :max="100"
          :step="1"
          class="ma-4"
          hide-details
          @end="onValueChanged">
          <template v-slot:append>
            <v-text-field
              class="p-0"
              v-model="item.value"
              density="compact"
              style="width: 70px"
              type="number"
              min="0"
              max="100"
              hide-details
              @update:model-value="onValueChanged"></v-text-field>
          </template>
        </v-slider>
      </template>

      <!--
      *+---------------------------------
      *| Filter type: time
      *| Range values
      *+--------------------------------- -->
      <template v-else-if="current && current.type == 'time'">
        <v-row class="my-4 px-2" justify="space-between">
          <v-col class="text-center">
            <span class="text-h2 font-weight-light">
              {{ dates.minToHours(item.value) || '◌' }}
            </span>
          </v-col>
        </v-row>

        <div class="px-3">
          <v-number-input
            label="minutes"
            v-model="item.value"
            :min="0"
            :step="30"
            controlVariant="stacked"
            glow
            inset
            variant="solo-filled"
            style="outline: 1px solid #23252e; border-radius: 3px"
            hide-details
            @update:model-value="onValueChanged" />
        </div>
      </template>

      <!--
      *+---------------------------------
      *| Filter type: array
      *| Range values
      *+--------------------------------- -->
      <template v-else-if="current && current.type == 'array'">
        <div
          style="
            padding: 3px;
            overflow-y: auto;
            max-height: 250px;
            overscroll-behavior: contain;
          "
          nostyle="`max-height: ${ui.maxHeight}px;`">
          <div
            v-for="(param, key) in options"
            :key="key"
            class="dropdown-item px-2"
            :class="{
              selected: isSelected(param),
            }"
            @click.stop="select(param)">
            <div
              nv-if="option.multiple !== false"
              class="selection"
              style="margin-right: 0.55rem">
              <small v-if="headless" style="color: white">
                {{ param[currentConf.opValue] }}
              </small>
              <input
                v-else
                type="checkbox"
                class="form-check-input"
                style="transform: scale(0.8)"
                :checked="isSelected(param)" />
            </div>

            <div class="content d-flex align-items-center w-100">
              <!--
              *+---------------------------------
              *| Array filter: state
              *+--------------------------------- -->
              <template v-if="filter == 'state'">
                <!-- <Icon
                                v-if="param.key == 'favorites'"
                                size="14"
                                style="color: red; fill: pink">
                                Heart
                              </Icon> -->
                <!-- v-else -->

                <!-- <Icon style="color: var(--tblr-primary)">SquareCheck</Icon>
                            <Icon style="color: #666">Square</Icon> -->

                <template v-if="param.id == -1">
                  <Icon size="12" class="me-1">CircleOff</Icon>
                </template>

                <span
                  v-else
                  class="badge me-2"
                  :style="{ 'background-color': param.color || '' }"></span>

                <span class="me-4">
                  <!-- {{ param[currentConf.opValue] }} -->
                  {{ param.name }}
                </span>

                <tippy
                  v-if="!headless"
                  :allow-h-t-m-l="true"
                  class="text-muted ms-auto cursor-help"
                  :content="param.description">
                  <span class="form-help">?</span>
                </tippy>
              </template>

              <template v-else-if="filter == 'genre'">
                <span class="avatar avatar-xs me-2">
                  {{ param.name[0] }}
                </span>

                <span class="me-4">
                  {{ param.name }}
                </span>
              </template>

              <template v-else>
                <Icon class="me-2" size="16">{{ param.icon ?? currentConf.icon }}</Icon>
                <span class="me-4">
                  {{ param[currentConf.opLabel] }}
                </span>
              </template>
            </div>
          </div>
        </div>
      </template>

      <!--
      *+---------------------------------
      *| Filter type: date
      *+--------------------------------- -->
      <template v-else-if="current && current.type == 'date'">
        <!-- <div class="hr-text mt-2 mb-3">Or pick</div> -->
        <div
          style="
            zoom: 0.8;
            display: flex;
            flex-wrap: nowrap;
            justify-content: center;
            align-items: center;
            padding: 10px;
          ">
          <v-date-picker
            v-model="item.value"
            nlandscape
            ndivided
            show-adjacent-months
            elevation="2"
            hide-header
            bg-color="rgb(30 31 41)"
            @update:model-value="onValueChanged">
            <!-- <template v-slot:title></template> -->
          </v-date-picker>
        </div>
      </template>

      <template v-if="!headless">
        <div class="dropdown-divider"></div>

        <div
          v-if="current.multiple"
          class="dropdown-item text-muted disabled"
          style="font-size: 0.75em">
          Hold CTRL to select multiple
        </div>

        <div class="dropdown-item small" @click="$emit('reset')">
          <Icon class="me-2" size="16">ArrowLeft</Icon>
          <span class="me-4">Go back</span>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
/**
 * @file:    \components\search\FilterMenu.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 27th March 2025
 * Modified: 24th July 2025 - 03:45:27
 **/

import filterService from '../../services/filterService'

export default {
  name: 'FilterMenu',

  props: {
    // The key of the filter
    // score, released, genre, state...
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    filter: {
      type: String,
      default: null,
    },

    // Index of the filter
    // used by this._index
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    index: {
      type: Number,
      default: null,
    },

    // If the filter is searchable
    // Even if the config search is true
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    searchable: {
      type: Boolean,
      default: true,
    },

    headless: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['reset'],

  data() {
    return {
      cursor: 0,
      created: null,

      item: {
        filter: null,
        mod: null,
        value: null,
      },

      ui: {
        findOption: '',
        maxHeight: 0,
      },
    }
  },

  computed: {
    ...mapStores(useSearchStore, useStateStore),
    ...mapState(useRepositoryStore, {
      _genres: 'genres',
    }),

    _index() {
      return this.index ?? this.created
    },

    _states() {
      let options = JSON.parse(JSON.stringify(this.stateStore.states))
      return options
    },

    _languages() {
      return enums.LANGUAGES
    },

    isSearchEnabled() {
      // if (this.ui.showMods) return false
      if (this.ui.showMods) return false
      if (this.current?.search === false) return false
      if (this.current?.type !== 'array') return false

      return true
    },

    isArray() {
      return this.current?.type == 'array'
    },

    isTime() {
      return this.current?.type == 'time'
    },

    hook() {
      return this.searchStore.f?.filters[this._index]
    },

    current() {
      return filterService.definitions[this.filter]
    },

    currentConf() {
      return filterService.configurations[this.filter] || {}
    },

    filterMods() {
      return filterService.mods
    },

    //+-------------------------------------------------
    // options()
    // returns an array of options based on this.filter
    // And current.data
    // -----
    // Created on Fri Apr 04 2025
    //+-------------------------------------------------
    options() {
      const options = []
      let { data, opLabel, opValue, opSort } = this.currentConf

      this['_' + data].forEach((option) => {
        let title = option[opLabel]
        title = title?.toLowerCase() || ''
        if (title.includes(this.ui.findOption.toLowerCase())) {
          options.push(option)
        }
      })

      // if the option[opsort] is a number, sort it as a number
      if (this.currentConf.type == 'number') {
        options.sort((a, b) => a[opSort] - b[opSort])
      }

      // if the option[opsort] is a string, sort it as a string
      else if (this.currentConf.type == 'string') {
        options.sort((a, b) => a[opSort].localeCompare(b[opSort]))
      }

      // console.warn(this.filter, this.currentConf, options)
      return options
    },

    sliderValue() {
      if (!this.isHLTB) return 100
      const value = this.item.value

      return 6000
    },

    sliderStep() {
      if (!this.isHLTB) return 1

      if (this.item.value < 100) return 30
      else return 60
    },
  },

  methods: {
    move(dir) {
      let max = this.options.length - 1

      if (dir == 'up') this.cursor--
      if (dir == 'down') this.cursor++
      if (this.cursor > max) this.cursor = max

      if (this.offerToSearch && this.cursor < -1) this.cursor = -1
      if (!this.offerToSearch && this.cursor < 0) this.cursor = 0
    },

    //+-------------------------------------------------
    // isSelected()
    //
    // -----
    // Created on Thu Apr 10 2025
    //+-------------------------------------------------
    isSelected(param) {
      const { opValue } = this.currentConf
      const value = param[opValue]

      return this.item.value.includes(value)
    },

    //+-------------------------------------------------
    // select()
    // Selects an option (in arrays)
    // -----
    // Created on Fri Apr 04 2025
    //+-------------------------------------------------
    select(param) {
      const { opValue } = this.currentConf
      const value = param[opValue]

      if (this.item.value.includes(value)) {
        this.item.value.splice(this.item.value.indexOf(value), 1)
      } else {
        this.item.value.push(value)
      }

      this.onValueChanged()
    },

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Thu Apr 10 2025
    //+-------------------------------------------------
    selectMod(mod) {
      this.item.mod = mod
      if (this._index !== null) this.setFilter()

      this.ui.showMods = false
    },

    onValueChanged() {
      if (this._index == null) this.addFilter()
      else this.setFilter()
    },

    addFilter() {
      let value = this.item.value

      if (this.current.type == 'date') {
        value = this.$moment(this.item.value).format('YYYY-MM-DD')
      }

      this.created = this.searchStore.addFilter({
        filter: this.item.filter,
        mod: this.item.mod,
        value: value,
      })

      // Handle filter position
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let mode = this.$parent.mode
      if (mode == 'menu') this.searchStore.f.show.tags = 'row'

      this.$mitt.emit('search:run')
    },

    setFilter() {
      let value = this.item.value

      if (this.current.type == 'date') {
        value = this.$moment(this.item.value).format('YYYY-MM-DD')
      }

      this.$nextTick(() => {
        this.searchStore.setFilter(this._index, this.item.mod, value)
        this.$mitt.emit('search:run')
      })
    },

    //+-------------------------------------------------
    // setDefaultValue()
    // Sets a default value for specific filter types
    // -----
    // Created on Fri May 02 2025
    //+-------------------------------------------------
    setDefaultValue() {
      if (this.item.value) return

      if (this.isTime) this.item.value = 0
      if (this.isArray) this.item.value = []
    },

    // calcHeight() {
    //   this.$nextTick(() => {
    //     let dimensions = this.$refs.menu?.getBoundingClientRect()
    //     this.ui.maxHeight = dimensions.height
    //   })
    // },
  },

  created() {
    // Opening the menu for a specific filter
    if (this.current) {
      this.item.filter = this.filter
      this.item.mod = this.current.mods[0]

      // if (!this.item.value && this.current.type == 'array') {
      //   this.item.value = []
      // }
    }

    // Opening the filter for an already set filter
    if (this.hook) {
      this.item.mod = this.hook.mod
      this.item.value = this.hook.value
    }

    this.setDefaultValue()
  },
}
</script>

<style>
.v-date-picker .v-picker-title {
  display: none;
}
</style>
