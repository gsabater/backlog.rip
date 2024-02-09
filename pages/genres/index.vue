<template>
  <div class="page-body">
    <div class="container-xl">
      <div class="row justify-content-center">
        <div class="col-12 col-md-6">
          <h1>Video game genres</h1>
          <div style="display: flex; justify-content: space-evenly">
            <span>#</span>
            <a
              v-for="(letter, i) in alphabet"
              :key="i"
              :href="'#' + letter"
              class="font-serif text-light cursor-pointer">
              {{ letter }}
            </a>
          </div>

          <div v-if="false" class="card">
            <div class="table-responsive">
              <table class="table table-vcenter table-bordered table-nowrap card-table">
                <thead>
                  <tr>
                    <td class="w-50">
                      <h2>Pricing plans for teams of all sizes</h2>
                      <div class="text-secondary text-wrap">
                        Choose an affordable plan that comes with the best features to
                        engage your audience, create customer loyalty and increase sales.
                      </div>
                    </td>
                    <td class="text-center">
                      <div class="text-uppercase text-secondary font-weight-medium">
                        Starter
                      </div>
                      <div class="display-6 fw-bold my-3">$0</div>
                      <a href="#" class="btn w-100">Choose plan</a>
                    </td>
                    <td class="text-center">
                      <div class="text-uppercase text-secondary font-weight-medium">
                        Professional
                      </div>
                      <div class="display-6 fw-bold my-3">$9</div>
                      <a href="#" class="btn btn-green w-100">Choose plan</a>
                    </td>
                    <td class="text-center">
                      <div class="text-uppercase text-secondary font-weight-medium">
                        Business
                      </div>
                      <div class="display-6 fw-bold my-3">$16</div>
                      <a href="#" class="btn w-100">Choose plan</a>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr class="bg-light">
                    <th colspan="4" class="subheader">Features</th>
                  </tr>
                  <tr>
                    <td>Some info about feature</td>
                    <td class="text-center">
                      <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon text-green"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M5 12l5 5l10 -10"></path>
                      </svg>
                    </td>
                    <td class="text-center">
                      <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon text-green"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M5 12l5 5l10 -10"></path>
                      </svg>
                    </td>
                    <td class="text-center">
                      <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon text-green"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M5 12l5 5l10 -10"></path>
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td>Online payment gateway</td>
                    <td class="text-center">
                      <!-- Download SVG icon from http://tabler-icons.io/i/x -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon text-red"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M18 6l-12 12"></path>
                        <path d="M6 6l12 12"></path>
                      </svg>
                    </td>
                    <td class="text-center">
                      <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon text-green"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M5 12l5 5l10 -10"></path>
                      </svg>
                    </td>
                    <td class="text-center">
                      <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon text-green"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M5 12l5 5l10 -10"></path>
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td>Unlimited products can be sold</td>
                    <td class="text-center">
                      <!-- Download SVG icon from http://tabler-icons.io/i/x -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon text-red"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M18 6l-12 12"></path>
                        <path d="M6 6l12 12"></path>
                      </svg>
                    </td>
                    <td class="text-center">
                      <!-- Download SVG icon from http://tabler-icons.io/i/x -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon text-red"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M18 6l-12 12"></path>
                        <path d="M6 6l12 12"></path>
                      </svg>
                    </td>
                    <td class="text-center">
                      <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon text-green"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M5 12l5 5l10 -10"></path>
                      </svg>
                    </td>
                  </tr>
                  <tr class="bg-light">
                    <th colspan="4" class="subheader">Reporting</th>
                  </tr>
                  <tr>
                    <td>Free hosting and domain name</td>
                    <td class="text-center">
                      <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon text-green"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M5 12l5 5l10 -10"></path>
                      </svg>
                    </td>
                    <td class="text-center">
                      <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon text-green"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M5 12l5 5l10 -10"></path>
                      </svg>
                    </td>
                    <td class="text-center">
                      <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon text-green"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M5 12l5 5l10 -10"></path>
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td>Admin dashboard to control items</td>
                    <td class="text-center">
                      <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon text-green"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M5 12l5 5l10 -10"></path>
                      </svg>
                    </td>
                    <td class="text-center">
                      <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon text-green"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M5 12l5 5l10 -10"></path>
                      </svg>
                    </td>
                    <td class="text-center">
                      <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon text-green"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M5 12l5 5l10 -10"></path>
                      </svg>
                    </td>
                  </tr>
                  <tr class="bg-light">
                    <th colspan="4" class="subheader">Support</th>
                  </tr>
                  <tr>
                    <td>Email marketing and service</td>
                    <td class="text-center">
                      <!-- Download SVG icon from http://tabler-icons.io/i/x -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon text-red"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M18 6l-12 12"></path>
                        <path d="M6 6l12 12"></path>
                      </svg>
                    </td>
                    <td class="text-center">
                      <!-- Download SVG icon from http://tabler-icons.io/i/x -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon text-red"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M18 6l-12 12"></path>
                        <path d="M6 6l12 12"></path>
                      </svg>
                    </td>
                    <td class="text-center">
                      <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon text-green"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M5 12l5 5l10 -10"></path>
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td>24/7 customer support online</td>
                    <td class="text-center">
                      <!-- Download SVG icon from http://tabler-icons.io/i/x -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon text-red"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M18 6l-12 12"></path>
                        <path d="M6 6l12 12"></path>
                      </svg>
                    </td>
                    <td class="text-center">
                      <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon text-green"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M5 12l5 5l10 -10"></path>
                      </svg>
                    </td>
                    <td class="text-center">
                      <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon text-green"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M5 12l5 5l10 -10"></path>
                      </svg>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td></td>
                    <td>
                      <a href="#" class="btn w-100">Choose plan</a>
                    </td>
                    <td>
                      <a href="#" class="btn btn-green w-100">Choose plan</a>
                    </td>
                    <td>
                      <a href="#" class="btn w-100">Choose plan</a>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <template v-for="(letter, i) in alphabet" :key="i">
            <h2 v-if="_genresStartsWith(letter).length > 0" :id="letter" class="mb-2">
              {{ letter }}
            </h2>
            <div
              v-if="genres.length > 0 && _genresStartsWith(letter).length > 0"
              class="card mb-3">
              <div class="list-group card-list-group">
                <template v-for="(genre, ii) in _genresStartsWith(letter)" :key="ii">
                  <NuxtLink
                    :to="'/games/' + genre.slug"
                    class="list-group-item py-2 px-3 cursor-pointer">
                    <div class="row g-2 align-items-center">
                      <div class="col">
                        {{ genre.name }}
                        <!-- <div class="text-secondary">GOLEC UORKIESTRA, Gromee, Bedoes</div> -->
                      </div>
                      <div class="col-auto text-secondary"><b-btn>View games</b-btn></div>
                    </div>
                  </NuxtLink>
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRepositoryStore } from '../../stores/RepositoryStore'

/**
 * @file:    \pages\genres\index.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 15th January 2024
 * Modified: Sun Feb 04 2024
 **/

export default {
  name: 'Genres',
  data() {
    return {
      alphabet: 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split(''),

      db: {
        apps: {},
        data: [],
        states: [],
      },
    }
  },

  computed: {
    ...mapStores(useRepositoryStore, useJournalStore),
    ...mapState(useRepositoryStore, ['genres']),
  },

  methods: {
    _genresStartsWith(letter) {
      if (this.genres.length == 0) return []

      return this.genres.filter((genre) => genre.name?.toUpperCase().startsWith(letter))
    },

    getData() {
      this.repositoryStore.getGenres()
    },

    async init() {
      this.getData()
    },
  },

  mounted() {
    this.init()
  },
}
</script>
