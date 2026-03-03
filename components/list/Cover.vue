<template>
  <div v-if="games.length" class="cover-container" :class="useLayout">
    <!--
      *+---------------------------------
      *| Flex layout
      *| Up to five covers
      *+--------------------------------- -->
    <div v-if="layout == 'flex'" style="aspect-ratio: 3/2.2">
      <div class="row m-0 w-100 h-100 layout-flex" style="align-content: stretch; overflow: hidden">
        <div
          v-for="(app, i) in covers"
          :key="'boxed' + app.uuid"
          class="col box p-0"
          :class="{
            'col i-0': i == 0 && covers.length <= 3,
            'col-4': i == 0 && covers.length >= 3,
            'col i+1': i > 0 && covers.length <= 2,
          }">
          <img
            :src="srcFor(app)"
            @error="borked(app.uuid)"
            style="object-fit: cover; height: 100%" />
        </div>

        <!-- <div
          class="col-4 box"
          style="
            box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.86);
            background: url('https://steamcdn-a.akamaihd.net/steam/apps/1245620/library_600x900.jpg');
            background-position: center center;
            background-size: cover;
            outline: 1px solid #000000cc;
            outline-offset: -1px;
            border-radius: 3px;
          "></div>
        <div
          class="col-4 box"
          style="
            box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.86);
            background: url('https://steamcdn-a.akamaihd.net/steam/apps/1880330/library_600x900.jpg');
            background-position: center center;
            background-size: cover;
            outline: 1px solid #000000cc;
            outline-offset: -1px;
            border-radius: 3px;
          "></div> -->
        <!-- <div class="col-12" v-if="games && games[0]">
        <game-asset
          ref="one"
          :app="games[0].uuid"
          asset="banner"
          fallback="cover"
          :priority="['steam', 'igdb']"></game-asset>
      </div> -->
      </div>
    </div>

    <!--
      *+---------------------------------
      *| Fanned layout
      *+--------------------------------- -->
    <div v-if="layout == 'fanned'" class="fanned-stack" style="--count: 5">
      <div
        v-for="(app, i) in covers"
        :key="'fan' + app.uuid"
        class="fan-card"
        :style="{ '--i': i }">
        <img
          :src="srcFor(app)"
          @error="borked(app.uuid)"
          style="object-fit: cover; height: 100%"
          class="game-img" />
      </div>
    </div>

    <!--
      *+---------------------------------
      *| Marquee layout
      *| Infinite scrolling carousel
      *+--------------------------------- -->
    <div class="card" v-if="layout == 'marquee'">
      <div class="card-body p-0 position-relative" style="height: 300px">
        <common-backgrquee
          :images="[
            'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/440/library_600x900.jpg',
            'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/library_600x900.jpg',
            'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900.jpg',
            'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/304930/library_600x900.jpg',
            'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/359550/library_600x900.jpg',
            'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/578080/library_600x900.jpg',
            'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/381210/library_600x900.jpg',
            'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/413150/library_600x900.jpg',
            'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/487430/library_600x900.jpg',
            'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/582010/library_600x900.jpg',
            'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/945360/library_600x900.jpg',
            'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1085660/library_600x900.jpg',
          ]"
          :columns="3"
          :gap="5"
          :rotation="33"
          :speed="80"
          :scale="1.5"
          :image-height="150" />

        <div
          class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style="background: rgba(0, 0, 0, 0.4)">
          <h3 class="fw-bold">Widget</h3>
        </div>
      </div>
    </div>

    <!--
      *+---------------------------------
      *| Old split layouts
      *+--------------------------------- -->
    <div v-if="false" style="width: 75%; margin: auto; aspect-ratio: 3/2" class="mb-3">
      <div class="row m-0 w-100 h-100">
        <div
          class="col-4 box"
          style="
            box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.86);
            background: url('https://steamcdn-a.akamaihd.net/steam/apps/440/library_600x900.jpg');
            background-position: center right;
            background-size: cover;
            outline: 1px solid #000000cc;
            outline-offset: -1px;
          "></div>
        <div
          class="col-2 box"
          style="
            box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.86);
            background: url('https://images.igdb.com/igdb/image/upload/t_cover_big/co65za.jpg');
            background-position: right;
            background-size: cover;
            outline: 1px solid #000000cc;
            outline-offset: -1px;
          "></div>
        <div
          class="col-2 box"
          style="
            box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.86);
            background: url('https://steamcdn-a.akamaihd.net/steam/apps/1282100/library_600x900.jpg');
            background-position: center right;
            background-size: cover;
            outline: 1px solid #000000cc;
            outline-offset: -1px;
          "></div>
        <div
          class="col-2 box"
          style="
            box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.86);
            background: url('https://steamcdn-a.akamaihd.net/steam/apps/1245620/library_600x900.jpg');
            background-position: center right;
            background-size: cover;
            outline: 1px solid #000000cc;
            outline-offset: -1px;
          "></div>
        <div
          class="col-2 box"
          style="
            box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.86);
            background: url('https://steamcdn-a.akamaihd.net/steam/apps/1880330/library_600x900.jpg');
            background-position: center right;
            background-size: cover;
            outline: 1px solid #000000cc;
            outline-offset: -1px;
          "></div>
      </div>
    </div>

    <div v-if="false" style="width: 75%; margin: auto; aspect-ratio: 3/2" class="mb-3">
      <div class="row m-0 w-100 h-100">
        <div
          class="col-4 box"
          style="
            box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.86);
            background: url('https://images.igdb.com/igdb/image/upload/t_cover_big/co65za.jpg');
            background-position: center center;
            background-size: cover;
            outline: 1px solid #000000cc;
            outline-offset: -1px;
            border-radius: 3px;
          "></div>

        <div
          class="col-4 box"
          style="
            box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.86);
            background: url('https://steamcdn-a.akamaihd.net/steam/apps/1245620/library_600x900.jpg');
            background-position: center center;
            background-size: cover;
            outline: 1px solid #000000cc;
            outline-offset: -1px;
            border-radius: 3px;
          "></div>
        <div
          class="col-4 box"
          style="
            box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.86);
            background: url('https://steamcdn-a.akamaihd.net/steam/apps/1880330/library_600x900.jpg');
            background-position: center center;
            background-size: cover;
            outline: 1px solid #000000cc;
            outline-offset: -1px;
            border-radius: 3px;
          "></div>
      </div>
    </div>

    <div v-if="false" style="width: 75%; margin: auto; aspect-ratio: 1/1" class="mb-3">
      <div class="row m-0 w-100 h-100">
        <div
          class="box col-6"
          style="
            border: 1px solid black;
            outline: 1px solid rgba(255, 255, 255, 0.15);
            outline-offset: -2px;
            box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.36);
            background: url('https://images.igdb.com/igdb/image/upload/t_cover_big/co65za.jpg');
            background-position: center top;
            background-size: cover;
          ">
          <!-- <img
                  src="https://steamcdn-a.akamaihd.net/steam/apps/72850/library_600x900.jpg"
                  style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 100%;
                    height: 100%;
                    transform: translate(-50%, -50%);
                    object-fit: cover;
                  " /> -->
        </div>
        <div
          class="box col-6"
          style="
            border: 1px solid black;
            outline: 1px solid rgba(255, 255, 255, 0.15);
            outline-offset: -2px;
            box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.36);
            background: url('https://steamcdn-a.akamaihd.net/steam/apps/1282100/library_600x900.jpg');
            background-position: center top;
            background-size: cover;
          ">
          <!-- <img
                  src="https://steamcdn-a.akamaihd.net/steam/apps/1282100/library_600x900.jpg"
                  style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 100%;
                    height: 100%;
                    transform: translate(-50%, -50%);
                    object-fit: cover;
                  " /> -->
        </div>
        <div
          class="box col-6"
          style="
            border: 1px solid black;
            outline: 1px solid rgba(255, 255, 255, 0.15);
            outline-offset: -2px;
            box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.36);
            background: url('https://steamcdn-a.akamaihd.net/steam/apps/2358720/library_600x900.jpg');
            background-position: center top;
            background-size: cover;
            border-radius: 0 0 0 5px;
          ">
          <!-- <img
                  src="https://steamcdn-a.akamaihd.net/steam/apps/2358720/library_600x900.jpg"
                  style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 100%;
                    height: 100%;
                    transform: translate(-50%, -50%);
                    object-fit: cover;
                  " /> -->
        </div>
        <div
          class="box col-6"
          style="
            border: 1px solid black;
            outline: 1px solid rgba(255, 255, 255, 0.15);
            outline-offset: -2px;
            box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.36);
            background-image: url('https://steamcdn-a.akamaihd.net/steam/apps/1627570/library_600x900.jpg');
            background-position: center top;
            background-size: cover;
          ">
          <!-- <img
                  src="https://steamcdn-a.akamaihd.net/steam/apps/1627570/library_600x900.jpg"
                  style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 100%;
                    height: 100%;
                    transform: translate(-50%, -50%);
                    object-fit: cover;
                  " /> -->
        </div>
      </div>
    </div>

    <div v-if="false" style="width: 75%; margin: auto; aspect-ratio: 1/1" class="mb-3">
      <div class="row m-0 w-100 h-100">
        <div
          class="box col-6"
          style="
            border: 1px solid black;
            outline: 1px solid rgba(255, 255, 255, 0.15);
            outline-offset: -2px;
            box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.36);
            background: url('https://images.igdb.com/igdb/image/upload/t_cover_big/co65za.jpg');
            background-position: center top;
            background-size: cover;
          ">
          <!-- <img
                  src="https://steamcdn-a.akamaihd.net/steam/apps/72850/library_600x900.jpg"
                  style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 100%;
                    height: 100%;
                    transform: translate(-50%, -50%);
                    object-fit: cover;
                  " /> -->
        </div>
        <div
          class="box col-6"
          style="
            border: 1px solid black;
            outline: 1px solid rgba(255, 255, 255, 0.15);
            outline-offset: -2px;
            box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.36);
            background: url('https://steamcdn-a.akamaihd.net/steam/apps/1282100/library_600x900.jpg');
            background-position: center top;
            background-size: cover;
          ">
          <!-- <img
                  src="https://steamcdn-a.akamaihd.net/steam/apps/1282100/library_600x900.jpg"
                  style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 100%;
                    height: 100%;
                    transform: translate(-50%, -50%);
                    object-fit: cover;
                  " /> -->
        </div>
        <div
          class="box col-6"
          style="
            border: 1px solid black;
            outline: 1px solid rgba(255, 255, 255, 0.15);
            outline-offset: -2px;
            box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.36);
            background: url('https://steamcdn-a.akamaihd.net/steam/apps/2358720/library_600x900.jpg');
            background-position: center top;
            background-size: cover;
            border-radius: 0 0 0 5px;
          ">
          <!-- <img
                  src="https://steamcdn-a.akamaihd.net/steam/apps/2358720/library_600x900.jpg"
                  style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 100%;
                    height: 100%;
                    transform: translate(-50%, -50%);
                    object-fit: cover;
                  " /> -->
        </div>
        <div class="col-6 row p-0 m-0" style="">
          <div
            class="col-6"
            style="
              border: 1px solid black;
              outline: 1px solid rgba(255, 255, 255, 0.15);
              outline-offset: -2px;
              box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.36);
              background-image: url('https://steamcdn-a.akamaihd.net/steam/apps/440/library_600x900.jpg');
              background-position: center top;
              background-size: cover;
            "></div>
          <div
            class="col-6"
            style="
              border: 1px solid black;
              outline: 1px solid rgba(255, 255, 255, 0.15);
              outline-offset: -2px;
              box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.36);
              background-image: url('https://steamcdn-a.akamaihd.net/steam/apps/240/library_600x900.jpg');
              background-position: center top;
              background-size: cover;
            "></div>
          <div
            class="col-6"
            style="
              border: 1px solid black;
              outline: 1px solid rgba(255, 255, 255, 0.15);
              outline-offset: -2px;
              box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.36);
              background-image: url('https://steamcdn-a.akamaihd.net/steam/apps/2322010/library_600x900.jpg');
              background-position: center top;
              background-size: cover;
            "></div>
          <div
            class="col-6"
            style="
              border: 1px solid black;
              outline: 1px solid rgba(255, 255, 255, 0.15);
              outline-offset: -2px;
              box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.36);
              background-image: url('https://steamcdn-a.akamaihd.net/steam/apps/2344520/library_600x900.jpg');
              background-position: center top;
              background-size: cover;
            "></div>
          <!-- <img
                  src="https://steamcdn-a.akamaihd.net/steam/apps/1627570/library_600x900.jpg"
                  style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 100%;
                    height: 100%;
                    transform: translate(-50%, -50%);
                    object-fit: cover;
                  " /> -->
        </div>
      </div>
    </div>

    <!--
      *+---------------------------------
      *| Side-by-side layout
      *+--------------------------------- -->
    <div v-if="layout == 'shelf'">
      <div
        v-for="(app, i) in covers"
        :key="'boxed' + app.uuid"
        class="col box p-0"
        :class="{
          'col i-0': i == 0 && covers.length <= 3,
          'col-4': i == 0 && covers.length >= 3,
          'col i+1': i > 0 && covers.length <= 2,
        }">
        <img :src="srcFor(app)" @error="borked(app.uuid)" style="object-fit: cover; height: 100%" />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \components\list\Cover.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 15th October 2024
 * Modified: 17th February 2026 - 16:40:33
 **/

export default {
  name: 'ListCover',

  props: {
    list: {
      type: Object,
      default: () => ({}),
    },

    useLayout: {
      type: String,
      default: null,
    },
  },

  data: () => ({
    srcList: [],
    hydrated: {},
    blacklist: [],

    asset: {
      steam: 'https://steamcdn-a.akamaihd.net/steam/apps/%ID%/library_600x900.jpg',
      igdb: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co65za.jpg',
    },

    ui: {
      show: false,
      loading: false,
      isValid: false,
    },
  }),

  computed: {
    games() {
      return this.list?.games || []
    },

    //+-------------------------------------------------
    // layout()
    // Returns a layout type based on number of games
    // -----
    // Created on Tue Dec 30 2025
    //+-------------------------------------------------
    layout() {
      if (!this.list?.games?.length) return null

      if (this.useLayout) return this.useLayout
      if (this.list.games.length <= 5) return 'flex'
      if (this.list.games.length > 5) return 'flex'

      return null
    },

    covers() {
      let games = this.games || this.list?.games || []
      return games.filter((app) => !this.blacklist.includes(app.uuid)).slice(0, 5)
    },
  },
  methods: {
    srcFor(app) {
      if (!app?.uuid) return

      if (app.steam_id || this.hydrated[app.uuid]?.steam_id) {
        let image = this.asset.steam.replace('%ID%', app.steam_id)
        return image
      }

      if (app.igdb_id || this.hydrated[app.uuid]?.igdb_id) {
        let image = this.asset.igdb.replace('%ID%', app.igdb_id)
        return image
      }

      this.blacklist.push(app.uuid)

      return null
    },

    //+-------------------------------------------------
    // borked()
    // This image could not be loaded, so we blacklist it
    // -----
    // Created on Fri Oct 25 2024
    //+-------------------------------------------------
    borked(app) {
      console.warn('an image from the list is borked', app)
      if (!app) return
      this.blacklist.push(app)
    },
  },
}
</script>

<style>
.cover-container {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid #000000cc;
}

.box {
  /* background: linear-gradient(
    240deg,
    #f9d423,
    #ff4e50,
    #9d50bb,
    #6e48aa,
    #b3ffab,
    #12fff7
  );
  background-size: 1200% 1200%;
  -webkit-animation: animateBg 10s ease infinite;
  animation: animateBg 10s ease infinite; */

  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.86);
  background-position: center center;
  background-size: cover;
  /* outline: 1px solid #000000cc;
  outline-offset: -1px; */
  /* border-radius: 3px; */

  position: relative;
}

.box:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: inherit;
  z-index: -1;
  filter: blur(15px);
}

.layout-flex .box:first-child {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border-right: 1px solid #000000cc;
}

.layout-flex .box:not(:first-child) {
  /* border-top: 1px solid #000000cc; */
  /* border-bottom: 1px solid #000000cc; */
}

.layout-flex .box:last-child {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border: none;
}

/* ==========================================================================
  1. THE FANNED STACK (CSS Variables Method)
  Usage in Vue:
  <div class="fanned-stack" :style="{ '--count': images.length }">
    <div v-for="(img, index) in images" class="fan-card" :style="{ '--i': index }">...</div>
  </div>
  ========================================================================== */
.fanned-stack {
  position: relative;
  width: 160px; /* Base width */
  height: 220px; /* Base height */
  margin: 0 auto;
  /* Center the stack content */
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
}

.fan-card {
  position: absolute;
  width: 140px;
  height: 200px;
  background-color: #1e1e1e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform-origin: bottom center;

  /* CSS MATH MAGIC */
  /* We calculate deviation from the center based on index (--i) and total count (--count) */
  /* Vue passes these variables in via :style */
  --center: calc((var(--count) - 1) / 2);
  --offset: calc(var(--i) - var(--center));

  /* Default State: Compact stack */
  transform: translateX(calc(var(--offset) * 10px)) rotate(calc(var(--offset) * 5deg));

  z-index: calc(10 - var(--i)); /* Ensure first items are on top */
}

/* HOVER EFFECT: Only triggers when hovering the STACK ITSELF */
.fanned-stack:hover .fan-card {
  /* Spread State: Wider X and larger Rotation */
  transform: translateX(calc(var(--offset) * 45px)) rotate(calc(var(--offset) * 15deg))
    translateY(calc(Math.abs(var(--offset)) * -5px)); /* Optional arch */
}
</style>
