<template>
  <VueFinalModal
    v-model="ui.dialog"
    class="game-details"
    content-class="game-details-content game-card"
    overlay-transition="vfm-fade"
    swipe-to-close="up"
    :content-transition="{
      'enter-from-class': 'details-modal-out',
      'enter-to-class': 'hunaa-menu-full',
      'enter-active-class': 'hunaa-menu-enter-active',
      'leave-from-class': 'hunaa-menu-full',
      'leave-to-class': 'details-modal-out',
      'leave-active-class': 'hunaa-menu-leave-active',
    }">
    <div class="row w-100 h-100 g-0 m-0">
      <div
        class="d-none d-md-flex col"
        style="
          max-width: 440px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        ">
        <div
          v-if="ui.layout == 'full'"
          style="max-width: 400px; max-height: 500px; z-index: 1; overflow: scroll">
          <pre>
          {{ app }}
        </pre
          >
        </div>

        <game-asset
          v-else
          ref="logo"
          :app="app"
          asset="logo"
          :priority="['steam']"
          style="
            max-width: 250px;
            z-index: 1;
            padding-bottom: 35px;
            filter: drop-shadow(2px 3px 9px black);
          "
          @click="ui.tab = 'details'"></game-asset>
        <div class="blur_back" style="">
          <game-asset
            ref="background"
            :app="app"
            asset="gen"
            :priority="['steam']"></game-asset>
        </div>

        <div
          style="
            position: absolute;
            bottom: 0px;
            text-align: center;
            width: 100%;
            background: linear-gradient(0deg, #0000005c, transparent);
            padding: 10px 0;
          ">
          <small class="text-muted" style="font-size: 12px; display: block">
            <span v-tippy="'Added to database ' + $moment(app.created_at).format('LL')">
              Updated {{ $moment(app.updated_at * 1000).format('LL') }}
            </span>
            <br />
            Data provided by
            <img
              class="px-1"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNCIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDM0IDE2IiBmaWxsPSJub25lIj4KICAgIDxwYXRoCiAgICAgICAgZD0iTTYuNzE2ODVlLTA1IDAuMDAwOTExNDY4QzExLjMzMzEgMC4wMDA2ODM4MjMgMjIuNjY2NSAwLjAwMjUwNDA5IDMzLjk5OTggMEMzNCA1LjMzMzI2IDM0LjAwMDIgMTAuNjY2NyAzMy45OTk1IDE2QzMxLjc5MzcgMTUuNjUyNCAyOS41Nzc5IDE1LjM2MTIgMjcuMzU0IDE1LjE0ODJDMTkuMzI5MSAxNC4zNjg1IDExLjIxMjIgMTQuNDk5MSAzLjIxNzc4IDE1LjUzNjdDMi4xNDI1NyAxNS42NzMxIDEuMDcxMDkgMTUuODM1OSA2LjcxNjg1ZS0wNSAxNS45OTkzQy0wLjAwMDE2NTUxIDEwLjY2NjUgMC4wMDAyOTk4NDcgNS4zMzM3MSA2LjcxNjg1ZS0wNSAwLjAwMDkxMTQ2OFpNMS4wMDA4MiAwLjk4MDIzOEMxLjAwMTI4IDUuNjA1NzUgMS4wMDA4MiAxMC4yMzE1IDEuMDAwODIgMTQuODU3QzExLjU4NDcgMTMuMjcyMSAyMi40MTU0IDEzLjI3MDggMzIuOTk5IDE0Ljg1NzVDMzIuOTk5NyAxMC4yMzE1IDMyLjk5OTIgNS42MDU1MiAzMi45OTkyIDAuOTc5NTU1QzIyLjMzMyAwLjk4MTE0OSAxMS42NjY4IDAuOTgwMDEgMS4wMDA4MiAwLjk4MDIzOFoiCiAgICAgICAgZmlsbD0id2hpdGUiCiAgICAvPgogICAgPHBhdGgKICAgICAgICBkPSJNOC4zMTkyNiA0LjYxOEM5LjAxMjg3IDMuOTU3MzcgOS45ODU5NCAzLjYwNTQ0IDEwLjk0OTcgMy42MjAyM0MxMS42MDc3IDMuNjE3OTYgMTIuMjc5NCAzLjcxODggMTIuODcxMiA0LjAxMjY5QzEzLjE3NjIgNC4xNjE1NyAxMy40NTQ5IDQuMzU2ODkgMTMuNzE1MSA0LjU3MTU2QzEzLjM4NzcgNC45NTgzMyAxMy4wNTc1IDUuMzQyNTkgMTIuNzMzOSA1LjczMjA5QzEyLjUzOTEgNS41ODkzNiAxMi4zNDk3IDUuNDM3MDYgMTIuMTM0MyA1LjMyNDE1QzExLjcwMTcgNS4wODUzNSAxMS4xOTIxIDUuMDAyNzIgMTAuNzAwNSA1LjAzNzc4QzEwLjA5ODggNS4wODgwOCA5LjU0ODI3IDUuNDQyOTggOS4yMjIyOCA1LjkzNDQ3QzguODAyMDcgNi41NTE4NCA4LjczNjY4IDcuMzY0MyA4Ljk5MTIzIDguMDU1NjZDOS4xNDUyNyA4LjQ3NTY2IDkuNDM5MzcgOC44NDgzMiA5LjgyNjc4IDkuMDg2MjFDMTAuMjEyMSA5LjMyODQyIDEwLjY4IDkuNDI1NjIgMTEuMTM0MiA5LjM5ODk5QzExLjYgOS4zODE0NiAxMi4wNzQyIDkuMjU3MTcgMTIuNDUzNSA4Ljk4NDY4QzEyLjQ0OTggOC42NTY4NyAxMi40NTM1IDguMzI4ODMgMTIuNDUxNiA4LjAwMTAyQzExLjkyOTcgOC4wMDIzOSAxMS40MDc2IDguMDAwNTcgMTAuODg1NyA4LjAwMTk0QzEwLjg4NDUgNy41NjIxMyAxMC44ODg1IDcuMTIyMzIgMTAuODgzOCA2LjY4MjczQzExLjkxMDQgNi42NzYzNiAxMi45MzcyIDYuNjg1MDEgMTMuOTYzOCA2LjY3ODQxQzEzLjk3MDEgNy42ODI1NSAxMy45NjMxIDguNjg2OTIgMTMuOTY3MyA5LjY5MTA2QzEzLjI2MDcgMTAuMjg3OSAxMi4zNjg4IDEwLjY3OTUgMTEuNDM3NCAxMC43Njg1QzEwLjUyODEgMTAuODY2MiA5LjU2OTQ0IDEwLjcwMjUgOC43OTQzOSAxMC4yMTE5QzguMTczMzcgOS44MjQ2OCA3LjY5MzU5IDkuMjMwNzYgNy40NDI1MyA4LjU1NDJDNy4xOTQ3MiA3Ljg4ODU3IDcuMTQ1ODYgNy4xNTUxIDcuMjg1IDYuNDYxMjRDNy40Mjk5NiA1Ljc2MzczIDcuNzkyNDcgNS4xMDk3MSA4LjMxOTI2IDQuNjE4WiIKICAgICAgICBmaWxsPSJ3aGl0ZSIKICAgIC8+CiAgICA8cGF0aAogICAgICAgIGQ9Ik0zLjc4NzYxIDMuNzM5NTJDNC4zMDgxMSAzLjc0MDY2IDQuODI4NjEgMy43Mzg2MSA1LjM0OTEyIDMuNzQwNjZDNS4zNDc5NSA2LjA1MDc5IDUuMzQ5MTIgOC4zNjExNiA1LjM0ODY1IDEwLjY3MTVDNC44MjgzOCAxMC42NzEzIDQuMzA4MTEgMTAuNjcwNiAzLjc4Nzg0IDEwLjY3MThDMy43ODc2MSA4LjM2MTE2IDMuNzg4MDggNi4wNTAzNCAzLjc4NzYxIDMuNzM5NTJaIgogICAgICAgIGZpbGw9IndoaXRlIgogICAgLz4KICAgIDxwYXRoCiAgICAgICAgZD0iTTE1Ljg2NDMgMy43Mzk3NUMxNi44MTY1IDMuNzM5OTcgMTcuNzY4NiAzLjczOTc1IDE4LjcyMDcgMy43Mzk5N0MxOS41ODYzIDMuNzQ5MzEgMjAuNDYyOCA0LjAxMjAxIDIxLjE0MDEgNC41NDkwMkMyMS43MzIzIDUuMDEyMjggMjIuMTUyMiA1LjY3ODYgMjIuMzEyMyA2LjQwMzY0QzIyLjUwNjEgNy4yNzkxNiAyMi4zNzk4IDguMjMzOTEgMjEuODk5MyA5LjAwNDAzQzIxLjUxOCA5LjYyNDgxIDIwLjkxOSAxMC4xMDgxIDIwLjIzNDUgMTAuMzc5MkMxOS43NTQ5IDEwLjU2OTggMTkuMjM3NyAxMC42Njk5IDE4LjcyIDEwLjY3MTNDMTcuNzY4MyAxMC42NzEzIDE2LjgxNjUgMTAuNjcwOCAxNS44NjQ2IDEwLjY3MTVDMTUuODY0NiA4LjM2MDkzIDE1Ljg2NSA2LjA1MDM0IDE1Ljg2NDMgMy43Mzk3NVpNMTcuNDMwMyA1LjExNjU0QzE3LjQyNzkgNi41MDkyNyAxNy40MzA1IDcuOTAyIDE3LjQyODkgOS4yOTQ5NkMxNy43Mjc2IDkuMjk0NSAxOC4wMjY2IDkuMjk0NzMgMTguMzI1NCA5LjI5NDczQzE4LjU2NiA5LjI5MjkxIDE4LjgwODYgOS4zMDU4OCAxOS4wNDY5IDkuMjYyNjNDMTkuNTEzOSA5LjE5MTYxIDE5Ljk2MzkgOC45NzE5MyAyMC4yNzI3IDguNjE3NDlDMjAuNTQyNiA4LjMxMzgxIDIwLjY5OTQgNy45MjQzMSAyMC43NDY2IDcuNTI3MDdDMjAuNzkwNiA3LjEyMzY4IDIwLjc1NTcgNi43MDU3MyAyMC41OTU4IDYuMzI4NzVDMjAuNDMxMyA1LjkyODA5IDIwLjEyMzcgNS41ODUyNiAxOS43MzUyIDUuMzc5N0MxOS4zODQzIDUuMTg4NDggMTguOTc5IDUuMTE2MzEgMTguNTgwNiA1LjExNjA5QzE4LjE5NzIgNS4xMTcgMTcuODEzNyA1LjExNjA4IDE3LjQzMDMgNS4xMTY1NFoiCiAgICAgICAgZmlsbD0id2hpdGUiCiAgICAvPgogICAgPHBhdGgKICAgICAgICBkPSJNMjQuMTgzOCAzLjc0NDA3QzI1LjE0NTkgMy43MzQwNiAyNi4xMDg5IDMuNzQyNzEgMjcuMDcxMyAzLjczOTc1QzI3LjMzNTYgMy43NDMzOSAyNy42MDA2IDMuNzI5MDUgMjcuODY0IDMuNzU1NjhDMjguMzMxOSAzLjc5ODI1IDI4LjgwNjEgMy45MzE4OCAyOS4xODA1IDQuMjE5MzlDMjkuNTA2IDQuNDY1MDIgMjkuNzM0NSA0LjgzMTc2IDI5Ljc5NzYgNS4yMzAzNkMyOS44NDMyIDUuNjA3MzQgMjkuODIyIDYuMDA4OTEgMjkuNjMyNCA2LjM0ODc4QzI5LjQ3MTEgNi42NTM2IDI5LjE5MzMgNi44Nzk4OCAyOC44OTQ2IDcuMDQ5N0MyOS4yOTI3IDcuMTk2MyAyOS42ODY0IDcuNDEyNTYgMjkuOTM0MiA3Ljc2MTMxQzMwLjE2NTIgOC4wODM0MyAzMC4yMzI3IDguNDkwNDYgMzAuMjEwMSA4Ljg3NjU1QzMwLjIwMDggOS4yNjkwMSAzMC4wNTQgOS42NjI2IDI5Ljc3OTIgOS45NTE5NEMyOS41MDE2IDEwLjI0ODYgMjkuMTIgMTAuNDMwOSAyOC43Mjg0IDEwLjUzNjhDMjguNDAxMSAxMC42MjMgMjguMDYyNSAxMC42Njc0IDI3LjcyMzcgMTAuNjcwNkMyNi41NDQ1IDEwLjY3MTUgMjUuMzY1MyAxMC42NzE4IDI0LjE4NjEgMTAuNjcwNkMyNC4xODQyIDguMzYxNjEgMjQuMTg4NiA2LjA1Mjg0IDI0LjE4MzggMy43NDQwN1pNMjUuNzA3OCA1LjA4MDM1QzI1LjcwOTQgNS41Njc1IDI1LjcwNjQgNi4wNTQ4OSAyNS43MDkyIDYuNTQyMjhDMjYuMjI1NyA2LjUzOTA5IDI2Ljc0MjMgNi41NDI5NiAyNy4yNTg4IDYuNTQwMjNDMjcuNDkzMSA2LjUyNzk0IDI3LjczNTggNi40OTUzOCAyNy45NDI5IDYuMzc5NzRDMjguMTA2NSA2LjI4OTE0IDI4LjIzMDcgNi4xMjY4MyAyOC4yNTUyIDUuOTQyNDRDMjguMjg5NiA1LjczNDYgMjguMjUzMSA1LjUwMTI2IDI4LjA5NzkgNS4zNDU3OEMyNy45MTEzIDUuMTU3NzQgMjcuNjMzIDUuMDk3NjUgMjcuMzc0OSA1LjA4MjYyQzI2LjgxOTMgNS4wNzgwNyAyNi4yNjM0IDUuMDgyNjIgMjUuNzA3OCA1LjA4MDM1Wk0yNS43MDc2IDcuODE1MjdDMjUuNzA4MyA4LjMyMTMyIDI1LjcwOSA4LjgyNzgzIDI1LjcwNzEgOS4zMzQxMUMyNi4yMDExIDkuMzM4NjcgMjYuNjk1MyA5LjMzNDU3IDI3LjE4OTUgOS4zMzU5M0MyNy40MzYxIDkuMzMyOTcgMjcuNjg1MyA5LjM0OTM2IDI3LjkyOTYgOS4zMDYzNEMyOC4xNDM3IDkuMjcyNjUgMjguMzY0NSA5LjE5Mzg4IDI4LjUwOSA5LjAyODYxQzI4LjY1NDcgOC44NjMxMSAyOC42ODUyIDguNjI3NzMgMjguNjQ4NiA4LjQxODk4QzI4LjYxOTUgOC4yNDE4NyAyOC41MDU4IDguMDgyNzUgMjguMzQ4NSA3Ljk5MTQ2QzI4LjEzNTEgNy44NjQ0NCAyNy44Nzk2IDcuODI0MzcgMjcuNjMzNCA3LjgxNjE4QzI2Ljk5MTUgNy44MTQzNiAyNi4zNDk1IDcuODE2MTggMjUuNzA3NiA3LjgxNTI3WiIKICAgICAgICBmaWxsPSJ3aGl0ZSIKICAgIC8+Cjwvc3ZnPgo="
              alt="" />
            and
            <span class="cursor-pointer">other sources (view)</span>
          </small>

          <div
            v-if="ui.layout == 'full'"
            style="background-color: #0000005c; margin: 5px; padding: 10px">
            <ul style="list-style-type: none">
              <li>Data from IGDB and Steam Store</li>
              <li>Metacritic score from metacritic.com</li>
              <li>Opencritic score from opencritic.com</li>
              <li>HowLongToBeat data from howlongtobeat.com</li>
            </ul>
          </div>
        </div>

        <div
          v-if="$prev"
          style="
            position: absolute;
            left: -35px;
            bottom: -10px;
            z-index: 9999;
            background-color: rgb(55, 49, 49);
            cursor: pointer;
            padding: 15px 20px;
            color: white;
            box-shadow: black 2px 2px 0px 0px;
            display: flex;
            align-items: center;
          "
          @click="load($prev)">
          <Icon size="18" width="2">ChevronLeft</Icon>
          <h4
            class="m-0"
            style="  font-weight: 500;
              margin-bottom: 8px;
              letter-spacing: normal;
              letter-spacing: 2px !important;
              text-transform: uppercase;
            }">
            Prev
          </h4>
        </div>
      </div>

      <!--
        *+---------------------------------
        *| Information column
        *+--------------------------------- -->
      <div class="col info_section">
        <template v-if="ui.tab == 'info'">
          <div class="info-header">
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

            <BState :app="app.uuid" :state="app.state"></BState>

            <!--
            *+---------------------------------
            *| Playtime pill
            *| If this shit is repeated, make a component
            *+--------------------------------- -->
            <div v-if="app.is.lib">
              <div class="status small my-2" style="border-radius: 4px">
                <Icon size="14">ClockHour3</Icon>
                <span style="font-size: 0.775rem">
                  <template v-if="app._.playtime == 0">Not played</template>
                  <template v-else>
                    Played
                    <!-- <Icon class="mx-1" style="color: #666">ArrowRightRhombus</Icon> -->
                    {{ dates.minToHours(app._.playtime, 'Not played') }}
                    {{ dates.timeAgo(app.playtime.steam_last * 1000) }}
                  </template>
                </span>
              </div>
            </div>

            <!-- <button
            v-tippy="'Filter by game state'"
            :class="'btn py-2 ps-3 pe-2'"
            style="transform: scale(0.9) translateX(-5px)">
            <Icon size="19" class="text-muted me-1">Background</Icon>
            <div class="pe-2 me-2 border-end">State</div>
            <BState :state="3" :label="true" :pulse="false"></BState>
          </button> -->
          </div>

          <p
            class="text mt-3 mb-2"
            style="
              text-align: justify;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
            "
            v-html="app.description || 'No description'"></p>

          <div v-if="app.genres.length || app.released_at" class="my-2">
            <h5>General details</h5>
            <ul>
              <li style="font-size: 13px">{{ listOfGenres(app) }}</li>
              <li
                v-if="app.released_at"
                style="font-size: 13px"
                v-tippy="dates.timeAgo(app.released_at)">
                <Icon>Calendar</Icon>
                First released on {{ app._.released_at }}
              </li>
            </ul>
          </div>

          <!--
          *+---------------------------------
          *| Scores block
          *|
          *+--------------------------------- -->
          <div v-if="app.score" class="my-2">
            <h5>Scores</h5>
            <div class="d-flex align-items-center">
              <div
                v-tippy="'Median score'"
                class="d-flex align-items-center text-muted small me-4">
                <Icon size="16" width="1.8" class="me-1">Universe</Icon>

                {{ app.score }}
              </div>

              <div
                v-if="app.scores.igdb"
                v-tippy="'Aggregate reviews from multiple sources'"
                class="d-flex align-items-center text-muted small me-3">
                <Icon size="16" width="1.8" class="me-1">Stack2</Icon>
                {{ app.scores.igdb }}%
                <!-- <br />
              <span>{{ app.scores.steamscore }}% of {{ app.scores.steamCount }}</span> -->
              </div>

              <!--
              *+---------------------------------
              *| Steam score
              *+---------------------------------
            -->
              <div
                v-if="app.scores.steamscoreAlt"
                v-tippy="'Reviews on Steam'"
                class="d-flex align-items-center text-muted small me-3">
                <Icon size="16" width="1.8" class="me-1">DiscountCheck</Icon>
                {{ app.scores.steamscore }}%, {{ app.scores.steamscoreAlt }}
                <!-- <br />
              <span>{{ app.scores.steamscore }}% of {{ app.scores.steamCount }}</span> -->
              </div>

              <!--
              *+---------------------------------
              *| Metacritic
              *+---------------------------------
            -->
              <div
                v-if="app.scores.metascore"
                class="d-flex align-items-center text-muted small me-3">
                <div
                  v-tippy="'Metacritic'"
                  class="text-muted"
                  style="
                    display: flex;
                    width: 23px;
                    height: 23px;
                    border-radius: 3px;
                    align-items: center;
                    justify-content: center;
                    color: black !important;
                  "
                  :style="{
                    'background-color': format.scoreToHuman(
                      app.scores.metascore,
                      'meta',
                      'color'
                    ),
                  }">
                  {{ app.scores.metascore }}
                </div>
              </div>

              <!--
              *+---------------------------------
              *| Metacritic
              *+---------------------------------
            -->
              <div
                v-if="app.scores.userscore"
                class="d-flex align-items-center text-muted small me-3">
                <div
                  v-tippy="'Metacritic users'"
                  class="text-muted"
                  style="
                    display: flex;
                    width: 23px;
                    height: 23px;
                    border-radius: 3px;
                    align-items: center;
                    justify-content: center;
                    color: black !important;
                  "
                  :style="{
                    'background-color': format.scoreToHuman(
                      app.scores.userscore,
                      'meta',
                      'color'
                    ),
                  }">
                  {{ app.scores.userscore }}
                </div>
              </div>

              <!--
              *+---------------------------------
              *| Opencritic
              *+---------------------------------
            -->
              <div
                v-if="app.scores.oc"
                v-tippy="'Opencritic'"
                class="d-flex align-items-center small"
                style="color: black">
                <img
                  :src="
                    'https://steam-backlog.com/images/' +
                    format.scoreToHuman(app.scores.oc, 'oc', 'label') +
                    '-head.png'
                  "
                  style="max-width: 20px; max-height: 20px; margin-right: 3px" />

                {{ app.scores.oc }}
              </div>
            </div>
          </div>

          <div v-if="app.hltb && app.hltb.main" class="my-2">
            <h5>Time to beat</h5>
            <small v-tippy="'Main game'" class="text-muted me-5">
              <Icon size="18" width="2" style="transform: translateY(-2px)" class="">
                SquareRoundedCheck
              </Icon>

              {{ dates.minToHours(app.hltb.main / 60) }}
            </small>
            <small v-tippy="'Main game with extras'" class="text-muted me-5">
              <Icon size="18" width="2" style="transform: translateY(-2px)" class="">
                DiscountCheck
              </Icon>
              {{ dates.minToHours(app.hltb.extras / 60) }}
            </small>
            <small v-if="app.hltb.comp" v-tippy="'Completionist'" class="text-muted me-5">
              <Icon size="18" width="2" style="transform: translateY(-2px)" class="">
                Trophy
              </Icon>
              {{ dates.minToHours(app.hltb.comp / 60) }}
            </small>

            <a
              v-tippy="hltbSource ? 'Click to open' : null"
              :href="hltbSource || null"
              :target="hltbSource ? '_blank' : null"
              class="text-muted"
              :class="{ disabled: !hltbSource }">
              <Icon size="18" width="2" style="transform: translateY(-2px)" class="">
                Click
              </Icon>
              From HLTB
            </a>
          </div>

          <div class="my-3">
            <div class="btn-list">
              <!-- <a
            v-tippy="'Open Steam store page'"
            :href="'https://store.steampowered.com/app/' + app.steam_id"
            class="btn btn-sm btn-icon"
            target="_blank">
            <Icon>BrandSteam</Icon>
            Steam page
          </a> -->

              <!-- <a
              v-tippy="'Open Steam store page'"
              :href="'https://store.steampowered.com/app/' + app.steam_id"
              class="btn btn-ghost-secondary btn-secondary btn-sm"
              target="_blank">
              <Icon size="15" class="me-2">BrandSteam</Icon>
              Steam page
            </a> -->

              <div class="btn-group btn-group-sm" role="group">
                <a
                  v-tippy="'Open Steam store page'"
                  :href="'https://store.steampowered.com/app/' + app.steam_id"
                  class="btn btn-ghost-secondary btn-secondary tonal btn-sm pe-2"
                  style="border: 0"
                  target="_blank">
                  <Icon size="15" class="me-2">BrandSteam</Icon>
                  Steam page
                </a>
                <a
                  v-tippy="'Run or install the game through Steam'"
                  :href="'steam://run/' + app.steam_id"
                  class="btn btn-ghost-secondary btn-secondary tonal btn-sm m-0 ps-0 pe-1"
                  style="border: 0"
                  target="_blank">
                  ⚡
                </a>
              </div>

              <a
                v-if="app.has_demo"
                v-tippy="'Download free demo on Steam'"
                :href="'https://store.steampowered.com/app/' + app.steam_id"
                class="btn btn-ghost-secondary btn-secondary btn-sm"
                target="_blank">
                <Icon size="15" class="me-1">FreeRights</Icon>
                Demo
              </a>

              <!-- <a
              v-tippy="'Open Xbox store page'"
              :href="'https://store.steampowered.com/app/' + app.xbox_id"
              class="btn btn-ghost-secondary btn-secondary btn-sm"
              target="_blank">
              <Icon size="15" class="me-2">BrandXbox</Icon>
              Xbox store
            </a> -->
              <!-- <a v-tippy="'Open on Steam'" href="#" class="btn btn-icon btn-sm">
            <Icon>GitMerge</Icon>
          </a> -->
            </div>
          </div>

          <div class="my-2">
            <small v-if="app.is.lib" class="text-muted" :title="app.is.lib">
              <Icon
                v-tippy="'In Backlog.rip since ' + $moment(app.created_at).format('LL')"
                size="16"
                style="transform: translateY(-2px)"
                class="me-1">
                Calendar
              </Icon>
              In your library since {{ app.is.lib }} -

              {{ $moment(app.is.lib).format('LL') }}
            </small>
          </div>
        </template>

        <template v-if="ui.tab == 'details'">
          <div class="row g-3">
            <div class="col-12 m-0" @click="ui.tab = 'info'">
              <h2 class="m-0">{{ app.name }} details</h2>
            </div>
            <div class="col-6">
              <div class="datagrid-title">Registrar</div>
              <div class="datagrid-content">Third Party</div>
            </div>
            <div class="col-6">
              <div class="datagrid-title">Port number</div>
              <div class="datagrid-content">3306</div>
            </div>

            <div class="col-6">
              <div class="datagrid-title">Registrar</div>
              <div class="datagrid-content">Third Party</div>
            </div>
            <div class="col-6">
              <div class="datagrid-title">Port number</div>
              <div class="datagrid-content">3306</div>
            </div>
          </div>
        </template>

        <div
          v-if="$next"
          style="
            position: absolute;
            right: -15px;
            bottom: -10px;
            z-index: 9999;
            background-color: rgb(55, 49, 49);
            cursor: pointer;
            padding: 15px 20px;
            color: white;
            box-shadow: black 2px 2px 0px 0px;
            display: flex;
            align-items: center;
          "
          @click="load($next)">
          <h4
            class="m-0"
            style="  font-weight: 500;
              margin-bottom: 8px;
              letter-spacing: normal;
              letter-spacing: 2px !important;
              text-transform: uppercase;
            }">
            Next
          </h4>
          <Icon size="18" width="2">ChevronRight</Icon>
        </div>
      </div>
    </div>

    <!-- <div class="modal-back"></div> -->
    <div v-if="false" class="info_section row">
      <div class="row row-deck row-cards m-0">
        <div v-if="app.score" class="col col-md-3">
          <div class="card">
            <div class="card-body" style="padding: 0.5rem 0.75rem">
              <div class="d-flex align-items-center">
                <div class="subheader">Median score</div>

                <!-- <div class="ms-auto">
                  <tippy class="text-muted ms-auto cursor-help" :content="'xxx'">
                    <Icon>HelpCircleFilled</Icon>
                  </tippy>
                </div> -->
              </div>
              <div class="h1 mt-2 mb-0">
                {{ app.score }}
                <span class="subheader">/100</span>
                <!-- <br />
                <span class="subheader">Overwhelmingly positive</span> -->
              </div>

              <!-- <div class="progress progress-sm" style="background-color: #25384f">
                <div class="progress-bar bg-primary" :style="`width: ${app.score}%`">
                  <span class="visually-hidden">{{ app.score }}% Complete</span>
                </div>
              </div> -->
              <!-- <div class="d-flex mb-2">
                <div class="subheader">125.000 votes on Steam</div>
              </div> -->
            </div>
          </div>
        </div>

        <div v-if="app.scores.steamscore" class="col col-md-3">
          <div class="card" style="border: 2px solid rgb(102, 192, 244)">
            <div class="card-body" style="padding: 0.5rem 0.75rem">
              <div class="d-flex align-items-center">
                <div class="subheader">Steam reviews</div>

                <!-- <div class="ms-auto">{{ app.scores.steamCount }} reviews on steam</div> -->
              </div>
              <div class="h1 mt-2 mb-0">
                {{ app.scores.steamscore }}
                <span class="subheader">/100</span>
                <span class="d-block subheader">
                  {{ app.scores.steamscoreAlt }}
                </span>
              </div>

              <!-- <div class="progress progress-sm" style="background-color: #25384f">
                <div class="progress-bar bg-primary" :style="`width: ${app.score}%`">
                  <span class="visually-hidden">{{ app.score }}% Complete</span>
                </div>
              </div> -->
              <!-- <div class="d-flex mb-2">
                <div class="subheader">125.000 votes on Steam</div>
              </div> -->
            </div>
          </div>
        </div>

        <div v-if="false && app.scores.metascore" class="col col-md-3">
          <div class="card" style="border: 2px solid rgb(84, 167, 43)">
            <div class="card-body" style="padding: 0.5rem 0.75rem">
              <div class="d-flex align-items-center">
                <div class="subheader">Metacritic reviews</div>
              </div>
              <div class="h1 mb-0">
                {{ app.scores.metascore }}
                <span class="subheader">/100</span>
                <!-- <br />
                <span class="subheader">Overwhelmingly positive</span> -->
              </div>

              <!-- <div class="progress progress-sm" style="background-color: #25384f">
                <div class="progress-bar bg-primary" :style="`width: ${app.score}%`">
                  <span class="visually-hidden">{{ app.score }}% Complete</span>
                </div>
              </div> -->
              <!-- <div class="d-flex mb-2">
                <div class="subheader">125.000 votes on Steam</div>
              </div> -->
            </div>
          </div>
        </div>
      </div>

      <!-- <div>95 /100 Median score</div>

      <div>93 /100 Overwhelmingly positive Steam score 125.000 votes view on steam</div> -->

      <div v-if="ui.layout == 'full'" class="col col-md-3">
        You played: {{ app._playtime }} last played: {{ app._last_played }}
        <br />
      </div>

      <!-- <div v-if="$app.dev" class="col col-md-3">
        owned: {{ app.is.owned }}
        <div v-tippy="'View history log of changes'"><Icon>Paper</Icon></div>
      </div> -->
    </div>
    <!-- <div class="blur_back">
      <game-asset
        ref="background"
        :app="app"
        asset="background"
        :priority="['steam']"></game-asset>
    </div> -->
  </VueFinalModal>
</template>

<script>
import format from '../../utils/format'

/**
 * @file:    \components\b\details.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 1st December 2023
 * Modified: Tue Apr 16 2024
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
        tab: 'info',
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

    hltbSource() {
      if (!this.app?.source?.providers?.hltb) return false

      return 'https://howlongtobeat.com/game/' + this.app.source.providers.hltb
    },
  },

  methods: {
    async show() {
      this.ui.dialog = true
      this.ui.layout == 'full'
    },

    load(uuid) {
      this.gameStore.load(uuid)
    },

    //+-------------------------------------------------
    // loadAndShow()
    // Loads a game and shows the modal
    // -----
    // Created on Fri Apr 05 2024
    //+-------------------------------------------------
    async loadAndShow(payload) {
      this.$list = payload.$list
      this.load(payload.uuid)
      this.show()

      // const timeline = await this.journalStore.getForRef(app)

      // this.app = { ...data }
      // this.timeline = { ...timeline }

      // const note = await this.journalStore.getNoteForRef(app)
      // this.status.noteObject = note || null
      // this.status.note = note?.data.note || ''

      // // console.warn(app, this.app, timeline)

      // this.evaluate()
    },

    //+-------------------------------------------------
    // listOfGenres()
    // Helper method to get the list of genre names for the current app
    // NOTE: Should be moved to a store
    // -----
    // Created on Fri Apr 05 2024
    //+-------------------------------------------------
    listOfGenres(app) {
      if (!app.genres) return

      return app.genres
        .map((id) => (this._genres[id] ? this._genres[id].name : undefined))
        .filter(Boolean)
        .join(', ')

      return app.genres.map((id) => this._genres[id]?.name).join(', ')
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
      this.loadAndShow(payload)
    })
  },
}
</script>
