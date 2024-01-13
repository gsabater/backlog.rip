<template>
  <img loading="lazy" :src="assetUrl(showing)" @error="showAnother" />
</template>

<script>
/**
 * @file:    \components\game\Asset.vue
 * @desc:    ...
 * -------------------------------------------
 * Can be used as
 * <game-asset :app="app" show="logo" :priority="['steam', 'igdb']"></game-asset>
 * <game-asset :app="app" show="cover" :priority="['steam', 'igdb']"></game-asset>
 * -------------------------------------------
 * Created Date: 12th January 2024
 * Modified: Fri Jan 12 2024
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

    assetUrl(index) {
      const item = this.assets[index]
      const isIgdb = item.includes('igdb/')
      const isSteam = item.includes('steam/')

      const cover = this.app?.cover ? JSON.parse(this.app?.cover) : {}

      if (isSteam) return item.replace('%ID%', this.app.steam_id)
      else if (isIgdb) return item.replace('%ID%', cover.igdb)
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
