<template>
  <div class="page-body">
    <div class="container-xl">
      <div class="row justify-content-center">
        <div class="col-12 col-md-6">
          <h1>Video game genres</h1>
          <div style="display: flex; justify-content: space-evenly">
            <span>#</span>
            <template v-for="(letter, i) in alphabet" :key="i">
              <a
                v-if="_genresStartsWith(letter).length > 0"
                class="font-serif text-light"
                :href="'#' + letter">
                {{ letter }}
              </a>

              <span v-else class="font-serif text-light text-muted">
                {{ letter }}
              </span>
            </template>
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
 * Modified: Mon Feb 12 2024
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
      // this.repositoryStore.getGenres()
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
