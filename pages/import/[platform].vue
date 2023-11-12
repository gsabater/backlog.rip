<template>
  <!-- <ul>
  <li><h4>Steps:</h4></li> -->
  <!-- <li>detect: detect if plugin is present.</li> -->
  <!-- <li>Check: getUserdata, getGames, getWishlist...</li> -->
  <!-- <li>Connect: Read manifest and give methods to the module.</li> -->
  <!-- <li>Receive plugin manifest: name, description, author, repository url , steps (things is going to do), requeriments, what it does, what it does not</li> -->
  <!-- <li>Give: vue instance?, axios instance, log(info, warning, error), error event, success event</li> -->
  <!-- <li>----</li> -->
  <!-- <li>initialize: get userdata</li>
  <li>onclick: getgames</li> -->

  <!-- <li>store each in every category</li>
  <li>get game data from api</li>
  <li>end</li>
</ul> -->

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
          <div class="card" style="border: 2px solid #d63939" v-if="ui.showlogs">
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

          <div class="card" style="border: 2px solid #d63939" v-if="ui.error">
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

          <div class="col-lg-8 mx-auto mt-4" v-if="ui.loading">
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
            class="container container-tight py-4"
            v-if="process.ready && ui.step == 'prep'">
            <div class="card card-md">
              <div class="card-body text-center">
                <div class="mb-4">
                  <h2 class="card-title mb-0">Steam library</h2>
                  <p class="text-muted">Click to begin the import</p>
                </div>
                <div class="mb-4">
                  <span
                    class="avatar avatar-xl mb-3"
                    :style="`background-image: url('${
                      account.provider?.data?.avatarfull || ''
                    }')`"></span>
                  <h3 class="mb-0">{{ account.username }}</h3>
                  <p class="text-muted">
                    Steam ID
                    <code>{{ account.steam }}</code>
                  </p>
                </div>
                <div>
                  <div class="btn btn-primary w-100" @click="doImport">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon icon-tabler icon-tabler-arrows-transfer-down"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M17 3v6"></path>
                      <path d="M10 18l-3 3l-3 -3"></path>
                      <path d="M7 21v-18"></path>
                      <path d="M20 6l-3 -3l-3 3"></path>
                      <path d="M17 21v-2"></path>
                      <path d="M17 15v-2"></path>
                    </svg>
                    Update your {{ importer.store }} library
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="ui.step == 'review'">
            <div class="row mb-3 align-items-center" style="zoom: 0.9">
              <div class="col col-4">
                <b-input v-model="table.filters.search" placeholder="Filter..."></b-input>
              </div>
              <div class="col col-4">
                <button type="button" class="btn">
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
                  <div class="pe-2 me-2 border-end">Status</div>
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
                      class="form-check-input m-0 me-2"
                      type="checkbox"
                      v-model="table.filters.played" />
                    Played
                    <!-- <span class="badge bg-primary text-primary-fg ms-auto">12</span> -->
                  </label>

                  <label class="dropdown-item">
                    <input
                      class="form-check-input m-0 me-2"
                      type="checkbox"
                      v-model="table.filters.unplayed" />
                    Not played
                    <!-- <span class="badge bg-primary text-primary-fg ms-auto">12</span> -->
                  </label>
                </b-menu>
                <b-btn variant="ghost" color="secondary">
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
                {{ toReview.length }} of {{ data.games.length }} games
              </div>
            </div>
            <pre>
              {{ table }}
            </pre>
            <div class="card">
              <div class="list-group card-list-group">
                <div
                  class="list-group-item"
                  v-for="(app, i) in toReview"
                  :key="'game' + i">
                  <div class="row g-4 align-items-center">
                    <!-- <div class="col-auto fs-3">
                        <label class="form-check form-switch">
                          <input class="form-check-input" type="checkbox"
                            v-model="app.import">
                        </label>
                      </div> -->

                    <div class="col-auto" v-if="app.will_import">
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
                      <div class="text-secondary">
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
                          stroke-linejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                          <path d="M12 12h3.5"></path>
                          <path d="M12 7v5"></path>
                        </svg>

                        Played {{ format.minToHours(app.playtime_forever) }}
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
                          stroke-linejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M21 12.3a9 9 0 1 0 -8.683 8.694"></path>
                          <path d="M12 7v5l2 2"></path>
                          <path d="M19 19m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                        </svg>
                        last played {{ app.rtime_last_played }}
                      </div>
                    </div>
                    <!-- <div class="col-auto text-secondary">
                        03:41
                      </div> -->
                    <div class="col-auto">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        v-model="app.will_import" />
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
          </div>
        </div>
        <div class="col-lg-4">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center mb-0">
                <div class="me-3">
                  <!-- Download SVG icon from http://tabler-icons.io/i/scale -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-brand-steam"
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
                      d="M16.5 5a4.5 4.5 0 1 1 -.653 8.953l-4.347 3.009l0 .038a3 3 0 0 1 -2.824 3l-.176 0a3 3 0 0 1 -2.94 -2.402l-2.56 -1.098v-3.5l3.51 1.755a2.989 2.989 0 0 1 2.834 -.635l2.727 -3.818a4.5 4.5 0 0 1 4.429 -5.302z"></path>
                    <circle cx="16.5" cy="9.5" r="1" fill="currentColor"></circle>
                  </svg>
                </div>
                <div>
                  <small class="text-muted">
                    v.{{ importer.version }} by {{ importer.author }}
                  </small>
                  <h3 class="lh-1">{{ importer.name }}</h3>
                </div>
              </div>
              <div class="text-muted mb-1">
                {{ importer.description }}
              </div>
            </div>
            <div class="card-body d-none">
              <h4 class="mb-1">What will be loaded</h4>
              <ul class="list-unstyled space-y-1">
                <li v-for="(el, i) in importer.does" :key="i">
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
                <li v-for="(el, i) in importer.doesnot" :key="i">
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
                  class="step-item"
                  v-for="(step, key) in steps"
                  :key="key"
                  :class="{ active: key == ui.step }">
                  <div class="h4 m-0">{{ step.action }}</div>
                  <div class="text-muted" v-if="ui.step == key">{{ step.desc }}</div>
                </li>
              </ul>
              <!-- <ul class="list-unstyled space-y-1">
                  <li v-for="(el, i) in importer.steps" :key="i">
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
            <div class="card-footer text-muted">
              This importer is open source. If you want to know more or are concerned
              about your privacy and security, you can
              <a href="https://github.com/gsabater/modules.backlog.rip" target="_blank">
                review the code on Github
              </a>
            </div>
          </div>

          <!-- <pre>
            {{ importer.manifest }}
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
 * Modified: Sun Nov 12 2023
 **/

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
      importer: {}, // the importer instance, plugin or module
      logs: [], // log array for the whole process

      data: {
        user: {}, // result of the user import
        games: [
          {
            appid: 211420,
            name: 'DARK SOULS™: Prepare To Die Edition',
            playtime_forever: 1286,
            img_icon_url: 'a24804c6c8412c8cd9d50efd06bf03fa58ff80a9',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1418686838,
            sort_as: 'Dark Souls',
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: true,
            playtime_disconnected: 0,
          },
          {
            appid: 204300,
            name: 'Awesomenauts',
            playtime_forever: 536,
            img_icon_url: '4996933171d0804bd0ceb7b9a0e224b3139d18ba',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1374511517,
            has_workshop: true,
            has_market: false,
            will_import: true,
            has_dlc: true,
            playtime_disconnected: 0,
          },
          {
            appid: 217200,
            name: 'Worms Armageddon',
            playtime_forever: 1,
            img_icon_url: '68c6d17bde9c578d91dd1e207b58eb4d8308ce40',
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1417637852,
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: false,
            playtime_disconnected: 0,
          },
          {
            appid: 98800,
            name: 'Dungeons of Dredmor',
            playtime_forever: 195,
            img_icon_url: '4924fdf2a9c2cf45bd7d1dcfaa4c039c60b9d410',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1439730943,
            has_workshop: true,
            has_market: false,
            will_import: true,
            has_dlc: true,
            has_leaderboards: true,
            playtime_disconnected: 0,
          },
          {
            appid: 214150,
            name: 'Galactic Civilizations I: Ultimate Edition',
            playtime_forever: 0,
            img_icon_url: '66df956909f51af564f8d6086c201004ab81aa51',
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 0,
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: true,
            playtime_disconnected: 0,
          },
          {
            appid: 214340,
            name: 'Deponia',
            playtime_forever: 113,
            img_icon_url: '48a94d33cae6065b0bedf7eefd01bd5321c7c729',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1392246823,
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: true,
            playtime_disconnected: 0,
          },
          {
            appid: 209080,
            name: 'Guns of Icarus Online',
            playtime_forever: 305,
            img_icon_url: '968e8c0b7a55f0229392278123dfd486140c9421',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1440031829,
            has_workshop: true,
            has_market: false,
            will_import: true,
            has_dlc: true,
            playtime_disconnected: 0,
          },
          {
            appid: 204220,
            name: 'Snapshot',
            playtime_forever: 0,
            img_icon_url: '322122b6f0560b73c5c36ff5009907d8087fd146',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 0,
            capsule_filename: 'portrait.png',
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: true,
            playtime_disconnected: 0,
          },
          {
            appid: 204630,
            name: 'Retro City Rampage™ DX',
            playtime_forever: 336,
            img_icon_url: '423b87d4a5a00ff6e807558e565b0b515fadf61b',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1456354383,
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: false,
            has_leaderboards: true,
            playtime_disconnected: 0,
          },
          {
            appid: 49520,
            name: 'Borderlands 2',
            playtime_forever: 13968,
            img_icon_url: 'a3f4945226e69b6196074df4c776e342d3e5a3be',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1561586642,
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: true,
            playtime_disconnected: 0,
          },
          {
            appid: 205100,
            name: 'Dishonored',
            playtime_forever: 311,
            img_icon_url: '74f8ee1ba536e0759e64a9bf801fc013e16c8dd1',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1427991765,
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: true,
            has_leaderboards: true,
            playtime_disconnected: 0,
          },
          {
            appid: 730,
            name: 'Counter-Strike 2',
            playtime_forever: 1409,
            img_icon_url: '8dbc71957312bbd3baea65848b545be9eae2a355',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1466447415,
            has_workshop: true,
            has_market: true,
            has_dlc: true,
            content_descriptorids: [2, 5],
            playtime_disconnected: 0,
          },
          {
            appid: 204120,
            name: 'LEGO® Harry Potter: Years 5-7',
            playtime_forever: 0,
            img_icon_url: 'eb9617f00259ad2dee791ec91b4862447080f0cb',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 0,
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: false,
            playtime_disconnected: 0,
          },
          {
            appid: 213330,
            name: 'LEGO® Batman™ 2: DC Super Heroes',
            playtime_forever: 0,
            img_icon_url: '92446ccf0abc6ab3e716251c0004acda5c3b13fd',
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 0,
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: false,
            playtime_disconnected: 0,
          },
          {
            appid: 33600,
            name: 'Broken Sword 2 - the Smoking Mirror: Remastered',
            playtime_forever: 0,
            img_icon_url: 'a136ba9e8ed89c49c23a55293f591a474cb6cdb1',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 0,
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: true,
            playtime_disconnected: 0,
          },
          {
            appid: 214790,
            name: 'The Basement Collection',
            playtime_forever: 0,
            img_icon_url: '0bd402578e431f679c9709f34b4ecfe334914600',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 0,
            capsule_filename: 'portrait.png',
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: false,
            playtime_disconnected: 0,
          },
          {
            appid: 72000,
            name: 'Closure',
            playtime_forever: 179,
            img_icon_url: '7da11a2030451f15450452b6c5f0aeb45b39fbd3',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1439571914,
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: false,
            playtime_disconnected: 0,
          },
          {
            appid: 215510,
            name: 'Rocketbirds: Hardboiled Chicken',
            playtime_forever: 115,
            img_icon_url: 'be9c980e8243b58aad6b568aa47dc1418be79fd4',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1485462780,
            capsule_filename: 'portrait.png',
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: true,
            playtime_disconnected: 0,
          },
          {
            appid: 200510,
            name: 'XCOM: Enemy Unknown',
            playtime_forever: 1606,
            img_icon_url: '48be2fee1d0d511b5c7313e1359beafd36ea92ed',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1389694287,
            sort_as: 'XCOM 1: Enemy Unknown',
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: true,
            playtime_disconnected: 0,
          },
          {
            appid: 211260,
            name: 'They Bleed Pixels',
            playtime_forever: 248,
            img_icon_url: '902560daa6a68b17e443a96652dfef1066b0eb34',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1372951339,
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: true,
            has_leaderboards: true,
            playtime_disconnected: 0,
          },
          {
            appid: 216290,
            name: 'Gateways',
            playtime_forever: 0,
            img_icon_url: '3cc65892ba65ac6eb9201ad77db3d11327e222e6',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 0,
            capsule_filename: 'portrait.png',
            has_workshop: true,
            has_market: false,
            will_import: true,
            has_dlc: true,
            playtime_disconnected: 0,
          },
          {
            appid: 65300,
            name: 'Dustforce',
            playtime_forever: 340,
            img_icon_url: '7823652dcb6b11c024003ec590c17f461637c66f',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1439743076,
            capsule_filename: 'portrait.png',
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: true,
            playtime_disconnected: 0,
          },
          {
            appid: 209540,
            name: 'Strike Suit Zero',
            playtime_forever: 77,
            img_icon_url: 'b30877270af7d5775ce626ef9bacab727ff979f3',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1392161616,
            has_workshop: true,
            has_market: false,
            will_import: true,
            has_dlc: true,
            has_leaderboards: true,
            playtime_disconnected: 0,
          },
          {
            appid: 214970,
            name: 'Intrusion 2',
            playtime_forever: 16,
            img_icon_url: 'e63fe503a18fc70c3c759e96341a406dc1c8cbe5',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1370407835,
            capsule_filename: 'portrait.png',
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: false,
            playtime_disconnected: 0,
          },
          {
            appid: 206440,
            name: 'To the Moon',
            playtime_forever: 184,
            img_icon_url: '6e29eb4076a6253fdbccb987a2a21746d2df54d7',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1441203112,
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: true,
            playtime_disconnected: 0,
          },
          {
            appid: 219740,
            name: "Don't Starve",
            playtime_forever: 2481,
            img_icon_url: '03fe647df40dccc4d19bf42a0185cd3e6b9f2953',
            playtime_windows_forever: 16,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1573407589,
            has_workshop: true,
            has_market: false,
            will_import: true,
            has_dlc: true,
            playtime_disconnected: 0,
          },
          {
            appid: 322330,
            name: "Don't Starve Together",
            playtime_forever: 2151,
            img_icon_url: 'a80aa6cff8eebc1cbc18c367d9ab063e1553b0ee',
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1558783496,
            has_workshop: true,
            has_market: true,
            has_dlc: true,
            playtime_disconnected: 0,
          },
          {
            appid: 220780,
            name: 'Thomas Was Alone',
            playtime_forever: 63,
            img_icon_url: '14a9056a76a256fbcfe833dd1420d01eeba14abc',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1405961995,
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: false,
            playtime_disconnected: 0,
          },
          {
            appid: 7830,
            name: 'Men of War',
            playtime_forever: 0,
            img_icon_url: 'bbaf5e7ea25bdd0235311558d95570dbd7e90348',
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 0,
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: true,
            playtime_disconnected: 0,
          },
          {
            appid: 220860,
            name: 'McPixel',
            playtime_forever: 263,
            img_icon_url: '236a6f77afff3814552ae2a6ccadbf84d992a252',
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1373900053,
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: false,
            playtime_disconnected: 0,
          },
          {
            appid: 221260,
            name: 'Little Inferno',
            playtime_forever: 113,
            img_icon_url: '478d0b4bbe94d5d6c5248e07f0da75cbe9f6ba95',
            has_community_visible_stats: true,
            playtime_windows_forever: 113,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1587062081,
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: true,
            playtime_disconnected: 0,
          },
          {
            appid: 219910,
            name: "Edna & Harvey: Harvey's New Eyes",
            playtime_forever: 94,
            img_icon_url: 'df160221c5be01797610ac2e452404c01e968b59',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1392591596,
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: true,
            playtime_disconnected: 0,
          },
          {
            appid: 204360,
            name: 'Castle Crashers',
            playtime_forever: 534,
            img_icon_url: '9b7625f9b70f103397fd0416fd92abb583db8659',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1527498497,
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: true,
            playtime_disconnected: 0,
          },
          {
            appid: 213610,
            name: 'Sonic Adventure™ 2 ',
            playtime_forever: 0,
            img_icon_url: '0ff2b133493b0bf7f1c16a38a83e7053f0b90f2d',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 0,
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: true,
            playtime_disconnected: 0,
          },
          {
            appid: 7510,
            name: 'X-Blades',
            playtime_forever: 179,
            img_icon_url: '311b4363fd29a55fbdd23f515e409785b520b6e8',
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1446487625,
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: true,
            playtime_disconnected: 0,
          },
          {
            appid: 203140,
            name: 'Hitman: Absolution',
            playtime_forever: 226,
            img_icon_url: 'fe5e36ac1548793eb48b6b25b701b37d86fb94a3',
            has_community_visible_stats: true,
            playtime_windows_forever: 0,
            playtime_mac_forever: 0,
            playtime_linux_forever: 0,
            rtime_last_played: 1439322140,
            sort_as: 'Hitman 5: Absolution',
            has_workshop: false,
            has_market: false,
            will_import: true,
            has_dlc: true,
            playtime_disconnected: 0,
          },
        ], // result of the games import
        wishlist: [], // result of the wishlist import
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

        step: 'review', //'prep',
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
      let steps = {
        prep: {
          action: 'Preparation',
          desc: 'Verifying requeriments',
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
          action: 'Completion',
          desc: 'Import process completed',
        },
      }

      if (this.importer?.games !== true) {
        delete steps.games
      }

      if (this.importer?.wishlist !== true) {
        delete steps.wishlist
      }

      return steps
    },

    toReview() {
      if (this.data.games.length === 0) return []

      let items = []

      this.data.games.forEach((el, i) => {
        if (
          this.table.filters.search !== '' &&
          el.name.toLowerCase().indexOf(this.table.filters.search.toLowerCase()) === -1
        )
          return false

        items.push({
          ...el,
          index: i,
          will_import: el.will_import,
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
      let now = new Date().getTime()
      log(`${message}`)

      if (type === 'error') {
        this.ui.error = message
        this.ui.showlogs = true
      }

      this.logs.unshift({
        type,
        time: now,
        message,
        data,
      })
    },

    //+-------------------------------------------------
    // doImport()
    // Main call that will execute the importing methods
    // available on the module
    // -----
    // Created on Thu Dec 01 2022
    //+-------------------------------------------------
    async doImport() {
      log(`🧶 Starting data import...`)
      this.ui.loading = true
      this.ui.step = 'games'

      try {
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
      this.ui.loading = true

      this.review()
    },

    review() {
      this.data.games = this.data.games.slice(0, 30)
      this.ui.step = 'review'
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
    //+-------------------------------------------------
    detect() {
      log('importer', 'detect()')

      let { platform } = this.$route.params
      this._log(`🎨 Platform ID: ${platform}`)

      if (this.$auth.user.isLogged || this.$auth.user.id == undefined) {
        this._log('You need to login first', 'error')
        return false
      }

      this.account = { ...this.$auth.api }
      this.account.provider = this.account.providers.find(
        (el) => el.provider === platform
      )
      this.account.bearer = this.$auth.bearer

      if (this.$route.params.platform !== 'steam') return false

      if (steam == undefined) {
        this._log('The Steam instance is not available', 'error')
        return false
      }

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

    //+-------------------------------------------------
    // connect()
    // Receives the module manifest, and gives the module
    // some data and methods to work with
    // -----
    // Created on Sat Oct 28 2023
    //+-------------------------------------------------
    async connect() {
      log('importer', 'connect()')

      let connected = false
      this.importer = steam.manifest
      importer = steam

      log('Manifest loaded', steam.manifest)

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

    async init() {
      log('importer', 'init()')
      this._log('✨ Initializing the importer')

      if (this.detect()) await this.connect()

      this.ui.watch = setInterval(() => {
        this.process.time++
        if (this.process.time <= 3) log(this.process.time)
      }, 1000)
    },
  },

  mounted() {
    this.init()
  },

  unmounted() {
    log('importer', 'unmounted()')
    clearInterval(this.ui.watch)
  },
}

// //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// // Data
// //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// let watch = null

// let importer = reactive({})
// let logs = reactive([])
// let ui = reactive({
//   step: null,

//   loading: false,
//   progress: 0,
//   time: 0,
// })

// //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// // Computed
// //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// // Methods
// //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// //+-------------------------------------------------
// // complete()
// // Method called from the importer when
// // the import process is complete
// // -----
// // Created on Thu Dec 08 2022
// //+-------------------------------------------------
// let complete = async () => {
//   log(`🎉 Import process completed!`)

//   ui.step = 'complete'
// }

// //+-------------------------------------------------
// // setStep()
// // UI utilty method
// // -----
// // Created on Thu Dec 08 2022
// //+-------------------------------------------------
// let setStep = (step) => {
//   ui.step = step
//   ui.time = 0
// }

// //+-------------------------------------------------
// // init()
// // Loads and registers the route importer
// // And calls first register method in it
// // -----
// // Created on Fri Dec 02 2022
// //+-------------------------------------------------
// let init = () => {

//   steam.register({
//     $axios: app.$axios,
//     log,
//     setStep,
//     onError,
//     complete,
//   })

//   importer = {
//     name: steam.name,
//     icon: steam.icon,
//     author: steam.author,
//     version: steam.version,
//     description: steam.description,

//     steps: steam.steps,
//     imports: steam.imports,
//     not_imports: steam.not_imports,
//   }

//   ui.step = 0
//   log('🆗 Importer ready to use')
//   console.warn(importer)

//   watch = setInterval(() => {
//     ui.time++
//     if (ui.time <= 3) console.warn(ui.time)
//   }, 1000)
// }
</script>
