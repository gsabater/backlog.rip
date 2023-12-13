<template>
  <!-- Page header -->
  <!-- <div class="page-header d-print-none">
      <div class="container-xl">
        <div class="row g-2 align-items-center">
          <div class="col">
            <h2 class="page-title">
              Importing games
            </h2>
          </div>
        </div>
      </div>
    </div> -->
  <!-- Page body -->
  <div class="page-body">
    <div class="container-xl">
      <div class="row row-cards">
        <div class="col-lg-8">
          <div v-if="ui.showlogs" class="card" style="border: 2px solid #d63939">
            <div class="card-body">
              <h3 class="card-title">There has been an error</h3>
              <p class="text-muted">
                We could not import your profile. Check your logs and try again or report
                the issue
              </p>
              <pre>{{ logs }}</pre>
            </div>
            <!-- Card footer -->
            <div class="card-footer">
              <div class="d-flex">
                <a href="#" class="btn btn-link">Cerrar</a>
                <a href="#" class="btn btn-primary ms-auto">Notify on Github</a>
                <a href="#" class="btn btn-primary ms-auto">Notify on Discord</a>
              </div>
            </div>
          </div>

          <!-- <div class="steps mb-4">
              <span href="#" class="step-item active" data-bs-toggle="tooltip" title="Step 4 description"></span>
              <span
                class="step-item"
                v-for="(el, i) in importer.steps" :key="i"
                :class="{'active': i == ui.step}">
                {{ el.name }}
              </span>
              <span href="#" class="step-item" data-bs-toggle="tooltip" title="Step 4 description"></span>
            </div> -->

          <div v-if="ui.error" class="card" style="border: 2px solid #d63939">
            <div class="card-body">
              <h3 class="card-title">There has been an error</h3>
              <p class="text-muted">{{ ui.error }}</p>
            </div>
            <!-- Card footer -->
            <div class="card-footer">
              <div class="d-flex">
                <a href="#" class="btn btn-link">Cerrar</a>
                <a href="#" class="btn btn-primary ms-auto">Notify on Github</a>
                <a href="#" class="btn btn-primary ms-auto">Notify on Discord</a>
              </div>
            </div>
          </div>

          <div v-if="ui.loading" class="col-lg-8 mx-auto mt-4">
            <div class="card">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-2">
                    <svg
                      width="45"
                      height="45"
                      viewBox="0 0 45 45"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="#4d72a1;">
                      <g
                        fill="none"
                        fill-rule="evenodd"
                        transform="translate(1 1)"
                        stroke-width="2">
                        <circle cx="22" cy="22" r="6" stroke-opacity="0">
                          <animate
                            attributeName="r"
                            begin="1.5s"
                            dur="3s"
                            values="6;22"
                            calcMode="linear"
                            repeatCount="indefinite" />
                          <animate
                            attributeName="stroke-opacity"
                            begin="1.5s"
                            dur="3s"
                            values="1;0"
                            calcMode="linear"
                            repeatCount="indefinite" />
                          <animate
                            attributeName="stroke-width"
                            begin="1.5s"
                            dur="3s"
                            values="2;0"
                            calcMode="linear"
                            repeatCount="indefinite" />
                        </circle>
                        <circle cx="22" cy="22" r="6" stroke-opacity="0">
                          <animate
                            attributeName="r"
                            begin="3s"
                            dur="3s"
                            values="6;22"
                            calcMode="linear"
                            repeatCount="indefinite" />
                          <animate
                            attributeName="stroke-opacity"
                            begin="3s"
                            dur="3s"
                            values="1;0"
                            calcMode="linear"
                            repeatCount="indefinite" />
                          <animate
                            attributeName="stroke-width"
                            begin="3s"
                            dur="3s"
                            values="2;0"
                            calcMode="linear"
                            repeatCount="indefinite" />
                        </circle>
                        <circle cx="22" cy="22" r="8">
                          <animate
                            attributeName="r"
                            begin="0s"
                            dur="1.5s"
                            values="6;1;2;3;4;5;6"
                            calcMode="linear"
                            repeatCount="indefinite" />
                        </circle>
                      </g>
                    </svg>
                  </div>
                  <div class="col-9">
                    <h3 class="card-title mb-1">Loading data...</h3>
                    <div class="text-muted">Working for {{ watchToHuman }} ...</div>
                    <div class="mt-3">
                      <div class="row g-2 align-items-center">
                        <!-- <div class="col-auto">
                            25%
                          </div> -->
                        <div class="col">
                          <div class="progress progress-sm">
                            <div
                              class="progress-bar progress-bar-indeterminate"
                              role="progressbar"
                              aria-valuemin="0"
                              aria-valuemax="100"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!--
              Block with account profile data
              Waiting to start the process
            -->
          <div
            v-if="process.ready && ui.step == 'prep'"
            class="container container-tight py-4">
            <div class="card card-md">
              <div class="card-body text-center">
                <div class="mb-4">
                  <h2 class="card-title mb-0">Your Steam library</h2>
                  <p class="text-muted">Click to begin to scan your games</p>
                </div>
                <div class="mb-4">
                  <span
                    class="avatar avatar-xl mb-3"
                    :style="`background-image: url('${
                      account.steam_data?.avatarfull || ''
                    }')`"></span>
                  <h3 class="mb-0">{{ account.username }}</h3>
                  <p class="text-muted">
                    Steam ID
                    <code>{{ account.steam }}</code>
                  </p>
                </div>
                <div>
                  <div class="btn btn-primary w-100" @click="scan">
                    <Icon class="me-2">ArrowsTransferDown</Icon>
                    Scan your {{ module.store }} library
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="ui.step == 'review'">
            <div class="row row-deck row-cards mb-3">
              <div class="col-12">
                <pre>
                  {{ appsToImport }}
                  --
                  {{ appsToIgnore }}
                </pre>
              </div>
              <div class="col-sm-6 col-lg-4">
                <div class="card">
                  <div class="card-body">
                    <div class="d-flex align-items-center">
                      <div class="subheader">
                        In your account
                        <!-- Adding to your library -->
                      </div>
                    </div>
                    <!-- <div class="h1 mb-3">
                      {{ data.games.length }} / {{ data.library.length }}
                      + 44% (todo)
                    </div> -->
                    <div class="d-flex align-items-baseline">
                      <div class="h2 mb-0 me-2 d-flex align-items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="icon icon-tabler icon-tabler-cards mr-2 text-muted mt-1"
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
                            d="M3.604 7.197l7.138 -3.109a.96 .96 0 0 1 1.27 .527l4.924 11.902a1 1 0 0 1 -.514 1.304l-7.137 3.109a.96 .96 0 0 1 -1.271 -.527l-4.924 -11.903a1 1 0 0 1 .514 -1.304z" />
                          <path d="M15 4h1a1 1 0 0 1 1 1v3.5" />
                          <path
                            d="M20 6c.264 .112 .52 .217 .768 .315a1 1 0 0 1 .53 1.311l-2.298 5.374" />
                        </svg>
                        {{ data.library.length }} games
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-sm-6 col-lg-4">
                <div class="card">
                  <div class="card-body">
                    <div class="d-flex align-items-center">
                      <div class="subheader">New games found</div>
                    </div>
                    <div class="h2 mb-3 d-flex align-items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon icon-tabler icon-tabler-new-section mr-2 text-muted mt-1"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M9 12l6 0" />
                        <path d="M12 9l0 6" />
                        <path
                          d="M4 6v-1a1 1 0 0 1 1 -1h1m5 0h2m5 0h1a1 1 0 0 1 1 1v1m0 5v2m0 5v1a1 1 0 0 1 -1 1h-1m-5 0h-2m-5 0h-1a1 1 0 0 1 -1 -1v-1m0 -5v-2m0 -5" />
                      </svg>
                      {{ data.appsToReview.length }} new
                    </div>
                    <!-- <b-btn block>Review</b-btn> -->
                  </div>
                </div>
              </div>
              <div class="col-sm-6 col-lg-4">
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col">
                        <div class="d-flex align-items-center">
                          <div class="subheader">updating</div>
                        </div>
                        <div class="h2 mb-3 d-flex align-items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="icon icon-tabler icon-tabler-refresh mr-2 text-muted mt-1"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                            <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                          </svg>
                          {{ data.appsToUpdate.length }}
                        </div>
                      </div>
                      <div class="col">
                        <div class="d-flex align-items-center">
                          <div class="subheader">importing</div>
                        </div>
                        <div class="h2 mb-3 d-flex align-items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="icon icon-tabler icon-tabler-step-into mr-2 text-muted mt-1"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M12 3l0 12" />
                            <path d="M16 11l-4 4" />
                            <path d="M8 11l4 4" />
                            <path d="M12 20m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                          </svg>
                          {{ appsToImport.length }}
                        </div>
                      </div>
                      <div class="col">
                        <div class="d-flex align-items-center">
                          <div class="subheader">Ignoring</div>
                        </div>
                        <div class="h2 mb-3 d-flex align-items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="icon icon-tabler icon-tabler-box-off mr-2 text-muted mt-1"
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
                              d="M17.765 17.757l-5.765 3.243l-8 -4.5v-9l2.236 -1.258m2.57 -1.445l3.194 -1.797l8 4.5v8.5" />
                            <path d="M14.561 10.559l5.439 -3.059" />
                            <path d="M12 12v9" />
                            <path d="M12 12l-8 -4.5" />
                            <path d="M3 3l18 18" />
                          </svg>
                          {{ appsToIgnore.length }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row mb-3 align-items-center" style="zoom: 0.9">
              <div class="col col-4">
                <b-input
                  v-model="table.filters.search"
                  placeholder="Filter..."
                  clearable></b-input>
              </div>
              <div class="col col-4">
                <button type="button" class="btn mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-circle-plus"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                    <path d="M9 12h6"></path>
                    <path d="M12 9v6"></path>
                  </svg>
                  <div
                    :class="{
                      'pe-2 me-2 border-end':
                        !table.filters.played || !table.filters.unplayed,
                    }">
                    Status
                  </div>
                  <span
                    v-if="table.filters.played && !table.filters.unplayed"
                    class="badge bg-indigo-lt">
                    Played
                  </span>
                  <span
                    v-if="!table.filters.played && table.filters.unplayed"
                    class="badge">
                    Not played
                  </span>
                </button>
                <b-menu>
                  <label class="dropdown-item">
                    <input
                      v-model="table.filters.played"
                      class="form-check-input m-0 me-2"
                      type="checkbox" />
                    Played
                    <!-- <span class="badge bg-primary text-primary-fg ms-auto">12</span> -->
                  </label>

                  <label class="dropdown-item">
                    <input
                      v-model="table.filters.unplayed"
                      class="form-check-input m-0 me-2"
                      type="checkbox" />
                    Not played
                    <!-- <span class="badge bg-primary text-primary-fg ms-auto">12</span> -->
                  </label>
                </b-menu>
                <b-btn
                  v-if="
                    !table.filters.played ||
                    !table.filters.unplayed ||
                    table.filters.search.length > 0
                  "
                  variant="ghost"
                  color="secondary"
                  @click="resetFilters">
                  Reset
                  <svg
                    style="margin-right: 0; margin-left: 5px"
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-square-rounded-x"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M10 10l4 4m0 -4l-4 4"></path>
                    <path
                      d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
                  </svg>
                </b-btn>
              </div>
              <div class="col text-end">
                <!-- <button type="button" class="btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-checkbox"
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
                  Toggle all
                </button>
                <b-btn @click="doit">doit</b-btn> -->
              </div>
            </div>
            <div class="card">
              <div class="list-group card-list-group list-group-hoverable">
                <div
                  v-for="(app, i) in toReview"
                  :key="'game' + i"
                  class="list-group-item"
                  @click="flagAs('import', app)">
                  <div class="row g-4 align-items-center">
                    <!-- <div class="col-auto fs-3">
                        <label class="form-check form-switch">
                          <input class="form-check-input" type="checkbox"
                            v-model="app.import">
                        </label>
                      </div> -->

                    <div v-if="app.will_import" class="col-auto">
                      <img
                        loading="lazy"
                        :src="`https://cdn.akamai.steamstatic.com/steam/apps/${app.appid}/capsule_184x69.jpg?t=1699291031`"
                        class="b-poster"
                        style="max-width: 120px" />
                    </div>
                    <div class="col">
                      <span class="d-block mb-1">
                        {{ app.name }}
                      </span>
                      <span v-if="app.will_ignore" class="badge bg-yellow-lt">
                        Will be ignored
                      </span>
                      <small class="text-muted">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="icon icon-tabler icon-tabler-clock-hour-3"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          style="zoom: 0.9">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                          <path d="M12 12h3.5"></path>
                          <path d="M12 7v5"></path>
                        </svg>

                        Played {{ dates.minToHours(app.playtime_forever) }}
                        <!-- <span class="px-1">&nbsp;</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="icon icon-tabler icon-tabler-clock-record"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          style="zoom: 0.9">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M21 12.3a9 9 0 1 0 -8.683 8.694"></path>
                          <path d="M12 7v5l2 2"></path>
                          <path d="M19 19m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                        </svg>
                        last played {{ dates.unixToDiff(app.rtime_last_played) }} -->
                      </small>
                    </div>
                    <!-- <div class="col-auto text-secondary">
                        03:41
                      </div> -->
                    <div class="col-auto">
                      <input
                        v-model="app.will_import"
                        type="checkbox"
                        class="form-check-input" />
                    </div>
                    <div
                      class="col-auto text-muted cursor-pointer"
                      @click="flagAs('ignore', app)">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon icon-tabler icon-tabler-box-off cursor-pointer"
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
                          d="M17.765 17.757l-5.765 3.243l-8 -4.5v-9l2.236 -1.258m2.57 -1.445l3.194 -1.797l8 4.5v8.5" />
                        <path d="M14.561 10.559l5.439 -3.059" />
                        <path d="M12 12v9" />
                        <path d="M12 12l-8 -4.5" />
                        <path d="M3 3l18 18" />
                      </svg>
                    </div>
                    <!-- <div class="col-auto lh-1">
                        <div class="dropdown">
                          <a href="#" class="link-secondary" data-bs-toggle="dropdown">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path><path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path></svg>
                          </a>
                        </div>
                      </div> -->
                  </div>

                  <!-- <pre>
                          {{ app }}
                        </pre> -->
                </div>
              </div>
            </div>

            <div class="row align-items-center p-2">
              <div class="col">
                <small class="text-muted">
                  {{
                    table.perPage < data.games.length ? table.perPage : data.games.length
                  }}
                  of {{ data.games.length }}
                </small>
              </div>
              <div class="col col-4 text-end">
                <b-btn
                  v-if="table.perPage < data.games.length"
                  variant="outline"
                  color="secondary"
                  @click="table.perPage += 50">
                  View 50 more
                </b-btn>

                <b-btn
                  v-if="table.perPage < data.games.length"
                  variant="outline"
                  color="secondary"
                  @click="table.perPage = 50000">
                  View all
                </b-btn>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="card" style="position: sticky; top: 20px">
            <div class="card-body">
              <div class="d-flex align-items-center mb-0">
                <div class="me-3">
                  <Icon size="26">BrandSteam</Icon>
                </div>
                <div>
                  <small class="text-muted">
                    Version {{ module.version }} by {{ module.author }}
                  </small>
                  <h3 class="lh-1">{{ module.name }}</h3>
                </div>
              </div>
              <div class="text-muted mb-1">
                {{ module.description }}
              </div>
            </div>
            <div class="card-body d-none">
              <h4 class="mb-1">What will be loaded</h4>
              <ul class="list-unstyled space-y-1">
                <li v-for="(el, i) in module.does" :key="i">
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
                  {{ el }}
                </li>
              </ul>
              <h4 class="mb-1">What cannot be imported</h4>
              <ul class="list-unstyled space-y-1">
                <li v-for="(el, i) in module.doesnot" :key="i">
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
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  {{ el }}
                </li>
                <li>
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
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  Warranty
                </li>
              </ul>
              <h4 class="mb-1">Requeriments</h4>
              <ul class="list-unstyled space-y-1">
                <li>
                  <!-- Download SVG icon from http://tabler-icons.io/i/info-circle -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon text-blue"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <circle cx="12" cy="12" r="9"></circle>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    <polyline points="11 12 12 12 12 16 13 16"></polyline>
                  </svg>
                  License and copyright notice
                </li>
              </ul>
            </div>

            <div class="card-body">
              <ul class="steps steps-vertical">
                <li
                  v-for="(step, key) in steps"
                  :key="key"
                  class="step-item"
                  :class="{ active: key == ui.step }">
                  <div class="h4 m-0">{{ step.action }}</div>
                  <div v-if="ui.step == key" class="text-muted">{{ step.desc }}</div>
                </li>
              </ul>
              <!-- <ul class="list-unstyled space-y-1">
                  <li v-for="(el, i) in module.steps" :key="i">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon text-green" width="24" height="24"
                      viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M5 12l5 5l10 -10"></path>
                    </svg>
                    {{ el }}
                  </li>
                </ul> -->
            </div>
            <div class="card-body">
              <b-btn
                block
                :color="ui.step !== 'review' ? 'secondary' : 'success'"
                :disabled="ui.step !== 'review'"
                @click="store">
                Save library
              </b-btn>
            </div>
            <div class="card-footer text-muted">
              This importer is open source. If you want to know more or are concerned
              about your privacy and security, you can
              <a href="https://github.com/gsabater/modules.backlog.rip" target="_blank">
                review the code on Github
              </a>
            </div>
          </div>

          <!-- <pre>
            {{ module.manifest }}
            </pre> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\import\[platform].vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 27th November 2022
 * Modified: Wed Dec 13 2023
 **/

/**
 * appsToReview:
 *  Array of apps to review, only new apps not in library
 *  Review means the user will check the will_import or will_ignore
 *  Also have 'exists' and 'is_updated'
 *
 * appsToImport:
 *  Array of apps to import, only the ones with will_import or will_ignore
 *
 * appsToUpdate:
 *  Array of apps already in store, that have different dates in playtime or last_played
 */

// {
//   appid: 211420,
//   name: 'DARK SOULS™: Prepare To Die Edition',
//   playtime_forever: 1286,
//   img_icon_url: 'a24804c6c8412c8cd9d50efd06bf03fa58ff80a9',
//   has_community_visible_stats: true,
//   playtime_windows_forever: 0,
//   playtime_mac_forever: 0,
//   playtime_linux_forever: 0,
//   rtime_last_played: 1418686838,
//   sort_as: 'Dark Souls',
//   has_workshop: false,
//   has_market: false,
//   will_import: true,
//   will_ignore: false,
//   has_dlc: true,
//   playtime_disconnected: 0,
// }

import steam from '~/modules/importers/steam'
import axios from 'axios'

let importer = null
const _axios = axios.create({
  timeout: 60000,
  headers: {
    // accept: 'application/ld+json',
  },
})

export default {
  name: 'LibraryImporter',
  data() {
    return {
      account: {}, // The user account -> store to import
      module: {}, // the plugin / module instance
      logs: [], // log array for the whole process

      data: {
        user: {}, // Raw of the imported userdata
        games: [], // Raw library games from the scan process
        wishlist: [], // Raw wishlist games from the scan

        library: [], // Preloaded content of user library
        appsToReview: [], // Array of apps to review, only new apps not in library
        appsToUpdate: [], // Array of apps already in store, that have different values in playtime or last_played
      },

      // helper object to control ui
      process: {
        time: 0,
        ready: true,

        progress: 0,
      },

      table: {
        page: 1,
        perPage: 10,

        filters: {
          search: '',
          played: true,
          unplayed: true,
        },
      },

      ui: {
        error: null,
        knownErrors: [
          // Account provider ID or provider object is missing from $auth
          'account:provider',
        ],

        step: 'prep',
        // step: 'review',
        watch: null,
        loading: false,
        showlogs: false,
      },
    }
  },

  computed: {
    watchToHuman() {
      if (this.process.time === 0) return '0s'
      // return tools.secondsToHuman(this.process.time)

      if (this.process.time < 60) return `${this.process.time} seconds`
      if (this.process.time < 60 && this.process.time > 3600)
        return `${Math.floor(this.process.time / 60)} minute`
      if (this.process.time < 3600 * 2)
        return `${Math.floor(this.process.time / 60)} minutes`

      return ''
    },

    steps() {
      const steps = {
        // check: {
        //   action: 'Prepare modules',
        //   desc: 'Verifying requeriments',
        // },

        prep: {
          action: 'Preparing modules',
          desc: 'Verifying requeriments and account',
        },
        games: {
          action: 'Import games',
          desc: 'Importing your games from Steam',
        },
        wishlist: {
          action: 'Import wishlist',
          desc: 'Importing your wishlist from Steam',
        },
        review: {
          action: 'Review and save',
          desc: 'Review the imported data',
        },
        complete: {
          action: 'Library updated 🎉',
          desc: 'Import process completed',
        },
      }

      if (this.module?.games !== true) {
        delete steps.games
      }

      if (this.module?.wishlist !== true) {
        delete steps.wishlist
      }

      return steps
    },

    appsToIgnore() {
      return ['wip']
    },

    toReview() {
      if (this.data.games.length === 0) return []

      const items = []

      this.data.appsToReview.forEach((el, i) => {
        if (items.length > this.table.perPage) return false

        if (
          this.table.filters.search !== '' &&
          el.name.toLowerCase().indexOf(this.table.filters.search.toLowerCase()) === -1
        )
          return false

        items.push({
          ...el,
          index: i,
        })
      })

      return items
    },

    appsToImport() {
      const items = []
      this.data.appsToReview
        .filter((el) => el.will_import === true)
        .forEach((el) => {
          items.push({
            uuid: this.$uuid(),
            steam_id: el.appid,
            name: el.name,
          })
        })

      return items
    },
  },

  methods: {
    //+-------------------------------------------------
    // _log()
    // Utility method that logs a message to the console
    // And adds it to the logs array for debugging
    // This can be called from the importer and from the module
    // When the logs are shown on the page, it will group it by
    // info, warning, error -- When an error is shown, the process is interrupted
    // -----
    // Created on Fri Dec 02 2022
    //+-------------------------------------------------
    _log(message, type = 'info', data) {
      const now = new Date().getTime()
      log(`${message}`)

      this.logs.unshift({
        type,
        time: now,
        message,
        data,
      })

      if (type == 'error') {
        this.ui.error = message

        if (!this.ui.knownErrors.includes(data)) {
          this.ui.showlogs = true
        }
      }
    },

    resetFilters() {
      this.table.filters.played = true
      this.table.filters.unplayed = true
      this.table.filters.search = ''
    },

    flagAs(flag, app) {
      const source = this.data.appsToReview.find((el) => el.appid === app.appid)

      if (flag === 'ignore') {
        source.will_ignore = !source.will_ignore
      }

      if (flag === 'import') {
        source.will_import = !source.will_import
      }
    },

    // controlApp(item) {
    //   this.data.games[item.index].will_import = !item.will_import
    // },

    //+-------------------------------------------------
    // import()
    // Main call that will execute the importing methods
    // available on the module
    // -----
    // Created on Thu Dec 01 2022
    //+-------------------------------------------------
    async scan() {
      log(`🧶 Starting data import...`)
      this.ui.loading = true
      this.ui.step = 'games'

      try {
        this.data.library = await this.$db.games.where('steam_id').above(0).toArray()
        this._log(`📚 Library loaded`)

        this.data.user = await steam.getUserdata()
        this._log(`👩‍🚀 Account store userdata received`)

        this.data.games = await steam.getGames()
        this._log(`🎮 Games received`)

        // this.data.wishlist = await steam.getWishlist()
        // this._log(`🎁 Wishlist received`)
      } catch (e) {
        this._log('Error getting user data', 'error', e)
        return false
      }

      console.warn(this.data)
      this.ui.loading = false

      this.review()
    },

    //+-------------------------------------------------
    // review()
    // Generate helper arrays with prepared data
    // -----
    // Created on Mon Nov 20 2023
    //+-------------------------------------------------
    review() {
      this.ui.step = 'review'

      const libraryKeys = this.data.library.reduce((acc, el) => {
        acc[el.steam_id] = el
        return acc
      }, {})

      console.warn('reviewing libraryKeys', libraryKeys)

      this.data.appsToReview = this.data.games
        .filter((game) => !(game.appid in libraryKeys))
        .map((el) => {
          el.will_import = false
          el.will_ignore = false
          return el
        })
        .sort((a, b) => {
          // Primary sort by 'playtime_forever'
          const diff = b.playtime_forever - a.playtime_forever
          if (diff !== 0) return diff

          // Secondary sort by 'name' (alphabetically)
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
          return 0
        })

      console.warn('reviewing appsToReview', this.data.appsToReview)
    },

    async doit() {
      // This will be done in the future
      // this.data.appsToUpdate = this.data.games.filter((game) => {
      //   if (!(game.appid in libraryKeys)) return false
      //   const lib = libraryKeys[game.appid]
      //   if (lib.playtime_forever !== game.playtime_forever) return true
      //   if (lib.rtime_last_played !== game.rtime_last_played) return true
      //   return false
      // })
      // // const toimport = this.data.games.filter((el) => el.will_import === true)
      // console.warn('doit', this.toImport[0])
      // console.warn('we have', this.toImport.length)
      // this.data.library = await this.$db.games.where('steam_id').above(0).toArray()
      // console.warn(`📚 Library loaded`, this.data.library, this.data.library.length)
      // debugger
      // const xhr = await this.$db.games.bulkPut(this.toImport)
      // console.warn('xhr', xhr)
    },

    async store() {
      // const randomGames = []
      // for (let i = 0; i < 3; i++) {
      //   const randomIndex = Math.floor(Math.random() * this.data.appsToReview.length)
      //   const pick = this.data.appsToReview[randomIndex]
      //   randomGames.push({
      //     uuid: this.$uuid(),
      //     steam_id: pick.appid,
      //     name: pick.name,
      //   })
      //   // this.data.appsToReview.splice(randomIndex, 1)
      // }

      const formattedGames = []
      this.data.appsToReview
        .filter((el) => el.will_import === true)
        .forEach((el) => {
          const app = {
            uuid: this.$uuid(),
            steam_id: el.appid,
            name: el.name,
          }

          if (app.will_ignore) {
            app.ignored = true
          }
          formattedGames.push(app)
        })

      // const toimport = this.data.games.filter((el) => el.will_import === true)
      console.warn('doit', formattedGames[0])
      console.warn('we have', formattedGames.length)

      debugger

      const xhr = await this.$db.games.bulkPut(formattedGames)
      console.warn('xhr', xhr)
    },

    //+-------------------------------------------------
    // connect()
    // Receives the module manifest, and gives the module
    // some data and methods to work with
    // -----
    // Created on Sat Oct 28 2023
    //+-------------------------------------------------
    async connect() {
      log('⬇️ importer', 'connect()')

      let connected = false
      this.module = steam.manifest
      importer = steam

      log('Manifest loaded', steam.manifest)
      log('Steps of the importing process', Object.keys(this.steps).join(', '))

      try {
        connected = importer.connect(this.account, _axios, this._log)
      } catch (e) {
        this._log('Error connecting to the importer', 'error', e)
        return false
      }

      if (connected) {
        this._log('🆗 Importer ready to use')
        this.process.ready = true
      }
    },

    //+-------------------------------------------------
    // detect()
    // First contact with the importer, called automatically on mount.
    // - Detects if the platform is valid
    // - Detects that the requested importer is present and available
    // - Detect if the user is logged in
    // - Also detects the browser has support for IndexedDB
    // - And finally detects that the importer has the required methods
    // -----
    // Created on Sat Oct 28 2023
    // Updated on Wed Dec 13 2023
    //+-------------------------------------------------
    detect() {
      log('⬇️ importer', 'detect()')

      const { platform } = this.$route.params
      this._log(`🎨 Platform ID: ${platform}`)

      if (this.$route.params.platform !== 'steam') return false

      if (steam == undefined) {
        this._log('The Steam importer plugin is not available', 'error')
        return false
      }

      if (
        !this.$auth.bearer ||
        !this.$auth.user[platform] ||
        !this.$auth.user[platform + '_data']
      ) {
        this._log('User needs to login with provider', 'error', 'account:provider')
        return false
      }

      this.account = { ...this.$auth.user }
      this.account.bearer = this.$auth.bearer
      this.account.provider = this.account.steam_data

      if (
        steam.getUserdata === undefined ||
        steam.getGames === undefined ||
        steam.getWishlist === undefined
      ) {
        console.warn(steam)
        this._log(
          'The Steam instance is not complete, some methods are not present',
          'error'
        )
        return false
      }

      return true
    },

    async init() {
      window.dev = this

      log('⬇️ importer', 'init()')
      this._log('✨ Initializing the importer')

      if (this.detect()) await this.connect()

      // this.ui.watch = setInterval(() => {
      //   this.process.time++
      //   if (this.process.time <= 3) log(this.process.time)
      // }, 1000)
    },
  },

  mounted() {
    this.init()
  },

  unmounted() {
    log('⬇️ importer', 'unmounted()')
    // clearInterval(this.ui.watch)
  },
}
</script>
