<template>
  <pre
    class="d-none my-3"
    style="
      position: fixed;
      bottom: 10px;
      left: 200px;
      z-index: 9999;
      max-height: 300px;
      max-width: 190px;
      overflow-y: scroll;
      background: rgba(39, 12, 42, 0.5);
      color: white;
      padding: 10px;
      border-radius: 5px;
      width: auto;
    ">
Filters
{{ f }}
</pre
  >

  <pre
    class="d-none my-3"
    style="
      position: fixed;
      bottom: 10px;
      left: 600px;
      z-index: 9999;
      max-height: 300px;
      max-width: 190px;
      overflow-y: scroll;
      background: rgba(39, 12, 42, 0.5);
      color: white;
      padding: 10px;
      border-radius: 5px;
      width: auto;
    ">
Option
{{ option }}
</pre
  >
  <pre
    class="d-none my-3"
    style="
      position: fixed;
      bottom: 10px;
      left: 800px;
      z-index: 9999;
      max-height: 300px;
      max-width: 190px;
      overflow-y: scroll;
      background: rgba(39, 12, 42, 0.5);
      color: white;
      padding: 10px;
      border-radius: 5px;
      width: auto;
    ">
Selected
{{ selected }}
</pre
  >

  <div class="col-12">
    <div class="row mb-4 align-items-center">
      <div class="col col-3">
        <b-input
          v-model="f.string"
          placeholder="Filter..."
          clearable
          @tick="notify"
          @clear="notify"></b-input>
      </div>
      <div class="col col-6">
        <div class="btn" style="outline: 1px dashed #b8b8b82c; padding: 0.35rem 0.85rem">
          <Icon class="me-2" size="16">ColorFilter</Icon>
          Filter by
          <tippy
            ref="tippyFilter"
            tag="div"
            to="parent"
            content-tag="div"
            :animate-fill="true"
            :interactive="true"
            :interactive-debounce="55"
            animation="scale-subtle"
            placement="bottom-start"
            trigger="click"
            theme="filters"
            :on-hidden="reset">
            <!-- :on-show="showBackdrop" -->
            <template #content="{ hide }">
              <div class="b-menu dropdown-menu show">
                <template v-if="ui.step == 'pick'">
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
                </template>

                <template v-if="ui.step == 'picked'">
                  <div class="dropdown-item">
                    <input
                      ref="findOption"
                      v-model="ui.findOption"
                      type="text"
                      class="form-control form-control-flush"
                      placeholder="Filter..." />
                  </div>
                  <div class="dropdown-divider"></div>

                  <div
                    v-for="(param, key) in picked"
                    :key="key"
                    class="dropdown-item px-2"
                    :class="{ selected: selected[param[option.opValue]] }">
                    <div
                      class="selection"
                      style="margin-right: 0.55rem"
                      @click="select(param, 'soft')">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        style="transform: scale(0.8)"
                        :checked="selected[param[option.opValue]]" />
                    </div>

                    <div
                      class="content d-flex align-items-center w-100"
                      @click="select(param, 'hard')">
                      <template v-if="option.by == 'state'">
                        <!-- <Icon
                          v-if="param.key == 'favorites'"
                          size="14"
                          style="color: red; fill: pink">
                          Heart
                        </Icon> -->
                        <!-- v-else -->
                        <span
                          class="badge me-2"
                          :style="{ 'background-color': param.color || '' }"></span>

                        <span class="me-4">
                          {{ param.name }}
                        </span>

                        <tippy
                          class="text-muted ms-auto ms-2 cursor-help"
                          :content="param.description">
                          <Icon size="16" stroke="1">HelpCircleFilled</Icon>
                        </tippy>
                      </template>

                      <template v-if="option.by == 'genre'">
                        <span class="avatar avatar-xs me-2">
                          {{ param.name[0] }}
                        </span>

                        <span class="me-4">
                          {{ param.name }}
                        </span>
                      </template>
                    </div>
                  </div>
                </template>

                <!-- <div class="dropdown-item">Genre</div>
                <div class="dropdown-item">Features</div>
                <div class="dropdown-item">Release date</div>
                <div class="dropdown-item">Languages</div>
                <div class="dropdown-item">Platform</div>
                <div class="dropdown-item">Type</div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item">
                  <div style="width: 30px">
                    <Icon style="color: red; fill: pink">Heart</Icon>
                  </div>
                  <span>OPción</span>
                </div> -->
              </div>
            </template>
          </tippy>
        </div>

        <!--
          🤔 Useful

          <button
          v-tippy="'Filter by game state'"
          :class="'btn py-2 ps-3 ' + (f.state ? 'pe-2' : 'pe-3')"
          style="transform: scale(0.9) translateX(-5px)">
          <Icon size="19" class="text-muted me-1">Background</Icon>
          <div :class="{ 'pe-2 me-2 border-end': f.state }">State</div>
          <BState v-if="f.state" :state="f.state" :label="true" :pulse="false"></BState>
        </button>
        <BMenuStates
          v-model="f.state"
          :clearable="true"
          @clear="search"
          @change="search"></BMenuStates> -->
      </div>
      <div v-if="false && $app.dev" class="col text-end">
        <div class="btn" style="outline: 1px dashed #b8b8b82c; padding: 0.35rem 0.85rem">
          <Icon size="19" class="text-muted me-1">
            SortDescending
            <!-- {{ f.sortDir == 'asc' ? 'SortAscending' : 'SortDescending' }} -->
          </Icon>
          <div class="pe-2 me-2 border-end">Sort and display</div>

          <span v-tippy="'Toggle sorting'" class="badge bg-purple-lt">
            asdasdsad
            <!-- {{ sortToHuman[f.sortBy] }} -->
            <Icon class="text-muted" size="11">ArrowDown</Icon>
          </span>

          <tippy
            ref="tippySort"
            tag="div"
            to="parent"
            content-tag="div"
            :animate-fill="true"
            :interactive="true"
            :interactive-debounce="55"
            animation="shift-away-subtle"
            placement="bottom-start"
            trigger="click"
            theme="overlap"
            :on-hidden="reset">
            <!-- :on-show="showBackdrop" -->
            <template #content="{ hide }">
              <div class="b-menu dropdown-menu show">
                <label
                  class="dropdown-item ps-1"
                  n:class="{ active: f.sortBy == 'rand' }"
                  @click="f.sortBy = 'rand'">
                  <div class="d-flex justify-center" style="width: 30px">
                    <Icon size="16" class="me-1">Dice</Icon>
                  </div>
                  Random
                  <!-- <div class="ms-auto">AZ</div> -->
                  <!-- <span class="text-muted">Sorting by Name descending</span> -->
                </label>

                <div class="w-100 border-top my-1"></div>

                <label
                  class="dropdown-item ps-1"
                  n:class="{ active: f.sortBy == 'name' }"
                  @click="f.sortBy = 'name'">
                  <div class="d-flex justify-center" style="width: 30px">
                    <Icon size="16" class="me-1">SortAscendingLetters</Icon>
                  </div>
                  Name
                </label>

                <label
                  class="dropdown-item ps-1"
                  n:class="{ active: f.sortBy == 'score' }"
                  @click="f.sortBy = 'score'">
                  <div class="d-flex justify-center" style="width: 30px">
                    <Icon size="16" class="me-1">SortDescendingNumbers</Icon>
                  </div>
                  <span class="pe-3">Median score</span>
                  <tippy
                    class="text-muted ms-auto cursor-help"
                    :content="'The median score is ....'">
                    <Icon>HelpCircleFilled</Icon>
                  </tippy>
                  <!-- <div class="ms-auto">AZ</div> -->
                  <!-- <span class="text-muted">Sorting by Name descending</span> -->
                </label>

                <label
                  class="dropdown-item ps-1"
                  n:class="{ active: f.sortBy == 'playtime' }"
                  @click="f.sortBy = 'playtime'">
                  <div class="d-flex justify-center" style="width: 30px">
                    <Icon size="16" class="me-1">AlarmAverage</Icon>
                  </div>
                  Your playtime
                  <!-- <div class="ms-auto">AZ</div> -->
                  <!-- <span class="text-muted">Sorting by Name descending</span> -->
                </label>

                <div class="w-100 border-top my-1"></div>

                <label
                  class="dropdown-item ps-1"
                  n:class="{ active: f.sortBy == 'hltb' }"
                  @click="f.sortBy = 'hltb'">
                  <div class="d-flex justify-center" style="width: 30px">
                    <Icon size="16" class="me-1">TimeDuration30</Icon>
                  </div>
                  How long to beat
                  <!-- <div class="ms-auto">AZ</div> -->
                  <!-- <span class="text-muted">Sorting by Name descending</span> -->
                </label>
              </div>
            </template>
          </tippy>
        </div>
        <!-- <small class="text-muted">
            Found {{  }} games,
            <br />
            666 in your library
          </small> -->

        <!-- <button type="button" class="btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-checkbox"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M9 11l3 3l8 -8"></path>
                    <path
                      d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9"></path>
                  </svg>
                  Toggle all
                </button>
                <b-btn @click="doit">doit</b-btn> -->
      </div>
    </div>

    <div class="filters-bar row mb-4 align-items-center">
      <div class="col-12">
        <template v-for="(param, key) in _filters" :key="key">
          <div class="btn-group btn-group-sm me-3">
            <div class="btn d-flex align-items-center disabled border-end-0">
              <template v-if="options[key]">
                <div style="width: 30px">
                  <Icon>{{ options[key].icon }}</Icon>
                </div>
                <span>{{ options[key].label }}</span>
              </template>
            </div>
            <div
              class="btn d-flex align-items-center disabled border-end-0 border-start-0">
              is
            </div>
            <div class="btn d-flex align-items-center">
              <template v-if="param.length == 1">
                <span class="badge bg-purple-lt">
                  {{ filterLabel(key) }}
                </span>
              </template>

              <template v-else>
                <span class="badge bg-purple-lt">
                  {{ param.length }} {{ options[key].labels }}
                </span>
              </template>
            </div>
            <div
              v-tippy="{ content: 'Remove filter', placement: 'bottom' }"
              class="btn d-flex align-items-center"
              @click="removeFilter(key)">
              <Icon>SquareRoundedX</Icon>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \components\search\filters\dropdown.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 7th February 2024
 * Modified: Tue Feb 13 2024
 **/

export default {
  name: 'SearchFilters',

  props: {
    filters: {
      type: Object,
      default: () => ({}),
    },
  },

  emits: ['update'],

  data() {
    return {
      f: {
        string: '',
      },

      option: {},
      selected: {},

      options: {
        states: {
          by: 'state',
          filter: 'states',

          icon: 'Background',
          label: 'State',
          labels: 'States',

          data: 'states',
          opTitle: 'name',
          opValue: 'id',
        },

        genres: {
          by: 'genre',
          filter: 'genres',

          icon: 'Graph',
          label: 'Genre',
          labels: 'Genres',

          data: 'genres',
          opSort: 'name',
          opTitle: 'name',
          opValue: 'id',
        },
      },

      ui: {
        step: 'pick',
        findOption: '',
      },
    }
  },

  computed: {
    // ...mapStores(useDataStore),
    ...mapState(useStateStore, {
      _states: 'states',
    }),

    ...mapState(useRepositoryStore, {
      _genres: 'genres',
    }),

    picked() {
      const options = []
      if (!this.option?.data) return options

      this['_' + this.option.data].forEach((option) => {
        let title = option[this.option.opTitle]
        title = title.toLowerCase()
        if (title.includes(this.ui.findOption.toLowerCase())) {
          options.push(option)
        }
      })

      if (this.option.opSort)
        options.sort((a, b) => a[this.option.opSort].localeCompare(b[this.option.opSort]))

      return options
    },

    _filters() {
      const enabled = ['states', 'genres']

      const filters = {}

      for (const key in this.f) {
        if (enabled.includes(key)) {
          if (this.f[key].length == 0) continue

          filters[key] = this.f[key]
        }
      }

      return filters
    },
  },

  watch: {
    // f: {
    //   handler: function (val) {
    //     // this.notify(val)
    //   },
    //   deep: true,
    // },

    filters: {
      handler: function (val) {
        this.f = { ...val }
      },
      deep: true,
    },
  },

  methods: {
    filterLabel(key) {
      let data = this['_' + this.options[key].data]
      if (!data) return

      data = data.filter((item) => this.f[key].includes(item[this.options[key].opValue]))

      if (data.length == 1) return data[0][this.options[key].opTitle]

      return data.length + ' ' + this.options[key].labels
    },

    //+-------------------------------------------------
    // pick()
    // picks an option from the group of options
    // this.options are the filters available
    // -----
    // Created on Fri Feb 09 2024
    //+-------------------------------------------------
    pick(option) {
      this.option = option
      this.selected = this.restoreFilter(option)

      this.ui.step = 'picked'

      this.$nextTick(() => {
        this.$refs.findOption.focus()
      })
    },

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Fri Feb 09 2024
    //+-------------------------------------------------
    select(param, mode = 'soft') {
      const key = param[this.option.opValue]

      if (this.selected[key]) delete this.selected[key]
      else this.selected[key] = { ...param }

      this.filter()

      if (mode == 'hard') {
        this.$refs.tippyFilter.hide()
      }
    },

    // Move selected to filters
    filter() {
      console.warn(this.selected)

      const values = Object.values(this.selected).map((item) => item[this.option.opValue])
      this.f[this.option.filter] = values

      this.notify()
    },

    removeFilter(key) {
      this.f[key] = []
      this.notify()
    },

    restoreFilter(option) {
      const selected = {}
      this.picked.forEach((param) => {
        if (this.f[option.filter].includes(param[option.opValue])) {
          selected[param[option.opValue]] = { ...param }
        }
      })

      return selected
    },

    // //+-------------------------------------------------
    // // function()
    // // moves selected to filters
    // // hides tippy and ui
    // // -----
    // // Created on Fri Feb 09 2024
    // //+-------------------------------------------------
    // endSelection(){

    // },

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Fri Feb 09 2024
    //+-------------------------------------------------
    reset() {
      this.option = {}
      this.selected = {}

      this.ui.step = 'pick'
      this.ui.findOption = ''
    },

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Fri Feb 09 2024
    //+-------------------------------------------------
    notify() {
      this.$emit('update', this.f)
      // console.warn('✏️ ', this.f.string, JSON.stringify(this.f))
      // this.$nextTick(() => {
      //   console.warn('✏️ 2', this.f.string, JSON.stringify(this.f))
      // })
    },

    init() {},
  },

  mounted() {
    this.init()
  },
}
</script>
