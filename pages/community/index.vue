<template>
  <!-- Page header -->
  <!-- <div class="page-header d-print-none">
    <div class="container-xl">
      <div class="row g-2 align-items-center">
        <div class="col">
          <h2 class="page-title">Music components</h2>
        </div>
      </div>
    </div>
  </div> -->
  <!-- Page body -->
  <div class="page-body">
    <div class="container-xl">
      <div class="row gx-lg-5 mx-auto">
        <div class="d-none d-lg-block col-lg-2">
          <div class="row g-2 align-items-center">
            <div class="col">
              <h3>Community</h3>
            </div>
          </div>

          <ul class="nav nav-pills nav-vertical">
            <!-- <li>My Account</li>

      <li>Integrations</li>

      <li>Account history</li>

      <li>Give Feedback</li>

      <li>---</li> -->
            <li class="nav-item">
              <NuxtLink to="/account/me" class="nav-link">
                <Icon class="me-2">Fingerprint</Icon>
                Users
              </NuxtLink>
            </li>

            <li class="nav-item">
              <NuxtLink to="/account/preferences" class="nav-link">
                <Icon class="me-2">Settings</Icon>
                Discord
              </NuxtLink>
            </li>

            <li class="nav-item">
              <NuxtLink to="/account/cloud" class="nav-link">
                <Icon class="me-2">CloudRain</Icon>
                Patrons
              </NuxtLink>
            </li>
          </ul>

          <div
            class="hr-text font-serif w-100"
            style="margin-top: 2.5rem !important; margin-bottom: 2.5rem !important">
            ◈ ◈ ◈
          </div>

          <div class="row g-2 align-items-center">
            <div class="col">
              <h3>Your data</h3>
            </div>
          </div>

          <ul class="nav nav-pills nav-vertical">
            <li class="nav-item">
              <NuxtLink to="/account/lists" class="nav-link">
                <Icon class="me-2">Mist</Icon>
                Lists
              </NuxtLink>
            </li>

            <li class="nav-item">
              <NuxtLink to="/account/states" class="nav-link">
                <Icon class="me-2">Background</Icon>
                States
              </NuxtLink>
            </li>

            <li class="nav-item">
              <NuxtLink to="/account/database" class="nav-link">
                <Icon class="me-2">Database</Icon>
                Database
              </NuxtLink>
            </li>

            <li v-if="$app.dev" class="nav-item">
              <NuxtLink to="/account/logs" class="nav-link">
                <Icon class="me-2">Bug</Icon>
                Application logs
              </NuxtLink>
            </li>
            <!-- <li class="nav-item">
        <a
          href="#menu-base"
          class="nav-link"
          data-bs-toggle="collapse"
          aria-expanded="false">
          Getting started
          <span class="nav-link-toggle"></span>
        </a>
        <ul id="menu-base" class="nav nav-pills collapse">
          <li class="nav-item">
            <a href="../docs/getting-started.html" class="nav-link">Getting Started</a>
          </li>
          <li class="nav-item">
            <a href="../docs/download.html" class="nav-link">Download</a>
          </li>
          <li class="nav-item">
            <a href="../docs/browser-support.html" class="nav-link">Browser Support</a>
          </li>
        </ul>
      </li>
      <li class="nav-item">
        <a
          href="#menu-content"
          class="nav-link"
          data-bs-toggle="collapse"
          aria-expanded="false">
          Content
          <span class="nav-link-toggle"></span>
        </a>
        <ul id="menu-content" class="nav nav-pills collapse">
          <li class="nav-item">
            <a href="../docs/colors.html" class="nav-link">Colors</a>
          </li>
          <li class="nav-item">
            <a href="../docs/typography.html" class="nav-link">Typography</a>
          </li>
          <li class="nav-item">
            <a href="../docs/icons.html" class="nav-link">Icons</a>
          </li>
          <li class="nav-item">
            <a href="../docs/customize.html" class="nav-link">Customize Tabler</a>
          </li>
        </ul>
      </li>
      <li class="nav-item">
        <a
          href="#menu-layout"
          class="nav-link"
          data-bs-toggle="collapse"
          aria-expanded="false">
          Layout
          <span class="nav-link-toggle"></span>
        </a>
        <ul id="menu-layout" class="nav nav-pills collapse">
          <li class="nav-item">
            <a href="../docs/page-headers.html" class="nav-link">Page headers</a>
          </li>
        </ul>
      </li>
      <li class="nav-item">
        <a
          href="#menu-forms"
          class="nav-link"
          data-bs-toggle="collapse"
          aria-expanded="false">
          Form components
          <span class="nav-link-toggle"></span>
        </a>
        <ul id="menu-forms" class="nav nav-pills collapse">
          <li class="nav-item">
            <a href="../docs/form-elements.html" class="nav-link">Form elements</a>
          </li>
          <li class="nav-item">
            <a href="../docs/form-helpers.html" class="nav-link">Form helpers</a>
          </li>
          <li class="nav-item">
            <a href="../docs/form-validation.html" class="nav-link">Validation states</a>
          </li>
          <li class="nav-item">
            <a href="../docs/form-image-check.html" class="nav-link">Image check</a>
          </li>
          <li class="nav-item">
            <a href="../docs/form-color-check.html" class="nav-link">Color check</a>
          </li>
          <li class="nav-item">
            <a href="../docs/form-selectboxes.html" class="nav-link">Form selectboxes</a>
          </li>
          <li class="nav-item">
            <a href="../docs/form-fieldset.html" class="nav-link">Form fieldset</a>
          </li>
        </ul>
      </li>
      <li class="nav-item">
        <a
          href="#menu-components"
          class="nav-link"
          data-bs-toggle="collapse"
          aria-expanded="false">
          Components
          <span class="nav-link-toggle"></span>
        </a>
        <ul id="menu-components" class="nav nav-pills collapse">
          <li class="nav-item">
            <a href="../docs/alerts.html" class="nav-link">Alerts</a>
          </li>
          <li class="nav-item">
            <a href="../docs/avatars.html" class="nav-link">Avatars</a>
          </li>
          <li class="nav-item">
            <a href="../docs/badges.html" class="nav-link">Badges</a>
          </li>
          <li class="nav-item">
            <a href="../docs/breadcrumb.html" class="nav-link">Breadcrumb</a>
          </li>
          <li class="nav-item">
            <a href="../docs/buttons.html" class="nav-link">Buttons</a>
          </li>
          <li class="nav-item">
            <a href="../docs/cards.html" class="nav-link">Cards</a>
          </li>
          <li class="nav-item">
            <a href="../docs/carousel.html" class="nav-link">Carousel</a>
          </li>
          <li class="nav-item">
            <a href="../docs/datagrid.html" class="nav-link">Data grid</a>
          </li>
          <li class="nav-item">
            <a href="../docs/dropdowns.html" class="nav-link">Dropdowns</a>
          </li>
          <li class="nav-item">
            <a href="../docs/divider.html" class="nav-link">Divider</a>
          </li>
          <li class="nav-item">
            <a href="../docs/empty.html" class="nav-link">Empty states</a>
          </li>
          <li class="nav-item">
            <a href="../docs/modals.html" class="nav-link">Modals</a>
          </li>
          <li class="nav-item">
            <a href="../docs/page-headers.html" class="nav-link">Page headers</a>
          </li>
          <li class="nav-item">
            <a href="../docs/progress.html" class="nav-link">Progress</a>
          </li>
          <li class="nav-item">
            <a href="../docs/range-slider.html" class="nav-link">Range slider</a>
          </li>
          <li class="nav-item">
            <a href="../docs/ribbons.html" class="nav-link">Ribbons</a>
          </li>
          <li class="nav-item">
            <a href="../docs/placeholder.html" class="nav-link">Placeholder</a>
          </li>
          <li class="nav-item">
            <a href="../docs/spinners.html" class="nav-link">Spinners</a>
          </li>
          <li class="nav-item">
            <a href="../docs/statuses.html" class="nav-link">Statuses</a>
          </li>
          <li class="nav-item">
            <a href="../docs/steps.html" class="nav-link">Steps</a>
          </li>
          <li class="nav-item">
            <a href="../docs/switch-icon.html" class="nav-link">Switch icon</a>
          </li>
          <li class="nav-item">
            <a href="../docs/tables.html" class="nav-link">Tables</a>
          </li>
          <li class="nav-item">
            <a href="../docs/tabs.html" class="nav-link">Tabs</a>
          </li>
          <li class="nav-item">
            <a href="../docs/timelines.html" class="nav-link">Timelines</a>
          </li>
          <li class="nav-item">
            <a href="../docs/toasts.html" class="nav-link">Toasts</a>
          </li>
          <li class="nav-item">
            <a href="../docs/tracking.html" class="nav-link">Tracking</a>
          </li>
          <li class="nav-item">
            <a href="../docs/tooltips.html" class="nav-link">Tooltips</a>
          </li>
          <li class="nav-item">
            <a href="../docs/popover.html" class="nav-link">Popover</a>
          </li>
        </ul>
      </li>
      <li class="nav-item">
        <a
          href="#menu-utils"
          class="nav-link"
          data-bs-toggle="collapse"
          aria-expanded="false">
          Utilities
          <span class="nav-link-toggle"></span>
        </a>
        <ul id="menu-utils" class="nav nav-pills collapse">
          <li class="nav-item">
            <a href="../docs/borders.html" class="nav-link">Borders</a>
          </li>
          <li class="nav-item">
            <a href="../docs/cursors.html" class="nav-link">Cursors</a>
          </li>
          <li class="nav-item">
            <a href="../docs/interactions.html" class="nav-link">Interactions</a>
          </li>
        </ul>
      </li>
      <li class="nav-item">
        <a
          href="#menu-plugins"
          class="nav-link"
          data-bs-toggle="collapse"
          aria-expanded="false">
          Plugins
          <span class="nav-link-toggle"></span>
        </a>
        <ul id="menu-plugins" class="nav nav-pills collapse">
          <li class="nav-item">
            <a href="../docs/autosize.html" class="nav-link">Autosize</a>
          </li>
          <li class="nav-item">
            <a href="../docs/input-mask.html" class="nav-link">Form input mask</a>
          </li>
          <li class="nav-item">
            <a href="../docs/flags.html" class="nav-link">Flags</a>
          </li>
          <li class="nav-item">
            <a href="../docs/payments.html" class="nav-link">Payments</a>
          </li>
          <li class="nav-item">
            <a href="../docs/charts.html" class="nav-link">Charts</a>
          </li>
          <li class="nav-item">
            <a href="../docs/dropzone.html" class="nav-link">Dropzone</a>
          </li>
          <li class="nav-item">
            <a href="../docs/inline-player.html" class="nav-link">Inline player</a>
          </li>
          <li class="nav-item">
            <a href="../docs/tinymce.html" class="nav-link">TinyMCE</a>
          </li>
        </ul>
      </li> -->
          </ul>
        </div>

        <div class="col-lg-9">
          <div class="row row-cards">
            <div class="col-md-6">
              <h3>Latest users</h3>
              <div class="card">
                <div class="list-group card-list-group">
                  <template v-for="item in latest" :key="item.uuid">
                    <div
                      class="list-group-item px-3 cursor-pointer text-decoration-none"
                      style="padding-top: 0.8rem; padding-bottom: 0.8rem">
                      <div class="row g-3 align-items-center">
                        <!-- <div class="col-auto text-secondary">
            <v-btn variant="text" icon="mdi-chevron-right" size="small">
              <Icon>Badge</Icon>
            </v-btn>
          </div> -->
                        <div class="col-auto">
                          <span
                            class="avatar avatar-sm"
                            style="
                              background-image: url('https://avatars.steamstatic.com/be9372d5ab3d163fd96fbe3e97b3330cc10c1165_medium.jpg');
                            "></span>
                        </div>
                        <div class="col">
                          <span class="font-serif">
                            {{ item.username || 'Anonymous' }}
                          </span>
                          <div class="v-list-item-subtitle">
                            <small class="text-muted">
                              {{ item.games || 0 }} games 🔸
                              {{ dates.timeAgo(item.created_at) }}
                              <!-- {{ $moment(item.created_at).format('LL') }} 🔸 -->
                              <!-- <Icon size="16" width="1">Replace</Icon> -->
                            </small>
                          </div>
                        </div>

                        <!-- <div class="col-auto">
              <v-btn variant="tonal" size="small" color="blue-grey-lighten-1">
                Modify list
              </v-btn>
            </div> -->

                        <div class="col-auto text-secondary" @click.prevent="() => {}">
                          <div style="position: relative">
                            <v-btn
                              variant="text"
                              icon="mdi-chevron-right"
                              size="x-small"
                              color="grey-lighten-1">
                              <Icon size="18" width="2">DotsVertical</Icon>
                            </v-btn>
                          </div>
                        </div>

                        <!-- <div class="col-auto text-secondary">
            <v-btn variant="tonal" icon="mdi-chevron-right" size="small">
              <Icon>ChevronRight</Icon>
            </v-btn>
          </div> -->
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <h3>Active</h3>
              <div class="card">
                <div class="list-group card-list-group">
                  <template v-for="item in active" :key="item.uuid">
                    <div
                      class="list-group-item px-3 cursor-pointer text-decoration-none"
                      style="padding-top: 0.8rem; padding-bottom: 0.8rem">
                      <div class="row g-3 align-items-center">
                        <!-- <div class="col-auto text-secondary">
            <v-btn variant="text" icon="mdi-chevron-right" size="small">
              <Icon>Badge</Icon>
            </v-btn>
          </div> -->
                        <div class="col-auto">
                          <span
                            class="avatar avatar-sm"
                            style="
                              background-image: url('https://avatars.steamstatic.com/be9372d5ab3d163fd96fbe3e97b3330cc10c1165_medium.jpg');
                            "></span>
                        </div>
                        <div class="col">
                          <span class="font-serif">
                            {{ item.username || 'Anonymous' }}
                          </span>
                          <div class="v-list-item-subtitle">
                            <small class="text-muted">
                              {{ item.games || 0 }} games 🔸
                              {{ dates.timeAgo(item.created_at) }}
                              <!-- {{ $moment(item.created_at).format('LL') }} 🔸 -->
                              <!-- <Icon size="16" width="1">Replace</Icon> -->
                            </small>
                          </div>
                        </div>

                        <!-- <div class="col-auto">
              <v-btn variant="tonal" size="small" color="blue-grey-lighten-1">
                Modify list
              </v-btn>
            </div> -->

                        <div class="col-auto text-secondary" @click.prevent="() => {}">
                          <div style="position: relative">
                            <v-btn
                              variant="text"
                              icon="mdi-chevron-right"
                              size="x-small"
                              color="grey-lighten-1">
                              <Icon size="18" width="2">DotsVertical</Icon>
                            </v-btn>
                          </div>
                        </div>

                        <!-- <div class="col-auto text-secondary">
            <v-btn variant="tonal" icon="mdi-chevron-right" size="small">
              <Icon>ChevronRight</Icon>
            </v-btn>
          </div> -->
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <div v-if="false" class="col-md-6">
              <h3>Latest users</h3>
              <div class="card">
                <div class="list-group card-list-group">
                  <template v-for="item in latest" :key="item.uuid">
                    <div
                      class="list-group-item px-3 cursor-pointer text-decoration-none"
                      style="padding-top: 0.8rem; padding-bottom: 0.8rem">
                      <div class="row g-3 align-items-center">
                        <!-- <div class="col-auto text-secondary">
            <v-btn variant="text" icon="mdi-chevron-right" size="small">
              <Icon>Badge</Icon>
            </v-btn>
          </div> -->
                        <div class="col-auto">
                          <span
                            class="avatar avatar-sm"
                            style="
                              background-image: url('https://avatars.steamstatic.com/be9372d5ab3d163fd96fbe3e97b3330cc10c1165_medium.jpg');
                            "></span>
                        </div>
                        <div class="col">
                          <span class="font-serif">
                            {{ item.username || 'Anonymous' }}
                          </span>
                          <div class="v-list-item-subtitle">
                            <small class="text-muted">
                              {{ item.games || 0 }} games 🔸
                              {{ dates.timeAgo(item.updated) }}
                              <!-- {{ $moment(item.created_at).format('LL') }} 🔸 -->
                              <!-- <Icon size="16" width="1">Replace</Icon> -->
                            </small>
                          </div>
                        </div>

                        <!-- <div class="col-auto">
              <v-btn variant="tonal" size="small" color="blue-grey-lighten-1">
                Modify list
              </v-btn>
            </div> -->

                        <div class="col-auto text-secondary" @click.prevent="() => {}">
                          <div style="position: relative">
                            <v-btn
                              variant="text"
                              icon="mdi-chevron-right"
                              size="x-small"
                              color="grey-lighten-1">
                              <Icon size="18" width="2">DotsVertical</Icon>
                            </v-btn>
                          </div>
                        </div>

                        <!-- <div class="col-auto text-secondary">
            <v-btn variant="tonal" icon="mdi-chevron-right" size="small">
              <Icon>ChevronRight</Icon>
            </v-btn>
          </div> -->
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-12">
              <div class="card">
                <div class="row row-0">
                  <div class="col-auto">
                    <img
                      class="rounded-start"
                      alt="Shape of You"
                      width="80"
                      height="80" />
                  </div>
                  <div class="col">
                    <div class="card-body">
                      Shape of You
                      <div class="text-secondary">Ed Sheeran</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-12">
              <div class="card">
                <div class="row row-0">
                  <div class="col-auto">
                    <img class="rounded-start" alt="Alone" width="80" height="80" />
                  </div>
                  <div class="col">
                    <div class="card-body">
                      Alone
                      <div class="text-secondary">Alan Walker</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-12">
              <div class="card">
                <div class="row row-0">
                  <div class="col-auto">
                    <img
                      class="rounded-start"
                      alt="Langrennsfar"
                      width="80"
                      height="80" />
                  </div>
                  <div class="col">
                    <div class="card-body">
                      Langrennsfar
                      <div class="text-secondary">Ylvis</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-12">
              <div class="card">
                <div class="row row-0">
                  <div class="col-auto">
                    <img
                      class="rounded-start"
                      alt="Skibidi - Romantic Edition"
                      width="80"
                      height="80" />
                  </div>
                  <div class="col">
                    <div class="card-body">
                      Skibidi - Romantic Edition
                      <div class="text-secondary">Little Big</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-12">
              <div class="card">
                <div class="row row-0">
                  <div class="col-auto">
                    <img class="rounded-start" alt="Miracle" width="80" height="80" />
                  </div>
                  <div class="col">
                    <div class="card-body">
                      Miracle
                      <div class="text-secondary">Caravan Palace</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-12">
              <div class="card">
                <div class="row row-0">
                  <div class="col-auto">
                    <img
                      class="rounded-start"
                      alt="Different World (feat. CORSAK)"
                      width="80"
                      height="80" />
                  </div>
                  <div class="col">
                    <div class="card-body">
                      Different World (feat. CORSAK)
                      <div class="text-secondary">
                        Alan Walker, K-391, Sofia Carson, CORSAK
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card">
            <pre>
              {{ community }}
            </pre>
            <div class="list-group card-list-group">
              <div class="list-group-item">
                <div class="row g-2 align-items-center">
                  <div class="col-auto fs-3">1</div>
                  <div class="col-auto">
                    <img class="rounded" alt="Górą ty" width="40" height="40" />
                  </div>
                  <div class="col">
                    Górą ty
                    <div class="text-secondary">GOLEC UORKIESTRA, Gromee, Bedoes</div>
                  </div>
                  <div class="col-auto text-secondary">03:41</div>
                  <div class="col-auto">
                    <a href="#" class="link-secondary">
                      <button class="switch-icon" data-bs-toggle="switch-icon">
                        <span class="switch-icon-a text-muted">
                          <!-- Download SVG icon from http://tabler-icons.io/i/heart -->
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="icon">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path
                              d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>
                          </svg>
                        </span>
                        <span class="switch-icon-b text-red">
                          <!-- Download SVG icon from http://tabler-icons.io/i/heart -->
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="icon icon-filled">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path
                              d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>
                          </svg>
                        </span>
                      </button>
                    </a>
                  </div>
                  <div class="col-auto lh-1">
                    <div class="dropdown">
                      <a href="#" class="link-secondary" data-bs-toggle="dropdown">
                        <!-- Download SVG icon from http://tabler-icons.io/i/dots -->
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="icon">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                          <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                          <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                        </svg>
                      </a>
                      <div class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item" href="#">Action</a>
                        <a class="dropdown-item" href="#">Another action</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="list-group-item">
                <div class="row g-2 align-items-center">
                  <div class="col-auto fs-3">2</div>
                  <div class="col-auto">
                    <img class="rounded" alt="High Life" width="40" height="40" />
                  </div>
                  <div class="col">
                    High Life
                    <div class="text-secondary">Daft Punk</div>
                  </div>
                  <div class="col-auto text-secondary">03:21</div>
                  <div class="col-auto">
                    <a href="#" class="link-secondary">
                      <button class="switch-icon" data-bs-toggle="switch-icon">
                        <span class="switch-icon-a text-muted">
                          <!-- Download SVG icon from http://tabler-icons.io/i/heart -->
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="icon">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path
                              d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>
                          </svg>
                        </span>
                        <span class="switch-icon-b text-red">
                          <!-- Download SVG icon from http://tabler-icons.io/i/heart -->
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="icon icon-filled">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path
                              d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>
                          </svg>
                        </span>
                      </button>
                    </a>
                  </div>
                  <div class="col-auto lh-1">
                    <div class="dropdown">
                      <a href="#" class="link-secondary" data-bs-toggle="dropdown">
                        <!-- Download SVG icon from http://tabler-icons.io/i/dots -->
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="icon">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                          <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                          <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                        </svg>
                      </a>
                      <div class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item" href="#">Action</a>
                        <a class="dropdown-item" href="#">Another action</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="list-group-item">
                <div class="row g-2 align-items-center">
                  <div class="col-auto fs-3">3</div>
                  <div class="col-auto">
                    <img class="rounded" alt="Houdini" width="40" height="40" />
                  </div>
                  <div class="col">
                    Houdini
                    <div class="text-secondary">Foster The People</div>
                  </div>
                  <div class="col-auto text-secondary">03:23</div>
                  <div class="col-auto">
                    <a href="#" class="link-secondary">
                      <button class="switch-icon" data-bs-toggle="switch-icon">
                        <span class="switch-icon-a text-muted">
                          <!-- Download SVG icon from http://tabler-icons.io/i/heart -->
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="icon">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path
                              d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>
                          </svg>
                        </span>
                        <span class="switch-icon-b text-red">
                          <!-- Download SVG icon from http://tabler-icons.io/i/heart -->
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="icon icon-filled">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path
                              d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>
                          </svg>
                        </span>
                      </button>
                    </a>
                  </div>
                  <div class="col-auto lh-1">
                    <div class="dropdown">
                      <a href="#" class="link-secondary" data-bs-toggle="dropdown">
                        <!-- Download SVG icon from http://tabler-icons.io/i/dots -->
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="icon">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                          <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                          <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                        </svg>
                      </a>
                      <div class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item" href="#">Action</a>
                        <a class="dropdown-item" href="#">Another action</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="list-group-item">
                <div class="row g-2 align-items-center">
                  <div class="col-auto fs-3">4</div>
                  <div class="col-auto">
                    <img class="rounded" alt="Safe And Sound" width="40" height="40" />
                  </div>
                  <div class="col">
                    Safe And Sound
                    <div class="text-secondary">Capital Cities</div>
                  </div>
                  <div class="col-auto text-secondary">03:12</div>
                  <div class="col-auto">
                    <a href="#" class="link-secondary">
                      <button class="switch-icon" data-bs-toggle="switch-icon">
                        <span class="switch-icon-a text-muted">
                          <!-- Download SVG icon from http://tabler-icons.io/i/heart -->
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="icon">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path
                              d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>
                          </svg>
                        </span>
                        <span class="switch-icon-b text-red">
                          <!-- Download SVG icon from http://tabler-icons.io/i/heart -->
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="icon icon-filled">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path
                              d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>
                          </svg>
                        </span>
                      </button>
                    </a>
                  </div>
                  <div class="col-auto lh-1">
                    <div class="dropdown">
                      <a href="#" class="link-secondary" data-bs-toggle="dropdown">
                        <!-- Download SVG icon from http://tabler-icons.io/i/dots -->
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="icon">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                          <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                          <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                        </svg>
                      </a>
                      <div class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item" href="#">Action</a>
                        <a class="dropdown-item" href="#">Another action</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\community\index.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 18th December 2024
 * Modified: Tue 31 December 2024 - 13:33:05
 **/

export default {
  name: 'Community',

  data() {
    return {}
  },

  computed: {
    ...mapState(useGuildStore, ['community']),

    active() {
      return this.community?.active?.slice(0, 7) || []
    },

    latest() {
      return this.community?.latest?.slice(0, 7) || []
    },
  },
}
</script>
