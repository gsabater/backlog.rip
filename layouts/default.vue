<template>
  <div class="page">
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
      class="navbar navbar-expand-md navbar-light none-sticky-top d-print-none"
      style="max-height: 56px">
      <div class="container-xl">
        <button class="navbar-toggler" @click="ui.showMobMenu = !ui.showMobMenu">
          <span class="navbar-toggler-icon"></span>
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
          <span>Backlog.rip</span>
        </h1>
        <div class="navbar-nav flex-row order-md-last">
          <!-- <div v-if="!$auth.isLogged" class="nav-item d-none d-md-flex me-3">
            <div class="btn-list">
              <NuxtLink to="/login" class="btn btn-purple">
                <Icon class="me-2">Login</Icon>
                Sign in
              </NuxtLink>
            </div>
          </div> -->

          <div class="d-none d-md-flex mx-3">
            <div
              v-tippy="'Enable dark mode'"
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

            <div v-if="false" class="nav-item dropdown me-3 d-none d-md-flex">
              <a
                href="#"
                class="nav-link px-0"
                data-bs-toggle="dropdown"
                tabindex="-1"
                aria-label="Show notifications">
                <Icon>Bell</Icon>
                <!-- Download SVG icon from http://tabler-icons.io/i/bell -->
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
                  <path
                    d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
                  <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                </svg>
                <span class="badge bg-red"></span>
              </a>
              <div
                class="dropdown-menu dropdown-menu-arrow dropdown-menu-end dropdown-menu-card">
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Last updates</h3>
                  </div>
                  <div class="list-group list-group-flush list-group-hoverable">
                    <div class="list-group-item">
                      <div class="row align-items-center">
                        <div class="col-auto">
                          <span
                            class="status-dot status-dot-animated bg-red d-block"></span>
                        </div>
                        <div class="col text-truncate">
                          <a href="#" class="text-body d-block">Example 1</a>
                          <div class="d-block text-muted text-truncate mt-n1">
                            Change deprecated html tags to text decoration classes
                            (#29604)
                          </div>
                        </div>
                        <div class="col-auto">
                          <a href="#" class="list-group-item-actions">
                            <!-- Download SVG icon from http://tabler-icons.io/i/star -->
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="icon text-muted"
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
                                d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div class="list-group-item">
                      <div class="row align-items-center">
                        <div class="col-auto">
                          <span class="status-dot d-block"></span>
                        </div>
                        <div class="col text-truncate">
                          <a href="#" class="text-body d-block">Example 2</a>
                          <div class="d-block text-muted text-truncate mt-n1">
                            justify-content:between ⇒ justify-content:space-between
                            (#29734)
                          </div>
                        </div>
                        <div class="col-auto">
                          <a href="#" class="list-group-item-actions show">
                            <!-- Download SVG icon from http://tabler-icons.io/i/star -->
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="icon text-yellow"
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
                                d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div class="list-group-item">
                      <div class="row align-items-center">
                        <div class="col-auto">
                          <span class="status-dot d-block"></span>
                        </div>
                        <div class="col text-truncate">
                          <a href="#" class="text-body d-block">Example 3</a>
                          <div class="d-block text-muted text-truncate mt-n1">
                            Update change-version.js (#29736)
                          </div>
                        </div>
                        <div class="col-auto">
                          <a href="#" class="list-group-item-actions">
                            <!-- Download SVG icon from http://tabler-icons.io/i/star -->
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="icon text-muted"
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
                                d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div class="list-group-item">
                      <div class="row align-items-center">
                        <div class="col-auto">
                          <span
                            class="status-dot status-dot-animated bg-green d-block"></span>
                        </div>
                        <div class="col text-truncate">
                          <a href="#" class="text-body d-block">Example 4</a>
                          <div class="d-block text-muted text-truncate mt-n1">
                            Regenerate package-lock.json (#29730)
                          </div>
                        </div>
                        <div class="col-auto">
                          <a href="#" class="list-group-item-actions">
                            <!-- Download SVG icon from http://tabler-icons.io/i/star -->
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="icon text-muted"
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
                                d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="nav-item dropdown d-block align-self-center">
            <div class="nav-link d-flex lh-1 text-reset p-0" aria-label="Open user menu">
              <span
                class="avatar avatar-sm"
                :style="`background-image: url(${$auth.user.avatar})`">
                {{ !$auth.user.avatar ? $auth.user.username[0] : '' }}
              </span>
              <div class="d-none d-xl-block ps-2">
                <div>{{ $auth.user.username }}</div>
                <!-- <div class="mt-1 small text-muted">UI Designer</div> -->
              </div>
            </div>
            <b-menu ref="menu" position="end">
              <div class="dropdown-item">
                Library
                <span class="badge bg-primary text-primary-fg ms-auto">12</span>
              </div>
              <NuxtLink to="/journal" class="dropdown-item">Journal</NuxtLink>
              <div class="dropdown-divider"></div>
              <NuxtLink to="/account/me" class="dropdown-item">Account</NuxtLink>
              <!-- <a href="./sign-in.html" class="dropdown-item">Logout</a> -->
              <!-- <div class="dropdown-divider"></div>
              <div class="dropdown-item">Upgrade to Pro</div> -->
            </b-menu>
            <!-- <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">

            </div> -->
          </div>
        </div>
      </div>
    </header>
    <Navigation :show-mob-menu="ui.showMobMenu"></Navigation>
    <!-- </div> -->
    <div class="page-wrapper">
      <NuxtLoadingIndicator />
      <!-- <div class="ch"></div> -->
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

  <game-details></game-details>
  <game-manager></game-manager>
  <b-backdrop></b-backdrop>

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
 * Modified: Fri Jan 26 2024
 **/

import { SpeedInsights } from '@vercel/speed-insights/nuxt'

// const app = useNuxtApp()
// const $auth = useUserStore()
// const repository = useRepositoryStore()

export default {
  name: 'DefaultLayout',
  components: {
    SpeedInsights,
  },

  setup() {
    const ui = reactive({
      theme: 'dark', // 'light',
      dialog: false,
      showMobMenu: false,
    })

    useHead({
      title: 'Backlog.rip',

      bodyAttrs: {
        'class': 'antialiased',
        'data-bs-theme': ui.theme.value || 'dark',
      },

      script: [
        {
          // src: "../node_modules/@tabler/core/dist/js/tabler.js",
          // src: 'https://cdn.jsdelivr.net/npm/@tabler/core@1.0.0-beta17/dist/js/tabler.min.js',
          // src: '../node_modules/@tabler/core/dist/tabler.js',
          // body: true,
        },
      ],

      link: [],
    })

    return {
      ui,
    }
  },
  data() {
    return {}
  },

  computed: {
    ...mapStores(useDataStore),
  },

  methods: {
    changeTheme(theme) {
      this.ui.theme = theme
      document.body.setAttribute('data-bs-theme', theme)
    },
  },

  created() {
    this.$mitt.on('*', (e, payload) => {
      log('🎆 Fired event', e, payload)
      // console.info(this.$mitt.all)
    })

    this.$mitt.on('app:render', () => {
      this.$forceUpdate()
    })
  },
}

// function changeTheme(theme) {
//   ui.theme = theme
//   document.body.setAttribute('data-bs-theme', theme)
// }

// onMounted(() => {
//   // getDB('top-games')
// })
</script>
