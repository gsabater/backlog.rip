<template>
  <img
    :key="src"
    :src="src"
    loading="lazy"
    crossorigin="anonymous"
    @error="handleError"
    @load="$emit('loaded', src)" />
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
 * Modified: 7th February 2026 - 12:46:13
 **/

// TODO: Move this constant to constants.js
const SOURCES = {
  steam: {
    logo: 'https://steamcdn-a.akamaihd.net/steam/apps/%ID%/logo.png',
    capsule:
      'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/%ID%/capsule_616x353.jpg',
    heroCapsule:
      'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/%ID%/hero_capsule.jpg',
    cover: 'https://steamcdn-a.akamaihd.net/steam/apps/%ID%/library_600x900.jpg',
    banner: 'https://steamcdn-a.akamaihd.net/steam/apps/%ID%/header.jpg',
    header:
      'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/%ID%/header_292x136.jpg',
    icon: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/%ID%/%ICON%.jpg',
    gen: 'https://steamcdn-a.akamaihd.net/steam/apps/%ID%/page_bg_generated_v6b.jpg',
    background: 'https://cdn.akamai.steamstatic.com/steam/apps/%ID%/page.bg.jpg',
    library: 'https://steamcdn-a.akamaihd.net/steam/apps/%ID%/library_hero.jpg',
  },
  igdb: {
    logo: 'https://images.igdb.com/igdb/image/upload/t_logo_med/%ID%.png',
    cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/%ID%.jpg',
    screenshot: 'https://images.igdb.com/igdb/image/upload/t_screenshot_med/%ID%.jpg',
    artwork: 'https://images.igdb.com/igdb/image/upload/t_2xlarge/%ID%.jpg',
  },
}

const FALLBACK = '/img/illustrations/wU08XKouRlOjqQsczsNQiw.webp'

export default {
  name: 'GameAsset',
  props: {
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
  },

  emits: ['loaded', 'failed'],

  data() {
    return {
      currentIndex: 0,
    }
  },

  computed: {
    availableAssets() {
      const assets = []

      for (const source of this.priority) {
        const urls = this.getAssetUrls(source, this.asset)
        if (urls) assets.push(...urls)

        if (this.fallback) {
          const fallbackUrls = this.getAssetUrls(source, this.fallback)
          if (fallbackUrls) assets.push(...fallbackUrls)
        }
      }

      return assets
    },

    src() {
      if (this.currentIndex >= this.availableAssets.length) {
        return FALLBACK
      }

      const url = this.availableAssets[this.currentIndex]
      return url ? `${url}?t=${this.$app.t}` : FALLBACK
    },
  },

  watch: {
    app() {
      this.currentIndex = 0
    },
  },

  methods: {
    getAssetUrls(source, assetType) {
      if (source === 'steam') {
        if (!this.app.id?.steam) return null

        const template = SOURCES.steam[assetType]
        if (!template) return null

        const url = template.replace('%ID%', this.app.id.steam)

        // Apply special styling for certain asset types
        if (assetType === 'cover' && template.includes('header.')) {
          this.applyStyling('banner', url)
        }

        return [url]
      }

      if (source === 'igdb') {
        if (!this.app.cover?.igdb) return null

        const template = SOURCES.igdb[assetType]
        if (!template) return null

        const url = template.replace('%ID%', this.app.cover.igdb)

        if (assetType === 'cover') {
          this.applyStyling('igdb')
        }

        return [url]
      }

      return null
    },

    applyStyling(type, url) {
      this.$nextTick(() => {
        if (!this.$el) return
        const container = this.$el.closest('div')
        if (!container) return

        if (type === 'banner') {
          container.classList.add('is-banner')
          container.style.backgroundImage = `url(${url})`
        } else if (type === 'igdb') {
          this.$el.style.backgroundSize = 'cover'
          container.classList.remove('is-banner')
        }
      })
    },

    handleError() {
      if (this.currentIndex < this.availableAssets.length - 1) {
        this.currentIndex++
      } else {
        this.$emit('failed')
      }
    },
  },
}
</script>
