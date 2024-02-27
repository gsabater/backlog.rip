<template>
  <div class="page-body">
    <div class="container-xl">
      <div class="row row-cards">
        <div class="col-lg-8">
          <!--
            *+---------------------------------
            *| Block of errors
            *| Shown when ui.showLogs == true
            *+--------------------------------- -->
          <div v-if="ui.showlogs" class="card" style="border: 2px solid #d63939">
            <div class="card-body">
              <h3 class="card-title">There has been an error</h3>
              <p class="text-muted">
                The importing process has encountered an error. Please, check your logs
                and try again or report the issue
              </p>
              <pre>{{ logs }}</pre>
            </div>
            <!-- Card footer -->
            <div class="card-footer">
              <div class="d-flex">
                <a
                  href="https://github.com/gsabater/backlog.rip"
                  target="_blank"
                  class="btn btn-primary ms-auto">
                  <Icon class="me-2">BrandGithub</Icon>
                  Report on Github
                </a>
                <a
                  href="https://discord.gg/F2sPE5B"
                  target="_blank"
                  class="btn btn-primary ms-auto">
                  <Icon class="me-2">BrandDiscord</Icon>
                  Report on Discord
                </a>
              </div>
            </div>
          </div>

          <!--
            *+---------------------------------
            *| Block of login
            *| Shown when the error is account:provider
            *+--------------------------------- -->
          <div
            v-if="ui.error == 'account:provider'"
            class="container container-tight py-4">
            <div class="card card-md">
              <div class="card-body text-center">
                <div class="mb-4">
                  <h2>You need to login first</h2>
                  <p class="text-secondary mb-4">
                    In order to get your Steam library, you have to login with your Steam
                    account. This is a safe process, and only your SteamID will be shared
                    with us.
                  </p>
                </div>
                <div>
                  <a class="btn btn-github" href="https://api.backlog.rip/auth/steam">
                    <Icon class="me-2">BrandSteam</Icon>
                    Sign in with Steam
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!--
            *+---------------------------------
            *| Loading block
            *| Shown when ui.loading == true
            *+--------------------------------- -->
          <div v-if="ui.loading" class="col-lg-8 mx-auto mt-4">
            <div class="card">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-12">
                    <h3 class="card-title mb-1">Scanning library...</h3>
                    <!-- <div class="text-muted">Working for {{ watchToHuman }} ...</div> -->
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
            *+---------------------------------
            *| Main waiting to start block
            *| Show account data and start button
            *+--------------------------------- -->
          <div
            v-if="process.ready && ui.step == 'prep'"
            class="container container-tight py-3">
            <div class="card card-md">
              <div class="card-body text-center">
                <div class="mb-4">
                  <h2 class="mb-0">Your Steam library</h2>
                  <!-- <p class="text-muted">Click to begin to scan your games</p> -->
                </div>
                <span
                  class="avatar avatar-xl mb-3"
                  :style="`background-image: url('${
                    account.steam_data?.avatarfull || ''
                  }')`"></span>
                <div class="mb-6">
                  <h3 class="card-title mb-0">
                    {{ account.username }} on {{ module.store }}
                  </h3>
                  <p class="text-muted">
                    SteamID
                    <code>{{ account.steam }}</code>
                  </p>
                </div>
                <div>
                  <div class="btn btn-primary w-100 mb-2" @click="scanAndPrepare">
                    <Icon class="me-2">ArrowsTransferDown</Icon>
                    Import your {{ module.store }} library
                  </div>
                  <small class="text-muted">
                    Last update, {{ dates.timeAgo($auth.user.steam_updated_at) }}
                  </small>
                </div>
              </div>
            </div>
          </div>

          <!--
            *+---------------------------------
            *| Small review window
            *| Shows overview of imported data
            *+--------------------------------- -->
          <div v-if="ui.step == 'review'" class="col-lg-8 mx-auto mt-4">
            <div class="card">
              <div class="card-body">
                <h2>Data received successfully</h2>
                <div class="row">
                  <div class="col">
                    <div class="card mb-2">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <div class="subheader">New games found</div>
                        </div>
                        <div class="h2 mb-1 d-flex align-items-center">
                          <Icon class="mr-2 text-muted mt-1">NewSection</Icon>
                          {{ data.appsToReview.length }} new
                          <br />
                        </div>
                        <!-- <b-btn block>Review</b-btn> -->
                      </div>
                    </div>
                  </div>

                  <div class="col">
                    <div class="card mb-3">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <div class="subheader">Updated existing</div>
                        </div>
                        <div class="h2 mb-1 d-flex align-items-center">
                          <Icon class="mr-2 text-muted mt-1">Refresh</Icon>
                          {{ data.appsToUpdate.length }}
                          <br />
                        </div>
                        <!-- <b-btn block>Review</b-btn> -->
                      </div>
                    </div>
                  </div>

                  <div
                    v-if="data.steambacklog && data.steambacklog.account"
                    class="col-12">
                    <div class="card">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <label class="form-label">
                            Your steam-backlog.com account has been found
                          </label>
                        </div>

                        <div class="mb-3">
                          <div class="text-secondary mb-3">
                            In future updates we will be able to import your old backlog
                            account
                          </div>

                          <ul class="list-unstyled space-y">
                            <li class="row g-2">
                              <span class="col-auto">
                                <Icon class="me-1 text-success">Check</Icon>
                              </span>
                              <span class="col">
                                <strong class="d-block">
                                  Backlog status on your library
                                </strong>
                                <span class="d-block text-secondary">
                                  Your completed games, games to play and more
                                </span>
                              </span>
                            </li>
                            <li class="row g-2">
                              <span class="col-auto">
                                <Icon class="me-1 text-success">Check</Icon>
                              </span>
                              <span class="col">
                                <strong class="d-block">
                                  {{ data.steambacklog.collections.length }} collections
                                </strong>
                                <span class="d-block text-secondary">
                                  Each collection with every game in it
                                </span>
                              </span>
                            </li>
                            <!-- <li class="row g-2">
                              <span class="col-auto">
                                <Icon class="me-1 text-success">Check</Icon>
                              </span>
                              <span class="col">
                                <strong class="d-block">Personalize</strong>
                                <span class="d-block text-secondary">
                                  Choose your own style, watch what you like.
                                </span>
                              </span>
                            </li> -->
                          </ul>

                          <label v-if="false" class="form-check">
                            <input class="form-check-input" type="checkbox" />
                            <span class="form-check-label">Import states</span>
                            <!-- <span class="form-check-description">
                              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            </span> -->
                          </label>
                          <label v-if="false" class="form-check">
                            <input class="form-check-input" type="checkbox" />
                            <span class="form-check-label">Import collections</span>
                            <!-- <span class="form-check-description">
                              Ab alias aut, consequuntur cumque esse eveniet incidunt
                              laborum minus molestiae.
                            </span> -->
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="text-secondary p-2">
                  <p>
                    You can review the list and select which games you want to import or
                    just import everything
                  </p>
                </div>
              </div>

              <div class="card-footer">
                <div class="w-100">
                  <div class="row">
                    <div class="col">
                      <div class="btn w-100" @click="ui.step = 'review:plus'">
                        Review your data
                      </div>
                    </div>
                    <div class="col">
                      <div class="btn btn-success w-100">Update everything</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!--
            *+---------------------------------
            *| Review interface
            *| Can edit everything
            *+--------------------------------- -->
          <div v-if="ui.step == 'review:plus'">
            <div class="row row-deck row-cards mb-5">
              <div class="col-sm-6 col-lg-4">
                <div class="card">
                  <div class="card-body">
                    <div class="d-flex align-items-center">
                      <div class="subheader">Already in your library</div>
                    </div>
                    <!-- <div class="h1 mb-3">
                      {{ data.games.length }} / {{ data.library.length }}
                      + 44% (todo)
                    </div> -->
                    <div class="d-flex align-items-baseline">
                      <div class="h2 mb-0 me-2 d-flex align-items-center">
                        <Icon class="mr-2 text-muted mt-1">Cards</Icon>
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
                    <div class="h2 mb-1 d-flex align-items-center">
                      <Icon class="mr-2 text-muted mt-1">NewSection</Icon>
                      {{ data.appsToReview.length }} new
                      <br />
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
                          <div class="subheader">importing</div>
                        </div>
                        <div class="h2 mb-1 d-flex align-items-center">
                          <Icon class="mr-2 text-muted mt-1">StepInto</Icon>
                          {{ appsToImport.length }}
                        </div>
                      </div>
                      <div class="col">
                        <div class="d-flex align-items-center">
                          <div class="subheader">updating</div>
                        </div>
                        <div class="h2 mb-1 d-flex align-items-center">
                          <Icon class="mr-2 text-muted mt-1">Refresh</Icon>
                          {{ data.appsToUpdate.length }}
                        </div>
                      </div>
                      <div class="col">
                        <div class="d-flex align-items-center">
                          <div class="subheader">Ignoring</div>
                        </div>
                        <div class="h2 mb-1 d-flex align-items-center">
                          <Icon class="mr-2 text-muted mt-1">SquareRotatedOff</Icon>
                          {{ appsToIgnore.length }}
                          <!-- <br />
                          <span class="d-block text-muted">view</span> -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row mb-3 align-items-center" style="zoom: 0.9">
              <div class="col-4">
                <b-input
                  v-model="table.filters.search"
                  placeholder="Filter..."
                  clearable></b-input>
              </div>
              <div class="col-5">
                <label class="form-check form-switch my-0 mx-2">
                  <input
                    class="form-check-input position-static"
                    type="checkbox"
                    :checked="tabs.appsToReview.count == tabs.appsToImport.count"
                    @click="toggleAll" />
                  <span class="form-check-label form-check-label-on">
                    Click to unselect everything
                  </span>
                  <span class="form-check-label form-check-label-off">
                    Click to select
                    {{ tabs.appsToReview.count }}
                    games
                  </span>
                </label>

                <!-- <button type="button" class="btn mr-2">
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
                  </label>

                  <label class="dropdown-item">
                    <input
                      v-model="table.filters.unplayed"
                      class="form-check-input m-0 me-2"
                      type="checkbox" />
                    Not played
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
                  <Icon style="margin-right: 0; margin-left: 5px">SquareRoundedX</Icon>
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
                </b-btn> -->
              </div>
              <div class="col text-end">
                <button class="btn dropdown-toggle pe-2">
                  <span class="badge text-blue me-2">
                    {{ tabs[ui.tab].count }}
                  </span>
                  {{ tabs[ui.tab].label }}
                </button>
                <b-menu position="end">
                  <template v-for="(tab, i) in tabs" :key="'tab' + i">
                    <label class="dropdown-item" @click="ui.tab = i">
                      <!-- <input class="form-check-input m-0 me-2" type="checkbox" /> -->
                      {{ tab.label }}
                      <span class="badge text-blue ms-auto">
                        {{ tab.count }}
                      </span>
                    </label>
                  </template>
                </b-menu>
              </div>
            </div>
            <div class="card">
              <div v-if="false" class="card-footer py-3">
                <div class="row g-4 align-items-center">
                  <div v-if="ui.tab == 'appsToReview'" class="col-1">
                    <input disabled type="checkbox" class="form-check-input disabled" />
                  </div>
                  <div class="col-auto"></div>
                  <div class="col"></div>
                  <div class="col-auto text-end">
                    <small class="text-muted">
                      {{
                        table.perPage < data.games.length
                          ? table.perPage
                          : data.games.length
                      }}
                      of {{ data.games.length }}
                    </small>

                    <small class="text-muted">
                      Found {{ data.appsToReview.length }} new games
                      <br />
                      of {{ data.games.length }} in your {{ module.store }} library
                    </small>
                  </div>
                </div>
              </div>
              <div class="list-group card-list-group list-group-hoverable">
                <div
                  v-for="(app, i) in loopToReview"
                  :key="'game' + i"
                  class="list-group-item cursor-pointer"
                  style="border-style: solid"
                  :class="{
                    active: app.will_import,
                  }"
                  @click="flagAs('import', app)">
                  <div class="row g-4 align-items-center">
                    <div class="col-auto fs-3">
                      <label class="form-check form-switch mb-0 ms-2">
                        <input
                          :checked="app.will_import"
                          class="form-check-input"
                          type="checkbox" />
                      </label>
                    </div>

                    <div class="col-auto">
                      <img
                        loading="lazy"
                        :src="`https://cdn.akamai.steamstatic.com/steam/apps/${
                          app.appid || app.steam_id
                        }/capsule_184x69.jpg?t=1699291031`"
                        class="b-poster"
                        style="max-width: 120px" />
                    </div>
                    <div class="col">
                      <p class="d-block mb-1">
                        {{ app.name }}
                      </p>

                      <template v-if="ui.tab == 'appsToImport'">
                        <small class="text-muted">Will be added to your library</small>
                      </template>

                      <template v-if="app.will_ignore || ui.tab == 'appsToIgnore'">
                        <small class="text-muted text-red">
                          Will be ignored and won't be shown again
                        </small>
                      </template>

                      <template v-if="ui.tab == 'appsToUpdate'">
                        <div v-if="app.toUpdate.owned" class="mb-2">
                          <span class="badge bg-teal-lt text-green">
                            + Marking the game as owned in your library
                          </span>
                        </div>

                        <div v-if="app.toUpdate.playtime" class="mb-2">
                          <span class="badge bg-teal-lt text-green">
                            + Updating playtime on Steam from "xx" to
                            <strong>
                              {{ dates.minToHours(app.playtime_forever) }}
                            </strong>
                          </span>
                        </div>

                        <div v-if="app.toUpdate.last_played" class="mb-2">
                          <span class="badge bg-teal-lt text-green">
                            + Updating your last played date on steam to
                            {{ app.last_played }}
                          </span>
                        </div>
                      </template>

                      <template v-if="ui.tab == 'appsToReview' && !app.will_ignore">
                        <small class="text-muted">
                          <Icon size="14" style="transform: translateY(-2px)">
                            ClockHour3
                          </Icon>
                          Played {{ dates.minToHours(app.playtime_forever) }}
                        </small>
                      </template>

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
                    </div>
                    <div class="col-auto text-secondary">
                      <code v-tippy="'Steam appid'">
                        #{{ app.appid || app.steam_id }}
                      </code>
                    </div>

                    <div
                      v-if="ui.tab == 'appsToReview'"
                      v-tippy="{
                        content:
                          'Click to ignore.<br>Ignored games will not be shown again.',
                        allowHTML: true,
                      }"
                      class="col-auto text-muted cursor-pointer"
                      @click.stop="flagAs('ignore', app)">
                      <Icon>SquareRotatedOff</Icon>
                    </div>
                    <!-- <div class="col-auto lh-1">
                      <Icon class="link-secondary">Dots</Icon>

                    </div> -->
                  </div>
                </div>
              </div>
            </div>

            <b-btn
              v-if="table.perPage < data.games.length"
              color="primary"
              class="w-100 my-4"
              @click="table.perPage += 100">
              View more
            </b-btn>
          </div>

          <!--
            Block with account profile data
            Waiting to start the process
          -->
          <div v-if="ui.step == 'complete'" class="container container-tight py-4">
            <div class="card card-md">
              <div class="card-body text-center">
                <h2 class="mb-2">awesome</h2>

                <div class="mb-4">
                  Your library has been updated with
                  {{ appsToImport.length }} new games
                </div>

                <div>
                  <NuxtLink to="/library" class="btn btn-primary w-100">
                    <Icon class="me-2">Apps</Icon>
                    View your library and backlog
                  </NuxtLink>

                  <!-- <div class="btn btn-primary w-100" @click="store">Again</div>
                  <div class="btn btn-primary w-100" @click="$importer.notify()">
                    only wrap
                  </div> -->
                </div>
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
            <div v-if="['review', 'complete'].includes(ui.step)" class="card-body">
              <b-btn
                block
                :color="ui.step !== 'review' ? 'secondary' : 'success'"
                :disabled="ui.step !== 'review'"
                @click="store">
                Save your library
              </b-btn>
              <!-- v-if="ui.step == 'complete'" <b-btn v-else block color="success">View library</b-btn> -->
            </div>
            <div class="card-footer text-muted">
              This module is open source. If you want to know more about the code or
              review your privacy and security, you can
              <a href="https://github.com/gsabater/modules.backlog.rip" target="_blank">
                check the code on Github.
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
 * Modified: Tue Feb 27 2024
 **/

const importer = null

export default {
  name: 'LibraryImporter',
  data() {
    return {
      logs: [], // log array for the whole process
      module: {}, // the plugin / module manifest
      account: {}, // The user account -> store to import

      data: {
        user: {}, // Raw of the imported userdata
        games: [], // Raw library games from the scan process
        library: [], // Preloaded content of user library
        steambacklog: {},

        appsToReview: [], // Processed array of apps missing in library
        appsToUpdate: [], // Processed array of apps already in library, that needs to update fields
      },

      // helper object to control ui
      process: {
        ready: false,

        // time: 0,
        // progress: 0,
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
        tab: 'appsToReview',

        loading: false,
        showlogs: false,
      },
    }
  },

  computed: {
    // ...mapStores(useDataStore, useJournalStore),

    // watchToHuman() {
    //   if (this.process.time === 0) return '0s'
    //   // return tools.secondsToHuman(this.process.time)

    //   if (this.process.time < 60) return `${this.process.time} seconds`
    //   if (this.process.time < 60 && this.process.time > 3600)
    //     return `${Math.floor(this.process.time / 60)} minute`
    //   if (this.process.time < 3600 * 2)
    //     return `${Math.floor(this.process.time / 60)} minutes`

    //   return ''
    // },

    platform() {
      return this.$route.params?.platform || null
    },

    steps() {
      const steps = {
        prep: {
          action: 'Preparing module',
          desc: 'Verifying requeriments and account',
        },

        games: {
          action: 'Import games',
          desc: 'Importing your games from Steam',
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

    tabs() {
      // > view to review > view played, view unplayed > view to ignore > view to
      //           update > import all > import none

      const tabs = {
        appsToReview: {
          label: 'new games',
          object: 'data.appsToReview',
          count: this.data.appsToReview.length,
        },

        appsToImport: {
          label: 'to be imported',
          object: 'appsToImport',
          count: this.appsToImport.length,
        },

        appsToUpdate: {
          label: 'to be updated',
          object: 'data.appsToUpdate',
          count: this.data.appsToUpdate.length,
        },

        appsToIgnore: {
          label: 'to be ignored',
          object: 'appsToIgnore',
          count: this.appsToIgnore.length,
        },
      }

      return tabs
    },

    //+-------------------------------------------------
    // loopToReview()
    // Used to display apps in the upper list
    // Takes this.ui.tab and returns the reference array
    // Has basic datatable controls
    // -----
    // Created on Tue Jan 30 2024
    //+-------------------------------------------------
    loopToReview() {
      if (this.data.games.length === 0) return []

      let loop = []
      const items = []

      let source = this.tabs[this.ui.tab].object

      if (source.indexOf('data.') == -1) {
        loop = this[source]
      } else {
        source = source.replace('data.', '')
        loop = this.data[source]
      }

      loop.forEach((el, i) => {
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

    //+-------------------------------------------------
    // appsToImport()
    // Array of apps that will be imported
    // Only apps with will_import === true
    // basic object with uuid, store_id and name
    // -----
    // Created on Thu Dec 14 2023
    //+-------------------------------------------------
    appsToImport() {
      const items = []

      this.data.appsToReview
        .filter((el) => el.will_import === true)
        .forEach((el) => {
          items.push({
            // uuid: this.$uuid(),
            [this.platform + '_id']: el.appid,
            name: el.name,
            is: {
              owned: true,
            },
            data: el,
            will_import: true,
          })
        })

      return items
    },

    //+-------------------------------------------------
    // appsToIgnore()
    // -----
    // Created on Thu Dec 14 2023
    //+-------------------------------------------------
    appsToIgnore() {
      const items = []

      this.data.appsToReview
        .filter((el) => el.will_ignore === true)
        .forEach((el) => {
          items.push({
            // uuid: this.$uuid(),
            [this.platform + '_id']: el.appid,
            name: el.name,
            is: {
              owned: true,
              ignored: true,
            },
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
        if (this.ui.knownErrors.includes(data)) {
          this.ui.error = data
        }
        // else {
        //   this.ui.error = message
        //   this.ui.showlogs = true
        // }

        if (this.ui.error) {
          this.ui.showlogs = false
        }
      }
    },

    //+-------------------------------------------------
    // toggleAll()
    // Toggles and select all the apps in the list to import
    // -----
    // Created on Tue Jan 30 2024
    //+-------------------------------------------------
    toggleAll() {
      const action =
        this.data.appsToReview.length == this.appsToImport.length ? 'none' : 'all'

      this.data.appsToReview.forEach((el) => {
        el.will_import = action == 'all' ? true : false
      })
    },

    //+-------------------------------------------------
    // flagAs()
    // When reviewing, get the app object and flag it as
    // -----
    // Created on Tue Jan 30 2024
    //+-------------------------------------------------
    flagAs(flag, app) {
      const source = this.data.appsToReview.find(
        (el) => el.appid === (app.appid || app.steam_id)
      )

      if (flag === 'ignore') {
        source.will_import = false
        source.will_ignore = !source.will_ignore
      }

      if (flag === 'import') {
        source.will_ignore = false
        source.will_import = !source.will_import
      }
    },

    // controlApp(item) {
    //   this.data.games[item.index].will_import = !item.will_import
    // },

    // //+-------------------------------------------------
    // // import()
    // // Main call that will execute the importing methods
    // // available on the module
    // // -----
    // // Created on Thu Dec 01 2022
    // //+-------------------------------------------------
    // async OLDscan() {
    //   log(`🧶 Starting data import...`)
    //   this.ui.loading = true
    //   this.ui.step = 'games'

    //   try {
    //     this.data.library = await this.$db.games.where('steam_id').above(0).toArray()
    //     this._log(`📚 Library loaded`)

    //     this.data.user = await steam.getUserdata()
    //     this._log(`👩‍🚀 Account store userdata received`)

    //     this.data.games = await steam.getGames()
    //     this._log(`🎮 Games received`)

    //     // this.data.wishlist = await steam.getWishlist()
    //     // this._log(`🎁 Wishlist received`)
    //   } catch (e) {
    //     this._log('Error getting user data', 'error', e)
    //     return false
    //   }

    //   console.warn(this.data)
    //   this.ui.loading = false

    //   this.review()
    // },

    // //+-------------------------------------------------
    // // review()
    // // Generate helper arrays with prepared data
    // // -----
    // // Created on Mon Nov 20 2023
    // //+-------------------------------------------------
    // review() {
    //   this.ui.step = 'review'

    //   this.data.libIDs = this.data.library.reduce((acc, el) => {
    //     acc[el.steam_id] = el
    //     return acc
    //   }, {})
    //   // console.warn(this.data.libIDs)

    //   //+-------------------------------------------------
    //   // Categorize found games with the library
    //   // And create two new groups: review and update
    //   //+-------------------------------------------------
    //   this.data.games.forEach((app) => {
    //     if (app.appid in this.data.libIDs) {
    //       // <- match by store_id instead of appid
    //       let add = false
    //       const lib = this.data.libIDs[app.appid]

    //       app.toUpdate = {}

    //       if (!lib.is?.owned) {
    //         add = true
    //         app.toUpdate.owned = true
    //       }

    //       if (lib.playtime?.steam !== app.playtime_forever) {
    //         add = true
    //         app.toUpdate.playtime = {
    //           from: lib.playtime?.steam,
    //           to: app.playtime_forever,
    //         }
    //       }

    //       if (lib.last_played?.steam !== app.rtime_last_played) {
    //         add = true
    //         app.toUpdate.last_played = {
    //           from: lib.last_played?.steam,
    //           to: app.rtime_last_played,
    //         }
    //       }

    //       if (add) this.data.appsToUpdate.push(app)
    //     } else {
    //       app.will_import = true
    //       app.will_ignore = false

    //       this.data.appsToReview.push(app)
    //     }
    //   })

    //   this.data.appsToReview.sort((a, b) => {
    //     // Primary sort by 'playtime_forever'
    //     const diff = b.playtime_forever - a.playtime_forever
    //     if (diff !== 0) return diff

    //     // Secondary sort by 'name' (alphabetically)
    //     if (a.name < b.name) return -1
    //     if (a.name > b.name) return 1
    //     return 0
    //   })

    //   console.warn('reviewing apps')
    //   console.warn('appsToReview', this.data.appsToReview)
    //   console.warn('appsToUpdate', this.data.appsToUpdate)
    // },

    //+-------------------------------------------------
    // store()
    // Process:
    // - appsToImport
    // - appsToUpdate
    // - appsToIgnore
    // -----
    // Created on Thu Dec 14 2023
    //+-------------------------------------------------
    async store() {
      log('✨ importer', 'store()')

      await this.$importer.store({
        notify: true,
        journal: true,
        apps: {
          toUpdate: this.data.appsToUpdate,
          toImport: this.appsToImport,
          toIgnore: this.appsToIgnore,
        },
      })

      this.ui.step = 'complete'
      return
      // const payload = []

      // await this.storeNewGames()
      // // this.updateExistingGames()

      // const keys = this.appsToImport.map((el) => el.uuid)
      // this.journalStore.add({
      //   event: 'added',
      //   data: {
      //     store: this.module.store,
      //     games: keys,
      //   },
      // })

      // this.ui.step = 'complete'
      // return

      // this.data.appsToReview
      //   .filter((el) => el.will_import === true)
      //   .forEach((el) => {
      //     const app = {
      //       uuid: this.$uuid(),
      //       steam_id: el.appid,
      //       name: el.name,
      //     }

      //     if (app.will_ignore) {
      //       app.ignored = true
      //     }
      //     payload.push(app)
      //   })

      // // const toimport = this.data.games.filter((el) => el.will_import === true)
      // console.warn('doit', payload[0])
      // console.warn('we have', payload.length)

      // debugger
    },

    // //+-------------------------------------------------
    // // storeNewGames()
    // // Take appsToImport and appsToIgnore
    // // and store them in the data store
    // // -----
    // // Created on Fri Dec 22 2023
    // //+-------------------------------------------------
    // async storeNewGames() {
    //   const items = []

    //   this.appsToImport.forEach((el) => {
    //     let app = this.dataStore.prepareToStore(el, 'steam')
    //     app = steam.prepareToStore(app)
    //     items.push(app)
    //   })

    //   this.appsToIgnore.forEach((el) => {
    //     const app = this.dataStore.prepareToStore(el, 'toIgnore')
    //     items.push(app)
    //   })
    //   debugger
    //   this.dataStore.store(items)
    // },

    // updateExistingGames() {
    //   const items = []

    //   // call a method in steam.js
    //   // that adds playtime (here and in storenewgames)
    //   // if (lib.playtime_forever !== game.playtime_forever) return true
    //   //   if (lib.rtime_last_played !== game.rtime_last_played) return true

    //   console.warn('going to update', items)
    // },

    //+-------------------------------------------------
    // scanAndPrepare()
    // Tell the $importer to scan, and review the results
    // -----
    // Created on Fri Jan 26 2024
    //+-------------------------------------------------
    async scanAndPrepare() {
      log('✨ importer', 'detectAndConnect()')

      this.ui.loading = true
      this.ui.step = 'games'

      const data = await this.$importer.scan({
        background: false,
      })

      this.data.user = data.data.user
      this.data.games = data.data.games
      this.data.library = data.data.library
      this.data.steambacklog = data.data.steambacklog

      this.data.appsToReview = data.apps.toReview
      this.data.appsToUpdate = data.apps.toUpdate

      console.warn(this.data, data.apps.toReview)
      this.data.appsToReview.sort((a, b) => {
        // Primary sort by 'playtime_forever'
        const diff = b.playtime_forever - a.playtime_forever
        if (diff !== 0) return diff

        // Secondary sort by 'name' (alphabetically)
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
      })

      this.ui.step = 'review'
      this.ui.loading = false
    },

    //+-------------------------------------------------
    // detectAndConnect()
    // initialize the $importer plugin instance
    // -----
    // Created on Fri Jan 26 2024
    //+-------------------------------------------------
    async detectAndConnect() {
      log('✨ importer', 'detectAndConnect()')

      const connection = await this.$importer.sync({
        log: this._log,
        platform: this.platform,
        background: false,
      })

      if (connection) {
        this.account = connection.account
        this.module = connection.module.manifest

        this._log('🆒 Waiting to the user to start the scan')
        this.process.ready = true
        return
      }

      this._log(
        'The importer could not be started, this is likely a programming problem. Try reloading the page and start again. If the problem persists, please report it.',
        'error'
      )
    },

    async init() {
      console.clear()
      this._log('✨ Initializing the importer')
      this.detectAndConnect()
    },
  },

  mounted() {
    window.dev = this
    this.init()
  },

  unmounted() {
    log('💠 importer', 'unmounted()')
  },
}
</script>
