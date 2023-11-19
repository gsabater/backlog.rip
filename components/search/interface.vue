<template>
  <div class="row">
    <div class="col-9">
      <div class="row">
        <div class="col-6">
          <button type="button" class="btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-circle-plus"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
              <path d="M9 12h6"></path>
              <path d="M12 9v6"></path>
            </svg>
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
      <search-results></search-results>
    </div>
    <div class="col-3">
      <b-input v-model="f.string" placeholder="Filter..."></b-input>
      <hr />
      <pre>
      Filtersz
      {{ f }}
    </pre
      >

      <pre>
      ui
      {{ ui }}
    </pre
      >
    </div>
  </div>
</template>

<script>
/**
 * @file:    \components\search\interface.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th November 2023
 * Modified: Sat Nov 18 2023
 **/

export default {
  name: 'Search Interface',
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
