<template>
  <div
    class="b-menu dropdown-menu show b-filter-menu"
    style="min-width: 300px; letter-spacing: normal; overflow: visible">
    <!-- <pre class="d-block">
      {{ index }} --
      {{ item }} --
      {{ hook }} --
    </pre> -->
    <div class="dropdown-header">
      <span class="text-muted">Filter by {{ currentConf.label }}</span>
    </div>

    <div class="dropdown-item active">
      <div>
        {{ currentConf.label }} {{ filterMods[item.mod].short }}
        <small class="d-block text-muted">
          {{ filterMods[item.mod].desc }}
        </small>
      </div>
      <div class="ms-auto">
        <Icon>ChevronDown</Icon>
      </div>
    </div>

    <!--
      *+---------------------------------
      *| Mods selector
      *+--------------------------------- -->
    <template v-if="ui.showMods"></template>

    <!--
      *+---------------------------------
      *| Filter type: number
      *| Range values
      *+--------------------------------- -->
    <template v-else-if="current && current.type == 'number'">
      <v-row class="my-4 px-2" justify="space-between">
        <v-col class="text-center">
          <span class="text-h2 font-weight-light">{{ item.value || '0' }}</span>
          <!-- <span class="subheading font-weight-light me-1">value</span> -->
        </v-col>
      </v-row>

      <!-- <v-slider v-model="value" :step="1" max="218" min="40" track-color="grey">
        <template v-slot:prepend>
          <v-btn
            :color="color"
            icon="mdi-minus"
            size="small"
            variant="text"
            @click="decrement"></v-btn>
        </template>

        <template v-slot:append>
          <v-btn
            :color="color"
            icon="mdi-plus"
            size="small"
            variant="text"
            @click="increment"></v-btn>
        </template>
      </v-slider> -->

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

      <!-- <div class="p-2">
        <v-slider
          label="score"
          v-model="value"
          :max="100"
          :min="0"
          :step="1"
          class="align-center"
          hide-details
          thumb-label
          @change="onValueChanged"></v-slider>
      </div> -->
    </template>

    <!-- <template v-if="ui.step == 'pick'">
      <span class="dropdown-header">
        <span class="text-muted">Choose a filter</span>
      </span>
      <div
        v-for="(param, key) in options"
        :key="key"
        class="dropdown-item"
        @click="pick(param)">
        <div style="width: 30px">
          <Icon>{{ param.icon }}</Icon>
        </div>
        <span>{{ param.label }}</span>
      </div>
    </template> -->

    <!-- <template v-if="ui.step == 'picked'"> -->
    <template v-if="conf.search && searchable">
      <div class="dropdown-item">
        <input
          id="⚓findOption"
          ref="findOption"
          v-model="ui.findOption"
          type="text"
          class="form-control form-control-flush"
          placeholder="Filter..." />
      </div>
      <div class="dropdown-divider"></div>
    </template>
    <!-- <span v-else class="dropdown-header">
      <span class="text-muted">Filter by {{ conf.label }}</span>
    </span> -->

    <template v-if="current && current.type == 'array'">
      <div
        v-for="(param, key) in options"
        :key="key"
        class="dropdown-item"
        :class="{
          'active': cursor == key,
          'selected': filter[param[conf.opValue]],
          'px-2': conf.multiple !== false,
        }">
        <div
          v-if="conf.multiple !== false"
          class="selection"
          style="margin-right: 0.55rem"
          @click="select(param, 'soft')">
          <input
            type="checkbox"
            class="form-check-input"
            style="transform: scale(0.8)"
            :checked="filter[param[conf.opValue]]" />
        </div>

        <div
          class="content d-flex align-items-center w-100"
          @click="select(param, 'hard')">
          <template v-if="conf.by == 'state'">
            <!-- <Icon
                          v-if="param.key == 'favorites'"
                          size="14"
                          style="color: red; fill: pink">
                          Heart
                        </Icon> -->
            <!-- v-else -->

            <!-- <Icon style="color: var(--tblr-primary)">SquareCheck</Icon>
                      <Icon style="color: #666">Square</Icon> -->

            <span
              class="badge me-2"
              :style="{ 'background-color': param.color || '' }"></span>

            <span class="me-4">
              {{ param.name }}
            </span>

            <!-- <tippy
                        class="text-muted ms-auto ms-2 cursor-help"
                        :content="param.description">
                        <Icon size="16" stroke="1">HelpCircleFilled</Icon>
                      </tippy> -->
            <tippy
              :allow-h-t-m-l="true"
              class="text-muted ms-auto cursor-help"
              :content="param.description">
              <span class="form-help">?</span>
            </tippy>
          </template>

          <template v-else-if="conf.by == 'genre'">
            <span class="avatar avatar-xs me-2">
              {{ param.name[0] }}
            </span>

            <span class="me-4">
              {{ param.name }}
            </span>
          </template>

          <template v-else>
            <Icon class="me-2" size="16">{{ param.icon ?? conf.icon }}</Icon>
            <span class="me-4">
              {{ param.name }}
            </span>
          </template>
        </div>
      </div>
    </template>

    <template v-if="$app.dev && conf.by == 'released'">
      <div class="hr-text mt-2 mb-3">Or pick</div>
      <div style="transform: scale(0.9)">
        <!-- <div>
                      <input type="month" value="2018-05" />
                    </div> -->
        <pre>
                      {{ released }}
                    </pre
        >
        <div class="input-group mb-1">
          <select v-model="released.month" class="form-control">
            <option selected="selected" disabled="disabled">Month</option>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          <select
            v-model="released.year"
            placeholder="asdasd"
            class="form-control"
            style="max-width: 43%">
            <option selected="selected" disabled="disabled">Year</option>
            <option
              v-for="year in Array.from(
                { length: $moment().year() - 1994 },
                (_, i) => $moment().year() - i
              )"
              :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </div>
      <!-- </div> -->
    </template>
    <!-- </template> -->

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

    <!--
                <div class="dropdown-item">Features</div>
                <div class="dropdown-item">Languages</div>
                <div class="dropdown-item">Platform</div>
                <div class="dropdown-item">Type</div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item">
                  <div style="width: 30px">
                    <Icon style="color: red; fill: pink">Heart</Icon>
                  </div>
                  <span>Opción</span>
                </div> -->
  </div>
</template>

<script>
/**
 * @file:    \components\search\FilterMenu.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 27th March 2025
 * Modified: Thu 03 April 2025 - 16:30:04
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
    // used in this._index
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

      conf: {
        dummy: 'dummy',
      },

      config: {
        state: {
          data: 'states',

          search: true,
          multiple: true,

          opSort: 'name',
          opLabel: 'name',
          opValue: 'id',
        },

        genre: {
          data: 'genres',

          search: true,
          multiple: true,

          opSort: 'name',
          opLabel: 'name',
          opValue: 'id',
        },
      },

      ui: {
        findOption: '',
      },
    }
  },

  computed: {
    ...mapStores(useSearchStore),
    ...mapState(useStateStore, {
      states: 'states',
    }),

    ...mapState(useRepositoryStore, {
      genres: 'genres',
    }),

    _index() {
      return this.index ?? this.created
    },

    hook() {
      return this.searchStore.f?.filters[this._index]
    },

    current() {
      return filterService.filters[this.filter]
    },

    currentConf() {
      return filterService.config[this.filter]
    },

    filterMods() {
      return filterService.mods
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

    select(param, type) {
      this.searchStore.setFilter(1, 2, 3)
    },

    onValueChanged() {
      if (this._index == null) this.addFilter()
      else this.setFilter()
    },

    addFilter(value) {
      this.created = this.searchStore.addFilter({
        filter: this.item.filter,
        mod: this.item.mod,
        value: this.item.value,
      })

      // Handle filter position
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let mode = this.$parent.mode
      if (mode == 'menu') this.searchStore.f.show.tags = 'row'

      this.$mitt.emit('search:run')
    },

    setFilter() {
      this.$nextTick(() => {
        this.searchStore.setFilter(this._index, this.item.mod, this.item.value)
        this.$mitt.emit('search:run')
      })
    },
  },

  created() {
    if (this.current) {
      this.item.filter = this.filter
      this.item.mod = this.current.mods[0]
    }

    if (this.hook) {
      this.item.mod = this.hook.mod
      this.item.value = this.hook.value
    }
  },
}
</script>
