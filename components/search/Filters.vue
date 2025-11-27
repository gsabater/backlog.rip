<template>
  <div class="col-12 row align-items-center mt-2 mb-3">
    <!--
      *+---------------------------------
      *| Source selector
      *+--------------------------------- -->
    <div v-if="f.is !== 'array'" class="col-6 col-md-auto d-flex align-items-center">
      <v-btn id="⚓source" variant="tonal" color="rgb(110 116 180)">
        <Icon v-if="f.source == 'all'" size="14" class="me-1">Cards</Icon>
        <Icon v-if="f.source == 'library'" size="14" class="me-1">LayoutDashboard</Icon>
        <Icon v-if="f.source == 'library:favorites'" size="14" class="me-1">Heart</Icon>
        <Icon v-if="f.source == 'library:pinned'" size="14" class="me-1">Bookmark</Icon>
        <Icon v-if="f.source == 'library:hidden'" size="14" class="me-1">Cancel</Icon>

        <span
          v-if="sourceState"
          class="status-dot ms-1"
          style="margin-right: 0.75rem; transform: translateY(1px)"
          :style="{ 'background-color': sourceState.color || '' }"></span>

        {{ sourceLabel }}

        <Icon class="text-muted" size="15" style="transform: translate(5px, 1px)">Selector</Icon>

        <b-tippy-sheety ref="source" to="#⚓source" trigger="click">
          <search-source-menu ref="sourceMenu" />
        </b-tippy-sheety>
      </v-btn>

      <!-- <div class="text-muted mx-3"><Icon size="14">Spaces</Icon></div> -->
    </div>

    <div v-if="false" class="col-6 col-md-auto">
      <v-btn-group
        variant="tonal"
        :divided="false"
        style="
          height: auto;
          color: inherit;
          background-color: none;
          outline: rgb(108 122 145 / 40%) solid 1px;
        ">
        <v-btn><Icon>Clock</Icon></v-btn>
        <v-btn
          v-tippy="'Run via Steam '"
          :href="'steam://run/'"
          slim
          style="height: 36px; min-width: 0">
          <Icon size="14" width="1.5">BrowserShare</Icon>
        </v-btn>
      </v-btn-group>
    </div>

    <!--
      *+---------------------------------
      *| Filter selector
      *+--------------------------------- -->
    <div class="col-6 col-md-auto d-flex align-items-center">
      <v-btn id="⚓filtersMenu" variant="tonal" color="rgb(110 116 180)">
        <Icon size="15" class="me-1">Filter</Icon>
        Filter

        <Icon class="text-muted" size="15" style="transform: translate(5px, 1px)">Selector</Icon>

        <b-tippy-sheety to="#⚓filtersMenu" trigger="click">
          <search-filters-menu ref="filtersMenu" @selected="handleNewFilter" />
        </b-tippy-sheety>
      </v-btn>
    </div>

    <!--
      *+---------------------------------
      *| Search box
      *+--------------------------------- -->
    <div class="col-12 col-md">
      <v-text-field
        id="⚓searchBox"
        ref="searchBox"
        v-model="f.box"
        :loading="loading"
        clearable
        density="comfortable"
        @keydown="handleKeydown"
        style="position: relative; z-index: 10">
        <template v-slot:prepend-inner>
          <template
            v-if="showTags == 'inline' && f.filters.length"
            v-for="(filter, i) in f.filters"
            :key="i">
            <search-filter-tag :index="i" :current="filter" mode="keyboard" />
          </template>

          <Icon v-else size="14" class="text-secondary me-2">Search</Icon>
        </template>

        <template v-slot:clear>
          <Icon size="18" class="mx-2" width="2" style="min-width: 1em" @click="clearSearchBox">
            SquareRoundedX
          </Icon>
        </template>

        <!-- <template #append>
            <v-btn
              variant="text"
              color="blue-grey-lighten-1"
              class="mx-2"
              @click="$emit('search')">
              Search
            </v-btn>
          </template> -->

        <!-- <template #details>
          <v-spacer />

          See our
          <a href="#">Terms and Service</a>
        </template> -->

        <template v-slot:append-inner>
          <kbd
            v-if="showEnterHint"
            class="text-muted small text-nowrap"
            style="letter-spacing: normal; font-size: 11px; font-family: monospace">
            Enter to search
          </kbd>
        </template>
      </v-text-field>

      <b-tippy-sheety ref="filtersTippy" to="#⚓searchBox" trigger="focusin">
        <search-filters-menu ref="filtersMenuKbd" mode="keyboard" @selected="handleNewFilter" />
      </b-tippy-sheety>
    </div>

    <div v-if="$app.wip" class="col-auto d-none d-md-block">
      <v-btn id="⚓f">
        🔸
        <b-tippy-sheety ref="source" to="#⚓f" trigger="click">
          <pre class="d-block">
            {{ f }}
          </pre>
        </b-tippy-sheety>
      </v-btn>
    </div>
  </div>

  <!--
    *+---------------------------------
    *| Second line
    *| Tags, display options...
    *+--------------------------------- -->
  <div class="col-12 row align-items-center mb-5">
    <div
      class="col"
      style="gap: 7px; display: flex; flex-direction: row; align-items: center; flex-wrap: wrap">
      <template v-if="f.string">
        <search-filter-tag :index="-1" class="is-chip" />
      </template>

      <template v-if="showTags !== 'inline'" v-for="(filter, i) in f.filters" :key="i">
        <search-filter-tag :index="i" :current="filter" :open="false" class="is-chip" />
      </template>

      <div class="d-inline-block">
        <div class="small text-muted">
          {{ format.num(stats.results) }} games
          <div
            v-if="loading"
            class="spinner-grow"
            role="status"
            style="width: 13px; height: 13px"></div>

          <span
            v-else
            v-tippy="
              'Time to search, filter and sort results ◈ When searching in all games, this includes the API calls as well'
            "
            class="d-inline-block"
            style="cursor: help">
            <Icon size="10" class="text-muted ms-1" style="transform: translateY(-1px)">
              ClockRecord
            </Icon>

            {{ dates.microTime(time) }}
          </span>
        </div>
      </div>
    </div>
    <div class="col-auto d-flex align-items-center ms-auto">
      <v-btn id="⚓sortby" variant="text" size="small" color="blue-grey-lighten-1">
        <small>
          <template v-if="f.sortBy == 'none'">
            <span>Sorted by the author</span>
          </template>
          <template v-else>
            Sorting by
            <strong class="ps-1">
              {{ sortLabel[f.sortBy] ?? '...' }}
              {{ !f.sortBy || !f.sortDir ? '' : f.sortDir == 'asc' ? '(Asc)' : '(Desc)' }}
            </strong>
          </template>
        </small>

        <Icon class="text-muted" size="15" style="transform: translate(5px, 1px)">Selector</Icon>

        <b-tippy-sheety to="#⚓sortby" trigger="click">
          <search-sort-menu @sort="sortBy" />
        </b-tippy-sheety>
      </v-btn>

      <!-- <v-btn class="me-2">Display options</v-btn>
      <v-btn class="me-2">Random</v-btn> -->

      <v-btn
        v-tippy="'Display results as a list'"
        icon
        variant="text"
        size="x-small"
        color="blue-grey-lighten-1"
        @click="f.show.layout = 'list'">
        <Icon width="1.2" size="16" class="mx-1">LayoutList</Icon>
      </v-btn>

      <v-btn
        v-tippy="'Display results as a grid of covers'"
        icon
        variant="text"
        size="x-small"
        color="blue-grey-lighten-1"
        @click="f.show.layout = 'grid'">
        <Icon width="1.2" size="16" class="mx-1">LayoutGrid</Icon>
      </v-btn>

      <v-btn
        v-tippy="'Get a random game from this list'"
        icon
        variant="text"
        size="x-small"
        color="blue-grey-lighten-1"
        @click="$mitt.emit('game:random', { filters: f })">
        <Icon width="1.2" size="16" class="mx-1">Dice5</Icon>
        <!-- <Icon class="text-muted" size="12" width="2">ChevronDown</Icon> -->
      </v-btn>

      <v-btn
        id="⚓itemDetails"
        variant="text"
        size="small"
        color="blue-grey-lighten-1"
        class="px-1 mx-0"
        style="--v-activated-opacity: 0.05">
        <Icon width="1.2" size="16" class="me-1">PlayCardStar</Icon>
        <Icon class="text-muted" size="12" width="2">ChevronDown</Icon>

        <b-tippy-sheety to="#⚓itemDetails" trigger="click">
          <search-item-details :f="f" @show="visibleProps" />
        </b-tippy-sheety>
      </v-btn>

      <!-- <small class="text-muted">
        <span class="mx-2">◈</span>
        Data from
        <a href="https://www.igdb.com" target="_blank">
          <img
            class="mx-2 text-muted"
            width="25"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNCIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDM0IDE2IiBmaWxsPSJub25lIj4KICAgIDxwYXRoCiAgICAgICAgZD0iTTYuNzE2ODVlLTA1IDAuMDAwOTExNDY4QzExLjMzMzEgMC4wMDA2ODM4MjMgMjIuNjY2NSAwLjAwMjUwNDA5IDMzLjk5OTggMEMzNCA1LjMzMzI2IDM0LjAwMDIgMTAuNjY2NyAzMy45OTk1IDE2QzMxLjc5MzcgMTUuNjUyNCAyOS41Nzc5IDE1LjM2MTIgMjcuMzU0IDE1LjE0ODJDMTkuMzI5MSAxNC4zNjg1IDExLjIxMjIgMTQuNDk5MSAzLjIxNzc4IDE1LjUzNjdDMi4xNDI1NyAxNS42NzMxIDEuMDcxMDkgMTUuODM1OSA2LjcxNjg1ZS0wNSAxNS45OTkzQy0wLjAwMDE2NTUxIDEwLjY2NjUgMC4wMDAyOTk4NDcgNS4zMzM3MSA2LjcxNjg1ZS0wNSAwLjAwMDkxMTQ2OFpNMS4wMDA4MiAwLjk4MDIzOEMxLjAwMTI4IDUuNjA1NzUgMS4wMDA4MiAxMC4yMzE1IDEuMDAwODIgMTQuODU3QzExLjU4NDcgMTMuMjcyMSAyMi40MTU0IDEzLjI3MDggMzIuOTk5IDE0Ljg1NzVDMzIuOTk5NyAxMC4yMzE1IDMyLjk5OTIgNS42MDU1MiAzMi45OTkyIDAuOTc5NTU1QzIyLjMzMyAwLjk4MTE0OSAxMS42NjY4IDAuOTgwMDEgMS4wMDA4MiAwLjk4MDIzOFoiCiAgICAgICAgZmlsbD0id2hpdGUiCiAgICAvPgogICAgPHBhdGgKICAgICAgICBkPSJNOC4zMTkyNiA0LjYxOEM5LjAxMjg3IDMuOTU3MzcgOS45ODU5NCAzLjYwNTQ0IDEwLjk0OTcgMy42MjAyM0MxMS42MDc3IDMuNjE3OTYgMTIuMjc5NCAzLjcxODggMTIuODcxMiA0LjAxMjY5QzEzLjE3NjIgNC4xNjE1NyAxMy40NTQ5IDQuMzU2ODkgMTMuNzE1MSA0LjU3MTU2QzEzLjM4NzcgNC45NTgzMyAxMy4wNTc1IDUuMzQyNTkgMTIuNzMzOSA1LjczMjA5QzEyLjUzOTEgNS41ODkzNiAxMi4zNDk3IDUuNDM3MDYgMTIuMTM0MyA1LjMyNDE1QzExLjcwMTcgNS4wODUzNSAxMS4xOTIxIDUuMDAyNzIgMTAuNzAwNSA1LjAzNzc4QzEwLjA5ODggNS4wODgwOCA5LjU0ODI3IDUuNDQyOTggOS4yMjIyOCA1LjkzNDQ3QzguODAyMDcgNi41NTE4NCA4LjczNjY4IDcuMzY0MyA4Ljk5MTIzIDguMDU1NjZDOS4xNDUyNyA4LjQ3NTY2IDkuNDM5MzcgOC44NDgzMiA5LjgyNjc4IDkuMDg2MjFDMTAuMjEyMSA5LjMyODQyIDEwLjY4IDkuNDI1NjIgMTEuMTM0MiA5LjM5ODk5QzExLjYgOS4zODE0NiAxMi4wNzQyIDkuMjU3MTcgMTIuNDUzNSA4Ljk4NDY4QzEyLjQ0OTggOC42NTY4NyAxMi40NTM1IDguMzI4ODMgMTIuNDUxNiA4LjAwMTAyQzExLjkyOTcgOC4wMDIzOSAxMS40MDc2IDguMDAwNTcgMTAuODg1NyA4LjAwMTk0QzEwLjg4NDUgNy41NjIxMyAxMC44ODg1IDcuMTIyMzIgMTAuODgzOCA2LjY4MjczQzExLjkxMDQgNi42NzYzNiAxMi45MzcyIDYuNjg1MDEgMTMuOTYzOCA2LjY3ODQxQzEzLjk3MDEgNy42ODI1NSAxMy45NjMxIDguNjg2OTIgMTMuOTY3MyA5LjY5MTA2QzEzLjI2MDcgMTAuMjg3OSAxMi4zNjg4IDEwLjY3OTUgMTEuNDM3NCAxMC43Njg1QzEwLjUyODEgMTAuODY2MiA5LjU2OTQ0IDEwLjcwMjUgOC43OTQzOSAxMC4yMTE5QzguMTczMzcgOS44MjQ2OCA3LjY5MzU5IDkuMjMwNzYgNy40NDI1MyA4LjU1NDJDNy4xOTQ3MiA3Ljg4ODU3IDcuMTQ1ODYgNy4xNTUxIDcuMjg1IDYuNDYxMjRDNy40Mjk5NiA1Ljc2MzczIDcuNzkyNDcgNS4xMDk3MSA4LjMxOTI2IDQuNjE4WiIKICAgICAgICBmaWxsPSJ3aGl0ZSIKICAgIC8+CiAgICA8cGF0aAogICAgICAgIGQ9Ik0zLjc4NzYxIDMuNzM5NTJDNC4zMDgxMSAzLjc0MDY2IDQuODI4NjEgMy43Mzg2MSA1LjM0OTEyIDMuNzQwNjZDNS4zNDc5NSA2LjA1MDc5IDUuMzQ5MTIgOC4zNjExNiA1LjM0ODY1IDEwLjY3MTVDNC44MjgzOCAxMC42NzEzIDQuMzA4MTEgMTAuNjcwNiAzLjc4Nzg0IDEwLjY3MThDMy43ODc2MSA4LjM2MTE2IDMuNzg4MDggNi4wNTAzNCAzLjc4NzYxIDMuNzM5NTJaIgogICAgICAgIGZpbGw9IndoaXRlIgogICAgLz4KICAgIDxwYXRoCiAgICAgICAgZD0iTTE1Ljg2NDMgMy43Mzk3NUMxNi44MTY1IDMuNzM5OTcgMTcuNzY4NiAzLjczOTc1IDE4LjcyMDcgMy43Mzk5N0MxOS41ODYzIDMuNzQ5MzEgMjAuNDYyOCA0LjAxMjAxIDIxLjE0MDEgNC41NDkwMkMyMS43MzIzIDUuMDEyMjggMjIuMTUyMiA1LjY3ODYgMjIuMzEyMyA2LjQwMzY0QzIyLjUwNjEgNy4yNzkxNiAyMi4zNzk4IDguMjMzOTEgMjEuODk5MyA5LjAwNDAzQzIxLjUxOCA5LjYyNDgxIDIwLjkxOSAxMC4xMDgxIDIwLjIzNDUgMTAuMzc5MkMxOS43NTQ5IDEwLjU2OTggMTkuMjM3NyAxMC42Njk5IDE4LjcyIDEwLjY3MTNDMTcuNzY4MyAxMC42NzEzIDE2LjgxNjUgMTAuNjcwOCAxNS44NjQ2IDEwLjY3MTVDMTUuODY0NiA4LjM2MDkzIDE1Ljg2NSA2LjA1MDM0IDE1Ljg2NDMgMy43Mzk3NVpNMTcuNDMwMyA1LjExNjU0QzE3LjQyNzkgNi41MDkyNyAxNy40MzA1IDcuOTAyIDE3LjQyODkgOS4yOTQ5NkMxNy43Mjc2IDkuMjk0NSAxOC4wMjY2IDkuMjk0NzMgMTguMzI1NCA5LjI5NDczQzE4LjU2NiA5LjI5MjkxIDE4LjgwODYgOS4zMDU4OCAxOS4wNDY5IDkuMjYyNjNDMTkuNTEzOSA5LjE5MTYxIDE5Ljk2MzkgOC45NzE5MyAyMC4yNzI3IDguNjE3NDlDMjAuNTQyNiA4LjMxMzgxIDIwLjY5OTQgNy45MjQzMSAyMC43NDY2IDcuNTI3MDdDMjAuNzkwNiA3LjEyMzY4IDIwLjc1NTcgNi43MDU3MyAyMC41OTU4IDYuMzI4NzVDMjAuNDMxMyA1LjkyODA5IDIwLjEyMzcgNS41ODUyNiAxOS43MzUyIDUuMzc5N0MxOS4zODQzIDUuMTg4NDggMTguOTc5IDUuMTE2MzEgMTguNTgwNiA1LjExNjA5QzE4LjE5NzIgNS4xMTcgMTcuODEzNyA1LjExNjA4IDE3LjQzMDMgNS4xMTY1NFoiCiAgICAgICAgZmlsbD0id2hpdGUiCiAgICAvPgogICAgPHBhdGgKICAgICAgICBkPSJNMjQuMTgzOCAzLjc0NDA3QzI1LjE0NTkgMy43MzQwNiAyNi4xMDg5IDMuNzQyNzEgMjcuMDcxMyAzLjczOTc1QzI3LjMzNTYgMy43NDMzOSAyNy42MDA2IDMuNzI5MDUgMjcuODY0IDMuNzU1NjhDMjguMzMxOSAzLjc5ODI1IDI4LjgwNjEgMy45MzE4OCAyOS4xODA1IDQuMjE5MzlDMjkuNTA2IDQuNDY1MDIgMjkuNzM0NSA0LjgzMTc2IDI5Ljc5NzYgNS4yMzAzNkMyOS44NDMyIDUuNjA3MzQgMjkuODIyIDYuMDA4OTEgMjkuNjMyNCA2LjM0ODc4QzI5LjQ3MTEgNi42NTM2IDI5LjE5MzMgNi44Nzk4OCAyOC44OTQ2IDcuMDQ5N0MyOS4yOTI3IDcuMTk2MyAyOS42ODY0IDcuNDEyNTYgMjkuOTM0MiA3Ljc2MTMxQzMwLjE2NTIgOC4wODM0MyAzMC4yMzI3IDguNDkwNDYgMzAuMjEwMSA4Ljg3NjU1QzMwLjIwMDggOS4yNjkwMSAzMC4wNTQgOS42NjI2IDI5Ljc3OTIgOS45NTE5NEMyOS41MDE2IDEwLjI0ODYgMjkuMTIgMTAuNDMwOSAyOC43Mjg0IDEwLjUzNjhDMjguNDAxMSAxMC42MjMgMjguMDYyNSAxMC42Njc0IDI3LjcyMzcgMTAuNjcwNkMyNi41NDQ1IDEwLjY3MTUgMjUuMzY1MyAxMC42NzE4IDI0LjE4NjEgMTAuNjcwNkMyNC4xODQyIDguMzYxNjEgMjQuMTg4NiA2LjA1Mjg0IDI0LjE4MzggMy43NDQwN1pNMjUuNzA3OCA1LjA4MDM1QzI1LjcwOTQgNS41Njc1IDI1LjcwNjQgNi4wNTQ4OSAyNS43MDkyIDYuNTQyMjhDMjYuMjI1NyA2LjUzOTA5IDI2Ljc0MjMgNi41NDI5NiAyNy4yNTg4IDYuNTQwMjNDMjcuNDkzMSA2LjUyNzk0IDI3LjczNTggNi40OTUzOCAyNy45NDI5IDYuMzc5NzRDMjguMTA2NSA2LjI4OTE0IDI4LjIzMDcgNi4xMjY4MyAyOC4yNTUyIDUuOTQyNDRDMjguMjg5NiA1LjczNDYgMjguMjUzMSA1LjUwMTI2IDI4LjA5NzkgNS4zNDU3OEMyNy45MTEzIDUuMTU3NzQgMjcuNjMzIDUuMDk3NjUgMjcuMzc0OSA1LjA4MjYyQzI2LjgxOTMgNS4wNzgwNyAyNi4yNjM0IDUuMDgyNjIgMjUuNzA3OCA1LjA4MDM1Wk0yNS43MDc2IDcuODE1MjdDMjUuNzA4MyA4LjMyMTMyIDI1LjcwOSA4LjgyNzgzIDI1LjcwNzEgOS4zMzQxMUMyNi4yMDExIDkuMzM4NjcgMjYuNjk1MyA5LjMzNDU3IDI3LjE4OTUgOS4zMzU5M0MyNy40MzYxIDkuMzMyOTcgMjcuNjg1MyA5LjM0OTM2IDI3LjkyOTYgOS4zMDYzNEMyOC4xNDM3IDkuMjcyNjUgMjguMzY0NSA5LjE5Mzg4IDI4LjUwOSA5LjAyODYxQzI4LjY1NDcgOC44NjMxMSAyOC42ODUyIDguNjI3NzMgMjguNjQ4NiA4LjQxODk4QzI4LjYxOTUgOC4yNDE4NyAyOC41MDU4IDguMDgyNzUgMjguMzQ4NSA3Ljk5MTQ2QzI4LjEzNTEgNy44NjQ0NCAyNy44Nzk2IDcuODI0MzcgMjcuNjMzNCA3LjgxNjE4QzI2Ljk5MTUgNy44MTQzNiAyNi4zNDk1IDcuODE2MTggMjUuNzA3NiA3LjgxNTI3WiIKICAgICAgICBmaWxsPSJ3aGl0ZSIKICAgIC8+Cjwvc3ZnPgo="
            alt="" />
        </a>

        <a href="https://store.steampowered.com" target="_blank">
          <img
            src="https://store.akamai.steamstatic.com/public/shared/images/header/logo_steam.svg?t=962016"
            width="55"
            class="ms-1"
            style="margin-right: -5px"
            alt="Link to the Steam Homepage" />
        </a>

        <span
          class="form-help cursor-help mx-2"
          v-tippy="{
            content: 'Automatic updates are disabled for GOG libraries',
            placement: 'top',
          }">
          ?
        </span>
      </small> -->
    </div>
  </div>
</template>

<script>
/**
 * @file:    \components\search\filters\dropdown.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 7th February 2024
 * Modified: 27th November 2025 - 05:02:12
 **/

export default {
  name: 'SearchFilters',
  emits: ['search'],

  data() {
    return {
      ui: {
        dice: 4,
        step: 'pick',
        findOption: '',
      },
    }
  },

  computed: {
    ...mapState(useStateStore, {
      _states: 'states',
    }),

    ...mapState(useRepositoryStore, {
      _genres: 'genres',
    }),

    ...mapStores(useSearchStore),
    ...mapState(useSearchStore, ['f', 'stats', 'loading', 'time']),

    //+-------------------------------------------------
    // showEnterHint()
    // -----
    // Created on Mon Jun 30 2025
    //+-------------------------------------------------
    showEnterHint() {
      return (this.f.string || '').trim() !== (this.f.box || '').trim()
    },

    //+-------------------------------------------------
    // sourceLabel()
    // Appropiate labeling
    // -----
    // Created on Mon Jan 13 2025
    //+-------------------------------------------------
    sourceLabel() {
      if (!this.f?.source) return 'Loading...'
      if (this.f.source == 'all') return 'All games'
      if (this.f.source == 'library') return 'Your library'
      if (this.f.source.includes(':fav')) return 'Favorites'
      if (this.f.source.includes(':pinned')) return 'Pinned games'
      if (this.f.source.includes(':hidden')) return 'Hidden games'

      if (this.f.source.includes('state:')) {
        const id = this.f.source.split(':')[1]
        const state = this._states.find((s) => s.id == id)
        if (state) return state.name
      }

      return this.f.source
    },

    //+-------------------------------------------------
    // sourceState()
    // Returns the state object for the current source
    // -----
    // Created on Mon Jan 13 2025
    //+-------------------------------------------------
    sourceState() {
      if (!this.f?.source) return null
      // TODO: do that searching into filters
      // if (this.f.states.length !== 1) return null
      if (this.f.source.includes('state:')) {
        const id = this.f.source.split(':')[1]
        return this._states.find((s) => s.id == id)
      }

      return null
    },

    //+-------------------------------------------------
    // sortLabel()
    // a human readable array of sort options
    // -----
    // TODO: this should be an enum
    // -----
    // Created on Mon Feb 03 2025
    //+-------------------------------------------------
    sortLabel() {
      return {
        'none': 'None',
        'name': 'Name',
        'rand': 'Random',
        'score': 'Score',
        'metascore': 'Metacritic',
        'oc': 'OpenCritic',
        'steamscore': 'Steam recommendations',
        'steamdb': 'SteamDB rating',
        'playtime': 'Your playtime',
        'hltb': 'How long to beat',
        'date.lib': 'Date added to your library',
        'date.released': 'Release date',
        'achievements': 'Achievements',
      }
    },

    // _filters() {
    //   const enabled = ['states', 'genres', 'released']

    //   const filters = {}

    //   for (const key in this.f) {
    //     if (enabled.includes(key)) {
    //       if (key == 'states' && this.f[key].includes('pinned')) continue
    //       if (!this.f[key] || !this.f[key].length) continue
    //       if (this.f[key].length == 0) continue

    //       filters[key] = this.f[key]
    //     }
    //   }

    //   return filters
    // },

    // _released() {
    //   let manual = false

    //   if (this.selected.month) {
    //     if (!this.selected.year) {
    //       manual = true
    //       this.selected.year = this.$moment().year()
    //     }
    //   }

    //   if (this.selected.year) {
    //     if (!this.selected.month) {
    //       manual = true
    //       this.selected.month = this.$moment().month() + 1
    //     }
    //   }

    //   const dates = [
    //     {
    //       name: '15 days ago',
    //       value: this.$dayjs().subtract(15, 'days').unix(),
    //     },

    //     {
    //       name: '1 month ago',
    //       value: this.$dayjs().subtract(1, 'months').unix(),
    //     },

    //     {
    //       name: '3 months ago',
    //       value: this.$dayjs().subtract(3, 'months').unix(),
    //     },
    //   ]

    //   return dates
    // },

    // _cardProperties() {
    //   return {
    //     default: 'Default',
    //     name: 'Name',
    //     score: 'Score',
    //     playtime: 'Playtime',
    //     hltb: 'How long to beat',
    //     released: 'Release date',
    //     genres: 'Genres',
    //   }
    // },

    showTags() {
      return this.f?.show?.tags
    },
  },

  methods: {
    //+-------------------------------------------------
    // handleKeydown()
    // Handles keyboard navigation on the search field
    // -----
    // Created on Thu Apr 03 2025
    //+-------------------------------------------------
    handleKeydown(e) {
      let action = false
      if (!e.target.classList.contains('v-field__input')) return

      if (e.key == 'Enter') {
        action = true
        let { suggestedValue, suggestions } = this.$refs.filtersMenuKbd || {}

        // If it has a suggested value, is a filter
        if (suggestedValue) this.$refs.filtersMenuKbd.addFilter()
        // If it has no suggested value, but there are suggestions, write the path
        else if (suggestions?.length) this.$refs.filtersMenuKbd.writePath()
        // If there are no suggestions, add the string as a filter
        else this.addStringFilter()
      }

      if (e.key == 'ArrowUp') {
        action = true
        this.$refs.filtersMenuKbd.move('up')
      }

      if (e.key == 'ArrowDown') {
        action = true
        this.$refs.filtersMenuKbd.move('down')
      }

      if (e.key == 'ArrowRight' || e.key == 'Tab') {
        action = true
        this.$refs.filtersMenuKbd.writePath()
      }

      if (e.key == 'Escape') {
        // this.$refs.filtersTippy.hide()
        // action = true
        // e.target.blur()
      }

      if (!action) return

      e.preventDefault()
      e.stopPropagation()
      return false
    },

    //+-------------------------------------------------
    // handleNewFilter()
    // A new filter has been added
    // -----
    // Created on Thu Apr 03 2025
    //+-------------------------------------------------
    handleNewFilter() {
      this.$nextTick(() => {
        this.$refs.searchBox.blur()
        this.$refs.filtersTippy.hide()
      })

      if (this.f.filters.length > 3) {
        this.searchStore.f.show.tags = 'row'
      }
    },

    addStringFilter() {
      this.f.string = this.f.box
      this.$mitt.emit('search:run', 3)
    },

    // filterLabel(key) {
    //   let data = this['_' + this.options[key].data]
    //   if (!data) return

    //   data = data.filter((item) => this.f[key].includes(item[this.options[key].opValue]))

    //   if (data.length == 1) return data[0][this.options[key].opLabel]

    //   return data.length + ' ' + this.options[key].labels
    // },

    //+-------------------------------------------------
    // sortBy()
    // Applies sortBy to the filters
    // -----
    // Created on Sun Mar 17 2024
    //+-------------------------------------------------
    sortBy(sort) {
      this.f.sortBy = sort.by
      this.f.sortDir = sort.dir
      this.f.sortAsc = sort.asc

      this.$emit('search')
      // this.$refs.tippySort.hide()
    },

    //+-------------------------------------------------
    // clearSearchBox()
    // -----
    // Created on Tue May 13 2025
    //+-------------------------------------------------
    clearSearchBox() {
      this.searchStore.clearFilter(-1)
      this.$emit('search')
    },

    //+-------------------------------------------------
    // pick()
    // picks an option from the group of options
    // this.options are the filters available
    // -----
    // Created on Fri Feb 09 2024
    //+-------------------------------------------------
    // pick(option) {
    //   this.option = option
    //   this.selected = this.restoreFilter(option)

    //   this.ui.step = 'picked'

    //   this.$nextTick(() => {
    //     if (this.$app.device !== 'sm') {
    //       this.$refs.findOption?.focus()
    //     }
    //   })
    // },

    //+-------------------------------------------------
    // select()
    // selects an option from the group of options to filter
    // -----
    // Created on Fri Feb 09 2024
    //+-------------------------------------------------
    // select(param, mode = 'soft') {
    //   const key = param[this.option.opValue]

    //   if (this.option.multiple == false) {
    //     this.selected = {}
    //   }

    //   if (this.selected[key]) delete this.selected[key]
    //   else this.selected[key] = { ...param }

    //   this.filter()

    //   if (mode == 'hard') {
    //     // this.$refs.tippyFilter.hide()
    //   }
    // },

    //+-------------------------------------------------
    // visibleProps()
    // Define the visible properties for the card
    // -----
    // Created on Fri May 10 2024
    // Updated on Tue Dec 31 2024 - No longer notifies
    //+-------------------------------------------------
    visibleProps(key) {
      if (this.f.show.card.includes(key)) {
        this.f.show.card = this.f.show.card.filter((item) => item !== key)
      } else {
        this.f.show.card.push(key)
      }

      if (key == 'default') this.f.show.card = ['default']
      if (this.f.show.card.length == 0) this.f.show.card = ['default']
      if (this.f.show.card.length > 1 && this.f.show.card.includes('default')) {
        this.f.show.card.splice(this.f.show.card.indexOf('default'), 1)
      }
    },

    init() {},
  },

  mounted() {
    this.init()
  },
}
</script>
