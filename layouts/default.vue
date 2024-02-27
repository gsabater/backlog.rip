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
      >{{ $app }}</pre
    >

    <!-- Sidebar -->
    <aside
      v-if="$app.layout.sidebar"
      class="navbar navbar-vertical navbar-expand-lg"
      style="box-shadow: inset calc(1 * 1px) 0 0 0 #dce1e7">
      <div class="container-fluid">
        <h1 class="navbar-brand navbar-brand-autodark">
          <a href=".">
            <!-- <img
              src="./static/logo.svg"
              width="110"
              height="32"
              alt="Tabler"
              class="navbar-brand-image" /> -->
          </a>
        </h1>

        <div
          id="sidebar-menu"
          class="collapse navbar-collapse"
          :class="{ show: ui.showMobMenu }">
          <ul class="navbar-nav pt-lg-3">
            <li class="nav-item">Your library</li>
            <li class="nav-item">Your backlog</li>
            <li class="nav-item">- State</li>
            <li class="nav-item">Your collections</li>
            <li class="nav-item">
              - Genre
              <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">New</span>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="./">
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <!-- Download SVG icon from http://tabler-icons.io/i/home -->
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
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M5 12l-2 0l9 -9l9 9l-2 0"></path>
                    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-*7"></path>
                    <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path>
                  </svg>
                </span>
                <span class="nav-link-title">Home</span>
              </a>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#navbar-base"
                data-bs-toggle="dropdown"
                data-bs-auto-close="false"
                role="button"
                aria-expanded="false">
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <!-- Download SVG icon from http://tabler-icons.io/i/package -->
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
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5"></path>
                    <path d="M12 12l8 -4.5"></path>
                    <path d="M12 12l0 9"></path>
                    <path d="M12 12l-8 -4.5"></path>
                    <path d="M16 5.25l-8 4.5"></path>
                  </svg>
                </span>
                <span class="nav-link-title">Interface</span>
              </a>
              <div class="dropdown-menu">
                <div class="dropdown-menu-columns">
                  <div class="dropdown-menu-column">
                    <a class="dropdown-item" href="./alerts.html">Alerts</a>
                    <a class="dropdown-item" href="./accordion.html">Accordion</a>
                    <div class="dropend">
                      <a
                        class="dropdown-item dropdown-toggle"
                        href="#sidebar-authentication"
                        data-bs-toggle="dropdown"
                        data-bs-auto-close="false"
                        role="button"
                        aria-expanded="false">
                        Authentication
                      </a>
                      <div class="dropdown-menu">
                        <a href="./sign-in.html" class="dropdown-item">Sign in</a>
                        <a href="./sign-in-link.html" class="dropdown-item">
                          Sign in link
                        </a>
                        <a href="./sign-in-illustration.html" class="dropdown-item">
                          Sign in with illustration
                        </a>
                        <a href="./sign-in-cover.html" class="dropdown-item">
                          Sign in with cover
                        </a>
                        <a href="./sign-up.html" class="dropdown-item">Sign up</a>
                        <a href="./forgot-password.html" class="dropdown-item">
                          Forgot password
                        </a>
                        <a href="./terms-of-service.html" class="dropdown-item">
                          Terms of service
                        </a>
                        <a href="./auth-lock.html" class="dropdown-item">Lock screen</a>
                        <a href="./2-step-verification.html" class="dropdown-item">
                          2 step verification
                        </a>
                        <a href="./2-step-verification-code.html" class="dropdown-item">
                          2 step verification code
                        </a>
                      </div>
                    </div>
                    <a class="dropdown-item" href="./blank.html">Blank page</a>
                    <a class="dropdown-item" href="./badges.html">
                      Badges
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                    <a class="dropdown-item" href="./buttons.html">Buttons</a>
                    <div class="dropend">
                      <a
                        class="dropdown-item dropdown-toggle"
                        href="#sidebar-cards"
                        data-bs-toggle="dropdown"
                        data-bs-auto-close="false"
                        role="button"
                        aria-expanded="false">
                        Cards
                        <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                          New
                        </span>
                      </a>
                      <div class="dropdown-menu">
                        <a href="./cards.html" class="dropdown-item">Sample cards</a>
                        <a href="./card-actions.html" class="dropdown-item">
                          Card actions
                          <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                            New
                          </span>
                        </a>
                        <a href="./cards-masonry.html" class="dropdown-item">
                          Cards Masonry
                        </a>
                      </div>
                    </div>
                    <a class="dropdown-item" href="./carousel.html">
                      Carousel
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                    <a class="dropdown-item" href="./charts.html">Charts</a>
                    <a class="dropdown-item" href="./colors.html">Colors</a>
                    <a class="dropdown-item" href="./colorpicker.html">
                      Color picker
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                    <a class="dropdown-item" href="./datagrid.html">
                      Data grid
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                    <a class="dropdown-item" href="./datatables.html">
                      Datatables
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                    <a class="dropdown-item" href="./dropdowns.html">Dropdowns</a>
                    <a class="dropdown-item" href="./dropzone.html">
                      Dropzone
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                    <div class="dropend">
                      <a
                        class="dropdown-item dropdown-toggle"
                        href="#sidebar-error"
                        data-bs-toggle="dropdown"
                        data-bs-auto-close="false"
                        role="button"
                        aria-expanded="false">
                        Error pages
                      </a>
                      <div class="dropdown-menu">
                        <a href="./error-404.html" class="dropdown-item">404 page</a>
                        <a href="./error-500.html" class="dropdown-item">500 page</a>
                        <a href="./error-maintenance.html" class="dropdown-item">
                          Maintenance page
                        </a>
                      </div>
                    </div>
                    <a class="dropdown-item" href="./flags.html">
                      Flags
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                    <a class="dropdown-item" href="./inline-player.html">
                      Inline player
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                  </div>
                  <div class="dropdown-menu-column">
                    <a class="dropdown-item" href="./lightbox.html">
                      Lightbox
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                    <a class="dropdown-item" href="./lists.html">Lists</a>
                    <a class="dropdown-item" href="./modals.html">Modal</a>
                    <a class="dropdown-item" href="./maps.html">Map</a>
                    <a class="dropdown-item" href="./map-fullsize.html">Map fullsize</a>
                    <a class="dropdown-item" href="./maps-vector.html">
                      Map vector
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                    <a class="dropdown-item" href="./markdown.html">Markdown</a>
                    <a class="dropdown-item" href="./navigation.html">Navigation</a>
                    <a class="dropdown-item" href="./offcanvas.html">Offcanvas</a>
                    <a class="dropdown-item" href="./pagination.html">
                      <!-- Download SVG icon from http://tabler-icons.io/i/pie-chart -->
                      Pagination
                    </a>
                    <a class="dropdown-item" href="./placeholder.html">Placeholder</a>
                    <a class="dropdown-item" href="./steps.html">
                      Steps
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                    <a class="dropdown-item" href="./stars-rating.html">
                      Stars rating
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                    <a class="dropdown-item" href="./tabs.html">Tabs</a>
                    <a class="dropdown-item" href="./tags.html">Tags</a>
                    <a class="dropdown-item" href="./tables.html">Tables</a>
                    <a class="dropdown-item" href="./typography.html">Typography</a>
                    <a class="dropdown-item" href="./tinymce.html">
                      TinyMCE
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="./form-elements.html">
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <!-- Download SVG icon from http://tabler-icons.io/i/checkbox -->
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
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M9 11l3 3l8 -8"></path>
                    <path
                      d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9"></path>
                  </svg>
                </span>
                <span class="nav-link-title">Forms</span>
              </a>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#navbar-extra"
                data-bs-toggle="dropdown"
                data-bs-auto-close="false"
                role="button"
                aria-expanded="false">
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <!-- Download SVG icon from http://tabler-icons.io/i/star -->
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
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path>
                  </svg>
                </span>
                <span class="nav-link-title">Extra</span>
              </a>
              <div class="dropdown-menu">
                <div class="dropdown-menu-columns">
                  <div class="dropdown-menu-column">
                    <a class="dropdown-item" href="./empty.html">Empty page</a>
                    <a class="dropdown-item" href="./cookie-banner.html">
                      Cookie banner
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                    <a class="dropdown-item" href="./chat.html">
                      Chat
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                    <a class="dropdown-item" href="./activity.html">Activity</a>
                    <a class="dropdown-item" href="./gallery.html">Gallery</a>
                    <a class="dropdown-item" href="./invoice.html">Invoice</a>
                    <a class="dropdown-item" href="./search-results.html">
                      Search results
                    </a>
                    <a class="dropdown-item" href="./pricing.html">Pricing cards</a>
                    <a class="dropdown-item" href="./pricing-table.html">Pricing table</a>
                    <a class="dropdown-item" href="./faq.html">
                      FAQ
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                    <a class="dropdown-item" href="./users.html">Users</a>
                    <a class="dropdown-item" href="./license.html">License</a>
                  </div>
                  <div class="dropdown-menu-column">
                    <a class="dropdown-item" href="./logs.html">
                      Logs
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                    <a class="dropdown-item" href="./music.html">Music</a>
                    <a class="dropdown-item" href="./photogrid.html">
                      Photogrid
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                    <a class="dropdown-item" href="./tasks.html">
                      Tasks
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                    <a class="dropdown-item" href="./uptime.html">Uptime monitor</a>
                    <a class="dropdown-item" href="./widgets.html">Widgets</a>
                    <a class="dropdown-item" href="./wizard.html">Wizard</a>
                    <a class="dropdown-item" href="./settings.html">
                      Settings
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                    <a class="dropdown-item" href="./trial-ended.html">
                      Trial ended
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                    <a class="dropdown-item" href="./job-listing.html">
                      Job listing
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                    <a class="dropdown-item" href="./page-loader.html">
                      Page loader
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li class="nav-item active dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#navbar-layout"
                data-bs-toggle="dropdown"
                data-bs-auto-close="false"
                role="button"
                aria-expanded="true">
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <!-- Download SVG icon from http://tabler-icons.io/i/layout-2 -->
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
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      d="M4 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                    <path
                      d="M4 13m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                    <path
                      d="M14 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                    <path
                      d="M14 15m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                  </svg>
                </span>
                <span class="nav-link-title">Layout</span>
              </a>
              <div class="dropdown-menu show">
                <div class="dropdown-menu-columns">
                  <div class="dropdown-menu-column">
                    <a class="dropdown-item" href="./layout-horizontal.html">
                      Horizontal
                    </a>
                    <a class="dropdown-item" href="./layout-boxed.html">
                      Boxed
                      <span class="badge badge-sm bg-green-lt text-uppercase ms-auto">
                        New
                      </span>
                    </a>
                    <a class="dropdown-item" href="./layout-vertical.html">Vertical</a>
                    <a class="dropdown-item" href="./layout-vertical-transparent.html">
                      Vertical transparent
                    </a>
                    <a class="dropdown-item" href="./layout-vertical-right.html">
                      Right vertical
                    </a>
                    <a class="dropdown-item" href="./layout-condensed.html">Condensed</a>
                    <a class="dropdown-item active" href="./layout-combo.html">
                      Combined
                    </a>
                  </div>
                  <div class="dropdown-menu-column">
                    <a class="dropdown-item" href="./layout-navbar-dark.html">
                      Navbar dark
                    </a>
                    <a class="dropdown-item" href="./layout-navbar-sticky.html">
                      Navbar sticky
                    </a>
                    <a class="dropdown-item" href="./layout-navbar-overlap.html">
                      Navbar overlap
                    </a>
                    <a class="dropdown-item" href="./layout-rtl.html">RTL mode</a>
                    <a class="dropdown-item" href="./layout-fluid.html">Fluid</a>
                    <a class="dropdown-item" href="./layout-fluid-vertical.html">
                      Fluid vertical
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="./icons.html">
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <!-- Download SVG icon from http://tabler-icons.io/i/ghost -->
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
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      d="M5 11a7 7 0 0 1 14 0v7a1.78 1.78 0 0 1 -3.1 1.4a1.65 1.65 0 0 0 -2.6 0a1.65 1.65 0 0 1 -2.6 0a1.65 1.65 0 0 0 -2.6 0a1.78 1.78 0 0 1 -3.1 -1.4v-7"></path>
                    <path d="M10 10l.01 0"></path>
                    <path d="M14 10l.01 0"></path>
                    <path d="M10 14a3.5 3.5 0 0 0 4 0"></path>
                  </svg>
                </span>
                <span class="nav-link-title">4713 icons</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="./emails.html">
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <!-- Download SVG icon from http://tabler-icons.io/i/mail-opened -->
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
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M3 9l9 6l9 -6l-9 -6l-9 6"></path>
                    <path d="M21 9v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10"></path>
                    <path d="M3 19l6 -6"></path>
                    <path d="M15 13l6 6"></path>
                  </svg>
                </span>
                <span class="nav-link-title">Email templates</span>
              </a>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#navbar-help"
                data-bs-toggle="dropdown"
                data-bs-auto-close="false"
                role="button"
                aria-expanded="false">
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <!-- Download SVG icon from http://tabler-icons.io/i/lifebuoy -->
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
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                    <path d="M15 15l3.35 3.35"></path>
                    <path d="M9 15l-3.35 3.35"></path>
                    <path d="M5.65 5.65l3.35 3.35"></path>
                    <path d="M18.35 5.65l-3.35 3.35"></path>
                  </svg>
                </span>
                <span class="nav-link-title">Help</span>
              </a>
              <div class="dropdown-menu">
                <a
                  class="dropdown-item"
                  href="https://tabler.io/docs"
                  target="_blank"
                  rel="noopener">
                  Documentation
                </a>
                <a class="dropdown-item" href="./changelog.html">Changelog</a>
                <a
                  class="dropdown-item"
                  href="https://github.com/tabler/tabler"
                  target="_blank"
                  rel="noopener">
                  Source code
                </a>
                <a
                  class="dropdown-item text-pink"
                  href="https://github.com/sponsors/codecalm"
                  target="_blank"
                  rel="noopener">
                  <!-- Download SVG icon from http://tabler-icons.io/i/heart -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-inline me-1"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>
                  </svg>
                  Sponsor project!
                </a>
              </div>
            </li>
          </ul>
          <pre>
            {{ $app }}
          </pre>
        </div>
      </div>
    </aside>

    <!-- Navbar -->
    <!-- <div class="sticky-top"> -->
    <header
      class="navbar navbar-expand-md navbar-light d-print-none"
      style="max-height: 56px">
      <div class="container-xl">
        <button class="d-md-none navbar-toggler" style="opacity: 0">
          <Icon>MenuDeep</Icon>
        </button>

        <h1 class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pa-0">
          <NuxtLink to="/">
            <img
              src="/img/logo.png"
              width="110"
              height="32"
              alt="Backlog.rip"
              class="navbar-brand-image d-none d-md-inline-block"
              style="height: auto; width: 100px; transform: translateY(15px)" />
          </NuxtLink>
          <!-- <h1 data-heading="Backlog.rip">Backlog.rip</h1> -->
          <span>Backlog.rip</span>
        </h1>

        <button class="navbar-toggler" style="opacity: 0.8" @click="ui.dialog = true">
          <Icon size="25">LayoutSidebarRightInactive</Icon>
        </button>

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
            v-model="ui.dialog"
            class="h-100"
            content-class="h-100 ms-6 py-3"
            content-transition="vfm-slide-right"
            overlay-transition="vfm-fade"
            swipe-to-close="right">
            <div class="card h-100">
              <div class="row g-0">
                <div class="col-12 col-md-3 border-end">
                  <div class="card-body">
                    <h4 class="subheader">Business settings</h4>
                    <div class="list-group list-group-transparent">
                      <a
                        href="./settings.html"
                        class="list-group-item list-group-item-action d-flex align-items-center active">
                        My Account
                      </a>
                      <a
                        href="#"
                        class="list-group-item list-group-item-action d-flex align-items-center">
                        My Notifications
                      </a>
                      <a
                        href="#"
                        class="list-group-item list-group-item-action d-flex align-items-center">
                        Connected Apps
                      </a>
                      <a
                        href="./settings-plan.html"
                        class="list-group-item list-group-item-action d-flex align-items-center">
                        Plans
                      </a>
                      <a
                        href="#"
                        class="list-group-item list-group-item-action d-flex align-items-center">
                        Billing &amp; Invoices
                      </a>
                    </div>
                    <h4 class="subheader mt-4">Experience</h4>
                    <div class="list-group list-group-transparent">
                      <a href="#" class="list-group-item list-group-item-action">
                        Give Feedback
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </VueFinalModal>
        </client-only>

        <div
          class="d-none d-md-flex navbar-nav flex-row order-md-last align-items-center">
          <!-- <div v-if="!$auth.isLogged" class="nav-item d-none d-md-flex me-3">
            <div class="btn-list">
              <NuxtLink to="/login" class="btn btn-purple">
                <Icon class="me-2">Login</Icon>
                Sign in
              </NuxtLink>
            </div>
          </div> -->

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
              </div>
              <b-dropdown placement="bottom-end">
                <NuxtLink to="/library" class="dropdown-item">
                  Library
                  <span class="badge ms-auto me-0">
                    {{ $app.count.library }}
                  </span>
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

    <Navigation :show-mob-menu="ui.showMobMenu"></Navigation>

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
    <!-- <b-backdrop></b-backdrop> -->
    <ModalsContainer />

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
    class="btn"
    style="
      position: fixed;
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
    </b-dropdown>
  </div>

  <!-- <div>
    <nav>
      <ul>
        <li>
          <NuxtLink to="/">Home</NuxtLink>
        </li>

        <li>---</li>
        <li>
          <NuxtLink to="/about">About</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/posts/1">Post 1</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/posts/2">Post 2</NuxtLink>
        </li>
        <li>---</li>
        <li>
          <NuxtLink to="/misc">MISC</NuxtLink>
        </li>
      </ul>
    </nav>
    <slot />
    <AppFooter />
  </div> -->
</template>

<script>
/**
 * @file:    \layouts\default.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 21st March 2023
 * Modified: Tue Feb 27 2024
 **/

import { SpeedInsights } from '@vercel/speed-insights/nuxt'

export default {
  name: 'DefaultLayout',
  components: {
    SpeedInsights,
  },

  // setup() {
  //   const ui = reactive({
  //     theme: 'dark', // 'light',
  //     dialog: false,
  //     showMobMenu: false,
  //   })

  //   return {
  //     ui,
  //   }
  // },

  data() {
    return {
      ui: {
        theme: 'dark', // 'light',
        dialog: false,
        showMobMenu: false,
      },
    }
  },

  computed: {
    // ...mapStores(useDataStore),
  },

  methods: {
    changeTheme(theme) {
      this.ui.theme = theme
      if (document?.body) document.body.setAttribute('data-bs-theme', theme)
    },

    mobileMenu() {
      this.ui.showMobMenu = !this.ui.showMobMenu
    },
  },

  mounted() {
    this.$app.initClient()
    this.$mitt.on('*', (e, payload) => {
      log('🎆 Fired event', e, payload)
      // console.info(this.$mitt.all)
    })

    this.$mitt.on('app:render', () => {
      this.$forceUpdate()
    })
  },
}

// onMounted(() => {
//   // getDB('top-games')
// })
</script>

<style>
[aioli-drawer],
[vaul-drawer] {
  position: fixed;
  background-color: white;
  /*
  display: flex;
  flex-direction: column;
  border: 1px solid rgb(229 231 235);
  pointer-events: auto; */
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
}
</style>
