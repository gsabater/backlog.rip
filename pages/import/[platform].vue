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
            *| Error block
            *| Shown when the error is library:empty
            *+--------------------------------- -->
          <div v-if="ui.error == 'library:empty'" class="container container-tight py-4">
            <div class="card card-md">
              <div class="card-body text-center">
                <div class="mb-4">
                  <h2>No games have been found</h2>
                  <p class="text-secondary mb-4">
                    The response from Steam was empty.
                    <br />
                    If you have games on your account, please review
                    <a href="https://steamcommunity.com/my/edit/settings" target="_blank">
                      your profile privacy settings.
                    </a>
                    and set your profile and game details to public.
                  </p>
                </div>
                <div>
                  <a
                    class="btn btn-ghost"
                    href="https://steamcommunity.com/my/edit/settings"
                    target="_blank">
                    <Icon class="me-2">BrandSteam</Icon>
                    Steam privacy settings
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
                    <div class="text-muted">
                      This shouldn't take more than a few moments...
                    </div>
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

          <div v-if="ui.saving" class="col-lg-8 mx-auto mt-4">
            <div class="card">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-12">
                    <h3 class="card-title mb-1">Saving your library...</h3>
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
            <import-card :module="module" :integration="integration">
              <template #card:action>
                <div>
                  <div class="btn btn-primary w-100" @click="scanAndPrepare">
                    <Icon class="me-2">ArrowsTransferDown</Icon>
                    Start synchronization
                  </div>

                  <!-- <small v-if="$auth.user.steam_updated_at" class="text-muted">
                    Last update, {{ dates.timeAgo($auth.user.steam_updated_at) }}
                  </small>

                  <div
                    v-if="!$auth.canUpdateSteamLibrary"
                    class="invalid-feedback d-block mt-1">
                    You have recently updated your library. Please wait a while before
                    updating again.
                  </div> -->
                </div>
              </template>
              <template #card:footer></template>
            </import-card>
          </div>

          <!--
            *+---------------------------------
            *| Small review window
            *| Shows overview of imported data
            *+--------------------------------- -->
          <div v-if="ui.step == 'review'" class="col-lg-9 mx-auto mt-2">
            <div class="card">
              <div class="card-body">
                <h2>Your library is ready! 🎉</h2>
                <div class="row">
                  <div class="col">
                    <div class="card mb-2">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <div class="subheader">New games found</div>
                        </div>
                        <div class="h2 mb-1 d-flex align-items-center">
                          <Icon class="mr-2 text-muted mt-1">CircleDashedPlus</Icon>
                          <!-- {{ data.appsToReview.length }} new -->
                          {{ format.num(newGames) }}
                          <small class="subheader mx-2 pt-2">new games</small>

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
                          {{ format.num(enabled.length) }}
                          <small class="subheader mx-2 pt-2">updates</small>
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
                      <div
                        class="btn w-100"
                        @click="((ui.step = 'review:plus'), toggleAll())">
                        Review your data
                      </div>
                    </div>
                    <div class="col">
                      <div class="btn btn-success w-100" @click="store">
                        Update everything
                      </div>
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
          <div v-if="ui.step == 'review:plus' && !ui.saving">
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

                        {{ format.num(Object.keys(data.library).length) }} games
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

                      <!-- {{ data.appsToReview.length }} new -->
                      {{ format.num(newGames) }}
                      <small class="subheader mx-2 pt-2">new games</small>

                      <br />
                    </div>
                    <!-- <b-btn block>Review</b-btn> -->
                  </div>
                </div>
              </div>

              <!-- <div class="col-sm-2">
                <div class="card cursor-pointer" @click="ui.tab = 'appsToImport'">
                  <div
                    class="card-body d-flex align-items-center"
                    style="flex-direction: column">
                    <div class="h2 m-0">
                      <Icon class="text-muted" style="transform: translateY(-1px)">
                        SquareRoundedPlus
                      </Icon>
                      {{ appsToImport.length }}
                    </div>
                    <div class="subheader">Importing</div>
                  </div>
                </div>
              </div> -->

              <div class="col-sm-4">
                <div class="card">
                  <div class="card-body">
                    <div class="d-flex align-items-center">
                      <div class="subheader">Synchronizing</div>
                    </div>
                    <div class="h2 mb-1 d-flex align-items-center">
                      <Icon class="mr-2 text-muted mt-1">Refresh</Icon>
                      {{ format.num(enabled.length) }}
                      <small class="subheader mx-2 pt-2">selected</small>
                    </div>
                  </div>
                  <!-- <div
                    class="card-body d-flex align-items-center"
                    style="flex-direction: column">
                    <div class="h2 m-0">
                      <Icon class="text-muted" style="transform: translateY(-1px)">
                        Refresh
                      </Icon>
                       {{ data.appsToUpdate.length }}
                      wip
                    </div>
                    <div class="subheader">Updating</div>
                  </div> -->
                </div>
              </div>

              <div class="col-sm-6 col-lg-4 d-none">
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col">
                        <div class="d-flex align-items-center">
                          <div class="subheader">importing</div>
                        </div>
                        <div class="h2 mb-1 d-flex align-items-center">
                          <Icon class="mr-2 text-muted mt-1">StepInto</Icon>
                          <!-- {{ appsToImport.length }} -->
                        </div>
                      </div>
                      <div class="col">
                        <div class="d-flex align-items-center">
                          <div class="subheader">updating</div>
                        </div>
                        <div class="h2 mb-1 d-flex align-items-center">
                          <Icon class="mr-2 text-muted mt-1">Refresh</Icon>
                          <!-- {{ data.appsToUpdate.length }} -->
                          wip
                        </div>
                      </div>
                      <!-- <div class="col">
                        <div class="d-flex align-items-center">
                          <div class="subheader">Ignoring</div>
                        </div>
                        <div class="h2 mb-1 d-flex align-items-center">
                          <Icon class="mr-2 text-muted mt-1">SquareRotatedOff</Icon>
                          {{ appsToIgnore.length }}
                        </div>
                      </div> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row mb-3 align-items-center">
              <div class="col-8">
                <b-input
                  v-model="table.filters.search"
                  placeholder="Filter..."
                  clearable></b-input>
              </div>
              <div class="d-none col-5">
                <!-- <button class="btn dropdown-toggle">
                  <span class="badge text-primary me-2">
                    {{ tabs[ui.tab].count }}
                  </span>
                  <span class="me-2">
                    {{ tabs[ui.tab].label }}
                  </span>
                  <b-dropdown placement="bottom-end">
                    <template v-for="(tab, i) in tabs" :key="'tab' + i">
                      <label class="dropdown-item" @click="ui.tab = i">
                        {{ tab.label }}
                        <span class="badge text-primary ms-auto">
                          {{ tab.count }}
                        </span>
                      </label>
                    </template>
                  </b-dropdown>
                </button> -->
              </div>
              <div class="col" style="display: flex">
                <label class="form-check form-switch my-0 mx-2">
                  <input
                    class="form-check-input position-static me-2"
                    type="checkbox"
                    :checked="data.changes.length == enabled.length"
                    @click="toggleAll" />

                  <small class="text-muted form-check-label form-check-label-on">
                    Unselect everything
                  </small>
                  <small
                    class="text-muted form-check-label form-check-label-off text-white">
                    Select all ({{ format.num(data.changes.length) }}) games
                  </small>
                </label>
              </div>
            </div>

            <search-empty v-if="!loopToReview.length" preset="filtering"></search-empty>
            <div v-else class="card">
              <div
                class="list-group card-list-group list-group-hoverable games-group games--list">
                <div
                  v-for="(app, i) in loopToReview"
                  :key="'game' + i"
                  class="list-group-item text-decoration-none game game--list"
                  @click="enable('import', app)">
                  <div class="row align-items-center">
                    <div class="col-auto fs-3">
                      <label class="form-check form-switch mb-0 ms-2">
                        <input
                          :checked="app.enabled"
                          class="form-check-input"
                          type="checkbox" />
                      </label>
                    </div>

                    <!-- <div class="col-auto">
                      <img
                        loading="lazy"
                        :src="`https://cdn.akamai.steamstatic.com/steam/apps/${
                          app.appid || app.id.steam
                        }/capsule_184x69.jpg?t=1699291031`"
                        class="b-poster"
                        style="max-width: 120px" />
                    </div> -->
                    <div class="col-auto text-secondary">
                      <div class="game__cover">
                        <game-asset
                          :app="{
                            id: {
                              steam: app.sourceID,
                            },
                          }"
                          asset="banner"
                          fallback="cover"
                          :priority="['steam', 'igdb']" />
                      </div>
                    </div>
                    <div class="col">
                      <span class="font-serif">{{ app.name }}</span>

                      <div class="v-list-item-subtitle my-2">
                        <!-- <small
                          class="text-muted me-2"
                          v-tippy="'Marking the game as owned in your library'">
                          <Icon
                            size="12"
                            width="1.5"
                            style="transform: translateY(-1px); margin-right: 0px">
                            NewSection
                          </Icon>
                          Add to library
                        </small> -->

                        <small
                          v-if="!app.uuid"
                          v-tippy="'This game will be added to your library'"
                          class="text-green me-2">
                          <Icon
                            size="12"
                            width="1.5"
                            style="transform: translateY(-1px); margin-right: 0px">
                            CircleDashedPlus
                          </Icon>
                          New
                        </small>

                        <div
                          v-if="app.sync.state"
                          class="d-inline-block text-muted"
                          style="transform: scale(0.9) translateX(-10px)">
                          <BState
                            :state="app.sync.state?.to"
                            :from="app.sync.state?.from"
                            :label="true"
                            :manager="false"></BState>
                        </div>

                        <small
                          v-if="app.sync.playtime"
                          v-tippy="'Updating your playtime'"
                          class="text-muted">
                          <Icon
                            size="12"
                            width="1.5"
                            style="transform: translateY(-1px); margin-right: 0px">
                            ClockHour3
                          </Icon>
                          {{ dates.minToHours(app.sync.playtime?.to, 'Not played') }}
                        </small>

                        <template v-if="app.sync.last_played">
                          <span class="mx-2">🔸</span>

                          <small
                            v-if="app.sync.last_played"
                            v-tippy="'Logging your last session'"
                            class="text-muted">
                            <Icon
                              size="12"
                              width="1.5"
                              style="transform: translateY(-1px); margin-right: 0px">
                              Calendar
                            </Icon>
                            Last played
                            {{ dates.timeAgo(app.sync.last_played?.to * 1000) }}
                          </small>
                        </template>
                      </div>

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
                      <code v-if="app.sourceID">#{{ app.sourceID }}</code>
                    </div>

                    <!-- <div
                      v-if="ui.tab == 'appsToReview'"
                      v-tippy="{
                        content:
                          'Click to ignore.<br>Ignored games will not be shown again.',
                        allowHTML: true,
                      }"
                      class="col-auto text-muted cursor-pointer"
                      @click.stop="enable('ignore', app)">
                      <Icon>SquareRotatedOff</Icon>
                    </div> -->

                    <!-- <div class="col-12">
                      <pre>
                        {{ app }}
                      </pre>
                    </div> -->
                  </div>
                </div>
              </div>
            </div>

            <b-btn
              v-if="loopToReview.length && table.perPage < data.games.length"
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
                  <!-- {{ appsToImport.length }} -->
                  WIP new games
                </div>

                <div>
                  <NuxtLink to="/library" class="btn btn-primary w-100">
                    <Icon class="me-2">Apps</Icon>
                    View your library
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
        <div v-if="manifest" class="col-lg-4">
          <div class="card" style="position: sticky; top: 20px">
            <div class="card-body">
              <div class="d-flex align-items-center mb-2">
                <div class="me-3">
                  <img
                    :src="manifest?.source?.logo"
                    style="max-width: 30px; max-height: 30px" />
                </div>
                <div>
                  <small class="text-secondary">Integration</small>
                  <h3 class="card-title lh-1 mb-1">
                    {{ manifest.name }}
                  </h3>
                </div>
              </div>
              <div class="text-muted mb-3">
                {{ manifest.description }}
              </div>
              <small class="text-muted">
                By
                <strong>{{ manifest.author }}</strong>
                <span class="px-1">•</span>
                <a :href="manifest.url" target="_blank">
                  version {{ manifest.ver }} ({{ manifest.v }})
                </a>
                <br />
                Last updated
                {{ dates.format(manifest.updated_at, 'LL') }}
              </small>
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
            <div
              v-if="['review', 'review:plus', 'complete'].includes(ui.step)"
              class="card-body p-3">
              <b-btn
                block
                :color="ui.step.indexOf('review') == -1 ? 'secondary' : 'success'"
                :disabled="ui.step.indexOf('review') == -1"
                @click="store">
                Update library
              </b-btn>
              <!-- v-if="ui.step == 'complete'" <b-btn v-else block color="success">View library</b-btn> -->
            </div>
            <div class="card-footer small text-muted">
              This module is open source. If you want to know more about the code or
              review your privacy and security, you can
              <a
                href="https://github.com/gsabater/backlog.rip/blob/master/modules/importers"
                target="_blank">
                check the code on Github.
              </a>
            </div>
          </div>
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
 * Modified: Wed 29 January 2025 - 17:52:32
 **/

export default {
  name: 'LibraryImporter',

  setup() {
    definePageMeta({
      ssr: false,
    })
  },

  data() {
    return {
      logs: [], // log array for the whole process
      // module: {}, // the plugin / module manifest
      account: {}, // The user account -> store to import

      data: {
        user: {}, // Raw of the imported userdata
        games: [], // Raw library received from the platform
        changes: [], // Array of changes to be applied
        library: {}, // DB library indexed by platform ID
        // steambacklog: {},

        updates: [],
        // appsToReview: [], // Processed array of apps missing in library
        // appsToUpdate: [], // Processed array of apps already in library, that needs to update fields
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

        saving: false,
        loading: false,
        showlogs: false,
      },
    }
  },

  computed: {
    ...mapStores(useLibraryStore),
    ...mapState(useStateStore, {
      states: 'keyed',
    }),

    //+-------------------------------------------------
    // module()
    // Returns the module instance from the $integration Strore
    //+-------------------------------------------------
    module() {
      if (!this.platform) return null
      return this.libraryStore.module[this.platform] ?? {}
    },

    manifest() {
      return this.libraryStore.module[this.platform]?.manifest ?? {}
    },

    //+-------------------------------------------------
    // integration()
    // Returns the integration with this platform
    //+-------------------------------------------------
    integration() {
      if (!this.platform) return null
      return this.libraryStore.linked[this.platform] ?? {}
    },

    platform() {
      return this.$route.params?.platform || null
    },

    // lastUpdateInHours() {
    //   let last_sync = this.$auth?.user?.steam_updated_at ?? null
    //   return dates.hoursAgo(last_sync)
    // },

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
          action: 'Review changes',
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
          label: 'games found',
          object: 'data.appsToReview',
          // count: this.data.appsToReview.length,
        },

        appsToImport: {
          label: 'to be imported',
          object: 'appsToImport',
          // count: this.appsToImport.length,
        },

        appsToUpdate: {
          label: 'to be updated',
          object: 'data.appsToUpdate',
          // count: this.data.appsToUpdate.length,
        },

        // appsToIgnore: {
        //   label: 'to be ignored',
        //   object: 'appsToIgnore',
        //   count: this.appsToIgnore.length,
        // },
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

      // let loop = []
      const items = []

      // let source = this.tabs[this.ui.tab].object

      // if (source.indexOf('data.') == -1) {
      //   loop = this[source]
      // } else {
      //   source = source.replace('data.', '')
      //   loop = this.data[source]
      // }

      this.data.changes.forEach((el, i) => {
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
    // newGames()
    //
    // -----
    // Created on Fri Nov 29 2024
    //+-------------------------------------------------
    newGames() {
      return this.data.changes.filter((item) => !item.uuid).length
    },

    //+-------------------------------------------------
    // enabled()
    // -----
    // Created on Mon Dec 02 2024
    //+-------------------------------------------------
    enabled() {
      return this.data.changes.filter((item) => item.enabled == true)
    },

    //+-------------------------------------------------
    // appsToImport()
    // Array of apps that will be imported
    // Only apps with will_import === true
    // basic object with uuid, store_id and name
    // -----
    // Created on Thu Dec 14 2023
    //+-------------------------------------------------
    // appsToImport() {
    //   const items = []
    //   console.warn('wip')
    //   return items

    //   this.data.appsToReview
    //     .filter((el) => el.will_import === true)
    //     .forEach((el) => {
    //       items.push({
    //         data: el,
    //         will_import: true,
    //         [this.platform + '_id']: el.appid,
    //       })
    //     })

    //   return items
    // },

    // //+-------------------------------------------------
    // // appsToIgnore()
    // // -----
    // // Created on Thu Dec 14 2023
    // //+-------------------------------------------------
    // appsToIgnore() {
    //   const items = []
    //   console.warn('wip')
    //   return items

    //   this.data.appsToReview
    //     .filter((el) => el.will_ignore === true)
    //     .forEach((el) => {
    //       items.push({
    //         name: el.name,
    //         [this.platform + '_id']: el.appid,
    //         // is: {
    //         //   owned: true,
    //         //   ignored: true,
    //         // },
    //       })
    //     })

    //   return items
    // },
  },

  watch: {
    '$app.ready': function () {
      this.init()
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
      const action = this.data.changes.length == this.enabled.length ? 'none' : 'all'

      this.data.changes.forEach((el) => {
        el.enabled = action == 'all' ? true : false
      })
    },

    //+-------------------------------------------------
    // enable()
    // When reviewing, get the app object and flag it as
    // -----
    // Created on Tue Jan 30 2024
    // Updated on Mon Dec 02 2024 - Updated to enable or disable data.changes
    //+-------------------------------------------------
    enable(flag, app) {
      // if (this.ui.tab !== 'appsToReview') return

      const item = this.data.changes.find(
        (el) => el.sourceID === (app.sourceID || app.id[this.id.platform])
      )

      item.enabled = !item.enabled
      return

      if (flag === 'ignore') {
        item.will_import = false
        item.will_ignore = !item.will_ignore
      }

      if (flag === 'import') {
        item.will_ignore = false
        item.will_import = !item.will_import
      }
    },

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
      this.ui.saving = true

      await this.$importer.store({
        notify: true,
        journal: true,
        apps: {
          // toUpdate: this.data.appsToUpdate,
          // toImport: this.appsToImport,
          // toIgnore: this.appsToIgnore,
        },
      })

      this.ui.saving = false
      this.ui.step = 'complete'
    },

    //+-------------------------------------------------
    // scanAndPrepare()
    // Tell the $importer to scan, and review the results
    // -----
    // Created on Fri Jan 26 2024
    //+-------------------------------------------------
    async scanAndPrepare() {
      log('✨ importer', 'scanAndPrepare()')

      this.ui.loading = true
      this.ui.step = 'games'

      const data = await this.$importer.scan()

      if (data?.status == 'error') {
        this.ui.error = data?.code
        this.ui.loading = false
        return
      }

      this.data.user = data.data.user
      this.data.games = data.data.games

      this.data.library = data.library
      this.data.changes = data.changes
        .map((item) => {
          item.enabled = true
          return item
        })
        .sort((a, b) => {
          const aValue = a.data[this.manifest?.sortBy] || 0
          const bValue = b.data[this.manifest?.sortBy] || 0
          return bValue - aValue
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

      if (!connection) {
        this._log(
          'The importer could not be started. Try reloading the page and start again.' +
            'If the problem persists, please report it.',
          'error'
        )
        return
      }

      // this.account = connection.account
      // this.module = connection.module?.manifest

      if (connection.account?.error == 'account:login') {
        this.ui.error = 'account:provider'
        return
      }

      this._log('🆒 Waiting to the user to start the scan')
      this.process.ready = true
    },

    storeConfig(field) {
      this.$auth.storeConfig(field)
      this.$toast.success('Your preferences have been updated')
    },

    async init() {
      if (!this.$app.ready) return

      console.clear()
      this._log('✨ Initializing the importer')
      this.detectAndConnect()
    },
  },

  mounted() {
    this.init()
  },

  unmounted() {
    log('💠 importer', 'unmounted()')
  },
}
</script>
