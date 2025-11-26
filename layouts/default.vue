<template>
  <div class="page">
    <!--
      *+---------------------------------
      *| Main sidebar / navbar on mobile
      *| Main menu and topbar on responsive
      *+--------------------------------- -->
    <aside class="navbar navbar-vertical navbar-expand-lg">
      <div class="container-fluid">
        <!--
          *+---------------------------------
          *| Navbar toggler to show sidebar
          *+--------------------------------- -->
        <button class="navbar-toggler" style="opacity: 0.8" @click="showMobileMenu">
          <Icon size="25">LayoutSidebarInactive</Icon>
        </button>

        <!--
          *+---------------------------------
          *| Responsive search
          *| Topbar search bar on mobile
          *+--------------------------------- -->
        <div class="d-block d-md-none" @click.stop="$mitt.emit('search:palette')">
          <div class="input-group input-group-flat input-palette">
            <span class="input-group-text">
              <Icon size="16" class="me-1">Search</Icon>
            </span>
            <input type="text" class="form-control" autocomplete="off" placeholder="Search" />
          </div>
        </div>

        <!--
          *+---------------------------------
          *| Fullscreen toggler
          *+--------------------------------- -->
        <button class="navbar-toggler" style="opacity: 0.8" @click="$app.f.toggleFullscreen">
          <Icon size="25" :icon="$app.ui.fullscreen ? 'WindowMinimize' : 'WindowMaximize'"></Icon>
        </button>

        <!--
          *+---------------------------------
          *| Sidebar top block
          *| Used to display logo and title
          *+--------------------------------- -->
        <NuxtLink
          to="/"
          class="d-none d-lg-flex pt-1 pb-2 text-decoration-none"
          style="display: flex; align-items: center; flex-direction: column">
          <img
            src="/img/logo.png"
            alt="Backlog.rip"
            class="navbar-brand-image d-none d-md-inline-block"
            nstyle="height: auto; width: 100px; transform: translateY(15px)"
            style="
              height: 115px;
              width: auto;
              filter: drop-shadow(0 0 1rem rgba(174, 62, 201, 0.2));
            " />
          <!-- <h1 class="navbar-brand navbar-brand-autodark mt-0 pt-0">Backlog.rip</h1> -->
        </NuxtLink>

        <!--
          *+---------------------------------
          *| Main sidebar Nav menu
          *+--------------------------------- -->
        <common-layout-sidebar-nav />
      </div>

      <!--
        *+---------------------------------
        *| Sidebar bottom block
        *| Used to display search and other options
        *+--------------------------------- -->
      <div class="d-lg-block aside-bottom w-100" style="position: absolute; bottom: 10px">
        <client-only>
          <!--
          *+---------------------------------
          *| Server online services status
          *+--------------------------------- -->
          <div class="px-2 my-1">
            <div class="card" style="background: #24232a; border: 1px solid #453331">
              <div class="card-body" style="padding: 10px 17px">
                <div class="d-flex align-items-center">
                  <!--
                    *+---------------------------------
                    *| Cloud and app idle
                    *|
                    *+--------------------------------- -->
                  <template v-if="!$cloud.process">
                    <div>
                      <div class="text-body">Operational</div>
                      <small class="text-secondary" v-if="$app.ready">
                        Booted in {{ dates.microTime($app.ready) }}
                      </small>
                    </div>

                    <div class="ms-auto">
                      <span
                        class="status-dot status-dot-animated"
                        :style="{
                          backgroundColor: serverStatusColor(),
                        }"></span>
                    </div>
                  </template>

                  <!--
                    *+---------------------------------
                    *| Processing cloud services
                    *| Display more information
                    *+--------------------------------- -->
                  <template v-else>
                    <div>
                      <div class="text-body">{{ cloudProcessToHuman }}</div>
                      <small v-if="$cloud.message" class="text-secondary">
                        {{ $cloud.message }}
                      </small>
                    </div>
                    <div class="ms-auto">
                      <Icon size="16" width="2" class="text-muted icon-rotate">
                        RotateClockwise2
                      </Icon>
                    </div>
                  </template>
                </div>
              </div>

              <div
                v-if="$cloud.status == 'loading'"
                class="card-footer p-1"
                style="background-color: transparent">
                <div class="progress progress-sm">
                  <div class="progress-bar progress-bar-indeterminate"></div>
                </div>
              </div>

              <div
                v-if="$cloud.status == 'error'"
                class="card-body p-2"
                style="
                  background-color: transparent;
                  border: 1px solid #ff000085;
                  border-radius: 3px;
                ">
                <small class="text-error">
                  Something went wrong when syncing with the cloud. Please report it on Discord.
                </small>
              </div>
              <b-dropdown
                trigger="mouseenter focus"
                placement="top"
                style="
                  min-width: 220px;
                  max-width: 220px;
                  overflow: hidden;
                  letter-spacing: initial;
                  background: #24232a;
                  border: 1px solid #453331;
                ">
                <!-- <span class="dropdown-header">Header</span> -->
                <div class="dropdown-item disabled">
                  API status
                  <span
                    class="status-dot status-dot-animated ms-auto"
                    :style="{
                      backgroundColor: serverStatusColor('api'),
                    }"></span>
                </div>

                <div class="dropdown-item disabled">
                  Worker server
                  <span
                    class="status-dot status-dot-animated ms-auto"
                    :style="{
                      backgroundColor: serverStatusColor('worker'),
                    }"></span>
                </div>

                <div class="dropdown-item disabled">
                  Backups server
                  <span
                    class="status-dot status-dot-animated ms-auto"
                    :style="{
                      backgroundColor: serverStatusColor('backups'),
                    }"></span>
                </div>
                <div class="dropdown-divider"></div>

                <div
                  v-if="$cloud.backup.is == 'local'"
                  class="dropdown-item disabled d-block"
                  style="text-wrap: auto">
                  <span class="d-block">Backups disabled</span>
                  <small class="text-muted">
                    Your data is stored directly in your browser's storage and is not synced to the
                    cloud. This means it is only accessible on this device and by you.
                  </small>
                </div>

                <div v-else class="dropdown-item disabled d-block">
                  <div class="d-flex w-100 mb-2" style="display: flex">
                    <small class="text-muted">Library updated</small>
                    <small class="text-muted ms-auto">
                      {{ dates.timeAgo(latestUpdatedAt) }}
                    </small>
                  </div>

                  <div class="d-flex w-100" style="display: flex">
                    <small class="text-muted">Latest backup</small>
                    <small class="text-muted ms-auto">
                      {{ dates.timeAgo(control?.local?.updated_at) }}
                    </small>
                  </div>

                  <!-- <div class="d-flex align-items-center w-100 mb-2" style="display: flex">
                    <small class="text-muted">Backup quota</small>
                    <small class="text-muted ms-auto">3%</small>
                  </div>
                  <div class="progress progress" style="height: 3px">
                    <div class="progress-bar bg-primary" style="width: 85%"></div>
                  </div> -->
                </div>

                <div class="dropdown-divider"></div>
                <div class="dropdown-item" @click="$mitt.emit('dialog:about')">
                  About the project
                  <span class="ms-auto text-secondary">
                    <Icon size="11">ProgressHelp</Icon>
                  </span>
                </div>
              </b-dropdown>
            </div>
          </div>

          <!-- TEMP disabled, not working the search -->
          <div v-if="false" class="px-3 my-2" @click.stop="$mitt.emit('search:palette')">
            <div class="input-group input-group-flat input-palette cursor-pointer">
              <span class="input-group-text">
                <Icon size="14" class="me-1">Search</Icon>
              </span>
              <input
                type="text"
                class="form-control"
                autocomplete="off"
                placeholder="Search"
                style="pointer-events: none" />
              <span class="input-group-text">
                <kbd style="font-size: 0.6rem">Ctrl K</kbd>
              </span>
            </div>
          </div>

          <!-- <button
          style="transform: scale(0.9)"
          class="form-control d-flex align-items-center cursor-pointer"
          @click.stop="$mitt.emit('search:palette')">
          <Icon size="16" class="text-secondary mx-1">Search</Icon>
          <div class="flex-fill">
            <span class="form-control-placeholder text-secondary ms-3 me-6">
              Quick search…
            </span>
          </div>
          <span class="v-kbd">Control + K</span>
        </button> -->

          <div v-else class="row w-100">
            <div class="col col d-flex justify-content-center">
              <v-btn
                class="mx-2"
                icon
                size="small"
                variant="text"
                href="https://discord.gg/F2sPE5B"
                target="_blank">
                <b-logo name="discord" size="14"></b-logo>
              </v-btn>

              <v-btn
                class="mx-2"
                icon
                size="small"
                variant="text"
                href="https://backlog.featurebase.app/en/roadmap"
                target="_blank"
                v-tippy="'Feedback board and roadmap on Featurebase'">
                <Icon size="18" width="2" color="#fff">Map</Icon>
              </v-btn>

              <v-btn
                class="mx-2"
                icon
                size="small"
                variant="text"
                href="https://github.com/gsabater/backlog.rip"
                target="_blank">
                <b-logo name="github" size="14" color="#fff" style="opacity: 0.6"></b-logo>
              </v-btn>
              <v-btn class="mx-2" icon size="small" variant="text">
                <b-dropdown placement="top-start" style="overflow: hidden; letter-spacing: initial">
                  <a class="dropdown-item" href="https://discord.gg/F2sPE5B" target="_blank">
                    <svg
                      class="me-2"
                      width="16"
                      height="16"
                      viewBox="0 -28.5 256 256"
                      version="1.1"
                      preserveAspectRatio="xMidYMid">
                      <g>
                        <path
                          d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
                          fill="#5865F2"
                          fill-rule="nonzero"></path>
                      </g>
                    </svg>
                    Discord
                    <Icon width="1" size="11" class="ms-auto">ExternalLink</Icon>
                  </a>

                  <a
                    href="https://www.patreon.com/c/BacklogRIP"
                    class="dropdown-item"
                    target="_blank">
                    <Icon size="16" class="me-2">BrandPatreon</Icon>
                    Patreon
                    <Icon width="1" size="11" class="ms-auto">ExternalLink</Icon>
                  </a>

                  <a
                    href="https://backlog.featurebase.app/en/roadmap"
                    target="_blank"
                    class="dropdown-item">
                    <Icon size="16" class="me-2">Map</Icon>
                    Roadmap
                    <Icon width="1" size="11" class="ms-auto">ExternalLink</Icon>
                  </a>

                  <a
                    href="https://github.com/gsabater/backlog.rip"
                    class="dropdown-item"
                    target="_blank">
                    <b-logo
                      name="github"
                      size="16"
                      class="me-2"
                      color="#fff"
                      style="opacity: 0.6"></b-logo>
                    <!-- <Icon size="18" class="me-2">BrandGithub</Icon> -->
                    Source code
                    <Icon width="1" size="11" class="ms-auto">ExternalLink</Icon>
                  </a>

                  <div class="dropdown-divider"></div>

                  <NuxtLink to="/changelog" class="dropdown-item">
                    <Icon size="16" class="me-2">Broadcast</Icon>
                    Changelog
                  </NuxtLink>

                  <NuxtLink to="/sitemap" class="dropdown-item">
                    <Icon size="16" class="me-2">Steam</Icon>
                    Sitemap
                  </NuxtLink>

                  <NuxtLink to="/support" class="dropdown-item">
                    <Icon size="16" class="me-2">ActivityHeartbeat</Icon>
                    <span class="fancy">Support the project</span>
                  </NuxtLink>

                  <!-- <NuxtLink v-if="$app.wip" to="/docs" class="dropdown-item">
                    <Icon size="16" class="me-2">Album</Icon>
                    Docs
                  </NuxtLink> -->

                  <span class="dropdown-header" style="text-transform: none">
                    <span class="text-muted my-4">
                      Version
                      {{ $app.v }}
                    </span>
                  </span>
                </b-dropdown>
                <Icon size="18" style="transform: translateY(1px)">Terminal2</Icon>
              </v-btn>
            </div>
          </div>
        </client-only>
      </div>
    </aside>

    <!-- Navbar -->
    <!-- <div class="sticky-top" style="z-index: 999"> -->
    <header class="navbar navbar-expand-md d-none d-lg-flex d-print-none" style="box-shadow: none">
      <div class="container-xl">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar-menu"
          aria-controls="navbar-menu"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- <div id="navbar-menu" class="collapse navbar-collapse">
          <div>
            xxx
          </div>
        </div> -->

        <!-- <h1 class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pa-0">
          <!- - <h1 data-heading="Backlog.rip">Backlog.rip</h1> - ->
          <!- - <span>Backlog.rip</span> - ->
          <input type="text" />
        </h1> -->

        <v-alert v-if="$app.beta" :icon="false" type="warning" variant="text" density="compact">
          You are viewing the Beta version of Backlog.rip. This version is still in development and
          may contain (even more) bugs or errors.

          <v-btn
            size="small"
            color="primary"
            variant="tonal"
            class="mx-2"
            @click="goTo('https://discord.gg/F2sPE5B', { external: true })">
            Discord
          </v-btn>
          <v-btn
            size="small"
            color="primary"
            variant="tonal"
            class="mx-2"
            @click="goTo('https://backlog.rip', { external: true })">
            Main site
          </v-btn>
        </v-alert>

        <div class="d-flex">
          <button class="navbar-toggler" style="opacity: 0.8" @click="$mitt.emit('search:palette')">
            <Icon size="25">ListSearch</Icon>
          </button>

          <button class="navbar-toggler" style="opacity: 0.8" @click="showMobileMenu">
            <Icon size="25">LayoutSidebarRightInactive</Icon>
          </button>
        </div>

        <!-- :content-transition="{
              'enter-active-class': 'hunaa-menu-enter-active',
              'enter-from-class': 'hunaa-menu-y-0',
              'enter-to-class': 'hunaa-menu-full',
              'leave-active-class': 'hunaa-menu-leave-active',
              'leave-to-class': 'hunaa-menu-y-0',
              'leave-from-class': 'hunaa-menu-full',
            }" -->
        <client-only>
          <VueFinalModal
            v-model="ui.mobileMenu"
            class="h-100"
            content-class="h-100 ms-6 py-3"
            content-transition="vfm-slide-right"
            overlay-transition="vfm-fade"
            swipe-to-close="right">
            <div class="card h-100">
              <div class="row g-0">
                <div class="col-12 col-md-3 border-end">
                  <div id="mobile-menu" class="card-body" @click="closeMobileMenu">
                    <!-- <h3>subir velocidad de slide</h3> -->
                    <h4 class="subheader">Explore</h4>
                    <div class="list-group list-group-transparent">
                      <NuxtLink
                        to="/games"
                        class="list-group-item list-group-item-action d-flex align-items-center">
                        <span class="nav-link-icon">
                          <Icon>Cards</Icon>
                        </span>
                        <span class="nav-link-title">All games</span>
                      </NuxtLink>

                      <NuxtLink
                        to="/genres"
                        class="list-group-item list-group-item-action d-flex align-items-center">
                        <span class="nav-link-icon">
                          <Icon>Triangles</Icon>
                        </span>
                        <span class="nav-link-title">Genres</span>
                      </NuxtLink>
                    </div>
                    <h4 class="subheader mt-4">Your data</h4>
                    <div class="list-group list-group-transparent">
                      <NuxtLink
                        to="/dashboard"
                        class="list-group-item list-group-item-action d-flex align-items-center">
                        <span class="nav-link-title">Dashboard</span>
                      </NuxtLink>

                      <NuxtLink
                        to="/library"
                        class="list-group-item list-group-item-action d-flex align-items-center">
                        <span class="nav-link-title">Your library</span>
                      </NuxtLink>

                      <NuxtLink
                        to="/library"
                        class="list-group-item list-group-item-action d-flex align-items-center">
                        <span class="nav-link-title">Library and backlog</span>
                      </NuxtLink>

                      <NuxtLink
                        to="/journal"
                        class="list-group-item list-group-item-action d-flex align-items-center">
                        <span class="nav-link-title">Journal</span>
                      </NuxtLink>

                      <NuxtLink
                        to="/import"
                        class="list-group-item list-group-item-action d-flex align-items-center">
                        <span class="nav-link-title">Import your library</span>
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </VueFinalModal>
        </client-only>

        <div class="nav-item d-none d-md-flex align-items-center">
          <!-- <div class="px-3" @click.stop="$mitt.emit('search:palette')">
            <div class="input-group input-group-flat input-palette">
              <span class="input-group-text">
                <Icon size="16" class="me-1">Search</Icon>
              </span>
              <input
                type="text"
                class="form-control"
                autocomplete="off"
                placeholder="Search" />
              <span class="input-group-text">
                <kbd style="font-size: 0.6rem">Ctrl K</kbd>
              </span>
            </div>
          </div> -->

          <!-- <button
            style="transform: scale(0.9)"
            class="form-control d-flex align-items-center cursor-pointer"
            @click.stop="$mitt.emit('search:palette')">
            <Icon size="16" class="text-secondary mx-1">Search</Icon>
            <div class="flex-fill">
              <span class="form-control-placeholder text-secondary ms-3 me-6">
                Quick search…
              </span>
            </div>
            <span class="v-kbd">Control + K</span>
          </button> -->

          <!-- <div class="dropdown">
            <div class="btn dropdown-toggle" style="transform: scale(0.9)">
              <span class="me-2">Add games</span>
            </div>

            <b-dropdown trigger="mouseenter focus click hover manual" placement="bottom">
              <span class="dropdown-header">Add games to your library</span>
              <div class="dropdown-item" @click.stop="$mitt.emit('game:add')">
                <Icon size="16" class="me-2 text-muted">SquareRoundedPlus</Icon>
                Manually
                <small class="text-secondary ms-auto me-0">Insert</small>
              </div>
              <NuxtLink to="/import" class="dropdown-item">
                <Icon size="16" class="me-2 text-muted">BrandSteam</Icon>
                Import your Steam account
              </NuxtLink>
            </b-dropdown>
          </div> -->
        </div>

        <div class="d-none d-md-flex navbar-nav flex-row order-md-last align-items-center">
          <!--
            *+---------------------------------
            *| Design modes
            *| Light and dark toggler
            *+---------------------------------
          -->
          <div v-if="$app.dev" class="mx-3">
            <div
              v-tippy="'Go back to dark'"
              class="nav-link cursor-pointer px-0 hide-theme-dark"
              @click="changeTheme('dark')">
              <Icon>Moon</Icon>
            </div>

            <div
              v-tippy="'Enable light mode'"
              class="nav-link cursor-pointer px-0 hide-theme-light"
              @click="changeTheme('light')">
              <Icon>Sun</Icon>
            </div>
          </div>

          <!--
            *+---------------------------------
            *| Logs quick access
            *+---------------------------------
          -->
          <div v-if="$app.ui.showLogs && false" class="mx-3">
            <div v-tippy="'Enable light mode'" class="nav-link cursor-pointer px-0">
              <Icon>FileCode</Icon>
            </div>
          </div>

          <!--
            *+---------------------------------
            *| Avatar and user menu
            *+---------------------------------
          -->
          <client-only>
            <div
              class="d-none d-md-block nav-item dropdown align-self-center"
              v-if="$auth && $auth.user">
              <div class="nav-link d-flex lh-1 text-reset p-0" aria-label="Open user menu">
                <span
                  class="avatar avatar-sm"
                  :style="$auth.user.avatar ? `background-image: url(${$auth.user.avatar})` : ''">
                  <!-- {{ !$auth.user.avatar ? $auth.user.username[0] : '' }} -->
                </span>
                <div class="d-none d-xl-block ps-2">
                  <div>{{ $auth.user.username }}</div>
                  <div class="mt-1 small text-secondary">
                    {{ format.num($app.count.library) }} games
                  </div>
                </div>
                <b-dropdown placement="bottom-end">
                  <NuxtLink to="/library" class="dropdown-item">
                    Library
                    <small class="text-secondary ms-auto me-0">
                      {{ format.num($app.count.library) }}
                    </small>
                  </NuxtLink>
                  <NuxtLink to="/account/lists" class="dropdown-item">
                    Lists
                    <small class="text-secondary ms-auto me-0">
                      {{ format.num($app.count.lists) }}
                    </small>
                  </NuxtLink>
                  <!-- <NuxtLink to="/journal" class="dropdown-item">Journal</NuxtLink> -->
                  <div class="dropdown-divider"></div>
                  <NuxtLink to="/account/me" class="dropdown-item">Account</NuxtLink>
                  <NuxtLink to="/account/preferences" class="dropdown-item">Preferences</NuxtLink>
                </b-dropdown>
              </div>
              <!-- <b-menu ref="menu" position="end">
                <a href="./sign-in.html" class="dropdown-item">Logout</a>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item">Upgrade to Pro</div>
              </b-menu> -->
            </div>
          </client-only>
        </div>
      </div>
    </header>

    <!-- <Navigation :show-mob-menu="ui.showMobMenu"></Navigation> -->

    <!-- </div> -->
    <div class="page-wrapper">
      <NuxtLoadingIndicator />
      <!-- <div class="ch"></div> -->
      <div id="detailPage" class="hide-theme-light">
        <div id="detailCanvas" class="">
          <div class="bg_gradient_body">
            <div class="bg_gradient_large"></div>
            <div class="bg_gradient_small"></div>
          </div>
        </div>
      </div>

      <slot />

      <footer class="footer footer-transparent d-print-none d-none">
        <div class="container-xl">
          <div class="row text-center align-items-center flex-row-reverse">
            <div class="col-lg-auto ms-lg-auto">
              <ul class="list-inline list-inline-dots mb-0">
                <!-- <li class="list-inline-item">
                  <a href="./docs/" class="link-secondary">Documentation</a>
                </li>
                <li class="list-inline-item">
                  <a href="./license.html" class="link-secondary">License</a>
                </li>
                <li class="list-inline-item">
                  <a
                    href="https://github.com/tabler/tabler"
                    target="_blank"
                    class="link-secondary"
                    rel="noopener">
                    Source code
                  </a>
                </li>
                <li class="list-inline-item">
                  <a
                    href="https://github.com/sponsors/codecalm"
                    target="_blank"
                    class="link-secondary"
                    rel="noopener">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon text-pink icon-filled icon-inline"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path
                        d="M19.5 12.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                    </svg>
                    Sponsor
                  </a>
                </li> -->
              </ul>
              <ul class="list-inline list-inline-dots mb-0">
                <!-- <li class="list-inline-item">
                  A personal project, from 2016 to {{ new Date().getFullYear() }}
                </li>
                <li class="list-inline-item">
                  <a href="https://steam-backlog.com" class="link-secondary">
                    Steam Backlog
                  </a>
                  and
                  <a href="https://backlog.rip" class="link-secondary">Backlog.rip</a>
                </li>
                <li class="list-inline-item">
                  Made with 💟 in
                  <a
                    href="https://www.google.com/maps/@39.4758462,2.304438,8z"
                    class="link-secondary"
                    target="_blank"
                    rel="noopener">
                    Mallorca
                  </a>
                </li> -->
                <!-- <li class="list-inline-item">
                  <a href="./changelog.html" class="link-secondary" rel="noopener">
                    v1.0.0-beta16
                  </a>
                </li> -->
              </ul>
            </div>
            <div class="col-12 col-lg-auto mt-3 mt-lg-0"></div>
          </div>
        </div>
      </footer>
    </div>
  </div>

  <!--
    *+---------------------------------
    *| Global components
    *| Mostly notifications and dialogs
    *+--------------------------------- -->
  <client-only>
    <common-aboutDialog />
    <common-notification />
    <common-confirmDialog />

    <!-- <v-layout>
    </v-layout> -->
    <!-- <game-add /> -->
    <game-dialog />
    <game-manager />
    <game-random-dialog />

    <list-crud-dialog />
    <backup-reload-dialog />
    <backup-restore-dialog />
    <!-- <backup-conflict-dialog /> -->
    <!-- <list-cover id="cover-helper" /> -->

    <!-- <search-palette></search-palette> -->
    <!-- <b-backdrop></b-backdrop> -->
    <!-- <ModalsContainer /> -->

    <Toaster
      position="bottom-right"
      close-button
      rich-colors
      :theme="ui.theme"
      nopetoast-options="{
      style: { background: '#fda4af' },
      className: 'card',
      descriptionClassName: 'my-toast-description',
    }" />

    <!-- TODO: Make this a component -->
    <component :is="'style'" id="dynamic-style" type="text/css">
      :root{
      <template v-for="(state, i) in states">
        --bckg-state-{{ state.id }}: {{ state.color }};
      </template>
      }
      <template v-for="(state, i) in states">
        .is-state_{{ state.id }}{ --bckg-state-color: {{ state.color }}; border-color:
        {{ state.color }}; }
      </template>
    </component>
  </client-only>

  <!--
    *+---------------------------------
    *| SVG Filter
    *| Grainy
    *+--------------------------------- -->
  <svg width="0" height="0" style="display: none">
    <filter id="grainy" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".837"></feTurbulence>
      <feColorMatrix type="saturate" values="0"></feColorMatrix>
      <feBlend mode="multiply" in="SourceGraphic"></feBlend>
    </filter>
  </svg>

  <!--
    *+---------------------------------
    *| SVG Filter
    *| Ambilight
    *+--------------------------------- -->
  <svg width="0" height="0">
    <filter
      id="ambilight"
      width="300%"
      height="300%"
      x="-0.75"
      y="-0.75"
      color-interpolation-filters="sRGB">
      <feOffset in="SourceGraphic" result="source-copy"></feOffset>
      <feColorMatrix
        in="source-copy"
        type="saturate"
        values="1"
        result="saturated-copy"></feColorMatrix>
      <feColorMatrix
        in="saturated-copy"
        type="matrix"
        values="1 0 0 0 0
                     0 1 0 0 0
                     0 0 1 0 0
                     33 33 33 101 -132"
        result="bright-colors"></feColorMatrix>
      <feMorphology in="bright-colors" operator="dilate" radius="2" result="spread"></feMorphology>
      <feGaussianBlur in="spread" stdDeviation="30" result="ambilight-light"></feGaussianBlur>
      <feOffset in="SourceGraphic" result="source"></feOffset>
      <feComposite in="source" in2="ambilight-light" operator="over"></feComposite>
    </filter>
  </svg>

  <div
    class="d-none btn"
    style="
      position: fixed;
      z-index: 99999;
      bottom: 18px;
      left: 18px;
      padding: 16px;
      /* background: #ffffff14; */
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-family: cursive;
      box-shadow: 0px 0px 7px 1px #00000029;
    ">
    ?
    <b-dropdown placement="top-start">
      <a class="dropdown-item" href="https://discord.gg/F2sPE5B" target="_blank">
        <svg
          class="me-2"
          width="18"
          height="18"
          viewBox="0 -28.5 256 256"
          version="1.1"
          preserveAspectRatio="xMidYMid">
          <g>
            <path
              d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
              fill="#5865F2"
              fill-rule="nonzero"></path>
          </g>
        </svg>
        Discord
      </a>
      <a href="https://github.com/gsabater/backlog.rip" class="dropdown-item" target="_blank">
        <Icon size="18" class="me-2">BrandGithub</Icon>
        Code on Github
      </a>

      <NuxtLink to="/changelog" class="dropdown-item">
        <Icon size="18" class="me-2">Broadcast</Icon>
        Changelog
      </NuxtLink>
      <span class="dropdown-header">
        <span class="text-muted my-4">
          Version
          {{ $app.v }}
        </span>
      </span>
    </b-dropdown>
  </div>

  <client-only>
    <VueFinalModal
      v-model="$app.ui.drawer"
      display-directive="show"
      content-class="class-one "
      content-transition="vfm-slide-down"
      overlay-transition="vfm-fade"
      swipe-to-close="down">
      <div
        class="handle"
        style="
          background-color: #d1d5db;
          border-radius: 10px;
          width: 3rem;
          height: 0.375rem;
          margin: 0 auto 1rem;
        "></div>
      <div class="bottom-sheet-teleport"></div>
    </VueFinalModal>
  </client-only>
</template>

<script>
/**
 * @file:    \layouts\default.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 21st March 2023
 * Modified: 19th November 2025 - 02:47:25
 **/

import synchronizationService from '../services/synchronizationService'

export default {
  name: 'DefaultLayout',

  data() {
    return {
      ui: {
        theme: 'dark', // 'light',
        mobileMenu: false,
      },
    }
  },

  computed: {
    ...mapStores(useStateStore, useBackupStore, useLibraryStore),

    ...mapState(useStateStore, ['states']),
    ...mapState(useBackupStore, ['control']),
    ...mapState(useLibraryStore, ['latestUpdatedAt']),

    //+-------------------------------------------------
    // cloudProcessToHuman()
    // TODO: could be a method in syncrhonization store
    // -----
    // Created on Tue Oct 21 2025
    //+-------------------------------------------------
    cloudProcessToHuman() {
      return synchronizationService.processToHuman(this.$cloud.process)
    },
  },

  methods: {
    serverStatusColor(serverName) {
      const STATUS_COLORS = {
        online: 'green',
        offline: 'rgb(255, 0, 0)', // red
        warning: 'rgb(255, 193, 7)', // yellow
        unknown: 'gray',
      }

      // Check specific server status
      if (serverName) {
        const status = this.$cloud.server[serverName]
        return STATUS_COLORS[status] || STATUS_COLORS.unknown
      }

      // Check all servers status
      if (!serverName) {
        const servers = Object.values(this.$cloud.server)
        if (servers.every((status) => status === 'online')) return STATUS_COLORS.online
        return STATUS_COLORS.warning
      }

      return STATUS_COLORS.error
    },

    goTo(route, options = {}) {
      navigateTo(route, options)

      // this.$router.push(route)
    },

    changeTheme(theme) {
      this.ui.theme = theme
      if (document?.body) document.body.setAttribute('data-bs-theme', theme)
      if (document?.documentElement) {
        document.documentElement.setAttribute('data-bs-theme', theme)
        document.documentElement.setAttribute('data-bs-theme-base', 'zinc')
        document.documentElement.setAttribute('data-bs-theme-primary', 'orange')
      }
    },

    showMobileMenu() {
      this.ui.mobileMenu = !this.ui.mobileMenu
    },

    closeMobileMenu() {
      this.ui.mobileMenu = false
    },
  },
}
</script>

<style>
/* [aioli-drawer],
[vaul-drawer] {
  position: fixed;
  background-color: white;
  / *
  display: flex;
  flex-direction: column;
  border: 1px solid rgb(229 231 235);
  pointer-events: auto; * /
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  max-height: 93%;
  margin: 0 -1px;
}

[aioli-drawer] {
  touch-action: none;
  transform: translate3d(0, 100%, 0);
  transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

[aioli-drawer][aioli-visible='true'] {
  transform: translateZ(0);
  transform: translate3d(0, var(--snap-point-height, 0), 0);
}

[aioli-overlay] {
  opacity: 0;
  transition: opacity 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

[aioli-overlay] {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.4);
  inset: 0;
}

.aioli-dragging .aioli-scrollable {
  overflow-y: hidden !important;
}

[aioli-overlay][aioli-visible='true'] {
  opacity: 1;
  opacity: var(--drag-percent, 1);
}

[aioli-drawer]:after {
  background: inherit;
  background-color: inherit;
  content: '';
  height: 200%;
  left: 0;
  position: absolute;
  right: 0;
  top: 100%;
}

@media (hover: hover) and (pointer: fine) {
  [aioli-drawer] {
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }
} */

.class-one {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 1rem;
  background: rgb(17 24 39/1);
}
</style>
