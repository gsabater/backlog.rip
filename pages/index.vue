<template>
  <section class="home-hero py-4">
    <div class="container-xl">
      <div class="row align-items-center">
        <div class="col-6 text-center px-4">
          <h1 class="hero-title">Backlog.rip</h1>

          <p class="hero-description">
            Free and open source library manager for all your games.
            <br />
            All data is saved locally in your browser, without any cookies or trackers.

            <span style="display: block; margin: 15px">
              Organize your library and games with ease.
            </span>
          </p>

          <div class="my-5">
            <div class="row g-3 justify-center">
              <div class="col-auto">&nbsp;</div>
              <div class="col-auto">
                <b-btn to="import/steam" color="purple" size="sm">
                  Import your library
                </b-btn>
              </div>

              <div class="col-auto">
                <b-btn to="games" variant="ghost" size="sm" color="secondary">
                  Browse games
                </b-btn>
              </div>
            </div>

            <p class="text-muted my-4" style="font-size: 0.75rem">
              <NuxtLink to="/changelog" class="link-secondary link-underline-opacity-0">
                Version
                <!-- <Icon size="16" width="1.8" style="transform: translateY(-1px)">Beta</Icon> -->
                {{ $app.v }}
              </NuxtLink>

              <span class="px-3">·</span>
              <a
                href="https://github.com/gsabater/backlog.rip"
                class="link-secondary link-underline-opacity-0"
                target="_blank">
                <Icon size="14" class="me-0" style="transform: translateY(-1px)">
                  BrandGithub
                </Icon>
                Source code on Github
              </a>

              <span class="px-3">·</span>

              <a
                href="https://discord.gg/F2sPE5B"
                class="link-secondary link-underline-opacity-0"
                target="_blank">
                <svg
                  class="me-1"
                  width="16"
                  height="16"
                  viewBox="0 -28.5 256 256"
                  version="1.1"
                  style="transform: translateY(-1px)"
                  preserveAspectRatio="xMidYMid">
                  <g>
                    <path
                      d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
                      fill="#5865F2"
                      fill-rule="nonzero"></path>
                  </g>
                </svg>
                Join at Discord
              </a>
            </p>
          </div>
        </div>
        <div class="col-6">
          <main>
            <div class="main-wcontent">
              <div class="scene">
                <div class="group">
                  <div class="xcard" v-for="item in randPosters">
                    <div
                      class="xcard__img"
                      :style="`
                        background-image: url(https://steamcdn-a.akamaihd.net/steam/apps/${item}/library_600x900.jpg);`"></div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </section>

  <section v-if="hot.length" class="py-5 py-md-6" style="background: rgba(0, 0, 0, 0.1)">
    <div class="container">
      <div class="row my-3 pb-2 align-items-center">
        <div class="col-12 text-center">
          <h2 class="display-6 font-weight-bold mb-1">🔥 So hot right now 🔥</h2>
          <p class="text-secondary mb-0">Popular games in the last couple of weeks</p>
        </div>
      </div>

      <gameList :apps="hot" cols="6" class="py-2 justify-content-center"></gameList>
    </div>
  </section>

  <footer class="pt-7 pb-9 md:pt-10 md:pb-13">
    <div class="container">
      <div class="my-5">
        <p class="text-muted my-4">
          <NuxtLink to="/changelog" class="link-secondary link-underline-opacity-0">
            Version
            <!-- <Icon size="16" width="1.8" style="transform: translateY(-1px)">Beta</Icon> -->
            {{ $app.v }}
          </NuxtLink>

          <span class="px-3">·</span>

          <a
            href="https://github.com/gsabater/backlog.rip"
            class="link-secondary link-underline-opacity-0"
            target="_blank">
            <Icon size="14" class="me-0" style="transform: translateY(-1px)">
              BrandGithub
            </Icon>
            Source code on Github
          </a>

          <span class="px-3">·</span>

          <a
            href="https://discord.gg/F2sPE5B"
            class="link-secondary link-underline-opacity-0"
            target="_blank">
            <svg
              class="me-1"
              width="16"
              height="16"
              viewBox="0 -28.5 256 256"
              version="1.1"
              style="transform: translateY(-1px)"
              preserveAspectRatio="xMidYMid">
              <g>
                <path
                  d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
                  fill="#5865F2"
                  fill-rule="nonzero"></path>
              </g>
            </svg>
            Participe in the development!
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
/**
 * @file:    \pages\index.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 6th March 2023
 * Modified: Sat May 04 2024
 **/

export default {
  data() {
    return {
      posters: [
        '400',
        '440',
        '22200',
        '24720',
        '72850',
        '379720',
        '1086940',
        '1205520',
        '1245620',
        '1282100',
        '1604030',
        '1880330',
        '2231450',
      ],
    }
  },

  computed: {
    ...mapStores(useDataStore, useRepositoryStore),
    ...mapState(useRepositoryStore, ['hot', 'genres', 'loaded']),

    //+-------------------------------------------------
    // function()
    // Timeline 1 - 9 ok
    // Timeline 2 - 9 ... (more radius)
    // -----
    // Created on Fri Apr 19 2024
    //+-------------------------------------------------

    randPosters() {
      return this.posters.sort(() => Math.random() - 0.5).slice(0, 8)
    },
  },

  watch: {
    '$app.ready': function () {
      this.init()
    },
  },

  methods: {
    async getGames() {
      if (this.loaded.includes(`top:popular`)) return
      // this.repositoryStore.topGames('popular')
    },

    async init() {
      if (!this.$app.ready) return

      this.getGames()
      this.$wow()
    },
  },
  mounted() {
    this.init()
  },
}
</script>

<style>
/* https://codepen.io/thebabydino/pen/abjpEbz */
svg[height='0'] {
  position: fixed;
}

header.herod {
  background: radial-gradient(circle, #191a22, rgb(46, 18, 94), #191a22);
  /* background: url(https://images.unsplash.com/photo-1633596683562-4a47eb4983c5?w=1400) 50% /    cover; */

  /* filter: url(#grainy); */
  border-bottom: 2px solid #191a22;
}

section.home-hero {
  position: relative;
  border-bottom: 2px solid #453331;
}

section.home-hero:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, #1d1630, transparent);
}

/* :root {
  font-size: 16px;
  --color-text: #111;
  --color-bg: #e3efed;
  --color-bg-alt: #8ca9af;
  --color-link: rgba(0, 0, 0, 0.6);
  --color-link-hover: #000;
  --page-padding: 1.5rem;
  --color-title: #000;
}

.demo-2 {
  --color-bg: #d8e5ec;
  --color-bg-alt: #7e8b92;
  --color-title: #223233;
}

.demo-3 {
  --color-bg: #ece6df;
  --color-bg-alt: #8b8078;
  --color-title: #191818;
} */

body {
  /* margin: 0;
  color: var(--color-text);
  background-color: var(--color-bg);
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    Segoe UI,
    Helvetica,
    Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  height: 100vh; */
  background-color: var(--color-bg);
  background: url(../img/noise.png),
    radial-gradient(circle, var(--color-bg) 0%, var(--color-bg-alt) 100%);
  background-size:
    150px,
    100% 100vh;
}

.unbutton {
  background: none;
  border: 0;
  padding: 0;
  margin: 0;
  font: inherit;
  cursor: pointer;
}

.unbutton:focus {
  outline: none;
}

.frame {
  padding: var(--page-padding);
  position: relative;
  text-transform: uppercase;
  font-size: 12px;
  display: grid;
  z-index: 1000;
  width: 100%;
  height: 100%;
  grid-row-gap: 1rem;
  grid-column-gap: 2rem;
  pointer-events: none;
  justify-items: start;
  grid-template-columns: auto auto;
  grid-template-areas: 'title' 'archive' 'back' 'github' 'demos' 'sponsor' 'tags';
}

.frame #cdawrap {
  justify-self: start;
}

.frame a {
  pointer-events: auto;
}

.frame__title {
  grid-area: title;
  font-size: inherit;
  margin: 0;
}

.frame__back {
  grid-area: back;
  justify-self: start;
}

.frame__archive {
  grid-area: archive;
  justify-self: start;
}

.frame__tags {
  grid-area: tags;
}

.frame__github {
  grid-area: github;
}

.frame__demos {
  grid-area: demos;
  display: flex;
  gap: 1rem;
}

main .main-wcontent {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  position: relative;
}

.scene {
  opacity: 0;
  perspective: 1000px;
  overflow-x: hidden;
  overflow-y: hidden;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
}

.xcard {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.xcard__img {
  width: 5em;
  border-radius: 5px;
  aspect-ratio: 2/3;
  background-position: center;
  background-size: cover;
}

.headings {
  text-align: center;
  position: relative;
  z-index: 10;
  color: var(--color-title);
  text-transform: uppercase;
}

.headings__main {
  line-height: 0.5;
  font-size: clamp(2.5rem, 1.59rem + 3.883vw, 6.25rem);
}

.headings_subtitle {
  line-height: 0.5;
  font-size: clamp(1rem, 0.757rem + 1.036vw, 2rem);
}

@media screen and (min-width: 53em) {
  .frame {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    grid-template-columns: auto auto auto 1fr;
    grid-template-rows: auto auto;
    align-content: space-between;
    grid-template-areas: 'title back archive github sponsor' 'tags tags tags demos demos';
  }
  .frame #cdawrap,
  .frame__demos {
    justify-self: end;
  }

  .xcard__img {
    width: 6em;
  }
}
</style>
