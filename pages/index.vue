<template>
  <section class="home-hero py-8">
    <div class="container-xl py-3">
      <div class="row align-items-center">
        <div class="col-12 text-center px-4" style="position: relative; z-index: 20">
          <h1 class="hero-title">Backlog.rip</h1>

          <p class="hero-description">
            A free and open source game library manager.
            <br />
            All your data stays local in your browser. No cookies, no trackers, just privacy.
            <span style="display: block; margin: 15px">
              Organize, track, and discover games with ease.
            </span>
          </p>

          <div class="my-5">
            <div class="row justify-center my-3">
              <div class="col-auto">&nbsp;</div>
              <div class="col-auto">
                <!-- <v-btn
                  to="import"
                  color="deep-purple-darken-4"
                  variant="flat"
                  style="
                    box-shadow: 0 0 1.5rem rgba(174, 62, 201, 0.1);
                    outline: 1px solid #06212e;
                  ">
                  Import your library
                </v-btn> -->
                <v-btn
                  to="games"
                  variant="tonal"
                  color="rgb(135 140 195)"
                  style="
                    filter: drop-shadow(0 0 1rem rgba(174, 62, 201, 0.2));
                    outline: 1px solid #9e58581c;
                    outline-offset: -1px;
                  ">
                  Browse games
                </v-btn>
              </div>

              <div class="col-auto">
                <v-btn to="import" color="secondary" variant="text">
                  Import your Steam library
                </v-btn>
              </div>
            </div>

            <p class="text-muted" style="font-size: 0.75rem">
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
                <b-logo
                  name="github"
                  size="13"
                  class="me-1"
                  color="#fff"
                  style="opacity: 0.6; transform: translateY(-1px)"></b-logo>
                Open source
              </a>

              <span class="px-3">·</span>
              <NuxtLink to="/support" class="link-secondary link-underline-opacity-0">
                Become a
                <span class="fancy">Supporter</span>
              </NuxtLink>
              <span class="px-3">·</span>

              Join us at

              <a
                v-tippy="'Join us at Discord'"
                href="https://discord.gg/F2sPE5B"
                class="link-secondary link-underline-opacity-0 ms-2"
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
              </a>

              <a
                v-tippy="'Support on Patreon'"
                href="https://www.patreon.com/c/BacklogRIP"
                class="link-secondary link-underline-opacity-0 mx-2"
                target="_blank">
                <Icon size="16" style="transform: translateY(-1px)">BrandPatreonFilled</Icon>
              </a>

              <a
                v-tippy="'Submit ideas and feedback on Featurebase'"
                href="https://backlog.featurebase.app"
                class="link-secondary link-underline-opacity-0 mx-1"
                target="_blank">
                <Icon size="16" style="transform: translateY(-1px)">Map</Icon>
              </a>
            </p>
          </div>
        </div>
        <div
          class="col-12"
          style="position: absolute; top: 0; right: 0; left: 0; pointer-events: none">
          <main>
            <div class="main-wcontent">
              <ClientOnly>
                <div
                  class="p-0 position-relative"
                  style="
                    width: 100%;
                    height: 100%;
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position-x: center;
                    -webkit-mask:
                      linear-gradient(180deg, black 58%, rgba(0, 0, 0, 0) 95%),
                      radial-gradient(
                        15.77% 44.22% at 50% 104.95%,
                        rgba(66, 66, 66, 0) 0%,
                        #333333 100%
                      ),
                      radial-gradient(
                        30.95% 86.8% at 30.69% 13.2%,
                        rgba(66, 66, 66, 0.33) 0%,
                        #333333 100%
                      ),
                      radial-gradient(
                        51.31% 143.89% at 49.99% 24.75%,
                        #000000 0%,
                        #000000 52.6%,
                        rgba(0, 0, 0, 0.18) 83.33%,
                        rgba(0, 0, 0, 0) 95.31%
                      ),
                      radial-gradient(
                        51.31% 143.89% at 49.99% 24.75%,
                        #000000 0%,
                        #000000 52.6%,
                        rgba(0, 0, 0, 0.18) 83.33%,
                        rgba(0, 0, 0, 0) 95.31%
                      ),
                      linear-gradient(180deg, #000000 90%, rgba(0, 0, 0, 0) 100%);
                    mask:
                      linear-gradient(180deg, black 58%, rgba(0, 0, 0, 0) 95%),
                      radial-gradient(
                        15.77% 44.22% at 50% 104.95%,
                        rgba(66, 66, 66, 0) 0%,
                        #333333 100%
                      ),
                      radial-gradient(
                        30.95% 86.8% at 30.69% 13.2%,
                        rgba(66, 66, 66, 0.33) 0%,
                        #333333 100%
                      ),
                      radial-gradient(
                        51.31% 143.89% at 49.99% 24.75%,
                        #000000 0%,
                        #000000 52.6%,
                        rgba(0, 0, 0, 0.18) 83.33%,
                        rgba(0, 0, 0, 0) 95.31%
                      ),
                      radial-gradient(
                        51.31% 143.89% at 49.99% 24.75%,
                        #000000 0%,
                        #000000 52.6%,
                        rgba(0, 0, 0, 0.18) 83.33%,
                        rgba(0, 0, 0, 0) 95.31%
                      ),
                      linear-gradient(180deg, #000000 90%, rgba(0, 0, 0, 0) 100%);
                    -webkit-mask-composite: source-in;
                    mask-composite: source-in;
                    transition:
                      background-image 0.1s ease-out,
                      filter 0.2s ease-out;
                    filter: brightness(0.6) grayscale(0.9) opacity(0.1);
                  ">
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
                    :columns="6"
                    :gap="10"
                    :rotation="33"
                    :speed="75"
                    :scale="1.5"
                    :image-height="190" />

                  <div
                    class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style="background: rgba(0, 0, 0, 0.4)">
                    <h3 class="fw-bold">Widget</h3>
                  </div>
                </div>
              </ClientOnly>
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

      <search-results
        ref="hotGames"
        :disabled="false"
        :source="hot"
        class="py-2 justify-content-center" />

      <!-- <search-results
          ref="gameAwardsNomineesGames"
          :source="gameAwardsNominees"
          :filters="{
            sortBy: 'rand',
            sortDir: 'asc',
          }"
          class="py-2 justify-content-center" /> -->
    </div>
  </section>

  <footer class="pt-7 pb-9 md:pt-10 md:pb-13">
    <div class="container">
      <div class="my-5">
        <p class="text-muted my-4">
          <NuxtLink to="/changelog" class="link-secondary link-underline-opacity-0">
            Version
            {{ $app.v }}
          </NuxtLink>

          <span class="px-3">·</span>

          <a
            href="https://github.com/gsabater/backlog.rip"
            class="link-secondary link-underline-opacity-0"
            target="_blank">
            <Icon size="14" class="me-0" style="transform: translateY(-1px)">BrandGithub</Icon>
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
            Participate in the development!
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
 * Modified: 23rd January 2026 - 16:52:41
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
  },

  watch: {
    '$app.ready': function () {
      this.init()
    },
  },

  methods: {
    async init() {
      // if (!this.$app.ready) return
      // this.$wow()
      // this.dataStore.process(this.gameAwardsNominees, 'list:batch')
    },
  },
  mounted() {
    // this.init()
  },
}
</script>

<style>
/* https://codepen.io/thebabydino/pen/abjpEbz */
svg[height='0'] {
  position: fixed;
}

section.home-hero {
  position: relative;
  border-bottom: 1px solid #453331;
}

section.home-hero:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, #1d1630, transparent);
}

main .main-wcontent {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  position: relative;
}
</style>
