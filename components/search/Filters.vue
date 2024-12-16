<template>
  <pre
    class="d-none my-3"
    style="
      position: fixed;
      bottom: 10px;
      left: 600px;
      z-index: 9999;
      max-height: 300px;
      max-width: 190px;
      overflow-y: scroll;
      background: rgba(39, 12, 42, 0.5);
      color: white;
      padding: 10px;
      border-radius: 5px;
      width: auto;
    ">
Option
{{ option }}
</pre
  >
  <pre
    class="d-none my-3"
    style="
      position: fixed;
      bottom: 10px;
      left: 800px;
      z-index: 9999;
      max-height: 300px;
      max-width: 190px;
      overflow-y: scroll;
      background: rgba(39, 12, 42, 0.5);
      color: white;
      padding: 10px;
      border-radius: 5px;
      width: auto;
    ">
Selected
{{ selected }}
</pre
  >

  <!--
  *+---------------------------------
  *| First row
  *| Search field
  *+--------------------------------- -->
  <div class="col-12 row gx-2 mx-0 mb-2 align-items-center">
    <div class="col">
      <v-text-field
        v-model="f.string"
        placeholder="Search any game..."
        clearable
        density="comfortable"
        @update:modelValue="notify">
        <!-- <template v-slot:prepend-inner>
          <Icon size="16" class="text-secondary mx-1" style="min-width: 1em">Search</Icon>
        </template> -->
        <!-- <template v-slot:clear>
          <Icon size="16" style="min-width: 1em; transform: translateY(1px)">
            SquareRoundedX
          </Icon>
        </template> -->
      </v-text-field>
    </div>
    <div class="col-auto">
      <!-- <button type="submit" class="btn" style="padding: 0.35rem 0.85rem">Search</button> -->
      <!-- <v-btn variant="tonal" color="secondary">Search</v-btn> -->
      <div class="btn" style="background: rgb(30 31 41 / 20%)">
        <!-- <Icon class="me-2" size="16">ColorFilter</Icon> -->
        <!-- <small>Search</small> -->
        <Icon size="16" class="text-secondary mx-1" style="min-width: 1em">Search</Icon>
      </div>
    </div>
  </div>

  <!--
    *+---------------------------------
    *| Second line
    *| Select souce and apply filters
    *+--------------------------------- -->
  <div class="col-auto">
    <div style="background: rgb(30 31 41 / 80%); border-radius: 4px; padding: 4px">
      <v-btn
        @click="browse('all')"
        size="small"
        color="blue-grey-lighten-1"
        :variant="f.source == 'all' ? 'tonal' : 'plain'">
        <Icon v-if="f.source == 'all'" size="12" class="text-muted me-1">Cards</Icon>
        All games
      </v-btn>
      <v-btn
        @click="browse('library')"
        size="small"
        :variant="f.source == 'library' ? 'tonal' : 'plain'">
        <Icon v-if="f.source == 'library'" size="12" class="text-muted me-1">
          LayoutDashboard
        </Icon>
        Library
      </v-btn>
    </div>
  </div>
  <div class="col-6 d-flex align-items-center">
    <!-- <div class="btn-group btn-group-sm filters__source">
      <div
        class="btn d-flex align-items-center border-end-0"
        :class="{ active: f.source == 'all' }"
        @click="browse('all')"
        nstyle="

        ">
        <Icon v-if="f.source == 'all'" size="14" class="text-muted me-1">Cards</Icon>
        <small>All games</small>
      </div>

      <div
        class="btn d-flex align-items-center"
        @click="browse('library')"
        :class="{ active: f.source == 'library' }">
        <Icon v-if="f.source == 'library'" size="14" class="text-muted me-1">
          LayoutDashboard
        </Icon>
        <small>Library</small>
      </div>
    </div> -->

    <!-- <Icon class="text-muted mx-2">MinusVertical</Icon> -->
    <!-- <div style="border-right: 1px dashed #ccc; margin: 10px"></div> -->

    <v-btn
      id="⚓filters"
      variant="text"
      size="small"
      class="me-2"
      color="blue-grey-lighten-1">
      Apply filters

      <Icon class="text-muted" size="14" width="2" style="transform: translate(5px, 1px)">
        ChevronDown
      </Icon>

      <b-tippy-sheety
        to="#⚓filters"
        ref="filters"
        trigger="click"
        :autoclose="150"
        @closed="reset">
        <div class="b-menu dropdown-menu show" style="letter-spacing: normal">
          <template v-if="ui.step == 'pick'">
            <span class="dropdown-header">
              <span class="text-muted">Choose a filter</span>
            </span>
            <div
              v-for="(param, key) in options"
              :key="key"
              class="dropdown-item"
              @click="pick(param)">
              <div style="width: 30px">
                <Icon size="16" class="me-1">{{ param.icon }}</Icon>
              </div>
              <span>{{ param.label }}</span>
            </div>
          </template>

          <template v-if="ui.step == 'picked'">
            <template v-if="option.search !== false">
              <div class="dropdown-item">
                <input
                  ref="findOption"
                  v-model="ui.findOption"
                  type="text"
                  class="form-control form-control-flush"
                  placeholder="Filter..." />
              </div>
              <div class="dropdown-divider"></div>
            </template>
            <span class="dropdown-header" v-else>
              <span class="text-muted">Filter by {{ option.label }}</span>
            </span>

            <div
              v-for="(param, key) in picked"
              :key="key"
              class="dropdown-item"
              :class="{
                'selected': selected[param[option.opValue]],
                'px-2': option.multiple !== false,
              }">
              <div
                v-if="option.multiple !== false"
                class="selection"
                style="margin-right: 0.55rem"
                @click="select(param, 'soft')">
                <input
                  type="checkbox"
                  class="form-check-input"
                  style="transform: scale(0.8)"
                  :checked="selected[param[option.opValue]]" />
              </div>

              <div
                class="content d-flex align-items-center w-100"
                @click="select(param, 'hard')">
                <template v-if="option.by == 'state'">
                  <!-- <Icon
                          v-if="param.key == 'favorites'"
                          size="14"
                          style="color: red; fill: pink">
                          Heart
                        </Icon> -->
                  <!-- v-else -->

                  <!-- <Icon style="color: var(--tblr-primary)">SquareCheck</Icon>
                      <Icon style="color: #666">Square</Icon> -->

                  <template v-if="param.id == -1">
                    <Icon size="12" class="me-1">CircleOff</Icon>
                  </template>

                  <span
                    v-else
                    class="badge me-2"
                    :style="{ 'background-color': param.color || '' }"></span>

                  <span class="me-4">
                    {{ param.name }}
                  </span>

                  <!-- <tippy
                        class="text-muted ms-auto ms-2 cursor-help"
                        :content="param.description">
                        <Icon size="16" stroke="1">HelpCircleFilled</Icon>
                      </tippy> -->
                  <tippy
                    :allow-h-t-m-l="true"
                    class="text-muted ms-auto cursor-help"
                    :content="param.description">
                    <span class="form-help">?</span>
                  </tippy>
                </template>

                <template v-else-if="option.by == 'genre'">
                  <span class="avatar avatar-xs me-2">
                    {{ param.name[0] }}
                  </span>

                  <span class="me-4">
                    {{ param.name }}
                  </span>
                </template>

                <template v-else>
                  <Icon class="me-2" size="16">{{ param.icon ?? option.icon }}</Icon>
                  <span class="me-4">
                    {{ param.name }}
                  </span>
                </template>
              </div>
            </div>

            <div class="dropdown-divider"></div>
            <div class="dropdown-item" @click="ui.step = 'pick'">
              <Icon class="me-2" size="16">ArrowLeft</Icon>
              <span class="me-4">Apply more filters</span>
            </div>

            <template v-if="$app.wip && option.by == 'released'">
              <div class="hr-text mt-2 mb-3">Or pick</div>
              <div style="transform: scale(0.9)">
                <!-- <div>
                      <input type="month" value="2018-05" />
                    </div> -->
                <pre>
                      {{ released }}
                    </pre
                >
                <div class="input-group mb-1">
                  <select class="form-control" v-model="released.month">
                    <option selected="selected" disabled="disabled">Month</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                  <select
                    placeholder="asdasd"
                    class="form-control"
                    style="max-width: 43%"
                    v-model="released.year">
                    <option selected="selected" disabled="disabled">Year</option>
                    <option
                      v-for="year in Array.from(
                        { length: $moment().year() - 1994 },
                        (_, i) => $moment().year() - i
                      )"
                      :value="year">
                      {{ year }}
                    </option>
                  </select>
                </div>
              </div>
              <!-- </div> -->
            </template>
          </template>

          <!--
                <div class="dropdown-item">Features</div>
                <div class="dropdown-item">Languages</div>
                <div class="dropdown-item">Platform</div>
                <div class="dropdown-item">Type</div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item">
                  <div style="width: 30px">
                    <Icon style="color: red; fill: pink">Heart</Icon>
                  </div>
                  <span>Opción</span>
                </div> -->
        </div>
      </b-tippy-sheety>
    </v-btn>
    <!-- <div class="btn btn-sm me-2" style="background: transparent">
      <small>Apply filters</small>

      <Icon class="text-muted" size="16" style="transform: translate(5px, 1px)">
        Selector
      </Icon>



     <tippy
            ref="tippyFilter"
            to="parent"
            tag="div"
            content-tag="div"
            :animate-fill="true"
            :interactive="true"
            :interactive-debounce="55"
            animation="scale-subtle"
            placement="bottom-start"
            trigger="click"
            theme="filters"
            :on-hidden="reset"
            :on-show="() => ($app.ui.drawer = true)">
            <template #content="{ hide }">
              <div class="b-menu dropdown-menu show">

              </div>
            </template>
          </tippy>
    </div> -->

    <v-btn
      id="⚓sortby"
      variant="text"
      size="small"
      class="me-2"
      color="blue-grey-lighten-1">
      Sorting by
      <strong class="ps-1">
        {{ sortLabel[f.sortBy] ?? '...' }}
        {{ !f.sortBy || !f.sortDir ? '' : f.sortDir == 'asc' ? '(Asc)' : '(Desc)' }}
      </strong>

      <Icon class="text-muted" size="14" width="2" style="transform: translate(5px, 1px)">
        ChevronDown
      </Icon>

      <b-tippy-sheety to="#⚓sortby" :autoclose="150" trigger="click">
        <search-sort-menu :f="f" @sort="sortBy" />
      </b-tippy-sheety>
    </v-btn>

    <!-- <div class="btn btn-sm" style="background: transparent">
      <small>
        Sorting by
        <strong>
          {{ sortLabel[f.sortBy] ?? '...' }}
        </strong>
      </small>
      <Icon class="text-muted" size="16" style="transform: translate(5px, 1px)">
        Selector
      </Icon>
    </div> -->

    <!-- <div class="text-muted mx-3"><Icon size="14">Spaces</Icon></div>

    <v-btn
      color="secondary"
      variant="tonal"
      size="small"
      style="min-width: 20px; width: 30px; padding: 0">
      <Icon>LayoutGrid</Icon>
    </v-btn>
    <v-btn
      class="active ms-2"
      color="secondary"
      variant="tonal"
      size="small"
      style="min-width: 20px; width: 30px; padding: 0">
      <Icon>LayoutList</Icon>
    </v-btn> -->
  </div>

  <div class="col text-end d-flex align-items-center" style="justify-content: flex-end">
    <small class="text-muted">
      <div
        v-if="loading"
        class="spinner-grow"
        role="status"
        style="width: 13px; height: 13px"></div>
      <span
        v-else
        style="cursor: help"
        v-tippy="
          'Time to search, filter and sort results ◈ When searching in all games, this includes the API calls as well'
        ">
        {{ dates.microTime(time) }}
      </span>
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

      <!-- <span
        class="form-help cursor-help mx-2"
        v-tippy="{
          content: 'Automatic updates are disabled for GOG libraries',
          placement: 'top',
        }">
        ?
      </span> -->
    </small>
    <div
      class="d-none d-inline-flex align-items-center nbtn mx-2 text-muted cursor-pointer"
      style="padding: 0.35rem 0.85rem">
      <!-- <Icon size="19" class="text-muted me-2">
            SortDescending
            {{ f.sortDir == 'asc' ? 'SortAscending' : 'SortDescending' }}
          </Icon> -->
      Sorting by
      {{ sortLabel[f.sortBy] ?? '--' + f.sortBy }}

      <Icon class="text-muted" size="14" style="transform: translateX(8px)">
        ChevronDown
      </Icon>

      <b-tippy-sheety placement="bottom-end">
        <!-- <tippy
            ref="tippySort"
            to="parent"
            tag="div"
            content-tag="div"
            :animate-fill="true"
            :interactive="true"
            :interactive-debounce="55"
            animation="scale-subtle"
            placement="bottom-start"
            trigger="click"
            theme="filters">
            <template #content="{ hide }"> -->
        <div
          class="b-menu dropdown-menu show"
          style="min-width: 280px; letter-spacing: normal">
          <span class="dropdown-header">
            <span class="text-muted">General sorting</span>
          </span>

          <label
            class="dropdown-item ps-1"
            :class="{ active: f.sortBy == 'rand' }"
            @click="sortBy('rand')">
            <div class="d-flex justify-center" style="width: 30px">
              <Icon size="16" width="2" class="me-1" :icon="'Dice' + ui.dice"></Icon>
            </div>

            <div class="pe-3">Random</div>
            <tippy
              class="text-muted ms-auto cursor-help ps-4"
              :content="'Every click triggers a re-sort!'">
              <Icon width="2" style="background: rgb(0 0 0 / 20%); border-radius: 50%">
                HelpSmall
              </Icon>
            </tippy>
          </label>

          <label
            class="dropdown-item ps-1"
            :class="{ active: f.sortBy == 'name' }"
            @click="sortBy('name', 'asc', true)">
            <div class="d-flex justify-center" style="width: 30px">
              <Icon
                size="16"
                width="2"
                class="me-1"
                :icon="
                  f.sortDir == 'asc' ? 'SortAscendingLetters' : 'SortDescendingLetters'
                "></Icon>
            </div>
            <div>
              Name
              <div
                v-if="f.sortBy == 'name'"
                class="text-muted"
                style="font-size: 0.75rem">
                {{ f.sortDir == 'asc' ? 'Ascending' : 'Descending' }}
                <Icon size="14" width="2" class="mx-1">Repeat</Icon>
              </div>
            </div>
          </label>

          <div class="dropdown-divider"></div>

          <span class="dropdown-header">
            <span class="text-muted">By Score</span>
          </span>

          <label
            class="dropdown-item ps-1"
            :class="{ active: f.sortBy == 'score' }"
            @click="sortBy('score', 'desc', true)">
            <div class="d-flex justify-center" style="width: 30px">
              <Icon size="16" class="me-1">Universe</Icon>
            </div>
            <div>
              Median score
              <div
                v-if="f.sortBy == 'score'"
                class="text-muted"
                style="font-size: 0.75rem">
                {{ f.sortDir == 'asc' ? 'Ascending' : 'Descending' }}
                <Icon size="14" width="2" class="mx-1">Repeat</Icon>
              </div>
            </div>
            <tippy
              class="text-muted ms-auto cursor-help ps-4"
              :content="'The median score is ....'">
              <Icon width="2" style="background: rgb(0 0 0 / 20%); border-radius: 50%">
                HelpSmall
              </Icon>
            </tippy>
          </label>

          <div class="dropdown-divider"></div>

          <span class="dropdown-header">
            <span class="text-muted">By Time</span>
          </span>

          <label
            class="dropdown-item ps-1"
            :class="{ active: f.sortBy == 'released' }"
            @click="sortBy('released', 'desc', true)">
            <div class="d-flex justify-center" style="width: 30px">
              <Icon size="16" class="me-1">CalendarDot</Icon>
            </div>
            <div>
              Release date
              <div
                v-if="f.sortBy == 'released'"
                class="text-muted"
                style="font-size: 0.75rem">
                {{ f.sortDir == 'asc' ? 'Oldest' : 'Newest' }}
                <Icon size="14" width="2" class="mx-1">Repeat</Icon>
              </div>
            </div>
          </label>

          <label
            class="dropdown-item ps-1"
            :class="{ active: f.sortBy == 'playtime' }"
            @click="sortBy('playtime', 'desc', true)">
            <div class="d-flex justify-center" style="width: 30px">
              <Icon size="16" class="me-1">AlarmAverage</Icon>
            </div>
            <div>
              Your playtime
              <div
                v-if="f.sortBy == 'playtime'"
                class="text-muted"
                style="font-size: 0.75rem">
                {{ f.sortDir == 'asc' ? 'Unplayed' : 'Most played' }}
                <Icon size="14" width="2" class="mx-1">Repeat</Icon>
              </div>
            </div>
          </label>

          <label
            class="dropdown-item ps-1"
            :class="{ active: f.sortBy == 'hltb' }"
            @click="sortBy('hltb', 'desc', true)">
            <div class="d-flex justify-center" style="width: 30px">
              <Icon size="16" class="me-1">TimeDuration30</Icon>
            </div>
            <div>
              How long to beat
              <div
                v-if="f.sortBy == 'hltb'"
                class="text-muted"
                style="font-size: 0.75rem">
                {{ f.sortDir == 'asc' ? 'Ascending' : 'Descending' }}
                <Icon size="14" width="2" class="mx-1">Repeat</Icon>
              </div>
            </div>
            <tippy
              class="text-muted ms-auto cursor-help ps-4"
              :content="'How long to beat is a metric that measures how much time is needed to complete a game. Data provided from howlongtobeat.com'">
              <Icon width="2" style="background: rgb(0 0 0 / 20%); border-radius: 50%">
                HelpSmall
              </Icon>
            </tippy>
          </label>
        </div>
      </b-tippy-sheety>
    </div>
  </div>

  <!--
    *+---------------------------------
    *| Third line
    *| Selected filters
    *+--------------------------------- -->
  <div
    class="filters-bar mt-2 mb-4 col-12 d-flex align-items-center"
    v-if="Object.keys(_filters).length">
    <template v-for="(param, key) in _filters" :key="key">
      <div class="btn-group btn-group-sm me-3">
        <div class="btn d-flex align-items-center disabled border-end-0">
          <template v-if="options[key]">
            <div style="width: 30px">
              <Icon size="14" weight="1.5">{{ options[key].icon }}</Icon>
            </div>
            <span>{{ options[key].label }}</span>
          </template>
        </div>
        <div
          class="btn d-flex align-items-center disabled border-end-0 border-start-0 cursor-pointer"
          nopev-tippy="{ content: 'Filter by ' + key }">
          is
          <b-tippy-sheety ref="filters">
            <div class="b-menu dropdown-menu show">
              <span class="dropdown-header">
                <span class="text-muted">Choose a filter</span>
              </span>
            </div>
          </b-tippy-sheety>
        </div>
        <div class="btn d-flex align-items-center">
          <template v-if="param.length == 1">
            {{ filterLabel(key) }}
          </template>

          <template v-else>
            <span class="badge bg-purple-lt">
              {{ param.length }} {{ options[key].labels }}
            </span>
          </template>
        </div>
        <div
          v-tippy="{ content: 'Clear filter', placement: 'bottom' }"
          class="btn d-flex align-items-center"
          @click="removeFilter(key)">
          <Icon size="16" style="transform: translateY(1px)">SquareRoundedX</Icon>
        </div>
      </div>
    </template>
    <!-- <button
          v-tippy="'Filter by game state'"
          :class="'btn py-2 ps-3 ' + (f.state ? 'pe-2' : 'pe-3')"
          style="transform: scale(0.9) translateX(-5px)">
          <Icon size="19" class="text-muted me-1">Background</Icon>
          <div :class="{ 'pe-2 me-2 border-end': f.state }">State</div>
          <BState v-if="f.state" :state="f.state" :label="true" :pulse="false"></BState>
        </button> -->

    <!-- <b-btn variant="ghost" color="secondary">
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
            <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
          </svg>
        </b-btn> -->
  </div>

  <div class="my-2 py-1" v-else></div>

  <div class="col-12 d-none">
    <div class="row gap-2 mb-4 align-items-center">
      <div class="col col-12 col-md-5">
        <b-input
          v-model="f.string"
          placeholder="Search games..."
          clearable
          @tick="notify"
          @clear="notify"></b-input>
      </div>
      <div class="col">
        <div class="btn" style="padding: 0.35rem 0.85rem">
          <Icon class="me-2" size="16">ColorFilter</Icon>
          <small>Apply filters</small>

          <Icon class="text-muted" size="15" style="transform: translateX(8px)">
            Selector
          </Icon>

          <b-tippy-sheety @closed="reset" ref="filters">
            <div class="b-menu dropdown-menu show">
              <template v-if="ui.step == 'pick'">
                <span class="dropdown-header">
                  <span class="text-muted">Choose a filter</span>
                </span>
                <div
                  v-for="(param, key) in options"
                  :key="key"
                  class="dropdown-item"
                  @click="pick(param)">
                  <div style="width: 30px">
                    <Icon>{{ param.icon }}</Icon>
                  </div>
                  <span>{{ param.label }}</span>
                </div>
              </template>

              <template v-if="ui.step == 'picked'">
                <template v-if="option.search !== false">
                  <div class="dropdown-item">
                    <input
                      ref="findOption"
                      v-model="ui.findOption"
                      type="text"
                      class="form-control form-control-flush"
                      placeholder="Filter..." />
                  </div>
                  <div class="dropdown-divider"></div>
                </template>
                <span class="dropdown-header" v-else>
                  <span class="text-muted">Filter by {{ option.label }}</span>
                </span>

                <div
                  v-for="(param, key) in picked"
                  :key="key"
                  class="dropdown-item"
                  :class="{
                    'selected': selected[param[option.opValue]],
                    'px-2': option.multiple !== false,
                  }">
                  <div
                    v-if="option.multiple !== false"
                    class="selection"
                    style="margin-right: 0.55rem"
                    @click="select(param, 'soft')">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      style="transform: scale(0.8)"
                      :checked="selected[param[option.opValue]]" />
                  </div>

                  <div
                    class="content d-flex align-items-center w-100"
                    @click="select(param, 'hard')">
                    <template v-if="option.by == 'state'">
                      <!-- <Icon
                          v-if="param.key == 'favorites'"
                          size="14"
                          style="color: red; fill: pink">
                          Heart
                        </Icon> -->
                      <!-- v-else -->

                      <!-- <Icon style="color: var(--tblr-primary)">SquareCheck</Icon>
                      <Icon style="color: #666">Square</Icon> -->

                      <span
                        class="badge me-2"
                        :style="{ 'background-color': param.color || '' }"></span>

                      <span class="me-4">
                        {{ param.name }}
                      </span>

                      <!-- <tippy
                        class="text-muted ms-auto ms-2 cursor-help"
                        :content="param.description">
                        <Icon size="16" stroke="1">HelpCircleFilled</Icon>
                      </tippy> -->
                      <tippy
                        :allow-h-t-m-l="true"
                        class="text-muted ms-auto cursor-help"
                        :content="param.description">
                        <span class="form-help">?</span>
                      </tippy>
                    </template>

                    <template v-else-if="option.by == 'genre'">
                      <span class="avatar avatar-xs me-2">
                        {{ param.name[0] }}
                      </span>

                      <span class="me-4">
                        {{ param.name }}
                      </span>
                    </template>

                    <template v-else>
                      <Icon class="me-2" size="16">{{ param.icon ?? option.icon }}</Icon>
                      <span class="me-4">
                        {{ param.name }}
                      </span>
                    </template>
                  </div>
                </div>

                <template v-if="$app.dev && option.by == 'released'">
                  <div class="hr-text mt-2 mb-3">Or pick</div>
                  <div style="transform: scale(0.9)">
                    <!-- <div>
                      <input type="month" value="2018-05" />
                    </div> -->
                    <pre>
                      {{ released }}
                    </pre>
                    <div class="input-group mb-1">
                      <select class="form-control" v-model="released.month">
                        <option selected="selected" disabled="disabled">Month</option>
                        <option value="01">January</option>
                        <option value="02">February</option>
                        <option value="03">March</option>
                        <option value="04">April</option>
                        <option value="05">May</option>
                        <option value="06">June</option>
                        <option value="07">July</option>
                        <option value="08">August</option>
                        <option value="09">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                      </select>
                      <select
                        placeholder="asdasd"
                        class="form-control"
                        style="max-width: 43%"
                        v-model="released.year">
                        <option selected="selected" disabled="disabled">Year</option>
                        <option
                          v-for="year in Array.from(
                            { length: $moment().year() - 1994 },
                            (_, i) => $moment().year() - i
                          )"
                          :value="year">
                          {{ year }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <!-- </div> -->
                </template>
              </template>

              <!--
                <div class="dropdown-item">Features</div>
                <div class="dropdown-item">Languages</div>
                <div class="dropdown-item">Platform</div>
                <div class="dropdown-item">Type</div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item">
                  <div style="width: 30px">
                    <Icon style="color: red; fill: pink">Heart</Icon>
                  </div>
                  <span>Opción</span>
                </div> -->
            </div>
          </b-tippy-sheety>

          <!-- <tippy
            ref="tippyFilter"
            to="parent"
            tag="div"
            content-tag="div"
            :animate-fill="true"
            :interactive="true"
            :interactive-debounce="55"
            animation="scale-subtle"
            placement="bottom-start"
            trigger="click"
            theme="filters"
            :on-hidden="reset"
            :on-show="() => ($app.ui.drawer = true)">
            <template #content="{ hide }">
              <div class="b-menu dropdown-menu show">

              </div>
            </template>
          </tippy> -->
        </div>
      </div>

      <div class="col text-end d-flex" style="justify-content: flex-end">
        <div
          class="d-inline-flex align-items-center nbtn mx-2 text-muted cursor-pointer"
          style="padding: 0.35rem 0.85rem">
          <!-- <Icon size="19" class="text-muted me-2">
            SortDescending
            {{ f.sortDir == 'asc' ? 'SortAscending' : 'SortDescending' }}
          </Icon> -->
          Sorting by
          {{ sortLabel[f.sortBy] ?? '--' + f.sortBy }}

          <Icon class="text-muted" size="14" style="transform: translateX(8px)">
            ChevronDown
          </Icon>

          <b-tippy-sheety placement="bottom-end">
            <!-- <tippy
            ref="tippySort"
            to="parent"
            tag="div"
            content-tag="div"
            :animate-fill="true"
            :interactive="true"
            :interactive-debounce="55"
            animation="scale-subtle"
            placement="bottom-start"
            trigger="click"
            theme="filters">
            <template #content="{ hide }"> -->
            <div class="b-menu dropdown-menu show" style="min-width: 280px">
              <span class="dropdown-header">
                <span class="text-muted">General sorting</span>
              </span>

              <label
                class="dropdown-item ps-1"
                :class="{ active: f.sortBy == 'rand' }"
                @click="sortBy('rand')">
                <div class="d-flex justify-center" style="width: 30px">
                  <Icon size="16" width="2" class="me-1" :icon="'Dice' + ui.dice"></Icon>
                </div>

                <div class="pe-3">Random</div>
                <tippy
                  class="text-muted ms-auto cursor-help ps-4"
                  :content="'Every click triggers a re-sort!'">
                  <Icon
                    width="2"
                    style="background: rgb(0 0 0 / 20%); border-radius: 50%">
                    HelpSmall
                  </Icon>
                </tippy>
              </label>

              <label
                class="dropdown-item ps-1"
                :class="{ active: f.sortBy == 'name' }"
                @click="sortBy('name', 'asc', true)">
                <div class="d-flex justify-center" style="width: 30px">
                  <Icon
                    size="16"
                    width="2"
                    class="me-1"
                    :icon="
                      f.sortDir == 'asc'
                        ? 'SortAscendingLetters'
                        : 'SortDescendingLetters'
                    "></Icon>
                </div>
                <div>
                  Name
                  <div
                    v-if="f.sortBy == 'name'"
                    class="text-muted"
                    style="font-size: 0.75rem">
                    {{ f.sortDir == 'asc' ? 'Ascending' : 'Descending' }}
                    <Icon size="14" width="2" class="mx-1">Repeat</Icon>
                  </div>
                </div>
              </label>

              <div class="dropdown-divider"></div>

              <span class="dropdown-header">
                <span class="text-muted">By Score</span>
              </span>

              <label
                class="dropdown-item ps-1"
                :class="{ active: f.sortBy == 'score' }"
                @click="sortBy('score', 'desc', true)">
                <div class="d-flex justify-center" style="width: 30px">
                  <Icon size="16" class="me-1">Universe</Icon>
                </div>
                <div>
                  Median score
                  <div
                    v-if="f.sortBy == 'score'"
                    class="text-muted"
                    style="font-size: 0.75rem">
                    {{ f.sortDir == 'asc' ? 'Ascending' : 'Descending' }}
                    <Icon size="14" width="2" class="mx-1">Repeat</Icon>
                  </div>
                </div>
                <tippy
                  class="text-muted ms-auto cursor-help ps-4"
                  :content="'The median score is ....'">
                  <Icon
                    width="2"
                    style="background: rgb(0 0 0 / 20%); border-radius: 50%">
                    HelpSmall
                  </Icon>
                </tippy>
              </label>

              <div class="dropdown-divider"></div>

              <span class="dropdown-header">
                <span class="text-muted">By Time</span>
              </span>

              <label
                class="dropdown-item ps-1"
                :class="{ active: f.sortBy == 'released' }"
                @click="sortBy('released', 'desc', true)">
                <div class="d-flex justify-center" style="width: 30px">
                  <Icon size="16" class="me-1">CalendarDot</Icon>
                </div>
                <div>
                  Release date
                  <div
                    v-if="f.sortBy == 'released'"
                    class="text-muted"
                    style="font-size: 0.75rem">
                    {{ f.sortDir == 'asc' ? 'Oldest' : 'Newest' }}
                    <Icon size="14" width="2" class="mx-1">Repeat</Icon>
                  </div>
                </div>
              </label>

              <label
                class="dropdown-item ps-1"
                :class="{ active: f.sortBy == 'playtime' }"
                @click="sortBy('playtime', 'desc', true)">
                <div class="d-flex justify-center" style="width: 30px">
                  <Icon size="16" class="me-1">AlarmAverage</Icon>
                </div>
                <div>
                  Your playtime
                  <div
                    v-if="f.sortBy == 'playtime'"
                    class="text-muted"
                    style="font-size: 0.75rem">
                    {{ f.sortDir == 'asc' ? 'Unplayed' : 'Most played' }}
                    <Icon size="14" width="2" class="mx-1">Repeat</Icon>
                  </div>
                </div>
              </label>

              <label
                class="dropdown-item ps-1"
                :class="{ active: f.sortBy == 'hltb' }"
                @click="sortBy('hltb', 'desc', true)">
                <div class="d-flex justify-center" style="width: 30px">
                  <Icon size="16" class="me-1">TimeDuration30</Icon>
                </div>
                <div>
                  How long to beat
                  <div
                    v-if="f.sortBy == 'hltb'"
                    class="text-muted"
                    style="font-size: 0.75rem">
                    {{ f.sortDir == 'asc' ? 'Ascending' : 'Descending' }}
                    <Icon size="14" width="2" class="mx-1">Repeat</Icon>
                  </div>
                </div>
                <tippy
                  class="text-muted ms-auto cursor-help ps-4"
                  :content="'How long to beat is a metric that measures how much time is needed to complete a game. Data provided from howlongtobeat.com'">
                  <Icon
                    width="2"
                    style="background: rgb(0 0 0 / 20%); border-radius: 50%">
                    HelpSmall
                  </Icon>
                </tippy>
              </label>
            </div>
          </b-tippy-sheety>
        </div>

        <div class="d-inline-flex align-items-center btn btn-sm">
          <Icon size="19" class="text-muted">ChartScatter3d</Icon>

          <b-tippy-sheety placement="bottom-start">
            <div class="b-menu dropdown-menu show" style="min-width: 280px">
              <span class="dropdown-header">
                <span class="text-muted">Display properties</span>
              </span>

              <div class="px-2 mx-1 mb-2">
                <small class="text-muted mb-3">
                  Select the properties you want to display on the cards
                </small>

                <div class="my-2"></div>
                <template v-for="(v, k) in _cardProperties">
                  <span
                    class="badge bg-purple-lt ms-auto mx-2 mb-2 cursor-pointer"
                    style="padding: 0.4rem"
                    :style="
                      f.show.card.includes(k)
                        ? 'outline: 1px solid; outline-offset: -1px;'
                        : '--tblr-bg-opacity: 0.6;'
                    "
                    @click="showInCard(k)">
                    <!-- <Icon size="16" v-if="f.show.card.includes(k)">Check</Icon> -->
                    {{ v }}
                  </span>
                </template>
              </div>
            </div>
          </b-tippy-sheety>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \components\search\filters\dropdown.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 7th February 2024
 * Modified: Wed 06 November 2024 - 12:08:45
 **/

export default {
  name: 'SearchFilters',

  props: {
    filters: {
      type: Object,
      default: () => ({}),
    },
  },

  emits: ['updated'],

  data() {
    return {
      f: {
        string: '',
      },

      option: {},
      selected: {},

      options: {
        states: {
          by: 'state',
          filter: 'states',

          icon: 'Background',
          label: 'State',
          labels: 'States',

          data: 'states',
          opTitle: 'name',
          opValue: 'id',
        },

        genres: {
          by: 'genre',
          filter: 'genres',

          icon: 'Graph',
          label: 'Genre',
          labels: 'Genres',

          data: 'genres',
          opSort: 'name',
          opTitle: 'name',
          opValue: 'id',
        },

        released: {
          search: false,
          multiple: false,

          by: 'released',
          filter: 'released',

          icon: 'CalendarDot',
          label: 'Release date',
          labels: 'Release dates',

          data: 'released',
          opTitle: 'name',
          opValue: 'value',
        },
      },

      released: {
        month: null,
        year: null,
      },

      ui: {
        dice: 4,
        step: 'pick',
        findOption: '',
      },
    }
  },

  computed: {
    // ...mapStores(useDataStore),
    ...mapState(useStateStore, {
      _states: 'states',
    }),

    ...mapState(useRepositoryStore, {
      _genres: 'genres',
    }),

    ...mapState(useSearchStore, ['stats', 'loading', 'time']),

    // //+-------------------------------------------------
    // // stats()
    // // Returns stats from results component
    // // -----
    // // Created on Fri Apr 05 2024
    // //+-------------------------------------------------
    // stats() {
    //   return this.$parent.stats || { state: 'no stats' }
    // },

    sortLabel() {
      return {
        name: 'Name',
        rand: 'Random',
        score: 'Score',
        playtime: 'Your playtime',
        hltb: 'How long to beat',
        released: 'Release date',
      }
    },

    amountOfApps() {
      if (this.$parent.source == 'all') return format.num(this.$app.count.api)

      return format.num(this.$app.count.library)
    },

    //+-------------------------------------------------
    // picked()
    // Returns an array of available options based on the
    // current selected filer (this.option)
    // -----
    // Created on Thu Sep 19 2024
    //+-------------------------------------------------
    picked() {
      const options = []
      if (!this.option?.data) return options

      this['_' + this.option.data].forEach((option) => {
        let title = option[this.option.opTitle]
        title = title?.toLowerCase() || ''
        if (title.includes(this.ui.findOption.toLowerCase())) {
          options.push(option)
        }
      })

      // Special case for states
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (this.option.data == 'states') {
        options.unshift({
          id: -1,
          color: '#000000',
          name: 'No state',
          description: 'Display games without a state',
        })
      }

      if (this.option.opSort)
        options.sort((a, b) => a[this.option.opSort].localeCompare(b[this.option.opSort]))

      return options
    },

    _filters() {
      const enabled = ['states', 'genres', 'released']

      const filters = {}

      for (const key in this.f) {
        if (enabled.includes(key)) {
          if (key == 'states' && this.f[key].includes('pinned')) continue
          if (!this.f[key] || !this.f[key].length) continue
          if (this.f[key].length == 0) continue

          filters[key] = this.f[key]
        }
      }

      return filters
    },

    _released() {
      let manual = false

      if (this.selected.month) {
        if (!this.selected.year) {
          manual = true
          this.selected.year = this.$moment().year()
        }
      }

      if (this.selected.year) {
        if (!this.selected.month) {
          manual = true
          this.selected.month = this.$moment().month() + 1
        }
      }

      let dates = [
        {
          name: '15 days ago',
          value: this.$dayjs().subtract(15, 'days').unix(),
        },

        {
          name: '1 month ago',
          value: this.$dayjs().subtract(1, 'months').unix(),
        },

        {
          name: '3 months ago',
          value: this.$dayjs().subtract(3, 'months').unix(),
        },
      ]

      return dates
    },

    _cardProperties() {
      return {
        default: 'Default',
        name: 'Name',
        score: 'Score',
        playtime: 'Playtime',
        hltb: 'How long to beat',
        released: 'Release date',
        genres: 'Genres',
      }
    },
  },

  watch: {
    filters: {
      handler: function (val) {
        this.f = { ...val }
      },
      deep: true,
    },
  },

  methods: {
    filterLabel(key) {
      let data = this['_' + this.options[key].data]
      if (!data) return

      data = data.filter((item) => this.f[key].includes(item[this.options[key].opValue]))

      if (data.length == 1) return data[0][this.options[key].opTitle]

      return data.length + ' ' + this.options[key].labels
    },

    //+-------------------------------------------------
    // browse()
    // Updates the source
    // -----
    // Created on Mon Sep 23 2024
    //+-------------------------------------------------
    browse(source) {
      this.f.source = source
      if (source == 'all') {
        this.f.sortBy = 'score'
        this.f.sortDir = 'desc'
      }

      this.notify()
    },

    //+-------------------------------------------------
    // sortBy()
    // Applies sortBy to the filters
    // -----
    // Created on Sun Mar 17 2024
    //+-------------------------------------------------
    sortBy(sort) {
      if (sort.toggle && this.f.sortBy == sort.by) {
        this.f.sortDir = this.f.sortDir == 'asc' ? 'desc' : 'asc'
      } else {
        this.f.sortBy = sort.by
        this.f.sortDir = sort.dir
      }

      // this.$refs.tippySort.hide()
      this.notify()
    },

    //+-------------------------------------------------
    // pick()
    // picks an option from the group of options
    // this.options are the filters available
    // -----
    // Created on Fri Feb 09 2024
    //+-------------------------------------------------
    pick(option) {
      this.option = option
      this.selected = this.restoreFilter(option)

      this.ui.step = 'picked'

      this.$nextTick(() => {
        if (this.$app.device !== 'sm') {
          this.$refs.findOption?.focus()
        }
      })
    },

    //+-------------------------------------------------
    // select()
    // selects an option from the group of options to filter
    // -----
    // Created on Fri Feb 09 2024
    //+-------------------------------------------------
    select(param, mode = 'soft') {
      const key = param[this.option.opValue]

      if (this.option.multiple == false) {
        this.selected = {}
      }

      if (this.selected[key]) delete this.selected[key]
      else this.selected[key] = { ...param }

      this.filter()

      if (mode == 'hard') {
        // this.$refs.tippyFilter.hide()
      }
    },

    //+-------------------------------------------------
    // showInCard()
    //
    // -----
    // Created on Fri May 10 2024
    //+-------------------------------------------------
    showInCard(key) {
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

      this.notify()
    },

    // Move selected to filters
    filter() {
      console.warn(this.selected)

      const values = Object.values(this.selected).map((item) => item[this.option.opValue])
      this.f[this.option.filter] = values

      this.notify()
    },

    removeFilter(key) {
      this.f[key] = []
      this.notify()
    },

    restoreFilter(option) {
      const selected = {}
      this.picked.forEach((param) => {
        if (this.f[option.filter]?.includes(param[option.opValue])) {
          selected[param[option.opValue]] = { ...param }
        }
      })

      return selected
    },

    // //+-------------------------------------------------
    // // function()
    // // moves selected to filters
    // // hides tippy and ui
    // // -----
    // // Created on Fri Feb 09 2024
    // //+-------------------------------------------------
    // endSelection(){

    // },

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Fri Feb 09 2024
    //+-------------------------------------------------
    reset() {
      this.option = {}
      this.selected = {}

      this.ui.step = 'pick'
      this.ui.findOption = ''
    },

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Fri Feb 09 2024
    //+-------------------------------------------------
    notify() {
      this.$emit('updated', this.f)
      // console.warn('✏️ ', this.f.string, JSON.stringify(this.f))
      // this.$nextTick(() => {
      //   console.warn('✏️ 2', this.f.string, JSON.stringify(this.f))
      // })
    },

    init() {},
  },

  mounted() {
    this.init()
  },
}
</script>
