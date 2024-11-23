<template>
  <div class="page-body">
    <div class="container-xl">
      <div class="row justify-content-center">
        <div class="col-12">
          <div class="d-flex align-items-center mb-4">
            <h1 class="h1 mb-0">Site Map</h1>
          </div>

          <div class="row g-4">
            <!-- Static Links Column -->
            <div class="col-12 col-md-4">
              <h2 class="mb-2">Website pages</h2>
              <div class="card me-4">
                <div class="list-group card-list-group">
                  <a
                    v-for="link in staticLinks"
                    :key="link.path"
                    :href="link.path"
                    class="list-group-item px-3">
                    <div class="row g-2 align-items-center">
                      <div class="col">
                        {{ link.name }}
                        <div class="v-list-item-subtitle">
                          <small class="text-muted">
                            https://backlog.rip{{ link.path }}
                          </small>
                        </div>
                      </div>
                      <div class="col-auto text-secondary">
                        <Icon size="12">CaretRightFilled</Icon>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <!-- Genres Column -->
            <div class="col-12 col-md-4">
              <h2 class="mb-2">Genres</h2>
              <ul class="list-unstyled">
                <li v-for="genre in genres" :key="genre.id" class="game-item mb-2">
                  <a :href="genre.path" class="sitemap-link">
                    {{ genre.name }}
                    <small class="d-block text-muted">
                      https://backlog.rip{{ genre.path }}
                    </small>
                  </a>
                </li>
              </ul>
            </div>

            <!-- First Games Column -->
            <div class="col-12 col-md-4">
              <h2 class="mb-2">Games</h2>
              <ul class="list-unstyled">
                <li v-for="game in firstGames" :key="game.url" class="game-item mb-2">
                  <a :href="game.url" class="sitemap-link">
                    {{ game.name }}
                    <small class="d-block text-muted">
                      https://backlog.rip{{ game.url }}
                    </small>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <!-- Remaining Games Grid -->
          <div v-if="remainingGames.length" class="mt-5">
            <h2 class="mb-2">More Games</h2>
            <div class="games-grid">
              <div v-for="game in remainingGames" :key="game.url" class="game-item">
                <a :href="game.url" class="sitemap-link">
                  {{ game.name }}
                  <small class="d-block text-muted">
                    https://backlog.rip{{ game.url }}
                  </small>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { markRaw, shallowRef, onMounted, computed } from 'vue'

const { data } = await useAsyncData(
  'sitemap',
  () => $fetch('https://api.backlog.rip/sitemap.json'),
  {
    server: true,
    lazy: false,
    immediate: true,
  }
)

const staticLinks = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/games', name: 'Games' },
  { path: '/genres', name: 'Genres' },
  { path: '/sitemap', name: 'Sitemap' },
]

// Non-reactive lists
const games = shallowRef([])
const genres = shallowRef([])
const firstGames = computed(() => {
  if (!games.value.length || !genres.value.length) return []
  return games.value.slice(0, genres.value.length)
})
const remainingGames = computed(() => {
  if (!games.value.length || !genres.value.length) return []
  return games.value.slice(genres.value.length)
})

onMounted(() => {
  if (data.value?.games) {
    games.value = markRaw(
      data.value.games
        .filter(
          (game) => game.url && game.url !== '/game/' && game.url !== '/game' && game.name
        )
        .map((game) => ({
          url: game.url,
          name: game.name,
        }))
    )
  }

  if (data.value?.genres) {
    genres.value = markRaw(
      data.value.genres.map((genre) => ({
        path: genre.url,
        name: genre.name,
        id: genre.id,
      }))
    )
  }
})
</script>

<style scoped>
.page-body {
  padding: 2rem 0;
}

.list-group-item {
  text-decoration: none;
  color: inherit;
  padding-top: 0.8rem !important;
  padding-bottom: 0.8rem !important;
}

.list-group-item:hover {
  background-color: rgba(var(--tblr-primary-rgb), 0.04);
}

.sitemap-link {
  display: block;
  /* padding: 0.8rem 0; */
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: inherit;
}

.sitemap-link:hover {
  color: var(--tblr-primary);
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.game-item {
  border: 1px solid var(--tblr-border-color);
  border-radius: var(--tblr-border-radius);
  /* padding: 0.5rem 1rem; */
}

.game-item:hover {
  background-color: rgba(var(--tblr-primary-rgb), 0.04);
}
</style>
