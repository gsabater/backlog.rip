<template>
  <img loading="lazy" :src="assetUrl(showing)" @error="showAnother" />
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
 * Modified: Tue Feb 06 2024
 **/

export default {
  name: 'GameAsset',
  props: {
    uuid: {
      type: String,
      default: null,
    },

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
  },

  data() {
    return {
      is: null, // steam, igdb, etc
      showing: 0,

      resources: {
        steam: {
          logo: 'https://steamcdn-a.akamaihd.net/steam/apps/%ID%/logo.png',
          cover: 'https://steamcdn-a.akamaihd.net/steam/apps/%ID%/library_600x900.jpg',
          banner: 'https://steamcdn-a.akamaihd.net/steam/apps/%ID%/header.jpg',
          icon: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/%ID%/%ICON%.jpg',
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

      this.priority.forEach((source) => {
        if (source == 'igdb' && !this.app.cover) return
        if (this.resources[source]) assets.push(this.resources[source][this.asset])
      })

      if (this.asset == 'cover' && this.priority.includes('steam')) {
        assets.push(this.resources.steam.banner)
      }

      return assets
    },
  },

  methods: {
    showAnother() {
      if (this.showing < this.assets.length - 1) this.showing++
    },

    //+-------------------------------------------------
    // assetUrl()
    // From an array of assets (computed), returns the URL
    // Tries multiple urls and updates on error.
    // If the url is detected to be a banner, adapt the parent
    // -----
    // Created on Tue Feb 06 2024
    //+-------------------------------------------------
    assetUrl(index) {
      const url = this.assets[index]
      const cover = this.app?.cover

      let theUrl = null

      if (url.includes('igdb/')) this.is = 'igdb'
      else if (url.includes('steam/')) this.is = 'steam'

      if (this.is == 'steam') theUrl = url.replace('%ID%', this.app.steam_id)
      else if (this.is == 'igdb') theUrl = url.replace('%ID%', cover.igdb)

      if (this.asset == 'cover' && url.includes('header.')) {
        this.adaptForBanner(theUrl)
      }

      if (this.asset == 'cover' && this.is == 'igdb') {
        this.adaptForIGDB(theUrl)
      }

      return theUrl
    },

    //+-------------------------------------------------
    // adaptForBanner()
    // Adapts the parent container for a banner
    // -----
    // Created on Tue Feb 06 2024
    //+-------------------------------------------------
    adaptForBanner(url) {
      if (!this.$el) return
      this.$el.closest('.card-game__cover').classList.add('is-banner')
      this.$el.closest('.card-game__cover').style.backgroundImage = `url(${url})`
    },

    adaptForIGDB(url) {
      if (!this.$el) return
      this.$el.style.backgroundSize = 'cover'
    },

    init() {
      this.getData()
    },
  },

  mounted() {
    // this.init()
  },
}
</script>
