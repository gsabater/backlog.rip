<template>
  <div class="navbar-expand-md">
    <div id="navbar-menu" class="collapse navbar-collapse" :class="{ show: showMobMenu }">
      <div class="navbar navbar-light p-0">
        <div class="container-xl" style="padding-left: 60px">
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

            <li class="nav-item dropdown">
              <div class="nav-link dropdown-toggle cursor-pointer ps-0">
                <!-- <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <Icon>ChartBubble</Icon>
                </span> -->
                <span class="nav-link-title pe-2">Explore</span>
              </div>
              <b-dropdown>
                <NuxtLink to="/games" class="dropdown-item">
                  <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
                    <Icon>Cards</Icon>
                  </span>
                  <span class="nav-link-title">All games</span>
                </NuxtLink>

                <NuxtLink to="/genres" class="dropdown-item">
                  <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
                    <Icon>Triangles</Icon>
                  </span>
                  <span class="nav-link-title">Genres</span>
                </NuxtLink>
              </b-dropdown>

              <!-- <b-menu :arrow="false">
              </b-menu> -->
            </li>

            <!-- <li class="nav-item">
              <NuxtLink to="/games" class="nav-link">
                <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
                  <Icon>Cards</Icon>
                </span>
                <span class="nav-link-title">
                  Browse games
                </span>
              </NuxtLink>
            </li> -->

            <!-- <li style="border-right: 1px dashed #ccc; margin: 10px"></li> -->
            <!-- (drop> add a game, connect accounts) -->

            <li class="nav-item">
              <NuxtLink to="/dashboard" class="nav-link">
                <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
                  <Icon>LayoutDashboard</Icon>
                </span>
                <span class="nav-link-title">Dashboard</span>
              </NuxtLink>
            </li>

            <li class="nav-item">
              <NuxtLink to="/library" class="nav-link">
                <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
                  <Icon>Apps</Icon>
                </span>
                <span class="nav-link-title">Library and backlog</span>
              </NuxtLink>
            </li>

            <li class="nav-item">
              <NuxtLink to="/journal" class="nav-link">
                <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
                  <Icon>Notebook</Icon>
                </span>
                <span class="nav-link-title">Journal</span>
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
                  Import library
                </span>
              </NuxtLink>
            </li>

            <li v-if="$app.dev" class="nav-item">
              <NuxtLink to="/welcome" class="nav-link">
                <span class="nav-link-title text-yellow">
                  <Icon>Subtask</Icon>
                  Onboarding
                </span>
              </NuxtLink>
            </li>

            <li v-if="$app.dev" class="nav-item">
              <NuxtLink to="/docs" class="nav-link">
                <span class="nav-link-title text-purple">
                  <Icon>Note</Icon>
                  Documentation
                </span>
              </NuxtLink>
            </li>
          </ul>
          <div class="my-2 my-md-0 flex-grow-1 flex-md-grow-0 order-first order-md-last">
            <!-- <div class="input-icon">
              <div
                class="progress progress-sm"
                style="position: absolute; height: 0.15rem">
                <div class="progress-bar progress-bar-indeterminate"></div>
              </div>
              <span class="input-icon-addon">
                <Icon class="mx-2">CloudDown</Icon>
              </span>
              <input
                type="text"
                value="Importing Steam library…"
                class="form-control"
                disabled />
              <span class="input-icon-addon">
                <div
                  class="spinner-border spinner-border-sm text-secondary"
                  role="status"></div>
              </span>
            </div> -->

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
