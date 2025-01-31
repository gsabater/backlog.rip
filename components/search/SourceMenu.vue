<template>
  <div
    class="b-menu dropdown-menu show"
    style="min-width: 240px; letter-spacing: normal; overflow: visible">
    <span class="dropdown-header">Where to search</span>

    <!-- <template v-if="withAll">
  </template> -->
    <component :is="componentIs" class="dropdown-item" @click="select('all')">
      <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
        <Icon size="17" width="1.5" class="text-muted">Cards</Icon>
      </span>
      <span class="nav-link-title">All games</span>
      <small class="ms-auto text-secondary me-1">
        {{ format.num($app.count.api) }}
      </small>
    </component>

    <component
      :is="componentIs"
      to="/library"
      class="dropdown-item"
      @click="select('library')">
      <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
        <Icon size="17" width="1.5" class="text-muted">LayoutDashboard</Icon>
      </span>
      <span class="nav-link-title">Your library</span>
      <small class="ms-auto text-secondary me-1">
        {{ format.num($app.count.library) }}
      </small>
    </component>

    <div class="dropdown-divider"></div>

    <div
      v-if="!isExpanded"
      class="dropdown-item small text-muted"
      @click="ui.expanded = true">
      Show more of your library
      <Icon class="ms-auto">ChevronDown</Icon>
    </div>

    <template v-if="isExpanded">
      <span class="dropdown-header">This is your complete library</span>

      <!-- <component
      :is="componentIs"
      v-for="(state, i) in pinnedStates"
      :key="'state' + i"
      :to="'/library/' + state.slug"
      class="dropdown-item ps-3">
      <span
        class="status-dot ms-0 me-4"
        :style="{ 'background-color': state.color || '' }"
        style="transform: translateX(1px)"></span>

      <span class="nav-link-title">{{ state.name }}</span>
      <small class="ms-auto text-secondary me-1">
        {{ format.num(stateStore.count(state.id)) }}
      </small>
    </component> -->

      <div class="dropdown-item">
        <div style="width: 30px">
          <Icon size="18" class="text-muted" width="1.5">Background</Icon>
        </div>

        <span>States</span>

        <span class="text-muted ms-auto">
          <Icon size="14">CaretRightFilled</Icon>
        </span>

        <b-dropdown placement="right-start" style="min-width: 240px">
          <component
            :is="componentIs"
            v-for="(state, i) in states"
            :key="'state' + i"
            :to="'/library/' + state.slug"
            class="dropdown-item px-2"
            @click="select('state:' + state.id)">
            <div class="content d-flex align-items-center w-100 px-1">
              <span
                class="status-dot ms-1 me-4"
                :style="{ 'background-color': state.color || '' }"></span>

              <span class="me-4">
                {{ state.name }}
              </span>

              <small class="ms-auto text-secondary me-1">
                {{ format.num(stateStore.count(state.id)) }}
              </small>
            </div>
          </component>
        </b-dropdown>
      </div>

      <!-- <div class="dropdown-divider"></div> -->

      <component
        :is="componentIs"
        nv-if="$auth.config.favorites"
        to="/library/favorites"
        class="dropdown-item"
        @click="select('library:favorites')">
        <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
          <Icon size="17" width="1.5" class="text-muted">Heart</Icon>
        </span>
        <span class="nav-link-title">Favorites</span>
        <small class="ms-auto text-secondary me-1">
          {{ format.num($app.count.fav) }}
        </small>
      </component>

      <component
        :is="componentIs"
        v-if="$auth.config.pinned"
        to="/library/pinned"
        class="dropdown-item"
        @click="select('library:pinned')">
        <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
          <Icon size="17" width="1.5" class="text-muted">Bookmark</Icon>
        </span>
        <span class="nav-link-title">Pinned games</span>
        <small class="ms-auto text-secondary me-1">
          {{ format.num($app.count.pinned) }}
        </small>
      </component>

      <component
        :is="componentIs"
        v-if="$auth.config.hidden"
        to="/library/hidden"
        class="dropdown-item"
        @click="select('library:hidden')">
        <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
          <Icon size="17" width="1.5" class="text-muted">Cancel</Icon>
        </span>
        <span class="nav-link-title">Hidden games</span>
        <small class="ms-auto text-secondary me-1">
          {{ format.num($app.count.hidden) }}
        </small>
      </component>
    </template>
  </div>
</template>

<script>
/**
 * @file:    \components\search\SourceMenu.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 8th January 2025
 * Modified: Mon 13 January 2025 - 17:05:30
 **/

export default {
  name: 'SourceMenu',

  props: {
    // Selected source at filters
    // Used for active and expanded ui
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    source: {
      type: String,
      default: 'all',
    },

    // Defines if the component is used as a filter dropdown
    // or a navigation dropdown with links
    // options: filter, nav
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    purpose: {
      type: String,
      default: 'filter',
    },

    // Display all games in the dropdown
    // options: true, false
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    withAll: {
      type: Boolean,
      default: false,
    },

    // Option to display states in the dropdown
    // Can be false, or a truthy value with a string
    // options: false, 'pinned', 'menu'
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    withStates: {
      type: [Boolean, String],
      default: false, //
    },
  },

  emits: ['change'],

  data() {
    return {
      ui: {
        expanded: false,
      },
    }
  },

  computed: {
    ...mapStores(useStateStore),
    ...mapState(useStateStore, ['states', 'pinnedStates', 'unPinnedStates']),

    componentIs() {
      return this.purpose === 'nav' ? 'NuxtLink' : 'div'
    },

    isExpanded() {
      if (this.ui.expanded) return true
      if (this.source !== 'all' && this.source !== 'library') return true

      return false
    },
  },

  methods: {
    select(source) {
      this.$emit('change', source)
      if (typeof this.$parent.hide == 'function') this.$parent.hide()
    },
  },

  mounted() {},
}
</script>
