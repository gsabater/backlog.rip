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
    "><h3>Search Filters</h3>
{{ f }}
</pre>

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
    <div class="row gap-2 mb-4 align-items-center">
      <div class="col col-12 col-md-5">
        <b-input
          v-model="f.string"
          placeholder="Search games..."
          clearable
          @tick="notify"
          @clear="notify"></b-input>
      </div>
      <div class="col">
        <div class="btn" style="padding: 0.35rem 0.85rem">
          <Icon class="me-2" size="16">ColorFilter</Icon>
          Filter by

          <Icon class="text-muted" size="15" style="transform: translateX(8px)">
            Selector
          </Icon>

          <b-tippy-sheety @closed="reset" ref="filters">
            <div class="b-menu dropdown-menu show">
              <template v-if="ui.step == 'pick'">
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
              </template>

              <template v-if="ui.step == 'picked'">
                <template v-if="option.search !== false">
                  <div class="dropdown-item">
                    <input
                      ref="findOption"
                      v-model="ui.findOption"
                      type="text"
                      class="form-control form-control-flush"
                      placeholder="Filter..." />
                  </div>
                  <div class="dropdown-divider"></div>
                </template>
                <span class="dropdown-header" v-else>
                  <span class="text-muted">Filter by {{ option.label }}</span>
                </span>

                <div
                  v-for="(param, key) in picked"
                  :key="key"
                  class="dropdown-item"
                  :class="{
                    'selected': selected[param[option.opValue]],
                    'px-2': option.multiple !== false,
                  }">
                  <div
                    v-if="option.multiple !== false"
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

                    <template v-else-if="option.by == 'genre'">
                      <span class="avatar avatar-xs me-2">
                        {{ param.name[0] }}
                      </span>

                      <span class="me-4">
                        {{ param.name }}
                      </span>
                    </template>

                    <template v-else>
                      <Icon class="me-2" size="16">{{ param.icon ?? option.icon }}</Icon>
                      <span class="me-4">
                        {{ param.name }}
                      </span>
                    </template>
                  </div>
                </div>

                <template v-if="$app.dev && option.by == 'released'">
                  <div class="hr-text mt-2 mb-3">Or pick</div>
                  <div style="transform: scale(0.9)">
                    <!-- <div>
                      <input type="month" value="2018-05" />
                    </div> -->
                    <pre>
                      {{ released }}
                    </pre>
                    <div class="input-group mb-1">
                      <select class="form-control" v-model="released.month">
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
                        placeholder="asdasd"
                        class="form-control"
                        style="max-width: 43%"
                        v-model="released.year">
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
              </template>

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
          </b-tippy-sheety>

          <!-- <tippy
            ref="tippyFilter"
            to="parent"
            tag="div"
            content-tag="div"
            :animate-fill="true"
            :interactive="true"
            :interactive-debounce="55"
            animation="scale-subtle"
            placement="bottom-start"
            trigger="click"
            theme="filters"
            :on-hidden="reset"
            :on-show="() => ($app.ui.drawer = true)">
            <template #content="{ hide }">
              <div class="b-menu dropdown-menu show">

              </div>
            </template>
          </tippy> -->
        </div>
      </div>

      <div class="col text-end d-flex" style="justify-content: flex-end">
        <div
          class="d-inline-flex align-items-center nbtn mx-2 text-muted cursor-pointer"
          style="padding: 0.35rem 0.85rem">
          <!-- <Icon size="19" class="text-muted me-2">
            SortDescending
            {{ f.sortDir == 'asc' ? 'SortAscending' : 'SortDescending' }}
          </Icon> -->
          Sorting by
          {{ sortLabel[f.sortBy] ?? '--' + f.sortBy }}

          <Icon class="text-muted" size="14" style="transform: translateX(8px)">
            ChevronDown
          </Icon>

          <b-tippy-sheety placement="bottom-end">
            <!-- <tippy
            ref="tippySort"
            to="parent"
            tag="div"
            content-tag="div"
            :animate-fill="true"
            :interactive="true"
            :interactive-debounce="55"
            animation="scale-subtle"
            placement="bottom-start"
            trigger="click"
            theme="filters">
            <template #content="{ hide }"> -->
            <div class="b-menu dropdown-menu show" style="min-width: 280px">
              <span class="dropdown-header">
                <span class="text-muted">General sorting</span>
              </span>

              <label
                class="dropdown-item ps-1"
                :class="{ active: f.sortBy == 'rand' }"
                @click="sortBy('rand')">
                <div class="d-flex justify-center" style="width: 30px">
                  <Icon size="16" width="2" class="me-1" :icon="'Dice' + ui.dice"></Icon>
                </div>

                <div class="pe-3">Random</div>
                <tippy
                  class="text-muted ms-auto cursor-help ps-4"
                  :content="'Every click triggers a re-sort!'">
                  <Icon
                    width="2"
                    style="background: rgb(0 0 0 / 20%); border-radius: 50%">
                    HelpSmall
                  </Icon>
                </tippy>
              </label>

              <label
                class="dropdown-item ps-1"
                :class="{ active: f.sortBy == 'name' }"
                @click="sortBy('name', 'asc', true)">
                <div class="d-flex justify-center" style="width: 30px">
                  <Icon
                    size="16"
                    width="2"
                    class="me-1"
                    :icon="
                      f.sortDir == 'asc'
                        ? 'SortAscendingLetters'
                        : 'SortDescendingLetters'
                    "></Icon>
                </div>
                <div>
                  Name
                  <div
                    v-if="f.sortBy == 'name'"
                    class="text-muted"
                    style="font-size: 0.75rem">
                    {{ f.sortDir == 'asc' ? 'Ascending' : 'Descending' }}
                    <Icon size="14" width="2" class="mx-1">Repeat</Icon>
                  </div>
                </div>
              </label>

              <div class="dropdown-divider"></div>

              <span class="dropdown-header">
                <span class="text-muted">By Score</span>
              </span>

              <label
                class="dropdown-item ps-1"
                :class="{ active: f.sortBy == 'score' }"
                @click="sortBy('score', 'desc', true)">
                <div class="d-flex justify-center" style="width: 30px">
                  <Icon size="16" class="me-1">Universe</Icon>
                </div>
                <div>
                  Median score
                  <div
                    v-if="f.sortBy == 'score'"
                    class="text-muted"
                    style="font-size: 0.75rem">
                    {{ f.sortDir == 'asc' ? 'Ascending' : 'Descending' }}
                    <Icon size="14" width="2" class="mx-1">Repeat</Icon>
                  </div>
                </div>
                <tippy
                  class="text-muted ms-auto cursor-help ps-4"
                  :content="'The median score is ....'">
                  <Icon
                    width="2"
                    style="background: rgb(0 0 0 / 20%); border-radius: 50%">
                    HelpSmall
                  </Icon>
                </tippy>
              </label>

              <div class="dropdown-divider"></div>

              <span class="dropdown-header">
                <span class="text-muted">By Time</span>
              </span>

              <label
                class="dropdown-item ps-1"
                :class="{ active: f.sortBy == 'released' }"
                @click="sortBy('released', 'desc', true)">
                <div class="d-flex justify-center" style="width: 30px">
                  <Icon size="16" class="me-1">CalendarDot</Icon>
                </div>
                <div>
                  Release date
                  <div
                    v-if="f.sortBy == 'released'"
                    class="text-muted"
                    style="font-size: 0.75rem">
                    {{ f.sortDir == 'asc' ? 'Oldest' : 'Newest' }}
                    <Icon size="14" width="2" class="mx-1">Repeat</Icon>
                  </div>
                </div>
              </label>

              <label
                class="dropdown-item ps-1"
                :class="{ active: f.sortBy == 'playtime' }"
                @click="sortBy('playtime', 'desc', true)">
                <div class="d-flex justify-center" style="width: 30px">
                  <Icon size="16" class="me-1">AlarmAverage</Icon>
                </div>
                <div>
                  Your playtime
                  <div
                    v-if="f.sortBy == 'playtime'"
                    class="text-muted"
                    style="font-size: 0.75rem">
                    {{ f.sortDir == 'asc' ? 'Unplayed' : 'Most played' }}
                    <Icon size="14" width="2" class="mx-1">Repeat</Icon>
                  </div>
                </div>
              </label>

              <label
                class="dropdown-item ps-1"
                :class="{ active: f.sortBy == 'hltb' }"
                @click="sortBy('hltb', 'desc', true)">
                <div class="d-flex justify-center" style="width: 30px">
                  <Icon size="16" class="me-1">TimeDuration30</Icon>
                </div>
                <div>
                  How long to beat
                  <div
                    v-if="f.sortBy == 'hltb'"
                    class="text-muted"
                    style="font-size: 0.75rem">
                    {{ f.sortDir == 'asc' ? 'Ascending' : 'Descending' }}
                    <Icon size="14" width="2" class="mx-1">Repeat</Icon>
                  </div>
                </div>
                <tippy
                  class="text-muted ms-auto cursor-help ps-4"
                  :content="'How long to beat is a metric that measures how much time is needed to complete a game. Data provided from howlongtobeat.com'">
                  <Icon
                    width="2"
                    style="background: rgb(0 0 0 / 20%); border-radius: 50%">
                    HelpSmall
                  </Icon>
                </tippy>
              </label>
            </div>
          </b-tippy-sheety>
        </div>

        <div class="d-inline-flex align-items-center btn btn-sm">
          <Icon size="19" class="text-muted">ChartScatter3d</Icon>

          <b-tippy-sheety placement="bottom-start">
            <div class="b-menu dropdown-menu show" style="min-width: 280px">
              <span class="dropdown-header">
                <span class="text-muted">Display properties</span>
              </span>

              <div class="px-2 mx-1 mb-2">
                <small class="text-muted mb-3">
                  Select the properties you want to display on the cards
                </small>

                <div class="my-2"></div>
                <template v-for="(v, k) in _cardProperties">
                  <span
                    class="badge bg-purple-lt ms-auto mx-2 mb-2 cursor-pointer"
                    style="padding: 0.4rem"
                    :style="
                      f.show.card.includes(k)
                        ? 'outline: 1px solid; outline-offset: -1px;'
                        : '--tblr-bg-opacity: 0.6;'
                    "
                    @click="showInCard(k)">
                    <!-- <Icon size="16" v-if="f.show.card.includes(k)">Check</Icon> -->
                    {{ v }}
                  </span>
                </template>
              </div>
            </div>
          </b-tippy-sheety>
        </div>
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
        <!-- <button
          v-tippy="'Filter by game state'"
          :class="'btn py-2 ps-3 ' + (f.state ? 'pe-2' : 'pe-3')"
          style="transform: scale(0.9) translateX(-5px)">
          <Icon size="19" class="text-muted me-1">Background</Icon>
          <div :class="{ 'pe-2 me-2 border-end': f.state }">State</div>
          <BState v-if="f.state" :state="f.state" :label="true" :pulse="false"></BState>
        </button> -->

        <!-- <b-btn variant="ghost" color="secondary">
          Reset
          <svg
            style="margin-right: 0; margin-left: 5px"
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-square-rounded-x"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M10 10l4 4m0 -4l-4 4"></path>
            <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
          </svg>
        </b-btn> -->
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
 * Modified: Thu Jun 20 2024
 **/

export default {
  name: 'SearchFilters',

  props: {
    filters: {
      type: Object,
      default: () => ({}),
    },
  },

  emits: ['updated'],

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

        released: {
          search: false,
          multiple: false,

          by: 'released',
          filter: 'released',

          icon: 'CalendarDot',
          label: 'Release date',
          labels: 'Release dates',

          data: 'released',
          opTitle: 'name',
          opValue: 'value',
        },
      },

      released: {
        month: null,
        year: null,
      },

      ui: {
        dice: 4,
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

    sortLabel() {
      return {
        name: 'Name',
        score: 'Score',
        playtime: 'Playtime',
        hltb: 'How long to beat',
        released: 'Release date',
      }
    },

    amountOfApps() {
      if (this.$parent.source == 'all') return format.num(this.$app.count.api)

      return format.num(this.$app.count.library)
    },

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
      const enabled = ['states', 'genres', 'released']

      const filters = {}

      for (const key in this.f) {
        if (enabled.includes(key)) {
          if (key == 'states' && this.f[key].includes('pinned')) continue
          if (!this.f[key] || !this.f[key].length) continue
          if (this.f[key].length == 0) continue

          filters[key] = this.f[key]
        }
      }

      return filters
    },

    _released() {
      let manual = false

      if (this.selected.month) {
        if (!this.selected.year) {
          manual = true
          this.selected.year = this.$moment().year()
        }
      }

      if (this.selected.year) {
        if (!this.selected.month) {
          manual = true
          this.selected.month = this.$moment().month() + 1
        }
      }

      let dates = [
        {
          name: '15 days ago',
          value: this.$dayjs().subtract(15, 'days').unix(),
        },

        {
          name: '1 month ago',
          value: this.$dayjs().subtract(1, 'months').unix(),
        },

        {
          name: '3 months ago',
          value: this.$dayjs().subtract(3, 'months').unix(),
        },
      ]

      return dates
    },

    _cardProperties() {
      return {
        default: 'Default',
        name: 'Name',
        score: 'Score',
        playtime: 'Playtime',
        hltb: 'How long to beat',
        released: 'Release date',
        genres: 'Genres',
      }
    },
  },

  watch: {
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
    // sortBy()
    // Applies sortBy to the filters
    // -----
    // Created on Sun Mar 17 2024
    //+-------------------------------------------------
    sortBy(by, dir = 'desc', toggle = false) {
      if (toggle && this.f.sortBy == by) {
        this.f.sortDir = this.f.sortDir == 'asc' ? 'desc' : 'asc'
      } else {
        this.f.sortBy = by
        this.f.sortDir = dir
      }

      if (by == 'rand') {
        this.ui.dice = Math.floor(Math.random() * 6) + 1
      }

      // this.$refs.tippySort.hide()
      this.notify()
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
        if (this.$app.device !== 'sm') {
          this.$refs.findOption?.focus()
        }
      })
    },

    //+-------------------------------------------------
    // select()
    // selects an option from the group of options to filter
    // -----
    // Created on Fri Feb 09 2024
    //+-------------------------------------------------
    select(param, mode = 'soft') {
      const key = param[this.option.opValue]

      if (this.option.multiple == false) {
        this.selected = {}
      }

      if (this.selected[key]) delete this.selected[key]
      else this.selected[key] = { ...param }

      this.filter()

      if (mode == 'hard') {
        // this.$refs.tippyFilter.hide()
      }
    },

    //+-------------------------------------------------
    // showInCard()
    //
    // -----
    // Created on Fri May 10 2024
    //+-------------------------------------------------
    showInCard(key) {
      if (this.f.show.card.includes(key)) {
        this.f.show.card = this.f.show.card.filter((item) => item !== key)
      } else {
        this.f.show.card.push(key)
      }

      if (key == 'default') this.f.show.card = ['default']
      if (this.f.show.card.length == 0) this.f.show.card = ['default']
      if (this.f.show.card.length > 1 && this.f.show.card.includes('default')) {
        this.f.show.card.splice(this.f.show.card.indexOf('default'), 1)
      }

      this.notify()
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
        if (this.f[option.filter]?.includes(param[option.opValue])) {
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
      this.$emit('updated', this.f)
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
