<template>
  <!-- <pre
    v-if="ui.dialog"
    class="my-3"
    style="
      position: fixed;
      bottom: 10px;
      left: 200px;
      z-index: 9999;
      max-height: 120vh;
      overflow-y: scroll;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      padding: 10px;
      border-radius: 5px;
      width: auto;
    "
    >{{ app }}
</pre> -->

  <VueFinalModal
    v-model="ui.dialog"
    class="details-modal"
    content-class="details-modal-content movie_card "
    overlay-transition="vfm-fade"
    :content-transition="{
      'enter-active-class': 'hunaa-menu-enter-active',
      'enter-from-class': 'hunaa-menu-y-0',
      'enter-to-class': 'hunaa-menu-full',
      'leave-active-class': 'hunaa-menu-leave-active',
      'leave-to-class': 'hunaa-menu-y-0',
      'leave-from-class': 'hunaa-menu-full',
    }">
    <div
      v-if="$prev"
      class="btn btn-ghost-secondary"
      style="position: absolute; left: -77px; z-index: 9999"
      @click="changeTo($prev)">
      <Icon size="50" width="2">ChevronLeft</Icon>
    </div>

    <div class="modal-back"></div>
    <div class="info_section row">
      <div class="col-12 row">
        <div class="movie_header">
          <game-asset
            ref="cover"
            :app="app"
            asset="cover"
            class="locandina"
            :priority="['steam', 'igdb']"
            @click="ui.layout = ui.layout == 'full' ? 'lite' : 'full'"></game-asset>

          <h2>
            {{ app.name }}
          </h2>
          <div>
            <BState :app="app.uuid" :state="app.state"></BState>
          </div>
          <div>
            <div
              v-tippy="{ content: 'Click to change', placement: 'bottom' }"
              class="status my-2"
              style="border-radius: 4px">
              <span style="font-size: 0.775rem">
                Played
                <!-- <Icon class="mx-1" style="color: #666">ArrowRightRhombus</Icon> -->
                {{ dates.minToHours(app._.playtime) }}
              </span>
            </div>
          </div>
          <p class="type" style="margin-left: 0; font-size: 13px">
            {{ listOfGenres(app) }}
          </p>
          <!-- <div class="status my-2" style="border-radius: 4px; font-size: 0.775rem">
            hey
            <span class="badge bg-blue-lt">Blue</span>
          </div> -->

          <!-- <button
            v-tippy="'Filter by game state'"
            :class="'btn py-2 ps-3 pe-2'"
            style="transform: scale(0.9) translateX(-5px)">
            <Icon size="19" class="text-muted me-1">Background</Icon>
            <div class="pe-2 me-2 border-end">State</div>
            <BState :state="3" :label="true" :pulse="false"></BState>
          </button> -->

          <!-- <h4>xxxxx{{ app.released_at }}, xxxx{{ app.developer }}</h4> -->
          <span v-if="$app.dev" class="minutes">125 min</span>
        </div>
        <div v-if="ui.layout == 'full'" class="col">ddd</div>
      </div>
      <div class="col-12 col-md-7 px-3">
        <p
          class="text"
          style="
            text-align: justify;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          "
          v-html="app.description || 'No description available'"></p>
      </div>
      <div class="col-5 px-3"></div>
      <div class="row row-deck row-cards">
        <div v-if="app.score" class="col-sm-6 col-lg-3">
          <div class="card">
            <div class="card-body" style="padding: 0.5rem 0.75rem">
              <div class="d-flex align-items-center">
                <div class="subheader">Median score</div>

                <div class="ms-auto">
                  <tippy class="text-muted ms-auto cursor-help" :content="'xxx'">
                    <Icon>HelpCircleFilled</Icon>
                  </tippy>
                </div>
              </div>
              <div class="h1 mb-3">
                {{ app.score }}
                <span class="subheader">/100</span>
                <!-- <br />
                <span class="subheader">Overwhelmingly positive</span> -->
              </div>

              <div class="progress progress-sm" style="background-color: #25384f">
                <div class="progress-bar bg-primary" :style="`width: ${app.score}%`">
                  <span class="visually-hidden">{{ app.score }}% Complete</span>
                </div>
              </div>
              <!-- <div class="d-flex mb-2">
                <div class="subheader">125.000 votes on Steam</div>
              </div> -->
            </div>
          </div>
        </div>
        <div v-if="app.scores.metascore" class="col-sm-6 col-lg-3">
          <div class="card">
            <div class="card-body" style="padding: 0.5rem 0.75rem">
              <div class="d-flex align-items-center">
                <div class="subheader">Metacritic reviews</div>
              </div>
              <div class="h1 mb-3">
                {{ app.scores.metascore }}
                <span class="subheader">/100</span>
                <!-- <br />
                <span class="subheader">Overwhelmingly positive</span> -->
              </div>

              <div class="progress progress-sm" style="background-color: #25384f">
                <div class="progress-bar bg-primary" :style="`width: ${app.score}%`">
                  <span class="visually-hidden">{{ app.score }}% Complete</span>
                </div>
              </div>
              <!-- <div class="d-flex mb-2">
                <div class="subheader">125.000 votes on Steam</div>
              </div> -->
            </div>
          </div>
        </div>
      </div>

      <div>95 /100 Median score</div>

      <div>93 /100 Overwhelmingly positive Steam score 125.000 votes view on steam</div>

      <div class="col-12 px-3">
        <div class="btn-list">
          <a v-tippy="'Open Steam store page'" href="#" class="btn btn-sm btn-icon">
            <Icon>BrandSteam</Icon>
          </a>
          <a v-tippy="'Open on Steam'" href="#" class="btn btn-icon btn-sm">
            <Icon>GitMerge</Icon>
          </a>
        </div>

        <ul v-if="ui.layout == 'full'">
          <li>
            <!-- <div class="btn btn-sm pe-3">
              <Icon size="14" class="mx-2">BrandSteam</Icon>
              On Steam
            </div> -->
          </li>
          <li><Icon>Clock</Icon></li>
          <li><Icon>Note</Icon></li>
        </ul>
      </div>

      <div v-if="ui.layout == 'full'" class="col-12 p-3">
        <div class="datagrid">
          <div class="datagrid-item">
            <div class="datagrid-title">Registrar</div>
            <div class="datagrid-content">Third Party</div>
          </div>
          <div class="datagrid-item">
            <div class="datagrid-title">Nameservers</div>
            <div class="datagrid-content">Third Party</div>
          </div>
          <div class="datagrid-item">
            <div class="datagrid-title">Port number</div>
            <div class="datagrid-content">3306</div>
          </div>
          <div class="datagrid-item">
            <div class="datagrid-title">Expiration date</div>
            <div class="datagrid-content">–</div>
          </div>
          <div class="datagrid-item">
            <div class="datagrid-title">Creator</div>
            <div class="datagrid-content">
              <div class="d-flex align-items-center">
                <span
                  class="avatar avatar-xs me-2 rounded"
                  style="background-image: url(./static/avatars/000m.jpg)"></span>
                Paweł Kuna
              </div>
            </div>
          </div>
          <div class="datagrid-item">
            <div class="datagrid-title">Age</div>
            <div class="datagrid-content">15 days</div>
          </div>
          <div class="datagrid-item">
            <div class="datagrid-title">Edge network</div>
            <div class="datagrid-content">
              <span class="status status-green">Active</span>
            </div>
          </div>
          <div class="datagrid-item">
            <div class="datagrid-title">Avatars list</div>
            <div class="datagrid-content">
              <div class="avatar-list avatar-list-stacked">
                <span
                  class="avatar avatar-xs rounded"
                  style="background-image: url(./static/avatars/000m.jpg)"></span>
                <span class="avatar avatar-xs rounded">JL</span>
                <span
                  class="avatar avatar-xs rounded"
                  style="background-image: url(./static/avatars/002m.jpg)"></span>
                <span
                  class="avatar avatar-xs rounded"
                  style="background-image: url(./static/avatars/003m.jpg)"></span>
                <span
                  class="avatar avatar-xs rounded"
                  style="background-image: url(./static/avatars/000f.jpg)"></span>
                <span class="avatar avatar-xs rounded">+3</span>
              </div>
            </div>
          </div>
          <div class="datagrid-item">
            <div class="datagrid-title">Checkbox</div>
            <div class="datagrid-content">
              <label class="form-check">
                <input class="form-check-input" type="checkbox" checked="" />
                <span class="form-check-label">Click me</span>
              </label>
            </div>
          </div>
          <div class="datagrid-item">
            <div class="datagrid-title">Icon</div>
            <div class="datagrid-content">
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
              Checked
            </div>
          </div>
          <div class="datagrid-item">
            <div class="datagrid-title">Form control</div>
            <div class="datagrid-content">
              <input
                type="text"
                class="form-control form-control-flush"
                placeholder="Input placeholder" />
            </div>
          </div>
          <div class="datagrid-item">
            <div class="datagrid-title">Longer description</div>
            <div class="datagrid-content">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6" style="display: flex; align-items: flex-end">
        <small class="text-muted">
          <Icon
            v-tippy="'In Backlog.rip since ' + $moment(app.created_at).format('LL')"
            size="16"
            style="transform: translateY(-2px)"
            class="me-1">
            Calendar
          </Icon>
          In your library since
          {{ $moment(app._dateOwned).format('LL') }}
        </small>
      </div>
      <div
        class="col-12 col-md-6 text-end"
        style="display: flex; align-items: flex-end; justify-content: flex-end">
        <small class="text-muted">
          Data updated {{ $moment(app.updated_at).format('LL') }}
          <br />
          Game data provided by
          <img
            class="px-1"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNCIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDM0IDE2IiBmaWxsPSJub25lIj4KICAgIDxwYXRoCiAgICAgICAgZD0iTTYuNzE2ODVlLTA1IDAuMDAwOTExNDY4QzExLjMzMzEgMC4wMDA2ODM4MjMgMjIuNjY2NSAwLjAwMjUwNDA5IDMzLjk5OTggMEMzNCA1LjMzMzI2IDM0LjAwMDIgMTAuNjY2NyAzMy45OTk1IDE2QzMxLjc5MzcgMTUuNjUyNCAyOS41Nzc5IDE1LjM2MTIgMjcuMzU0IDE1LjE0ODJDMTkuMzI5MSAxNC4zNjg1IDExLjIxMjIgMTQuNDk5MSAzLjIxNzc4IDE1LjUzNjdDMi4xNDI1NyAxNS42NzMxIDEuMDcxMDkgMTUuODM1OSA2LjcxNjg1ZS0wNSAxNS45OTkzQy0wLjAwMDE2NTUxIDEwLjY2NjUgMC4wMDAyOTk4NDcgNS4zMzM3MSA2LjcxNjg1ZS0wNSAwLjAwMDkxMTQ2OFpNMS4wMDA4MiAwLjk4MDIzOEMxLjAwMTI4IDUuNjA1NzUgMS4wMDA4MiAxMC4yMzE1IDEuMDAwODIgMTQuODU3QzExLjU4NDcgMTMuMjcyMSAyMi40MTU0IDEzLjI3MDggMzIuOTk5IDE0Ljg1NzVDMzIuOTk5NyAxMC4yMzE1IDMyLjk5OTIgNS42MDU1MiAzMi45OTkyIDAuOTc5NTU1QzIyLjMzMyAwLjk4MTE0OSAxMS42NjY4IDAuOTgwMDEgMS4wMDA4MiAwLjk4MDIzOFoiCiAgICAgICAgZmlsbD0id2hpdGUiCiAgICAvPgogICAgPHBhdGgKICAgICAgICBkPSJNOC4zMTkyNiA0LjYxOEM5LjAxMjg3IDMuOTU3MzcgOS45ODU5NCAzLjYwNTQ0IDEwLjk0OTcgMy42MjAyM0MxMS42MDc3IDMuNjE3OTYgMTIuMjc5NCAzLjcxODggMTIuODcxMiA0LjAxMjY5QzEzLjE3NjIgNC4xNjE1NyAxMy40NTQ5IDQuMzU2ODkgMTMuNzE1MSA0LjU3MTU2QzEzLjM4NzcgNC45NTgzMyAxMy4wNTc1IDUuMzQyNTkgMTIuNzMzOSA1LjczMjA5QzEyLjUzOTEgNS41ODkzNiAxMi4zNDk3IDUuNDM3MDYgMTIuMTM0MyA1LjMyNDE1QzExLjcwMTcgNS4wODUzNSAxMS4xOTIxIDUuMDAyNzIgMTAuNzAwNSA1LjAzNzc4QzEwLjA5ODggNS4wODgwOCA5LjU0ODI3IDUuNDQyOTggOS4yMjIyOCA1LjkzNDQ3QzguODAyMDcgNi41NTE4NCA4LjczNjY4IDcuMzY0MyA4Ljk5MTIzIDguMDU1NjZDOS4xNDUyNyA4LjQ3NTY2IDkuNDM5MzcgOC44NDgzMiA5LjgyNjc4IDkuMDg2MjFDMTAuMjEyMSA5LjMyODQyIDEwLjY4IDkuNDI1NjIgMTEuMTM0MiA5LjM5ODk5QzExLjYgOS4zODE0NiAxMi4wNzQyIDkuMjU3MTcgMTIuNDUzNSA4Ljk4NDY4QzEyLjQ0OTggOC42NTY4NyAxMi40NTM1IDguMzI4ODMgMTIuNDUxNiA4LjAwMTAyQzExLjkyOTcgOC4wMDIzOSAxMS40MDc2IDguMDAwNTcgMTAuODg1NyA4LjAwMTk0QzEwLjg4NDUgNy41NjIxMyAxMC44ODg1IDcuMTIyMzIgMTAuODgzOCA2LjY4MjczQzExLjkxMDQgNi42NzYzNiAxMi45MzcyIDYuNjg1MDEgMTMuOTYzOCA2LjY3ODQxQzEzLjk3MDEgNy42ODI1NSAxMy45NjMxIDguNjg2OTIgMTMuOTY3MyA5LjY5MTA2QzEzLjI2MDcgMTAuMjg3OSAxMi4zNjg4IDEwLjY3OTUgMTEuNDM3NCAxMC43Njg1QzEwLjUyODEgMTAuODY2MiA5LjU2OTQ0IDEwLjcwMjUgOC43OTQzOSAxMC4yMTE5QzguMTczMzcgOS44MjQ2OCA3LjY5MzU5IDkuMjMwNzYgNy40NDI1MyA4LjU1NDJDNy4xOTQ3MiA3Ljg4ODU3IDcuMTQ1ODYgNy4xNTUxIDcuMjg1IDYuNDYxMjRDNy40Mjk5NiA1Ljc2MzczIDcuNzkyNDcgNS4xMDk3MSA4LjMxOTI2IDQuNjE4WiIKICAgICAgICBmaWxsPSJ3aGl0ZSIKICAgIC8+CiAgICA8cGF0aAogICAgICAgIGQ9Ik0zLjc4NzYxIDMuNzM5NTJDNC4zMDgxMSAzLjc0MDY2IDQuODI4NjEgMy43Mzg2MSA1LjM0OTEyIDMuNzQwNjZDNS4zNDc5NSA2LjA1MDc5IDUuMzQ5MTIgOC4zNjExNiA1LjM0ODY1IDEwLjY3MTVDNC44MjgzOCAxMC42NzEzIDQuMzA4MTEgMTAuNjcwNiAzLjc4Nzg0IDEwLjY3MThDMy43ODc2MSA4LjM2MTE2IDMuNzg4MDggNi4wNTAzNCAzLjc4NzYxIDMuNzM5NTJaIgogICAgICAgIGZpbGw9IndoaXRlIgogICAgLz4KICAgIDxwYXRoCiAgICAgICAgZD0iTTE1Ljg2NDMgMy43Mzk3NUMxNi44MTY1IDMuNzM5OTcgMTcuNzY4NiAzLjczOTc1IDE4LjcyMDcgMy43Mzk5N0MxOS41ODYzIDMuNzQ5MzEgMjAuNDYyOCA0LjAxMjAxIDIxLjE0MDEgNC41NDkwMkMyMS43MzIzIDUuMDEyMjggMjIuMTUyMiA1LjY3ODYgMjIuMzEyMyA2LjQwMzY0QzIyLjUwNjEgNy4yNzkxNiAyMi4zNzk4IDguMjMzOTEgMjEuODk5MyA5LjAwNDAzQzIxLjUxOCA5LjYyNDgxIDIwLjkxOSAxMC4xMDgxIDIwLjIzNDUgMTAuMzc5MkMxOS43NTQ5IDEwLjU2OTggMTkuMjM3NyAxMC42Njk5IDE4LjcyIDEwLjY3MTNDMTcuNzY4MyAxMC42NzEzIDE2LjgxNjUgMTAuNjcwOCAxNS44NjQ2IDEwLjY3MTVDMTUuODY0NiA4LjM2MDkzIDE1Ljg2NSA2LjA1MDM0IDE1Ljg2NDMgMy43Mzk3NVpNMTcuNDMwMyA1LjExNjU0QzE3LjQyNzkgNi41MDkyNyAxNy40MzA1IDcuOTAyIDE3LjQyODkgOS4yOTQ5NkMxNy43Mjc2IDkuMjk0NSAxOC4wMjY2IDkuMjk0NzMgMTguMzI1NCA5LjI5NDczQzE4LjU2NiA5LjI5MjkxIDE4LjgwODYgOS4zMDU4OCAxOS4wNDY5IDkuMjYyNjNDMTkuNTEzOSA5LjE5MTYxIDE5Ljk2MzkgOC45NzE5MyAyMC4yNzI3IDguNjE3NDlDMjAuNTQyNiA4LjMxMzgxIDIwLjY5OTQgNy45MjQzMSAyMC43NDY2IDcuNTI3MDdDMjAuNzkwNiA3LjEyMzY4IDIwLjc1NTcgNi43MDU3MyAyMC41OTU4IDYuMzI4NzVDMjAuNDMxMyA1LjkyODA5IDIwLjEyMzcgNS41ODUyNiAxOS43MzUyIDUuMzc5N0MxOS4zODQzIDUuMTg4NDggMTguOTc5IDUuMTE2MzEgMTguNTgwNiA1LjExNjA5QzE4LjE5NzIgNS4xMTcgMTcuODEzNyA1LjExNjA4IDE3LjQzMDMgNS4xMTY1NFoiCiAgICAgICAgZmlsbD0id2hpdGUiCiAgICAvPgogICAgPHBhdGgKICAgICAgICBkPSJNMjQuMTgzOCAzLjc0NDA3QzI1LjE0NTkgMy43MzQwNiAyNi4xMDg5IDMuNzQyNzEgMjcuMDcxMyAzLjczOTc1QzI3LjMzNTYgMy43NDMzOSAyNy42MDA2IDMuNzI5MDUgMjcuODY0IDMuNzU1NjhDMjguMzMxOSAzLjc5ODI1IDI4LjgwNjEgMy45MzE4OCAyOS4xODA1IDQuMjE5MzlDMjkuNTA2IDQuNDY1MDIgMjkuNzM0NSA0LjgzMTc2IDI5Ljc5NzYgNS4yMzAzNkMyOS44NDMyIDUuNjA3MzQgMjkuODIyIDYuMDA4OTEgMjkuNjMyNCA2LjM0ODc4QzI5LjQ3MTEgNi42NTM2IDI5LjE5MzMgNi44Nzk4OCAyOC44OTQ2IDcuMDQ5N0MyOS4yOTI3IDcuMTk2MyAyOS42ODY0IDcuNDEyNTYgMjkuOTM0MiA3Ljc2MTMxQzMwLjE2NTIgOC4wODM0MyAzMC4yMzI3IDguNDkwNDYgMzAuMjEwMSA4Ljg3NjU1QzMwLjIwMDggOS4yNjkwMSAzMC4wNTQgOS42NjI2IDI5Ljc3OTIgOS45NTE5NEMyOS41MDE2IDEwLjI0ODYgMjkuMTIgMTAuNDMwOSAyOC43Mjg0IDEwLjUzNjhDMjguNDAxMSAxMC42MjMgMjguMDYyNSAxMC42Njc0IDI3LjcyMzcgMTAuNjcwNkMyNi41NDQ1IDEwLjY3MTUgMjUuMzY1MyAxMC42NzE4IDI0LjE4NjEgMTAuNjcwNkMyNC4xODQyIDguMzYxNjEgMjQuMTg4NiA2LjA1Mjg0IDI0LjE4MzggMy43NDQwN1pNMjUuNzA3OCA1LjA4MDM1QzI1LjcwOTQgNS41Njc1IDI1LjcwNjQgNi4wNTQ4OSAyNS43MDkyIDYuNTQyMjhDMjYuMjI1NyA2LjUzOTA5IDI2Ljc0MjMgNi41NDI5NiAyNy4yNTg4IDYuNTQwMjNDMjcuNDkzMSA2LjUyNzk0IDI3LjczNTggNi40OTUzOCAyNy45NDI5IDYuMzc5NzRDMjguMTA2NSA2LjI4OTE0IDI4LjIzMDcgNi4xMjY4MyAyOC4yNTUyIDUuOTQyNDRDMjguMjg5NiA1LjczNDYgMjguMjUzMSA1LjUwMTI2IDI4LjA5NzkgNS4zNDU3OEMyNy45MTEzIDUuMTU3NzQgMjcuNjMzIDUuMDk3NjUgMjcuMzc0OSA1LjA4MjYyQzI2LjgxOTMgNS4wNzgwNyAyNi4yNjM0IDUuMDgyNjIgMjUuNzA3OCA1LjA4MDM1Wk0yNS43MDc2IDcuODE1MjdDMjUuNzA4MyA4LjMyMTMyIDI1LjcwOSA4LjgyNzgzIDI1LjcwNzEgOS4zMzQxMUMyNi4yMDExIDkuMzM4NjcgMjYuNjk1MyA5LjMzNDU3IDI3LjE4OTUgOS4zMzU5M0MyNy40MzYxIDkuMzMyOTcgMjcuNjg1MyA5LjM0OTM2IDI3LjkyOTYgOS4zMDYzNEMyOC4xNDM3IDkuMjcyNjUgMjguMzY0NSA5LjE5Mzg4IDI4LjUwOSA5LjAyODYxQzI4LjY1NDcgOC44NjMxMSAyOC42ODUyIDguNjI3NzMgMjguNjQ4NiA4LjQxODk4QzI4LjYxOTUgOC4yNDE4NyAyOC41MDU4IDguMDgyNzUgMjguMzQ4NSA3Ljk5MTQ2QzI4LjEzNTEgNy44NjQ0NCAyNy44Nzk2IDcuODI0MzcgMjcuNjMzNCA3LjgxNjE4QzI2Ljk5MTUgNy44MTQzNiAyNi4zNDk1IDcuODE2MTggMjUuNzA3NiA3LjgxNTI3WiIKICAgICAgICBmaWxsPSJ3aGl0ZSIKICAgIC8+Cjwvc3ZnPgo="
            alt="" />
          and
          <Icon>BrandSteam</Icon>
        </small>
      </div>
      <div v-if="ui.layout == 'full'" class="col">
        You played: {{ app._playtime }} last played: {{ app._last_played }}
        <br />
        scores: {{ app.scores }}
        <br />
        hltb: {{ app.hltb }}
      </div>

      <!-- <div v-if="$app.dev" class="col">
        owned: {{ app.is.owned }}
        <div v-tippy="'View history log of changes'"><Icon>Paper</Icon></div>
      </div> -->
    </div>
    <div class="blur_back">
      <game-asset
        ref="background"
        :app="app"
        asset="background"
        :priority="['steam']"></game-asset>
    </div>
    <div
      v-if="$next"
      class="btn btn-ghost-secondary"
      style="position: absolute; right: -77px; z-index: 9999"
      @click="changeTo($next)">
      <Icon size="50" width="2">ChevronRight</Icon>
    </div>
  </VueFinalModal>

  <!-- <b-dialog v-model="ui.dialog" class="game-details">
    <div class="row">
      <div class="col-4 details-sidebar" style="position: relative">
        <game-asset :app="app" asset="logo" :priority="['steam', 'igdb']"></game-asset>
      </div>
      <div class="col-8 details-content">
        <h1>{{ app.name }}</h1>

        <pre>{{ app }}</pre>
        <pre>{{ timeline }}</pre>
        <ul>
          <li>
            {{ app.updated_at }}
          </li>
          <li>

          </li>
        </ul>
        <textarea
          v-model="status.note"
          class="form-control"
          name="note"
          rows="2"
          @blur="setNote"></textarea>
        <span v-if="status.noteObject" class="d-block text-muted">
          Note created at {{ status.noteObject.created_at }}
        </span>
      </div>
    </div>
  </b-dialog> -->
</template>

<script>
/**
 * @file:    \components\b\details.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 1st December 2023
 * Modified: Tue Feb 27 2024
 **/

export default {
  name: 'GameDetails',
  data() {
    return {
      $list: null,
      timeline: [],

      status: {
        note: '',
        noteObject: null,
        needs_update: false,
      },

      ui: {
        layout: 'lite', // full
        dialog: false,
        loading: false,
      },
    }
  },

  computed: {
    ...mapStores(useGameStore, useJournalStore),
    // ...mapState(useDataStore, ['app']),
    ...mapState(useGameStore, ['app']),
    ...mapState(useRepositoryStore, {
      _genres: 'keyedGenres',
    }),

    $prev() {
      if (!this.app || !this.$data.$list || !this.$data.$list.items) return

      const index = this.$data.$list.items.indexOf(this.app.uuid)
      return this.$data.$list.items[index - 1]
    },

    $next() {
      if (!this.app || !this.$data.$list || !this.$data.$list.items) return

      const index = this.$data.$list.items.indexOf(this.app.uuid)
      return this.$data.$list.items[index + 1]
    },
  },

  methods: {
    async show() {
      this.ui.dialog = true
    },

    changeTo(uuid) {
      this.gameStore.load(uuid)
    },

    listOfGenres(app) {
      if (!app.genres) return
      return app.genres.map((id) => this._genres[id].name).join(', ')
    },

    confirm() {
      console.log('confirm✅✅✅✅')
      this.show = false
    },

    async load(payload) {
      this.$list = payload.$list
      this.gameStore.load(payload.uuid)
      // const timeline = await this.journalStore.getForRef(app)

      // this.app = { ...data }
      // this.timeline = { ...timeline }

      // const note = await this.journalStore.getNoteForRef(app)
      // this.status.noteObject = note || null
      // this.status.note = note?.data.note || ''

      // // console.warn(app, this.app, timeline)

      // this.evaluate()

      this.show()
    },

    //+-------------------------------------------------
    // evaluate()
    // Evaluates the status of the loaded data
    // And determines if it needs to be updated and more
    // -----
    // Created on Tue Dec 12 2023
    //+-------------------------------------------------
    evaluate() {
      if (!this.app.api_id) {
        this.status.needs_update = true
      }
    },

    //+-------------------------------------------------
    // setNote()
    // update or create a note for the current app
    // TODO: if note is empty, delete note
    // -----
    // Created on Tue Dec 26 2023
    //+-------------------------------------------------
    setNote() {
      if (!this.status.note) return

      this.journalStore.updateOrCreateNote(this.app.uuid, this.status.note)
      this.$toast.success('Note saved for ' + this.app.name, {
        description: 'Monday, January 3rd at 6:00pm',
      })
    },
  },

  mounted() {
    this.$mitt.on('game:modal', (payload) => {
      this.load(payload)
    })
  },
}
</script>
