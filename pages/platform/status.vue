<template>
  <ClientOnly>
    <div class="page-body">
      <div class="container-xl">
        <div class="row gx-lg-5 mx-auto">
          <div class="d-none d-lg-block col-lg-2">
            <community-sidebar></community-sidebar>
          </div>

          <div class="col-lg-9">
            <div class="row row-cards">
              <div class="col-8">
                <h2 class="mb-1">Project Status</h2>
                <p class="card-subtitle mb-1">
                  Project Status page. Take a look for transparency, database health and monitoring.
                </p>
              </div>
              <div class="col-auto ms-auto"></div>

              <!--
                *+---------------------------------
                *| Button group (tabs)
                *+--------------------------------- -->
              <div class="col-12 mb-3">
                <div
                  style="
                    display: inline-flex;
                    background: rgba(255, 255, 255, 0.06);
                    border-radius: 8px;
                    padding: 3px;
                    gap: 2px;
                  ">
                  <!-- , 'executions', 'stats' -->
                  <button
                    v-for="t in ['overview', 'executions']"
                    :key="t"
                    class="text-capitalize"
                    :style="{
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 14px',
                      fontSize: '13px',
                      fontWeight: ui.tab === t ? '600' : '400',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      background: ui.tab === t ? 'rgba(255,255,255,0.12)' : 'transparent',
                      color:
                        ui.tab === t
                          ? 'rgb(var(--v-theme-on-surface))'
                          : 'rgba(var(--v-theme-on-surface), 0.45)',
                      boxShadow: ui.tab === t ? '0 1px 3px rgba(0,0,0,0.25)' : 'none',
                    }"
                    @click="ui.tab = t">
                    {{ t }}
                  </button>
                </div>
              </div>

              <!--
                *+---------------------------------
                *| Status bar
                *+--------------------------------- -->
              <div class="col-12">
                <div class="row align-items-center">
                  <div class="col-6 d-flex align-items-center gap-3">
                    <span
                      class="small text-muted"
                      style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em">
                      System status
                    </span>
                    <span
                      v-for="server in ['api', 'worker', 'supabase']"
                      :key="server"
                      class="d-flex align-items-center gap-2">
                      <common-server-status
                        :server="server"
                        style="opacity: 0.75; transform: scale(0.85)" />

                      <small
                        class="text-muted"
                        style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em">
                        {{ server }}
                      </small>
                    </span>
                  </div>

                  <div
                    class="col-6 d-flex align-items-center justify-content-end gap-1"
                    style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em">
                    <Icon
                      name="tabler:heartbeat"
                      size="13"
                      class="text-muted"
                      style="opacity: 0.65" />
                    <small class="text-muted">Information updated</small>
                    <small class="fw-medium">
                      {{ $dayjs(statsUpdatedAt).format('HH:mm:ss') }}
                    </small>
                    <!-- <small class="text-muted">· {{ dates.timeAgo(statsUpdatedAt) }}</small> -->
                  </div>
                </div>
              </div>
            </div>

            <!--
              *+---------------------------------
              *| Tab overview
              *+--------------------------------- -->
            <div v-if="ui.tab === 'overview'" class="row row-deck row-cards">
              <div class="col-12 row row-deck g-3 px-0 mx-0 mb-2">
                <!--
                    *+---------------------------------
                    *| KPI
                    *| Database size, games, DLC and others
                    *+--------------------------------- -->
                <div class="col-6">
                  <stats-kpi
                    label="Database status"
                    href="games"
                    :value="stats.db != null ? format.num(stats.db.total) : null"
                    style="--tblr-card-bg: #2c2e3b8c">
                    <template #sub>
                      <div class="d-flex gap-3 mt-2">
                        <small class="text-muted">
                          <span class="fw-semibold text-body">
                            {{ format.num(stats.db?.games) }}
                          </span>
                          Base games
                        </small>
                        <small class="text-muted">
                          <span class="fw-semibold text-body">
                            {{ format.num(stats.db?.dlc) }}
                          </span>
                          DLC
                        </small>
                        <small class="text-muted">
                          <span class="fw-semibold text-body">
                            {{ format.num(stats.db?.other) }}
                          </span>
                          Mods & other
                        </small>
                      </div>
                    </template>
                  </stats-kpi>
                </div>

                <!--
                    *+---------------------------------
                    *| KPI
                    *| Worker actions
                    *+--------------------------------- -->
                <div class="col-3">
                  <stats-kpi
                    label="Operations today"
                    :value="(stats.db?.new24h || 0) + (stats.db?.updated24h || 0)"
                    :sub="`${stats.db?.new24h || 0} added · ${stats.db?.updated24h || 0} updated`"
                    style="background-color: rgba(255, 255, 255, 0.04)" />
                </div>

                <!--
                    *+---------------------------------
                    *| KPI
                    *| API Calls
                    *+--------------------------------- -->
                <!-- <div class="col-3">
                    <stats-kpi
                      label="API calls (24h)"
                      :value="format.num(stats.worker?.ApiCalls24h)"
                      style="background-color: rgba(255, 255, 255, 0.04)" />
                  </div> -->

                <!--
                    *+---------------------------------
                    *| KPI
                    *| Registered users
                    *+--------------------------------- -->
                <div class="col-3">
                  <stats-kpi
                    label="Registered users"
                    :value="format.num(stats.users.total)"
                    :sub="`+${stats.users.new7d} new this week`"
                    style="background-color: rgba(255, 255, 255, 0.04)" />
                </div>
              </div>

              <!-- Left: Recent games -->
              <!--
                *+---------------------------------
                *| List
                *| Latest added/updated games with tabs
                *+--------------------------------- -->
              <div class="col-6">
                <div class="card h-100 d-flex flex-column overflow-hidden">
                  <div class="card-body" style="flex: 0 0 auto">
                    <div class="d-flex align-items-center justify-content-between">
                      <small class="font-serif small text-muted">Latest operations</small>
                      <a
                        href="#"
                        class="small"
                        style="color: rgba(var(--v-theme-on-surface), 0.65); text-decoration: none"
                        @click.prevent="ui.tab = 'executions'">
                        Executions list
                      </a>
                    </div>
                  </div>

                  <div
                    class="list-group list-group-flush"
                    v-if="recentGames.length"
                    style="flex: 1 1 0; min-height: 0; overflow-y: auto">
                    <div
                      v-for="game in recentGames"
                      :key="game.id"
                      @click.stop="$mitt.emit('game:dialog', { uuid: game.uuid })"
                      class="list-group-item list-group-item-action border-0 p-1 cursor-pointer">
                      <div class="d-flex align-items-start">
                        <div
                          class="flex-shrink-0"
                          style="
                            width: 96px;
                            height: 50px;
                            overflow: hidden;
                            border-radius: 2px;
                            background: rgba(255, 255, 255, 0.05);
                          ">
                          <game-asset
                            :app="game"
                            asset="banner"
                            :priority="['steam', 'igdb']"
                            style="width: 100%; height: 100%; object-fit: cover; display: block" />
                        </div>

                        <div class="flex-fill" style="min-width: 0; padding: 4px 8px 0 10px">
                          <div
                            class="fw-medium small"
                            style="
                              line-height: 1.3;
                              white-space: nowrap;
                              overflow: hidden;
                              text-overflow: ellipsis;
                            ">
                            {{ game.name }}
                          </div>
                          <div class="d-flex align-items-center gap-2 mt-1">
                            <span
                              style="
                                font-size: 9px;
                                font-weight: 600;
                                padding: 0 4px;
                                border-radius: 2px;
                                line-height: 1.7;
                                letter-spacing: 0.02em;
                                text-transform: uppercase;
                                background: rgba(255, 255, 255, 0.08);
                                color: rgba(var(--v-theme-on-surface), 0.75);
                              ">
                              {{ game._recentType }}
                            </span>
                            <span
                              v-if="game.scores?.metascore"
                              style="
                                font-size: 10px;
                                font-weight: 600;
                                padding: 0 4px;
                                border-radius: 2px;
                                line-height: 1.7;
                                background: rgba(76, 175, 110, 0.15);
                                color: #4caf6e;
                              ">
                              {{ game.scores.metascore }}
                            </span>
                            <span v-if="game.hltb?.main" class="text-muted" style="font-size: 10px">
                              {{ dates.minToHours(game.hltb.main / 60) }}
                            </span>
                            <span
                              v-if="game.released_at"
                              class="text-muted"
                              style="font-size: 10px">
                              {{ new Date(game.released_at * 1000).getFullYear() }}
                            </span>
                            <span
                              v-if="
                                !game.scores?.metascore && !game.hltb?.main && !game.released_at
                              "
                              class="text-muted"
                              style="font-size: 10px">
                              —
                            </span>
                          </div>
                        </div>

                        <div
                          class="flex-shrink-0 text-end"
                          style="min-width: 110px; padding-top: 5px">
                          <div class="text-muted" style="font-size: 10px; white-space: nowrap">
                            {{ dates.timeAgo(getRecentTimestamp(game)) }}
                          </div>
                          <div class="text-muted" style="font-size: 9px; white-space: nowrap">
                            {{ formatExecutionDate(getRecentTimestamp(game)) }}
                          </div>
                        </div>

                        <Icon
                          name="tabler:arrow-up-right"
                          size="13"
                          class="text-muted flex-shrink-0"
                          style="opacity: 0.4; margin-top: 5px; margin-right: 8px" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--
                *+---------------------------------
                *| Graphs
                *| Worker jobs status and data coverage
                *+--------------------------------- -->
              <div class="col-6 d-flex flex-column gap-3">
                <!--
                  *+---------------------------------
                  *| Stats
                  *| Worker jobs
                  *+--------------------------------- -->
                <div class="card">
                  <div class="card-body pb-1">
                    <div class="font-serif small text-muted mb-1">API Gateway (24h)</div>
                    <v-skeleton-loader v-if="!worker" type="table" />
                    <table v-else class="table table-sm table-borderless mb-0">
                      <tbody>
                        <tr v-for="item in gatewayAPIs" :key="item.key" class="py-2">
                          <td class="ps-0 py-1">
                            <div class="d-flex align-items-center gap-2">
                              <!-- <span class="status-dot flex-shrink-0"></span> -->
                              <icon name="tabler:broadcast" size="10" />
                              <span class="small">{{ item.label }}</span>
                            </div>
                          </td>
                          <td class="text-end pe-0 py-1">
                            <span class="small text-muted">{{ item.count }} requests</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="card-footer py-2 px-3">
                    <div class="text-muted small text-end">
                      <span v-if="worker && worker.gateway" class="fw-semibold text-body">
                        {{ format.num(worker.gateway.calls24h) }}
                      </span>
                      API calls in 24h
                    </div>
                  </div>
                </div>

                <!--
                  *+---------------------------------
                  *| Stats
                  *| Data coverage
                  *+--------------------------------- -->
                <div class="card">
                  <div class="card-body pb-1" v-if="stats.coverage">
                    <div class="font-serif small text-muted mb-1">Data coverage</div>
                    <table class="table table-sm table-borderless mb-0">
                      <tbody>
                        <tr
                          v-for="dimension in stats.coverage"
                          :key="dimension.label"
                          class="align-middle">
                          <td class="ps-0 py-1" style="width: 100px">
                            <div class="d-flex align-items-center gap-2">
                              <icon name="tabler:columns" size="10" />
                              <span class="small">{{ dimension.label }}</span>
                            </div>
                          </td>
                          <td class="py-1">
                            <div
                              class="progress"
                              style="height: 3px; background-color: rgba(255, 255, 255, 0.07)">
                              <div
                                class="progress-bar"
                                :style="{ width: dimension.pct + '%' }"></div>
                            </div>
                          </td>
                          <td class="text-end pe-0 py-1" style="white-space: nowrap; width: 80px">
                            <span class="small text-muted">
                              {{ dimension.pct }}% ({{ format.num(dimension.amount) }})
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!--
              *+---------------------------------
              *| Tab executions
              *+--------------------------------- -->
            <div v-if="ui.tab === 'executions'" class="row row-deck row-cards">
              <div class="col-12 row row-deck g-3 px-0 mx-0 mb-2">
                <div class="col-4">
                  <stats-kpi
                    label="Jobs in 24h"
                    :value="format.num(worker.runs?.jobs24h || 0)"
                    style="background-color: rgba(255, 255, 255, 0.04)" />
                </div>

                <div class="col-4">
                  <stats-kpi
                    label="Updating database"
                    value="Every 60 seconds"
                    style="background-color: rgba(255, 255, 255, 0.04)" />
                </div>

                <div class="col-4">
                  <stats-kpi
                    label="Last job"
                    :value="recentGames.length ? recentGames[0].name : 'No recent jobs'"
                    :sub="recentGames.length ? dates.timeAgo(recentGames[0].executedAt) : ''"
                    style="background-color: rgba(255, 255, 255, 0.04)" />
                </div>
              </div>

              <div class="col-12">
                <div class="card h-100 d-flex flex-column overflow-hidden">
                  <div class="card-body pb-2" style="flex: 0 0 auto">
                    <div class="d-flex align-items-center justify-content-between">
                      <small class="font-serif small text-muted">Recent executions</small>
                      <small class="text-muted" style="font-size: 11px">
                        {{ filteredRecentGames.length }} items
                      </small>
                    </div>
                    <div class="d-flex gap-1 mt-2">
                      <button
                        v-for="f in ['all', 'created', 'updated']"
                        :key="f"
                        class="text-capitalize"
                        :style="{
                          border: 'none',
                          borderRadius: '4px',
                          padding: '2px 10px',
                          fontSize: '11px',
                          fontWeight: ui.listFilter === f ? '600' : '400',
                          cursor: 'pointer',
                          background:
                            ui.listFilter === f ? 'rgba(255,255,255,0.1)' : 'transparent',
                          color:
                            ui.listFilter === f
                              ? 'rgb(var(--v-theme-on-surface))'
                              : 'rgba(var(--v-theme-on-surface), 0.4)',
                        }"
                        @click="ui.listFilter = f; ui.page = 1">
                        {{ f }}
                      </button>
                    </div>
                  </div>

                  <div class="list-group card-list-group games-group games--list">
                    <div
                      v-for="game in paginatedGames"
                      :key="game.id"
                      @click.stop="$mitt.emit('game:dialog', { uuid: game.uuid })"
                      class="list-group-item text-decoration-none game game--list"
                      style="
                        padding-top: 0.65rem;
                        padding-bottom: 0.65rem;
                        padding-left: 0.65rem;
                        border: none;
                      ">
                      <div class="d-flex align-items-start">
                        <div
                          class="flex-shrink-0"
                          style="
                            width: 96px;
                            height: 45px;
                            overflow: hidden;
                            border-radius: 2px;
                            background: rgba(255, 255, 255, 0.05);
                          ">
                          <div class="game__cover">
                            <game-asset :app="game" asset="banner" :priority="['steam', 'igdb']" />
                          </div>
                        </div>

                        <!-- Name + second row -->
                        <div class="flex-fill" style="min-width: 0; padding: 4px 8px 0 10px">
                          <div
                            class="fw-medium small"
                            style="
                              line-height: 1.3;
                              white-space: nowrap;
                              overflow: hidden;
                              text-overflow: ellipsis;
                            ">
                            {{ game.name }}
                          </div>
                          <div class="d-flex align-items-center gap-2 mt-1">
                            <span
                              style="
                                font-size: 9px;
                                font-weight: 600;
                                padding: 0 4px;
                                border-radius: 2px;
                                line-height: 1.7;
                                letter-spacing: 0.02em;
                                text-transform: uppercase;
                                background: rgba(255, 255, 255, 0.08);
                                color: rgba(var(--v-theme-on-surface), 0.75);
                              ">
                              {{ game._recentType }}
                            </span>
                            <span
                              v-if="game.scores?.metascore"
                              style="
                                font-size: 10px;
                                font-weight: 600;
                                padding: 0 4px;
                                border-radius: 2px;
                                line-height: 1.7;
                                background: rgba(76, 175, 110, 0.15);
                                color: #4caf6e;
                              ">
                              {{ game.scores.metascore }}
                            </span>
                            <span v-if="game.hltb?.main" class="text-muted" style="font-size: 10px">
                              {{ dates.minToHours(game.hltb.main / 60) }}
                            </span>
                            <span
                              v-if="game.released_at"
                              class="text-muted"
                              style="font-size: 10px">
                              {{ new Date(game.released_at * 1000).getFullYear() }}
                            </span>
                            <span
                              v-if="
                                !game.scores?.metascore && !game.hltb?.main && !game.released_at
                              "
                              class="text-muted"
                              style="font-size: 10px">
                              —
                            </span>
                          </div>
                        </div>

                        <!-- Execution time -->
                        <div
                          class="flex-shrink-0 text-end"
                          style="min-width: 110px; padding-top: 5px">
                          <div class="text-muted" style="font-size: 10px; white-space: nowrap">
                            {{ dates.timeAgo(getRecentTimestamp(game)) }}
                          </div>
                          <div class="text-muted" style="font-size: 9px; white-space: nowrap">
                            {{ formatExecutionDate(getRecentTimestamp(game)) }}
                          </div>
                        </div>

                        <Icon
                          name="tabler:arrow-up-right"
                          size="13"
                          class="text-muted flex-shrink-0"
                          style="opacity: 0.4; margin-top: 5px; margin-right: 8px" />
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="totalPages > 1"
                    class="card-footer py-2 px-3 d-flex align-items-center justify-content-between">
                    <small class="text-muted">Page {{ ui.page }} of {{ totalPages }}</small>
                    <div class="d-flex gap-1">
                      <button
                        class="btn btn-sm btn-ghost-secondary"
                        :disabled="ui.page <= 1"
                        @click="ui.page--">
                        <Icon name="tabler:chevron-left" size="14" />
                      </button>
                      <button
                        class="btn btn-sm btn-ghost-secondary"
                        :disabled="ui.page >= totalPages"
                        @click="ui.page++">
                        <Icon name="tabler:chevron-right" size="14" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script>
/**
 * @file:    \pages\platform\database.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 17th March 2026
 * Modified: 24th June 2026 - 19:03:28
 **/

import backlogrip from '../../modules/integrations/backlogrip'

export default {
  name: 'PlatformDatabase',
  data() {
    return {
      stats: {
        db: {},
        users: {},
        games: [],
        worker: {},
        coverage: {},
      },

      ui: {
        tab: 'overview',
        listFilter: 'all',
        page: 1,
      },
    }
  },

  computed: {
    ...mapStores(useDataStore),

    worker() {
      return this.stats.worker || {}
    },

    //+-------------------------------------------------
    // gatewayAPIs()
    // Hand set list of APIs with labels and counts
    // -----
    // Created on Wed Jun 03 2026
    //+-------------------------------------------------
    gatewayAPIs() {
      const gateway = this.worker?.gateway || {}

      const labels = { steam: 'STEAM', igdb: 'IGDB' }
      const list = Object.keys(labels)

      return list
        .filter((key) => key in gateway)
        .map((key) => ({ key, label: labels[key], count: gateway[key] }))
    },

    //+-------------------------------------------------
    // recentGames()
    // Combined list of recently added and updated games
    // -----
    // Created on Wed Jun 03 2026
    //+-------------------------------------------------
    recentGames() {
      let created = this.stats.games.justAdded || []
      let updated = this.stats.games.justUpdated || []
      if (!created.length && !updated.length) return []

      created = created.map((game) => ({ ...game, _recentType: 'created' }))
      updated = updated.map((game) => ({ ...game, _recentType: 'updated' }))

      return [...created, ...updated].sort((a, b) => {
        const aTime = this.getRecentTimestamp(a)
        const bTime = this.getRecentTimestamp(b)
        return bTime - aTime
      })
    },

    filteredRecentGames() {
      if (this.ui.listFilter === 'all') return this.recentGames
      return this.recentGames.filter((g) => g._recentType === this.ui.listFilter)
    },

    paginatedGames() {
      const size = 15
      const start = (this.ui.page - 1) * size
      return this.filteredRecentGames.slice(start, start + size)
    },

    totalPages() {
      return Math.max(1, Math.ceil(this.filteredRecentGames.length / 15))
    },

    statsUpdatedAt() {
      return this.stats?._request?.timestamp
    },
  },

  watch: {
    'ui.tab'() {
      this.ui.page = 1
    },
  },

  methods: {
    getRecentTimestamp(game) {
      return dates.toStamp(game.dates?.updated || game.dates?.created)
    },

    formatExecutionDate(timestamp) {
      if (!timestamp) return ''
      return this.$dayjs.unix(timestamp).format('YYYY-MM-DD HH:mm:ss')
    },

    //+-------------------------------------------------
    // getData()
    // Calls the API for Stats
    // -----
    // Created on Thu Dec 04 2025
    //+-------------------------------------------------
    async getData() {
      const data = await backlogrip.getStats()
      this.stats = { ...this.stats, ...data }

      let added = data?.games?.justAdded || []
      let updated = data?.games?.justUpdated || []
      const games = [...added, ...updated]

      this.dataStore.process(games, 'api:batch')
    },

    init() {
      this.getData()
    },
  },

  mounted() {
    this.init()
  },
}
</script>
