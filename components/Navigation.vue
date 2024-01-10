<template>
  <div class="navbar-expand-md">
    <div id="navbar-menu" class="collapse navbar-collapse" :class="{ show: showMobMenu }">
      <div class="navbar navbar-light">
        <div class="container-xl">
          <ul class="navbar-nav">
            <li
              v-if="false"
              v-tippy="{ content: 'Show Backlog menu', placement: 'bottom' }"
              class="nav-item cursor-pointer"
              @click="$app.toggleSidebar()">
              <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
                <Icon>LayoutSidebarInactive</Icon>
              </span>
            </li>
            <li v-if="false" style="border-right: 1px dashed #ccc; margin: 10px"></li>
            <li class="nav-item">
              <NuxtLink to="/games" class="nav-link">
                <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
                  <Icon>Cards</Icon>
                </span>
                <span class="nav-link-title">
                  Browse games
                  <!-- (drop> add a game, connect accounts) -->
                </span>
              </NuxtLink>
            </li>

            <li style="border-right: 1px dashed #ccc; margin: 10px"></li>

            <li class="nav-item">
              <NuxtLink to="/dashboard" class="nav-link">
                <span class="nav-link-title">Dashboard</span>
              </NuxtLink>
            </li>

            <li class="nav-item">
              <NuxtLink to="/library" class="nav-link">
                <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
                  <Icon>Apps</Icon>
                </span>
                <span class="nav-link-title">My Library and backlog</span>
              </NuxtLink>
            </li>

            <li class="nav-item">
              <NuxtLink to="/journal" class="nav-link">
                <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
                  <Icon>Notebook</Icon>
                </span>
                <span class="nav-link-title">My gaming journal</span>
              </NuxtLink>
            </li>

            <!-- <li class="nav-item">
              <NuxtLink to="/dev/ui" class="nav-link">
                <span v-if="false" class="d-none nav-link-icon d-md-none d-lg-inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24"
                    stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <polyline points="5 12 3 12 12 3 21 12 19 12" />
                    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                    <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                  </svg>
                </span>
                <span class="nav-link-title">
                  UI
                </span>
              </NuxtLink>
            </li> -->

            <!-- <li class="nav-item">
              <NuxtLink to="/games" class="nav-link">
                <span class="nav-link-title">Browse games</span>
              </NuxtLink>
            </li> -->

            <!-- <li class="nav-item">
              <NuxtLink to="/account" class="nav-link">
                <span class="nav-link-title">
                  account
                </span>
              </NuxtLink>
            </li>

             -->

            <li class="nav-item">
              <NuxtLink to="/import/steam" class="nav-link">
                <span class="nav-link-title text-orange">
                  <Icon>StepInto</Icon>
                  Import games
                </span>
              </NuxtLink>
            </li>
          </ul>
          <div class="my-2 my-md-0 flex-grow-1 flex-md-grow-0 order-first order-md-last">
            <!-- <form action="./" method="get" autocomplete="off" novalidate>
              <div class="input-icon">
                <span class="input-icon-addon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <circle cx="10" cy="10" r="7" />
                    <line x1="21" y1="21" x2="15" y2="15" />
                  </svg>
                </span>
                <input
                  type="text"
                  value=""
                  class="form-control"
                  placeholder="Search…"
                  aria-label="Search in website" />
              </div>
            </form> -->
          </div>
        </div>
      </div>

      <!-- <div
        v-if="ui.menu"
        class="navbar-backdrop"
        style="position: fixed; top: 0; left: 0; z-index: 1; width: 100vw; height: 100vh"
        @click="ui.menu = false"></div> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showMobMenu: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
}
</script>

<style>
#navbar-menu .navbar {
  z-index: 5;
}
</style>
