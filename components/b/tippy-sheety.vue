<template>
  <client-only>
    <tippy
      v-if="$app.ready"
      ref="tippy-sheety"
      theme="filters"
      trigger="click"
      :placement="placement"
      to="parent"
      tag="div"
      content-tag="div"
      animation="scale-subtle"
      :duration="[200, 250]"
      :animate-fill="true"
      :interactive="true"
      :interactive-debounce="55"
      :on-show="onShow"
      :on-hide="onHide">
      <template #content="{ state, hide }">
        <Teleport v-if="enabled" to=".bottom-sheet-teleport" :disabled="!useDrawer">
          <slot />
        </Teleport>
      </template>
    </tippy>
  </client-only>
</template>

<script>
/**
 * @file:    \components\b\tippy-Sheety.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 7th February 2024
 * Modified: Fri Apr 26 2024
 **/

export default {
  name: 'TippySheety',
  props: {
    theme: {
      type: String,
      default: '',
      options: ['dropdown', 'card'],
    },

    trigger: {
      type: String,
      default: 'mouseenter focus',
      options: ['click', 'hover', 'focus', 'manual'],
    },

    placement: {
      type: String,
      default: 'bottom-start',
      options: ['start', 'end', 'right-start'],
    },
  },

  emits: ['closed'],

  data() {
    return {
      enabled: false,
    }
  },

  computed: {
    isMobile() {
      return this.$app.device == 'sm'
    },

    useTippy() {
      return !this.isMobile
    },

    useDrawer() {
      //!isMobile || (isMobile && teleport)
      return !this.useTippy
    },
  },

  watch: {
    'enabled'(val) {
      if (val === false) {
        this.$emit('closed')
      }
    },

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Thu Apr 04 2024
    //+-------------------------------------------------

    '$app.device': function (val, was) {
      if (!this.enabled) return

      if (val == 'sm' && !$app.ui.drawer) {
        console.warn('opening drawer')
        $app.ui.drawer = true
      }

      if (was == 'sm' && $app.ui.drawer) {
        console.warn('closing drawer')
        $app.ui.drawer = false
      }
    },

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Thu Apr 04 2024
    //+-------------------------------------------------
    '$app.ui.drawer': function (val) {
      if (!this.enabled) return

      if (val === false) {
        this.hide('drawer')
        console.warn('hiding from drawer')
      }
    },
  },

  methods: {
    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Fri Apr 26 2024
    //+-------------------------------------------------
    show() {
      this.$refs['tippy-sheety'].setProps({
        appendTo: () => document.body,

        getReferenceClientRect: () => ({
          width: 0,
          height: 0,
          top: event?.clientY ?? 333,
          bottom: event?.clientY ?? 333,
          left: event?.clientX ?? 444,
          right: event?.clientX ?? 444,
        }),

        // popperOptions: {
        //   strategy: 'fixed',
        // },
      })
      this.$refs['tippy-sheety'].show()
    },

    //+-------------------------------------------------
    // hide()
    // Requests to hide / disable the tippy
    // If the tippy is visible, just disable it.
    // If the request comes from the drawer, check if the tippy is hidden and then disable it.
    // This is to prevent the tippy from hiding when closing the drawer by a window resize.
    // -----
    // Created on Thu Apr 04 2024
    //+-------------------------------------------------
    async hide(from = null) {
      if (!this.enabled) return

      await delay(300)

      if (!from && this.useTippy) this.enabled = false
      if (from == 'drawer') {
        if (this.$refs['tippy-sheety'].state.isVisible == false) {
          this.enabled = false
        }
      }

      // console.warn(
      //   'Request closed from ',
      //   from,
      //   'leaving as enabled: ',
      //   this.enabled,
      //   'tippy visible: ',
      //   this.$refs['tippy-sheety'].state.isVisible
      // )
    },

    //+-------------------------------------------------
    // onShow()
    // Enable the tippy and show the drawer if the device is mobile
    // -----
    // Created on Thu Apr 04 2024
    //+-------------------------------------------------
    onShow() {
      this.enabled = true

      if (this.useDrawer) {
        $app.ui.drawer = true
      }
    },

    //+-------------------------------------------------
    // onHide()
    // -----
    // Created on Thu Apr 04 2024
    //+-------------------------------------------------
    onHide() {
      this.hide()
      // console.warn('on hide tippy')
    },

    //+-------------------------------------------------
    // onHidden()
    // -----
    // Created on Thu Apr 04 2024
    //+-------------------------------------------------
    // async onHidden() {},

    // async init() {
    //   // this.enableMenu()
    // },
  },

  mounted() {
    // this.init()
  },
}
</script>
