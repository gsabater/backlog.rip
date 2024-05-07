<template>
  <div class="page">
    <pre
      v-if="$app.dev"
      style="
        position: fixed;
        bottom: 10px;
        right: 10px;
        z-index: 9999;
        max-height: 90vh;
        overflow-y: scroll;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        padding: 10px;
        border-radius: 5px;
      "
      @click="$app.dev = false"
      >{{ $app.v }}
---
{{ $app.api }}
    </pre>

    <!--
      *+---------------------------------
      *| Main sidebar
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
            <input
              type="text"
              class="form-control"
              autocomplete="off"
              placeholder="Search" />
          </div>
        </div>

        <!--
          *+---------------------------------
          *| Fullscreen toggler
          *+--------------------------------- -->
        <button
          class="navbar-toggler"
          style="opacity: 0.8"
          @click="$app.f.toggleFullscreen">
          <Icon
            size="25"
            :icon="$app.ui.fullscreen ? 'WindowMinimize' : 'WindowMaximize'"></Icon>
        </button>

        <!--
          *+---------------------------------
          *| Sidebar top block
          *| Used to display logo and title
          *+--------------------------------- -->
        <NuxtLink
          to="/"
          class="d-none d-lg-flex py-3"
          style="
            display: flex;
            align-items: center;
            flex-direction: column;
            nheight: 56px;
          ">
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
          <h1 class="navbar-brand navbar-brand-autodark mt-0 pt-0">Backlog.rip</h1>
        </NuxtLink>

        <!--
          *+---------------------------------
          *| Main dropdown menu
          *| Menu with options to navigate
          *+--------------------------------- -->
        <div class="d-none d-lg-block dropdown-menu show bg-transparent">
          <span class="dropdown-header">
            <span class="text-muted my-2">Explore</span>
          </span>

          <!-- <div class="dropdown-item disabled text-white">
            <h6 class="m-0">Explore</h6>
          </div> -->

          <NuxtLink to="/games" class="dropdown-item">
            <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
              <Icon size="16">Cards</Icon>
            </span>
            <span class="nav-link-title">All games</span>
          </NuxtLink>

          <NuxtLink to="/genres" class="dropdown-item">
            <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
              <Icon size="16">Triangle</Icon>
            </span>
            <span class="nav-link-title">Genres</span>
          </NuxtLink>

          <div class="dropdown-divider"></div>

          <NuxtLink to="/dashboard" class="dropdown-item">
            <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
              <Icon size="16">Components</Icon>
            </span>
            <span class="nav-link-title">Dashboard</span>
          </NuxtLink>

          <NuxtLink to="/library" class="dropdown-item">
            <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
              <Icon size="16">LayoutDashboard</Icon>
            </span>
            <span class="nav-link-title">Your library</span>
            <small class="ms-auto text-secondary">
              {{ format.num($app.count.library) }}
            </small>
          </NuxtLink>

          <NuxtLink to="/journal" class="dropdown-item">
            <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
              <Icon size="16">Notebook</Icon>
            </span>
            <span class="nav-link-title">Journal</span>
            <small class="ms-auto text-secondary">
              {{ $moment().format('DD/MM') }}
            </small>
          </NuxtLink>

          <div class="dropdown-divider"></div>

          <NuxtLink v-if="$app.dev" to="/library" class="dropdown-item">
            <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
              <Icon size="16">Bookmark</Icon>
            </span>
            <span class="nav-link-title">Pinned games</span>
          </NuxtLink>

          <NuxtLink
            v-for="(state, i) in pinnedStates"
            :to="'/library/' + (state.key || state.id)"
            :key="'state' + i"
            class="dropdown-item ps-3 pe-1">
            <div class="content d-flex align-items-center w-100 px-1">
              <span
                class="status-dot me-2"
                :style="{ 'background-color': state.color || '' }"></span>

              <span class="ps-1 me-4">
                {{ state.name }}
              </span>

              <span
                v-if="stateStore.count(state.id) > 0"
                class="badge bg-purple-lt ms-auto">
                {{ format.num(stateStore.count(state.id)) }}
              </span>
              <!-- <tippy
                class="text-muted ms-auto ms-1 cursor-help"
                :content="state.description">
                <Icon size="18" stroke="1">HelpCircleFilled</Icon>
              </tippy> -->
            </div>
          </NuxtLink>

          <div class="dropdown-divider"></div>

          <NuxtLink to="/import/steam" class="dropdown-item mt-1">
            <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
              <Icon size="16">SquareRoundedPlus</Icon>
            </span>
            <span class="nav-link-title">Import your games</span>
          </NuxtLink>
        </div>
      </div>

      <!--
        *+---------------------------------
        *| Sidebar bottom block
        *| Used to display search and other options
        *+--------------------------------- -->
      <div
        class="d-none d-lg-block aside-bottom w-100"
        style="position: absolute; bottom: 10px">
        <div v-if="$app.updating" class="px-3 mt-2 mb-3">
          <div class="input-icon" style="overflow: hidden; border-radius: 4px">
            <div class="progress progress-sm" style="position: absolute; height: 0.15rem">
              <div class="progress-bar progress-bar-indeterminate"></div>
            </div>
            <span class="input-icon-addon">
              <Icon>BrandSteam</Icon>
              <!-- <div
                class="spinner-border spinner-border-sm text-secondary"
                role="status"></div> -->
            </span>
            <input
              type="text"
              value="Updating your library…"
              class="form-control"
              style="background-color: transparent"
              disabled />
            <!-- <span class="input-icon-addon">
                <div
                  class="spinner-border spinner-border-sm text-secondary"
                  role="status"></div>
              </span> -->
          </div>
        </div>

        <div v-else class="px-3 mt-2 mb-3" @click.stop="$mitt.emit('search:palette')">
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
        </div>

        <div class="row w-100 mb-3">
          <div class="col col d-flex justify-content-center">
            <div
              class="btn btn-ghost-secondary btn-sm btn-icon"
              style="border-radius: 50%">
              <Icon size="18" style="transform: translateY(1px)">HelpSquare</Icon>
              <b-dropdown placement="top-start">
                <a
                  class="dropdown-item"
                  href="https://discord.gg/F2sPE5B"
                  target="_blank">
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
                <a
                  href="https://github.com/gsabater/backlog.rip"
                  class="dropdown-item"
                  target="_blank">
                  <Icon size="18" class="me-2">BrandGithub</Icon>
                  Code on Github
                </a>

                <NuxtLink to="/changelog" class="dropdown-item">
                  <Icon size="18" class="me-2">Broadcast</Icon>
                  Changelog
                </NuxtLink>
                <span class="dropdown-header" style="text-transform: none">
                  <span class="text-muted my-4">
                    Version
                    {{ $app.v }}
                  </span>
                </span>
              </b-dropdown>
            </div>
          </div>
          <div class="col col d-flex justify-content-center">
            <NuxtLink
              v-if="$app.dev"
              to="/docs"
              class="btn btn-ghost-secondary btn-sm btn-icon"
              style="border-radius: 50%">
              <Icon size="18" style="transform: translateY(1px)">Book</Icon>
            </NuxtLink>
          </div>
        </div>
      </div>
    </aside>

    <!-- Navbar -->
    <!-- <div class="sticky-top" style="z-index: 999"> -->
    <header class="navbar navbar-expand-md d-none d-lg-flex d-print-none">
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

        <div class="d-flex">
          <button
            class="navbar-toggler"
            style="opacity: 0.8"
            @click="$mitt.emit('search:palette')">
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
                        to="/import/steam"
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

        <div
          class="d-none d-md-flex navbar-nav flex-row order-md-last align-items-center">
          <div class="mx-3">
            <div
              xv-tippy="'Enable dark mode'"
              class="nav-link cursor-pointer px-0 hide-theme-dark"
              @click="changeTheme('dark')">
              <Icon>Moon</Icon>
            </div>

            <div
              xv-tippy="'Enable light mode'"
              class="nav-link cursor-pointer px-0 hide-theme-light"
              @click="changeTheme('light')">
              <Icon>Sun</Icon>
            </div>
          </div>

          <div class="d-none d-md-block nav-item dropdown align-self-center">
            <div class="nav-link d-flex lh-1 text-reset p-0" aria-label="Open user menu">
              <span
                class="avatar avatar-sm"
                :style="
                  $auth.user.avatar ? `background-image: url(${$auth.user.avatar})` : ''
                ">
                {{ !$auth.user.avatar ? $auth.user.username[0] : '' }}
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
                <NuxtLink to="/journal" class="dropdown-item">Journal</NuxtLink>
                <div class="dropdown-divider"></div>
                <NuxtLink to="/account/me" class="dropdown-item">Account</NuxtLink>
              </b-dropdown>
            </div>
            <!-- <b-menu ref="menu" position="end">
                <a href="./sign-in.html" class="dropdown-item">Logout</a>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item">Upgrade to Pro</div>
              </b-menu> -->
          </div>
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

      <footer class="footer footer-transparent d-print-none">
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

  <client-only>
    <game-details></game-details>
    <game-manager></game-manager>
    <search-palette></search-palette>
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

    <SpeedInsights v-if="!$app.dev" />

    <component :is="'style'" id="dynamic-style" type="text/css">
      <template v-if="!$app.dev">pre{ display: none !important; }</template>
    </component>
  </client-only>

  <svg width="0" height="0" style="display: none">
    <filter id="grainy" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".837"></feTurbulence>
      <feColorMatrix type="saturate" values="0"></feColorMatrix>
      <feBlend mode="multiply" in="SourceGraphic"></feBlend>
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
      <a
        href="https://github.com/gsabater/backlog.rip"
        class="dropdown-item"
        target="_blank">
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
 * Modified: Fri Apr 26 2024
 **/

import { SpeedInsights } from '@vercel/speed-insights/nuxt'

export default {
  name: 'DefaultLayout',
  components: {
    SpeedInsights,
  },

  data() {
    return {
      ui: {
        theme: 'dark', // 'light',

        test: false,
        mobileMenu: false,
      },
    }
  },

  computed: {
    ...mapStores(useStateStore),
    ...mapState(useStateStore, ['states']),

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Wed Apr 03 2024
    //+-------------------------------------------------
    pinnedStates() {
      const pinned = this.$auth?.menu?.states || []
      return this.states.filter((state) => pinned.includes(state.id))
    },
  },

  methods: {
    changeTheme(theme) {
      this.ui.theme = theme
      if (document?.body) document.body.setAttribute('data-bs-theme', theme)
    },

    showMobileMenu() {
      this.ui.mobileMenu = !this.ui.mobileMenu
    },

    closeMobileMenu() {
      this.ui.mobileMenu = false
    },
  },

  mounted() {
    this.$app.initClient()

    this.$mitt.on('app:render', () => {
      this.$forceUpdate()
    })
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
