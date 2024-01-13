<template>
  <!-- <pre>
    {{ $attrs }}
    {{ value }}
    {{ show }}
    {{ display }}
  </pre> -->
  <div
    v-if="show"
    class="modal modal-blur fade d-block"
    :class="{ show: display }"
    @click.self="hide">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div v-if="title" class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="hide"></button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
        <!-- <div class="modal-footer">
          <button type="button" class="btn me-auto" data-bs-dismiss="modal" @click="hide">
            Close
          </button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
            Save changes
          </button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \components\b\dialog.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 30th November 2023
 * Modified: Fri Jan 12 2024
 **/

export default {
  name: 'TablerDialog',
  props: {
    width: {
      type: String,
      default: '500px',
    },

    title: {
      type: String,
      default: null,
    },

    persistent: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:model-value'],

  data() {
    return {
      show: false,
      display: false,
    }
  },

  watch: {
    // 'show'() {

    // },
    '$attrs.modelValue'(val) {
      if (val !== false) this._show()
    },
  },

  methods: {
    _show() {
      this.show = true
      window.setTimeout(() => {
        this.display = true
      }, 50)
    },

    hide() {
      this.display = false
      window.setTimeout(() => {
        this.show = false
        this.$emit('update:model-value', this.show)
      }, 50)
    },
  },

  mounted() {
    this.show = this.$attrs.modelValue
  },
}
</script>

<style></style>
