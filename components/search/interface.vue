<template>
  <div class="row">
    <div class="col-9">
      <div class="row mb-2">
        <div class="col-6">
          <button type="button" class="btn">
            <Icon size="18" class="text-muted me-1">CirclePlus</Icon>
            <div
              :class="{
                'pe-2 me-2 border-end': !f.played || !f.unplayed,
              }">
              Presets
            </div>
            <span v-if="f.played && !f.unplayed" class="badge bg-indigo-lt">Played</span>
            <span v-if="!f.played && f.unplayed" class="badge">Not played</span>
          </button>
          <b-menu>
            <label class="dropdown-item">
              Played
              <span class="badge bg-primary text-primary-fg ms-auto">12</span>
            </label>

            <label class="dropdown-item">
              Not played
              <!-- <span class="badge bg-primary text-primary-fg ms-auto">12</span> -->
            </label>
          </b-menu>
        </div>
        <div class="col-6"></div>
      </div>
      <search-results :filters="f"></search-results>
    </div>
    <div class="col-3">
      <b-input v-model="f.string" placeholder="Filter..."></b-input>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \components\search\interface.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th November 2023
 * Modified: Wed Nov 22 2023
 **/

export default {
  name: 'SearchInterface',
  props: {
    filters: {
      type: Object,
      default: () => ({}),
    },

    preset: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    f: {},
    base: {
      string: '',
    },

    presets: {
      'my-preset': {
        string: 'my preset',
      },
    },

    ui: {},
  }),

  computed: {},

  methods: {
    //+-------------------------------------------------
    // setFilters()
    // Initializes this.f
    // With values from props and presets
    // -----
    // Created on Tue Nov 14 2023
    //+-------------------------------------------------
    setFilters() {
      this.f = {
        ...this.base,
        ...(this.preset ? this.presets[this.preset] : {}),
        ...this.filters,
      }
    },

    init() {},
  },

  mounted() {
    this.setFilters()
  },
}
</script>

<style>
.offcanvas-backdrop.show {
  opacity: 0.54;
  backdrop-filter: blur(4px);
}
</style>
