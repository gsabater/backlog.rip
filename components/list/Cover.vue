<template>
  <div v-if="games.length" class="cover-container">
    <!--
      *+---------------------------------
      *| Flex layout
      *| Up to five covers
      *+--------------------------------- -->
    <div v-if="layout == 'flex'" style="aspect-ratio: 3/2.2">
      <div
        class="row m-0 w-100 h-100 layout-flex"
        style="align-content: stretch; overflow: hidden">
        <div
          v-for="(app, i) in covers"
          :key="'boxed' + app.uuid"
          class="col box p-0"
          :class="{
            'col': i == 0 && covers.length <= 3,
            'col-4': i == 0 && covers.length >= 3,
            'col': i > 0 && covers.length <= 2,
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
  </div>
</template>

<script>
/**
 * @file:    \components\list\Cover.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 15th October 2024
 * Modified: Wed 06 November 2024 - 17:00:58
 **/

export default {
  name: 'ListCover',

  props: {
    games: {
      type: Array,
      default: () => [],
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
    ...mapStores(useDataStore),
    ...mapState(useListStore, ['list']),

    layout() {
      if (!this.list?.games?.length) return null
      if (this.list.games.length <= 5) return 'flex'
      if (this.list.games.length > 5) return 'flex'

      return null
    },

    covers() {
      return this.list.games
        .filter((app) => !this.blacklist.includes(app.uuid))
        .slice(0, 5)
    },

    // srcList() {
    //   console.warn('calc srcList')
    //   if (!this.games.length) return []
    //   if (!this.$refs.preload) re turn []
    //   return this.$refs.preload.map((app) => app.src)
    // },
  },

  // watch: {
  //   games: {
  //     handler() {
  //       this.findCovers()
  //     },
  //     deep: true,
  //   },
  // },

  // watch: {
  //   games: {
  //     handler() {
  //       this.hydrate()
  //       this.findCovers()
  //     },
  //     deep: true,
  //   },
  // },

  methods: {
    srcFor(app) {
      if (!app.uuid) return

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
    // hydrate()
    // Makes an array of hydrated data from this.games
    // And stores in this.hydrated with uuid as key
    // -----
    // Created on Fri Oct 25 2024
    //+-------------------------------------------------
    hydrate() {
      return
      let apps = []
      this.games.forEach((item) => {
        if (this.hydrated[item.uuid]) return

        let data = this.dataStore.get(item.uuid)
        if (data) this.hydrated[item.uuid] = { ...data }
      })

      console.warn(this.list, this.hydrated, this.games)
      debugger
      // this.$nextTick(() => this.findCovers())

      return apps
    },

    //+-------------------------------------------------
    // findCovers()
    // Iterates over each of the games in the list to
    // search the cover in the preload area
    // -----
    // Created on Wed Oct 23 2024
    //+-------------------------------------------------
    findCovers() {
      if (!this.games.length) return []

      let srcList = []
      let asset = {
        steam: 'https://steamcdn-a.akamaihd.net/steam/apps/%ID%/library_600x900.jpg',
        igdb: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co65za.jpg',
      }

      debugger

      this.games.forEach((app) => {
        // let src = this.$refs['preload-' + app.uuid][0].src
        // if (src) srcList.push(src)
      })

      this.list.cover = srcList.splice(0, 15)
    },

    //+-------------------------------------------------
    // borked()
    // This image could not be loaded, so we blacklist it
    // -----
    // Created on Fri Oct 25 2024
    //+-------------------------------------------------
    borked(app) {
      console.warn('borked', app)
      if (!app) return
      this.blacklist.push(app)
    },
  },

  // mounted() {
  //   this.$mitt.on('list:findCovers', () => {
  //     console.warn(this.$attrs)
  //     debugger
  //   })
  // },

  // beforeUnmount() {
  //   this.$mitt.off('list:findCovers')
  // },
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
  /* border: 1px solid #000000cc; */
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
</style>
