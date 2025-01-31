<template>
  <div class="b-menu dropdown-menu show" style="min-width: 280px; letter-spacing: normal">
    <span class="dropdown-header">
      <span class="text-muted">Item details</span>
    </span>

    <label class="dropdown-item ps-1" style="align-items: normal">
      <div class="selection mx-1" style="margin-top: 1px">
        <input
          type="checkbox"
          class="form-check-input"
          style="transform: scale(0.7)"
          :checked="f.show.card.includes('default')"
          @change="show('default')" />
      </div>

      <div class="content d-flex align-items-center w-100">
        <!-- <Icon size="16" width="2" class="me-1" :icon="'Dice' + ui.dice"></Icon> -->
        <div class="pe-3">
          Default
          <div class="text-muted" style="font-size: 0.75rem">
            Show details related to the search filters
          </div>
        </div>
      </div>
    </label>

    <div class="dropdown-divider"></div>

    <label class="dropdown-item ps-1" style="align-items: normal">
      <div class="selection mx-1" style="margin-top: 1px">
        <input
          type="checkbox"
          class="form-check-input"
          style="transform: scale(0.7)"
          :checked="f.show.card.includes('name')"
          @change="show('name')" />
      </div>

      <div class="content d-flex align-items-center w-100">
        <div class="pe-3">Name</div>
      </div>
    </label>

    <label class="dropdown-item ps-1" style="align-items: normal">
      <div class="selection mx-1" style="margin-top: 1px">
        <input
          type="checkbox"
          class="form-check-input"
          style="transform: scale(0.7)"
          :checked="f.show.card.includes('score')"
          @change="show('score')" />
      </div>

      <div class="content d-flex align-items-center w-100">
        <div class="pe-3">Score</div>
      </div>
    </label>

    <label class="dropdown-item ps-1" style="align-items: normal">
      <div class="selection mx-1" style="margin-top: 1px">
        <input
          type="checkbox"
          class="form-check-input"
          style="transform: scale(0.7)"
          :checked="f.show.card.includes('playtime')"
          @change="show('playtime')" />
      </div>

      <div class="content d-flex align-items-center w-100">
        <div class="pe-3">Playtime</div>
      </div>
    </label>

    <label class="dropdown-item ps-1" style="align-items: normal">
      <div class="selection mx-1" style="margin-top: 1px">
        <input
          type="checkbox"
          class="form-check-input"
          style="transform: scale(0.7)"
          :checked="f.show.card.includes('hltb')"
          @change="show('hltb')" />
      </div>

      <div class="content d-flex align-items-center w-100">
        <div class="pe-3">Time to beat</div>
      </div>
    </label>

    <label class="dropdown-item ps-1" style="align-items: normal">
      <div class="selection mx-1" style="margin-top: 1px">
        <input
          type="checkbox"
          class="form-check-input"
          style="transform: scale(0.7)"
          :checked="f.show.card.includes('released')"
          @change="show('released')" />
      </div>

      <div class="content d-flex align-items-center w-100">
        <div class="pe-3">Release date</div>
      </div>
    </label>
  </div>
</template>

<script>
/**
 * @file:    \components\search\ItemDetails.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 27th December 2024
 * Modified: Tue 31 December 2024 - 11:19:12
 **/

export default {
  name: 'ItemDetailsMenu',

  props: {
    f: {
      type: Object,
      default: () => ({}),
    },
  },

  emits: ['sort', 'show'],

  data() {
    return {}
  },

  methods: {
    show(key) {
      this.$emit('show', key)
    },
  },

  mounted() {},
}
</script>
