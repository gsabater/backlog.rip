<template>
  <div class="page-body">
    <div class="container-xl">
      <!--
        *+---------------------------------
        *| Main Hero
        *+--------------------------------- -->
      <div class="row align-items-center min-vh-75 mb-3 mb-md-5 pb-3 pb-md-5">
        <div class="col-lg-5 offset-lg-1 d-none d-lg-block">
          <div class="text-center">
            <img
              src="/img/transhumans/new-beginnings.png"
              class="img-fluid"
              style="
                max-height: 400px;
                object-fit: cover;
                filter: drop-shadow(1px 1px 0px currentcolor);
                color: #00fdcf;
              " />

            <small class="text-muted d-block mt-1">
              Illustration from
              <strong>Transhumans</strong>
              by Pablo Stanley
            </small>
          </div>
        </div>
        <div class="col-12 col-lg-5">
          <div class="pe-lg-4 px-3 px-lg-0">
            <h1
              class="display-5 display-6-sm fw-bold mb-4 w-100 text-center text-lg-start"
              style="filter: drop-shadow(2px 2px 0px #000)">
              Backlog.rip
              <!-- <small>{{ $app.v }}</small> -->
              <span class="fancy">Changelog</span>
            </h1>

            <p class="lead mb-3 text-center text-lg-start">
              Stay updated with the latest features, improvements, and bug fixes in our
              product. Explore our changelog to see how we are evolving and enhancing your
              experience.
            </p>
            <p class="lead mb-4 text-center text-lg-start">
              <strong>Join our community on Discord</strong>
              to discuss updates, share feedback, and connect with other users. We value
              your input and are excited to hear from you!
            </p>
            <p class="text-muted text-center text-lg-start" style="font-size: 0.75rem">
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

              <span class="px-2 px-md-3">·</span>
              <NuxtLink to="/support" class="link-secondary link-underline-opacity-0">
                Become a
                <span class="fancy">Supporter</span>
              </NuxtLink>
              <span class="px-2 px-md-3">·</span>

              <span class="d-inline mt-2 mt-sm-0">
                <span class="d-none d-md-inline-block">Join us at</span>

                <a
                  v-tippy="'Join us at Discord'"
                  href="https://discord.gg/F2sPE5B"
                  class="link-secondary link-underline-opacity-0 ms-1 ms-sm-2 mx-1"
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
                  class="link-secondary link-underline-opacity-0 mx-1"
                  target="_blank">
                  <Icon size="16" style="transform: translateY(-1px)">
                    BrandPatreonFilled
                  </Icon>
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>

      <!--
        *+---------------------------------
        *| Latest Release Section
        *+--------------------------------- -->
      <div class="row justify-content-center py-3 py-md-5">
        <div class="col-12 px-3 px-md-0">
          <!-- Latest Release using the ChangelogEntry component -->
          <DocsChangelogEntry v-if="latest" :post="latest" />
        </div>
      </div>

      <pre class="d-block" v-if="false">
        {{ latest ? latest : 'Loading latest release...' }}
      </pre>

      <!--
        *+---------------------------------
        *| Changelog History Section
        *+--------------------------------- -->
      <div class="row mt-3 mt-md-5 pt-2 pt-md-4">
        <div class="col-12 text-center mb-3 mb-md-5 px-3">
          <h2 class="display-6 mb-1" style="text-shadow: 2px 2px 0px #000">
            Previous Releases
          </h2>

          <p class="text-muted">A history of all our updates and improvements</p>
        </div>

        <div class="col-12 col-md-10 col-lg-8 mx-auto px-3 px-md-0">
          <div class="card" v-if="changelog && changelog.length > 0">
            <div class="list-group list-group-hoverable card-list-group">
              <template v-for="(item, index) in changelog" :key="item.path">
                <NuxtLink
                  :to="`/docs${item.path}`"
                  class="list-group-item px-2 px-md-3 cursor-pointer text-decoration-none"
                  style="padding-top: 0.8rem; padding-bottom: 0.8rem; color: inherit">
                  <div class="row g-2 g-md-3 align-items-center">
                    <div class="col-auto text-secondary">
                      <!-- <Icon class="mx-2">ActivityHeartbeat</Icon> -->
                      <span class="badge me-1 me-md-2">{{ item.version }}</span>
                    </div>
                    <div class="col">
                      <span class="font-serif">
                        {{ item.title }}
                      </span>
                      <div class="v-list-item-subtitle">
                        <small class="text-muted">
                          {{ $moment(item.date).format('LL') }}
                          <!-- , {{ dates.timeAgo(item.date) }} -->
                        </small>
                      </div>
                    </div>

                    <div class="col-auto text-secondary d-flex">
                      <v-btn
                        @click.stop="goToList(item, 'edit')"
                        icon
                        variant="text"
                        size="x-small">
                        <Icon width="1.2" size="12" class="mx-1">CaretRightFilled</Icon>
                      </v-btn>
                    </div>
                  </div>
                </NuxtLink>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * @file:    \pages\changelog.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 5th January 2024
 * Modified: 28th June 2025 - 04:18:42
 **/

const { data: changelog } = await useAsyncData('changelog', () => {
  return queryCollection('changelog').order('date', 'DESC').all()
})

// console.log('Posts:', changelog.value.length, changelog.value)

const latest = computed(() =>
  changelog.value && changelog.value.length > 0 ? changelog.value[0] : null
)
</script>
