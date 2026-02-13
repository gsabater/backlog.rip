<template>
  <div class="marquee-root">
    <div class="marquee-wrapper" :style="wrapperStyle">
      <div class="grid-container" :style="containerStyle">
        <div
          v-for="track in tracksData"
          :key="track.id"
          class="marquee-track"
          :style="getTrackStyle(track)">
          <div class="marquee-content" :style="getContentStyle(track)">
            <template v-for="n in 4" :key="n">
              <div
                v-for="(img, idx) in track.images"
                :key="n + '-' + idx"
                class="item-wrapper"
                :style="getItemWrapperStyle(img)">
                <img
                  :src="img"
                  class="marquee-img"
                  :style="getImageStyle(img)"
                  loading="lazy"
                  alt="grid item" />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \components\common\Backgrquee.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 31st December 2025
 * Modified: 31st December 2025 - 13:20:55
 **/

export default {
  name: 'Backgrquee',

  props: {
    images: { type: Array, required: true },
    columns: { type: Number, default: 5 },
    gap: { type: Number, default: 20 },
    speed: { type: Number, default: 30 },
    rotation: { type: Number, default: -15 },
    direction: { type: String, default: 'vertical' }, // 'vertical' | 'horizontal'
    alternate: { type: Boolean, default: true },

    scale: { type: Number, default: 1.5 },
    imageHeight: { type: Number, default: null },
  },

  data() {
    return {
      // Almacenamos la configuración computada de cada "pista" (track)
      // para que los valores aleatorios (velocidad, orden img) no cambien al renderizar
      tracksData: [],
    }
  },

  watch: {
    // Si cambian propiedades estructurales, regeneramos la data interna
    columns: { immediate: true, handler: 'initTracks' },
    images: { handler: 'initTracks' },
    alternate: { handler: 'initTracks' },
    // Nota: gap, speed, rotation y direction se manejan reactivamente en computed/style
    // sin necesidad de regenerar el array de tracks.
  },

  computed: {
    isVertical() {
      return this.direction === 'vertical'
    },
    wrapperStyle() {
      // Usamos porcentajes para escalar relativo al padre
      return {
        width: `${this.scale * 100}%`,
        height: `${this.scale * 100}%`,
        transform: `translate(-50%, -50%) rotate(${this.rotation}deg)`,
      }
    },
    containerStyle() {
      return {
        flexDirection: this.isVertical ? 'row' : 'column',
        gap: `${this.gap}px`,
      }
    },
  },

  methods: {
    initTracks() {
      const newTracks = []
      for (let i = 0; i < this.columns; i++) {
        const shuffled = [...this.images].sort(() => 0.5 - Math.random())
        const speedOffset = Math.random() * 5 - 2.5
        const delayFactor = Math.random()
        const isReversed = this.alternate && i % 2 !== 0

        newTracks.push({ id: i, images: shuffled, speedOffset, delayFactor, isReversed })
      }
      this.tracksData = newTracks
    },
    getTrackStyle(track) {
      const sizePercentage = 100 / this.columns
      if (this.isVertical) {
        return {
          width: `calc(${sizePercentage}% - ${this.gap}px)`,
          height: '100%',
          flexDirection: 'column',
        }
      } else {
        return {
          height: `calc(${sizePercentage}% - ${this.gap}px)`,
          width: '100%',
          flexDirection: 'row',
        }
      }
    },
    getContentStyle(track) {
      const flexDir = this.isVertical ? 'column' : 'row'
      let animName = ''
      if (this.isVertical) animName = track.isReversed ? 'scroll-up' : 'scroll-down'
      else animName = track.isReversed ? 'scroll-left' : 'scroll-right'

      const duration = (this.speed + track.speedOffset) * 2
      const delay = -1 * track.delayFactor * duration

      return {
        flexDirection: flexDir,
        animationName: animName,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
      }
    },
    getItemWrapperStyle(imgUrl) {
      const dims = this.getDimensionsFromUrl(imgUrl)
      const aspectRatio = `${dims.width}/${dims.height}`

      if (this.isVertical) {
        return { width: '100%', paddingBottom: `${this.gap}px` }
      } else {
        return { height: '100%', paddingRight: `${this.gap}px`, aspectRatio: aspectRatio }
      }
    },
    getImageStyle(imgUrl) {
      const dims = this.getDimensionsFromUrl(imgUrl)
      const style = {}

      // Si el usuario define un alto fijo (imageHeight prop)
      if (this.imageHeight) {
        style.height = `${this.imageHeight}px`
        style.width = '100%' // Ocupa el ancho de la columna
        style.objectFit = 'cover' // Recorta para llenar sin deformar
      } else {
        // Comportamiento automático (ratio original)
        style.aspectRatio = `${dims.width}/${dims.height}`
        style.width = '100%'
        style.height = 'auto'
      }

      return style
    },
    getDimensionsFromUrl(url) {
      const match = url.match(/(\d+)x(\d+)/)
      if (match) return { width: match[1], height: match[2] }
      return { width: 600, height: 600 }
    },
  },

  mounted() {
    this.initTracks()
  },
}
</script>

<style scoped>
.marquee-root {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #000;
}

.marquee-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  /* El transform se maneja en linea en el componente */
  /* width/height ahora se manejan via props/style para adaptarse al padre */
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  backface-visibility: hidden;
  perspective: 1000px;
}

.grid-container {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  will-change: transform;
}

.marquee-track {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-shrink: 0;
  contain: layout paint;
}

.marquee-content {
  display: flex;
  will-change: transform;
  box-sizing: border-box;
}

.item-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  flex-shrink: 0;
}

.marquee-img {
  display: block;
  object-fit: cover;
  border-radius: 8px;
  width: 100%;
  height: 100%;
}
</style>
