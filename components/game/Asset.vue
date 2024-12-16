<template>
  <img
    loading="lazy"
    :src="src"
    @error="showAnother"
    @load="emitLoaded"
    crossorigin="anonymous" />
</template>

<script>
/**
 * @file:    \components\game\Asset.vue
 * @desc:    ...
 * -------------------------------------------
 * Can be used as
 * <game-asset :app="app" asset="logo" :priority="['steam', 'igdb']"></game-asset>
 * <game-asset :app="app" asset="cover" :priority="['steam', 'igdb']"></game-asset>
 * <game-asset :app="app" asset="banner" :priority="['steam', 'igdb']"></game-asset>
 * -------------------------------------------
 * Created Date: 12th January 2024
 * Modified: Fri 15 November 2024 - 14:04:14
 **/

export default {
  name: 'GameAsset',
  props: {
    // uuid: {
    //   type: String,
    //   default: null,
    // },

    app: {
      type: Object,
      default: () => ({}),
    },

    asset: {
      type: String,
      default: 'cover',
    },

    priority: {
      type: Array,
      default: () => ['steam', 'igdb'],
    },

    fallback: {
      type: String,
      default: null,
    },

    adapt: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['loaded', 'failed'],

  data() {
    return {
      is: null, // steam, igdb, etc
      ready: false,
      showing: 0,

      resources: {
        steam: {
          logo: 'https://steamcdn-a.akamaihd.net/steam/apps/%ID%/logo.png',
          cover: 'https://steamcdn-a.akamaihd.net/steam/apps/%ID%/library_600x900.jpg',
          banner: 'https://steamcdn-a.akamaihd.net/steam/apps/%ID%/header.jpg',
          header:
            'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/%ID%/header_292x136.jpg',
          icon: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/%ID%/%ICON%.jpg',
          gen: 'https://steamcdn-a.akamaihd.net/steam/apps/%ID%/page_bg_generated_v6b.jpg',
          background: 'https://cdn.akamai.steamstatic.com/steam/apps/%ID%/page.bg.jpg',
          library: 'https://steamcdn-a.akamaihd.net/steam/apps/%ID%/library_hero.jpg',
        },

        // prettier-ignore
        igdb: {
          logo: 'https://images.igdb.com/igdb/image/upload/t_logo_med/%ID%.png',
          cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/%ID%.jpg',
          screenshot: 'https://images.igdb.com/igdb/image/upload/t_screenshot_med/%ID%.jpg',
          artwork: 'https://images.igdb.com/igdb/image/upload/t_2xlarge/%ID%.jpg',
        },
      },
    }
  },

  computed: {
    assets() {
      const assets = []
      const fallback = []

      this.priority.forEach((source) => {
        if (source == 'steam' && !this.app.id.steam) return

        const resource = this.resources[source]

        if (!resource) return
        if (source == 'igdb' && !this.app.cover) return

        const asset = resource[this.asset]
        const fallb = resource[this.fallback]

        if (asset) assets.push(asset)
        if (fallb) fallback.push(fallb)
      })

      // if (this.asset == 'cover' && this.priority.includes('steam')) {
      //   assets.push(this.resources.steam.banner)
      // }

      // if (this.asset == 'background' && this.priority.includes('steam')) {
      //   assets.push(this.resources.steam.library)
      //   assets.push(this.resources.steam.gen)
      // }

      return assets.concat(fallback)
    },

    src() {
      return this.assetUrl(this.showing)
    },
  },

  watch: {
    app: {
      handler() {
        this.showing = 0
      },
    },
  },

  methods: {
    fadeOut() {
      this.$el.classList.add('animate__animated animate__fadeOut animate__faster')
    },

    //+-------------------------------------------------
    // showAnother()
    // Tries to show another asset or fails
    // -----
    // Updated on Thu Nov 14 2024 - Emit failed
    //+-------------------------------------------------
    showAnother() {
      // console.warn('show another', this.app.uuid, this.assets)
      if (this.showing == -1) {
        this.$emit('failed')
        return
      }

      if (this.showing < this.assets.length - 1) this.showing++
      else this.showing = -1
    },

    //+-------------------------------------------------
    // assetUrl()
    // From an array of assets (computed), returns the URL
    // Tries multiple urls and updates on error.
    // If the url is detected to be a banner, adapt the parent
    // -----
    // Created on Tue Feb 06 2024
    // Updated on Tue Nov 05 2024 - Added timestamp and null values
    //+-------------------------------------------------
    assetUrl(index) {
      if (index == -1) {
        this.adaptForIGDB()
        return '/img/illustrations/wU08XKouRlOjqQsczsNQiw.webp'
      }

      const cover = this.app?.cover
      const assets = this.assets[index]
      // console.warn('assetUrl', index, this.app.uuid, this.asset, this.is, assets, cover)

      if (!assets) return
      let theUrl = null

      if (assets.includes('igdb/')) this.is = 'igdb'
      else if (assets.includes('steam/')) this.is = 'steam'

      if (this.is == 'steam') theUrl = assets.replace('%ID%', this.app.id.steam)
      else if (this.is == 'igdb') theUrl = assets.replace('%ID%', cover.igdb)

      if (this.asset == 'cover' && assets.includes('header.')) {
        this.adaptForBanner(theUrl)
      }

      if (this.asset == 'cover' && this.is == 'igdb') {
        this.adaptForIGDB(theUrl)
      }

      return theUrl + '?t=' + this.$app.t
    },

    //+-------------------------------------------------
    // adaptForBanner()
    // Adapts the parent container for a banner
    // -----
    // Created on Tue Feb 06 2024
    //+-------------------------------------------------
    adaptForBanner(url) {
      if (!this.$el) return
      const container = this.$el.closest('div')
      if (!container) return

      container.classList.add('is-banner')
      container.style.backgroundImage = `url(${url})`
    },

    adaptForIGDB() {
      if (!this.$el) return
      const container = this.$el.closest('div')
      if (!container) return

      this.$el.style.backgroundSize = 'cover'
      container.classList.remove('is-banner')
    },

    emitLoaded() {
      this.$emit('loaded', this.src)
    },
  },
}
</script>
