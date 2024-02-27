<template>
  <div class="page">
    <pre
      style="
        position: fixed;
        bottom: 10px;
        right: 10px;
        z-index: 9999;
        max-height: 90vh;
        overflow-y: scroll;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        padding: 10px;
        border-radius: 5px;
      "
      >{{ $app }}</pre
    >

    <!-- </div> -->
    <div class="page-wrapper">
      <NuxtLoadingIndicator />
      <!-- <div class="ch"></div> -->
      <div id="detailPage" class="hide-theme-light">
        <div id="detailCanvas" class="">
          <div class="bg_gradient_body">
            <div class="bg_gradient_large"></div>
            <div class="bg_gradient_small"></div>
          </div>
        </div>
      </div>

      <slot />
    </div>
  </div>

  <game-details></game-details>
  <game-manager></game-manager>
  <ModalsContainer />

  <Toaster
    position="bottom-right"
    close-button
    rich-colors
    :theme="ui.theme"
    nopetoast-options="{
      style: { background: '#fda4af' },
      className: 'card',
      descriptionClassName: 'my-toast-description',
    }" />

  <component :is="'style'" id="dynamic-style" type="text/css">
    <template v-if="!$app.dev">pre{ display: none !important; }</template>
  </component>

  <svg width="0" height="0" style="display: none">
    <filter id="grainy" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".837"></feTurbulence>
      <feColorMatrix type="saturate" values="0"></feColorMatrix>
      <feBlend mode="multiply" in="SourceGraphic"></feBlend>
    </filter>
  </svg>

  <!-- <div>
    <nav>
      <ul>
        <li>
          <NuxtLink to="/">Home</NuxtLink>
        </li>

        <li>---</li>
        <li>
          <NuxtLink to="/about">About</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/posts/1">Post 1</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/posts/2">Post 2</NuxtLink>
        </li>
        <li>---</li>
        <li>
          <NuxtLink to="/misc">MISC</NuxtLink>
        </li>
      </ul>
    </nav>
    <slot />
    <AppFooter />
  </div> -->
</template>

<script>
/**
 * @file:    \layouts\dev.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 7th February 2024
 * Modified: Wed Feb 14 2024
 **/

export default {
  name: 'DevLayout',

  setup() {
    const ui = reactive({
      theme: 'dark', // 'light',
      dialog: false,
      showMobMenu: false,
    })

    useHead({
      title: 'D',
      bodyAttrs: {
        class: 'antialiased',
      },

      script: [
        {
          // src: "../node_modules/@tabler/core/dist/js/tabler.js",
          // src: 'https://cdn.jsdelivr.net/npm/@tabler/core@1.0.0-beta17/dist/js/tabler.min.js',
          // src: '../node_modules/@tabler/core/dist/tabler.js',
          // body: true,
        },
      ],

      link: [],
    })

    return {
      ui,
    }
  },
  data() {
    return {}
  },

  computed: {
    ...mapStores(useDataStore),
  },

  methods: {
    changeTheme(theme) {
      this.ui.theme = theme
      document.body.setAttribute('data-bs-theme', theme)
    },
  },

  created() {
    this.changeTheme(this.ui.theme)

    this.$mitt.on('*', (e, payload) => {
      log('🎆 Fired event', e, payload)
      // console.info(this.$mitt.all)
    })

    this.$mitt.on('app:render', () => {
      this.$forceUpdate()
    })
  },
}

// function changeTheme(theme) {
//   ui.theme = theme
//   document.body.setAttribute('data-bs-theme', theme)
// }

// onMounted(() => {
//   // getDB('top-games')
// })
</script>
