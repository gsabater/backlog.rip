<template>
  <div v-if="app.uuid" class="game-details__content" @click.stop.prevent="() => {}">
    <button type="button" class="game-details__close" @click="$emit('close')">
      <Icon width="2">X</Icon>
    </button>
    <!-- <div
        style="
          outline: 2px solid red;
          outline-offset: -2px;
          width: 100%;
          position: absolute;
          top: 0;
          z-index: 1;
          height: 600px;
          pointer-events: none;
        "
        :style="`
            background-image: url(https://steamcdn-a.akamaihd.net/steam/apps/${app.id.steam || ''}/library_hero.jpg);`"></div> -->
    <div class="game-details__header">
      <div
        class="game-details__header-background"
        :style="`
            background-image: url(https://steamcdn-a.akamaihd.net/steam/apps/${app.id.steam || ''}/library_hero.jpg);
          `">
        <!-- <game-asset
            ref="background"
            :app="app"
            asset="gen"
            :priority="['steam']"></game-asset> -->
      </div>

      <div class="d-none game-details__header-data row w-100 h-100 g-0 m-0">
        <div
          class="col-5 nope-offset-1 d-flex flex-column align-items-center"
          style="position: relative">
          <!-- <div
              class="col px-3"
              style="display: flex; justify-content: flex-end">
              <game-asset
                ref="cover"
                id="sourceImage"
                :app="app"
                asset="cover"
                class="locandina"
                :priority="['steam', 'igdb']"></game-asset>
            </div> -->

          <game-asset
            ref="logo"
            :app="app"
            :priority="['steam']"
            asset="logo"
            class="mb-3"
            style="max-width: 300px; filter: drop-shadow(1px 1px 1px black)"
            :alt="app.name + '- Backlog.rip'"
            @loaded="ui.showTitle = false" />

          <!-- <div
              class="_3ftcCC9ublF9tDz6nPW_Vb"
              style="
                background-image: url('https://shared.akamai.steamstatic.com//store_item_assets/steam/apps/275850/library_hero.jpg?t=1721300183');
                position: absolute;
                width: 100%;
                height: 650px;
                background-size: cover;
                background-repeat: no-repeat;
                background-position-x: center;
                -webkit-mask: linear-gradient(180deg, black 58%, rgba(0, 0, 0, 0) 95%),
                  radial-gradient(
                    15.77% 44.22% at 50% 104.95%,
                    rgba(66, 66, 66, 0) 0%,
                    #333333 100%
                  ),
                  radial-gradient(
                    30.95% 86.8% at 30.69% 13.2%,
                    rgba(66, 66, 66, 0.33) 0%,
                    #333333 100%
                  ),
                  radial-gradient(
                    51.31% 143.89% at 49.99% 24.75%,
                    #000000 0%,
                    #000000 52.6%,
                    rgba(0, 0, 0, 0.18) 83.33%,
                    rgba(0, 0, 0, 0) 95.31%
                  ),
                  radial-gradient(
                    51.31% 143.89% at 49.99% 24.75%,
                    #000000 0%,
                    #000000 52.6%,
                    rgba(0, 0, 0, 0.18) 83.33%,
                    rgba(0, 0, 0, 0) 95.31%
                  ),
                  linear-gradient(180deg, #000000 90%, rgba(0, 0, 0, 0) 100%);
                mask: linear-gradient(180deg, black 58%, rgba(0, 0, 0, 0) 95%),
                  radial-gradient(
                    15.77% 44.22% at 50% 104.95%,
                    rgba(66, 66, 66, 0) 0%,
                    #333333 100%
                  ),
                  radial-gradient(
                    30.95% 86.8% at 30.69% 13.2%,
                    rgba(66, 66, 66, 0.33) 0%,
                    #333333 100%
                  ),
                  radial-gradient(
                    51.31% 143.89% at 49.99% 24.75%,
                    #000000 0%,
                    #000000 52.6%,
                    rgba(0, 0, 0, 0.18) 83.33%,
                    rgba(0, 0, 0, 0) 95.31%
                  ),
                  radial-gradient(
                    51.31% 143.89% at 49.99% 24.75%,
                    #000000 0%,
                    #000000 52.6%,
                    rgba(0, 0, 0, 0.18) 83.33%,
                    rgba(0, 0, 0, 0) 95.31%
                  ),
                  linear-gradient(180deg, #000000 90%, rgba(0, 0, 0, 0) 100%);
                -webkit-mask-composite: source-in;
                mask-composite: source-in;
                transition: background-image 0.1s ease-out;
              "></div> -->

          <h2 :class="{ 'sr-only': !ui.showTitle }">
            {{ app.name }}
          </h2>
        </div>

        <!-- <div class="col-6">
            <img
              :src="`https://steamcdn-a.akamaihd.net/steam/apps/${app.id.steam || ''}/library_hero.jpg`"
              alt=""
              style="object-fit: cover" />
            <game-asset
              ref="background"
              :app="app"
              asset="gen"
              :priority="['steam']"
              ></game-asset>
          </div> -->
      </div>

      <!-- <div class="game-details__header-title">
          <h1>{{ app.name }}</h1>
        </div> -->
    </div>
    <div class="game-details__body mt-0">
      <!-- <div class="d-none game-details__body-sticky">
          <div class="game-details__body-sticky-inner row">
            <div class="col-auto">


              <game-asset
                ref="cover"
                :app="app"
                asset="cover"
                class="locandina"
                style="max-width: 60px; max-height: 90px"
                :priority="['steam', 'igdb']"></game-asset>
            </div>
            <div class="col">
              <h2>{{ app.name }}</h2>
              <br />
              <BState :app="app.uuid" :state="app.state"></BState>
            </div>
          </div>
        </div> -->
      <div class="game-details__body-content">
        <!-- <div
            class="game-details__body-content-bg"
            :style="`
            background-image: url(https://steamcdn-a.akamaihd.net/steam/apps/${app.id.steam || ''}/library_hero.jpg);
          `"></div> -->
        <div class="row w-100 h-100 m-0">
          <div class="col-3">
            <div
              class="cover ambilight"
              @click="
                $mitt.emit('game:modal', {
                  uuid: app.uuid,
                })
              ">
              <game-asset
                ref="cover"
                :app="app"
                asset="cover"
                class="locandina"
                :priority="['steam', 'igdb']"></game-asset>
            </div>
            <div class="mb-3">
              <h3 class="mb-1">Your library</h3>
              <div v-tippy="'Date added to your library'" class="mb-2">
                <Icon
                  size="16"
                  width="1.2"
                  class="me-1"
                  style="transform: translateY(-1px)">
                  CalendarWeek
                </Icon>
                Owned since
                {{ app._.created_at }}
              </div>
              <div class="mb-2">
                <div class="d-flex flex-direction-column">
                  <div>
                    <Icon
                      size="16"
                      width="1.2"
                      class="me-1"
                      style="transform: translateY(-1px)">
                      ClockHour3
                    </Icon>
                    <template v-if="app._.playtime == 0">Not played</template>
                    <template v-else>
                      Played {{ dates.minToHours(app._.playtime) }}
                    </template>
                  </div>
                  <div v-if="app._.playtime > 0" class="text-muted" style="zoom: 0.9">
                    <div class="d-inline-block me-2" style="width: 15px">&nbsp;</div>
                    Last played {{ dates.timeAgo(app.playtime.steam_last * 1000) }}
                  </div>
                </div>
              </div>
            </div>
            <div class="my-2 py-1" style="zoom: 0.8">🔸🔸🔸</div>
            <div class="mb-3 text-muted" style="zoom: 0.9">
              <h5 class="mb-1">In Backlog.rip</h5>
              <div
                v-tippy="'The date when the game has been added to the website'"
                class="mb-2">
                <Icon size="16" width="1.2" class="me-1">Box</Icon>
                Since {{ app._.created_at }}
                <!-- {{ $moment(app.created_at).format('LL') }} -->
              </div>

              <div v-tippy="'The last update on metadata from data sources'" class="mb-2">
                <Icon size="16" width="1.2" class="me-1">RotateClockwise2</Icon>
                Updated {{ app._.updated_at }}
                <!-- {{ $moment(app.created_at).format('LL') }} -->
              </div>

              <div class="mb-2">
                <Icon size="16" width="1.2" class="me-1">Edit</Icon>
                Edit missing or wrong data on
                <a :href="`https://www.igdb.com/games/${app.igdb_slug}`" target="_blank">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="16"
                    viewBox="0 0 34 16"
                    fill="none"
                    class="mx-1">
                    <path
                      d="M6.71685e-05 0.000911468C11.3331 0.000683823 22.6665 0.00250409 33.9998 0C34 5.33326 34.0002 10.6667 33.9995 16C31.7937 15.6524 29.5779 15.3612 27.354 15.1482C19.3291 14.3685 11.2122 14.4991 3.21778 15.5367C2.14257 15.6731 1.07109 15.8359 6.71685e-05 15.9993C-0.00016551 10.6665 0.000299847 5.33371 6.71685e-05 0.000911468ZM1.00082 0.980238C1.00128 5.60575 1.00082 10.2315 1.00082 14.857C11.5847 13.2721 22.4154 13.2708 32.999 14.8575C32.9997 10.2315 32.9992 5.60552 32.9992 0.979555C22.333 0.981149 11.6668 0.98001 1.00082 0.980238Z"
                      fill="black" />
                    <path
                      d="M8.31926 4.618C9.01287 3.95737 9.98594 3.60544 10.9497 3.62023C11.6077 3.61796 12.2794 3.7188 12.8712 4.01269C13.1762 4.16157 13.4549 4.35689 13.7151 4.57156C13.3877 4.95833 13.0575 5.34259 12.7339 5.73209C12.5391 5.58936 12.3497 5.43706 12.1343 5.32415C11.7017 5.08535 11.1921 5.00272 10.7005 5.03778C10.0988 5.08808 9.54827 5.44298 9.22228 5.93447C8.80207 6.55184 8.73668 7.3643 8.99123 8.05566C9.14527 8.47566 9.43937 8.84832 9.82678 9.08621C10.2121 9.32842 10.68 9.42562 11.1342 9.39899C11.6 9.38146 12.0742 9.25717 12.4535 8.98468C12.4498 8.65687 12.4535 8.32883 12.4516 8.00102C11.9297 8.00239 11.4076 8.00057 10.8857 8.00194C10.8845 7.56213 10.8885 7.12232 10.8838 6.68273C11.9104 6.67636 12.9372 6.68501 13.9638 6.67841C13.9701 7.68255 13.9631 8.68692 13.9673 9.69106C13.2607 10.2879 12.3688 10.6795 11.4374 10.7685C10.5281 10.8662 9.56944 10.7025 8.79439 10.2119C8.17337 9.82468 7.69359 9.23076 7.44253 8.5542C7.19472 7.88857 7.14586 7.1551 7.285 6.46124C7.42996 5.76373 7.79247 5.10971 8.31926 4.618Z"
                      fill="black" />
                    <path
                      d="M3.78761 3.73952C4.30811 3.74066 4.82861 3.73861 5.34912 3.74066C5.34795 6.05079 5.34912 8.36116 5.34865 10.6715C4.82838 10.6713 4.30811 10.6706 3.78784 10.6718C3.78761 8.36116 3.78808 6.05034 3.78761 3.73952Z"
                      fill="black" />
                    <path
                      d="M15.8643 3.73975C16.8165 3.73997 17.7686 3.73975 18.7207 3.73997C19.5863 3.74931 20.4628 4.01201 21.1401 4.54902C21.7323 5.01228 22.1522 5.6786 22.3123 6.40364C22.5061 7.27916 22.3798 8.23391 21.8993 9.00403C21.518 9.62481 20.919 10.1081 20.2345 10.3792C19.7549 10.5698 19.2377 10.6699 18.72 10.6713C17.7683 10.6713 16.8165 10.6708 15.8646 10.6715C15.8646 8.36093 15.865 6.05034 15.8643 3.73975ZM17.4303 5.11654C17.4279 6.50927 17.4305 7.902 17.4289 9.29496C17.7276 9.2945 18.0266 9.29473 18.3254 9.29473C18.566 9.29291 18.8086 9.30588 19.0469 9.26263C19.5139 9.19161 19.9639 8.97193 20.2727 8.61749C20.5426 8.31381 20.6994 7.92431 20.7466 7.52707C20.7906 7.12368 20.7557 6.70573 20.5958 6.32875C20.4313 5.92809 20.1237 5.58526 19.7352 5.3797C19.3843 5.18848 18.979 5.11631 18.5806 5.11609C18.1972 5.117 17.8137 5.11608 17.4303 5.11654Z"
                      fill="black" />
                    <path
                      d="M24.1838 3.74407C25.1459 3.73406 26.1089 3.74271 27.0713 3.73975C27.3356 3.74339 27.6006 3.72905 27.864 3.75568C28.3319 3.79825 28.8061 3.93188 29.1805 4.21939C29.506 4.46502 29.7345 4.83176 29.7976 5.23036C29.8432 5.60734 29.822 6.00891 29.6324 6.34878C29.4711 6.6536 29.1933 6.87988 28.8946 7.0497C29.2927 7.1963 29.6864 7.41256 29.9342 7.76131C30.1652 8.08343 30.2327 8.49046 30.2101 8.87655C30.2008 9.26901 30.054 9.6626 29.7792 9.95194C29.5016 10.2486 29.12 10.4309 28.7284 10.5368C28.4011 10.623 28.0625 10.6674 27.7237 10.6706C26.5445 10.6715 25.3653 10.6718 24.1861 10.6706C24.1842 8.36161 24.1886 6.05284 24.1838 3.74407ZM25.7078 5.08035C25.7094 5.5675 25.7064 6.05489 25.7092 6.54228C26.2257 6.53909 26.7423 6.54296 27.2588 6.54023C27.4931 6.52794 27.7358 6.49538 27.9429 6.37974C28.1065 6.28914 28.2307 6.12683 28.2552 5.94244C28.2896 5.7346 28.2531 5.50126 28.0979 5.34578C27.9113 5.15774 27.633 5.09765 27.3749 5.08262C26.8193 5.07807 26.2634 5.08262 25.7078 5.08035ZM25.7076 7.81527C25.7083 8.32132 25.709 8.82783 25.7071 9.33411C26.2011 9.33867 26.6953 9.33457 27.1895 9.33593C27.4361 9.33297 27.6853 9.34936 27.9296 9.30634C28.1437 9.27265 28.3645 9.19388 28.509 9.02861C28.6547 8.86311 28.6852 8.62773 28.6486 8.41898C28.6195 8.24187 28.5058 8.08275 28.3485 7.99146C28.1351 7.86444 27.8796 7.82437 27.6334 7.81618C26.9915 7.81436 26.3495 7.81618 25.7076 7.81527Z"
                      fill="black" />
                  </svg>
                </a>
              </div>
            </div>

            <template v-if="$app.wip">
              <h3>Your library</h3>
              <ul>
                <li>This game is in your library</li>
                <li>since {{ app.is.lib }}</li>
              </ul>

              <!-- <h3>Add a note</h3>
              <textarea id="" name="" cols="30" rows="10">
                You can add a note here. Use markdown to format your text.
              </textarea> -->
            </template>
          </div>
          <div class="col-9 row" style="align-content: flex-start">
            <div class="col-7 translocate">
              <h1 class="text-white" style="text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5)">
                {{ app.name }}
              </h1>
              <div class="row">
                <div class="mb-3">
                  <strong class="text-muted">{{ app.date.releasedYear }}</strong>
                  <div class="d-inline-block px-2 opacity-50">🔸</div>
                  <strong v-tippy="'Median score'" class="text-muted">
                    <Icon size="12" width="1" style="transform: translateY(-2px)">
                      StarFilled
                    </Icon>
                    {{ app.score }}
                  </strong>

                  <client-only>
                    <template v-if="genre">
                      <div class="d-inline-block px-2 opacity-50">🔸</div>
                      <strong class="text-muted">{{ genre.name }}</strong>
                    </template>
                  </client-only>
                </div>
                <div class="">
                  <b-state ref="bstate" :app="app.uuid" :state="app.state">
                    <template #container="{ state }">
                      <v-btn
                        variant="tonal"
                        class="me-2"
                        :color="state.color || 'deep-purple-lighten-4'"
                        :style="{
                          '--tblr-status-color': state.color,
                          'outline': '1px solid ' + state.color,
                        }"
                        @click.stop="$refs.bstate.showManager($event)">
                        <span
                          v-if="state.id"
                          class="status-dot status-dot-animated me-2"></span>
                        {{ state.name || 'Assign a state' }}
                        <Icon size="12" class="ms-1" style="transform: translateX(3px)">
                          ChevronDown
                        </Icon>
                      </v-btn>
                    </template>
                  </b-state>

                  <v-btn variant="text" size="small" class="me-2" color="pink-darken-2">
                    <Icon>{{ app.is.fav ? 'HeartFilled' : 'Heart' }}</Icon>
                  </v-btn>

                  <!-- <v-btn class="me-2" variant="tonal" size="small" color="blue-grey">
                  Add to a list
                  <Icon size="12" class="ms-2">ChevronDown</Icon>
                </v-btn> -->

                  <!-- <v-btn variant="tonal" size="small" class="me-2" color="blue-grey">
                  <Icon>Settings</Icon>
                </v-btn> -->
                </div>
              </div>
            </div>

            <p
              class="text mb-3"
              :class="{ 'text-muted': !app.description }"
              style="
                text-align: justify;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
              "
              v-html="app.description || 'No description'"></p>

            <div class="col-12 mb-3">
              <!-- <h5>Direct links</h5> -->
              <div class="btn-list">
                <v-btn
                  v-if="app.id.steam"
                  v-tippy="'Open Steam store page'"
                  variant="tonal"
                  :href="'https://store.steampowered.com/app/' + app.id.steam"
                  target="_blank"
                  style="outline: rgb(108 122 145 / 40%) solid 1px">
                  <Icon size="15" class="me-2">BrandSteam</Icon>
                  Steam store
                </v-btn>

                <!-- <a
                    v-if="app.is.steam"
                    v-tippy="'Run or install the game through Steam'"
                    :href="'steam://run/' + app.id.steam"
                    class="btn btn-ghost-secondary btn-secondary tonal btn-sm m-0 ps-0 pe-1"
                    style="border: 0"
                    target="_blank">
                    ⚡
                  </a> -->

                <a
                  v-if="app.has_demo"
                  v-tippy="'Play a free demo on Steam'"
                  :href="'https://store.steampowered.com/app/' + app.id.steam"
                  class="btn btn-ghost-secondary btn-secondary btn-sm"
                  target="_blank">
                  <Icon size="15" class="me-1">Download</Icon>
                  Demo
                </a>

                <v-btn
                  v-if="app.id.xbox"
                  v-tippy="'Open Xbox page'"
                  variant="text"
                  :href="`https://www.xbox.com/games/store/${app.slug}/${app.id.xbox}`"
                  target="_blank">
                  <Icon size="15" class="me-1">BrandXbox</Icon>
                  Xbox
                </v-btn>
              </div>
            </div>

            <!--
                *+---------------------------------
                *| HLTB
                *+--------------------------------- -->
            <div v-if="app.hltb && app.hltb.main" class="col-12 my-3">
              <h5>Time to complete</h5>

              <div v-if="app.hltb" class="row row-cards">
                <div v-if="app.hltb.main" class="col-sm-6 col-lg-3">
                  <div class="card card-sm">
                    <div class="card-body">
                      <h3 class="m-0">
                        <Icon
                          size="15"
                          width="1.5"
                          style="transform: translateY(-1px)"
                          class="me-1">
                          SquareRoundedCheck
                        </Icon>
                        {{ dates.minToHours(app.hltb.main / 60) }}
                      </h3>
                      <small class="text-secondary">Main story</small>
                    </div>
                  </div>
                </div>

                <div v-if="app.hltb.extras" class="col-sm-6 col-lg-3">
                  <div class="card card-sm">
                    <div class="card-body">
                      <h3 class="m-0">
                        <Icon
                          size="15"
                          width="1.5"
                          style="transform: translateY(-1px)"
                          class="me-1">
                          DiscountCheck
                        </Icon>
                        {{ dates.minToHours(app.hltb.extras / 60) }}
                      </h3>
                      <small class="text-secondary">Main with extras</small>
                    </div>
                  </div>
                </div>

                <div v-if="app.hltb.comp" class="col-sm-6 col-lg-3">
                  <div class="card card-sm">
                    <div class="card-body">
                      <h3 class="m-0">
                        <!-- <Icon
                                size="15"
                                width="1.5"
                                style="transform: translateY(-1px)"
                                class="me-1">
                                Number100Small
                              </Icon> -->
                        💯

                        {{ dates.minToHours(app.hltb.comp / 60) }}
                      </h3>
                      <small class="text-secondary">Completionist</small>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6 col-lg-3" style="display: flex; align-items: center">
                  <a
                    v-tippy="hltbSource ? 'Click to open' : null"
                    :href="hltbSource || 'javascript:void(0)'"
                    :target="hltbSource ? '_blank' : null"
                    class="text-muted small text-center"
                    :class="{
                      'disabled cursor-default text-decoration-none': !hltbSource,
                    }">
                    <Icon
                      v-if="hltbSource"
                      size="18"
                      width="2"
                      style="transform: translateY(-2px)">
                      Click
                    </Icon>
                    Game length provided by
                    <strong>HowLongToBeat</strong>
                  </a>
                </div>
              </div>
            </div>
            <!-- Single line layout -->
            <div class="d-none col-12 my-3">
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
                <small
                  v-if="app.hltb.comp"
                  v-tippy="'Completionist'"
                  class="text-muted me-5">
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
            </div>

            <!--
              *+---------------------------------
              *| Scores block
              *+--------------------------------- -->
            <div v-if="app.score" class="col-12 my-3">
              <h5>Scores</h5>

              <div class="row row-cards">
                <div class="col-3">
                  <div
                    class="card card-sm card-data card-is-score"
                    :style="{
                      '--score-color': format.scoreToHuman(app.score, 'meta', 'color'),
                    }">
                    <div class="card-body">
                      <div class="text-black fw-bold m-0">
                        <Icon size="13" width="1.5" style="transform: translateY(-2px)">
                          StarFilled
                        </Icon>
                        {{ app.score }}
                      </div>
                      <small class="text-secondary">Median score</small>
                    </div>
                  </div>
                </div>

                <div v-if="app.scores.steamscore" class="col-3">
                  <div
                    class="card card-sm card-data card-is-score"
                    :style="{
                      '--score-color': format.scoreToHuman(
                        app.scores.steamscore,
                        'steam',
                        'color'
                      ),
                    }">
                    <div class="card-body">
                      <div class="text-black fw-bold m-0">
                        {{ app.scores.steamscore }}%
                      </div>

                      <small class="text-secondary">
                        {{ app.scores.steamscoreAlt }}
                        <!-- #
                            {{ format.compactNum(app.scores.steamCount) }} -->
                        <!--  of
                             reviews on -->
                        <!-- Steam -->
                      </small>
                    </div>
                  </div>
                </div>

                <div v-if="app.scores.metascore || app.scores.userscore" class="col-3">
                  <div
                    class="card card-sm card-data card-is-score"
                    :style="{
                      '--score-color': format.scoreToHuman(
                        app.scores.metascore,
                        'meta',
                        'color'
                      ),
                    }">
                    <div class="card-body">
                      <!-- <h3 class="m-0"> -->
                      <!-- <span>
                                  {{ app.scores.metascore }}
                                </span> -->
                      <div
                        style="
                          display: flex;
                          justify-content: center;
                          transform: translateY(-2px);
                        ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="20"
                          viewBox="0 0 40 40"
                          class="me-1"
                          style="transform: translateX(-2px)">
                          <path d="M36.978 19.49a17.49 17.49 0 1 1 0-.021" fill="#000" />
                          <path
                            d="m17.209 32.937 3.41-3.41-6.567-6.567c-.276-.276-.576-.622-.737-1.014-.369-.783-.53-2.004.369-2.903 1.106-1.106 2.58-.645 4.009.784l6.313 6.313 3.41-3.41-6.59-6.59c-.276-.276-.599-.691-.76-1.037-.438-.898-.415-2.027.392-2.834 1.129-1.129 2.603-.714 4.24.922l6.128 6.129 3.41-3.41L27.6 9.274c-3.364-3.364-6.52-3.249-8.686-1.083-.83.83-1.337 1.705-1.59 2.696a6.71 6.71 0 0 0-.092 2.81l-.046.047c-1.66-.691-3.549-.277-5 1.175-1.936 1.935-1.866 3.986-1.636 5.184l-.07.07-1.681-1.36-2.95 2.949c1.037.945 2.282 2.097 3.687 3.502l7.673 7.673Z"
                            fill="#F2F2F2" />
                          <path
                            d="M19.982 0A20 20 0 1 0 40 20v-.024A20 20 0 0 0 19.982 0Zm-.091 4.274A15.665 15.665 0 0 1 35.57 19.921v.018A15.665 15.665 0 1 1 19.89 4.274Z"
                            fill="#FFBD3F" />
                        </svg>
                        <div
                          v-tippy="'Metacritic users'"
                          class="text-muted me-1"
                          style="
                            display: flex;
                            width: 24px;
                            height: 24px;
                            border-radius: 3px;
                            align-items: center;
                            justify-content: center;
                            color: black !important;
                            font-size: 12px;
                            font-weight: bold;
                          "
                          :style="{
                            border:
                              '1px solid ' +
                              format.scoreToHuman(app.scores.metascore, 'meta', 'color'),
                          }">
                          {{ app.scores.metascore }}
                        </div>
                        <div
                          v-if="app.scores.userscore"
                          v-tippy="'Metacritic users'"
                          class="text-muted"
                          style="
                            display: flex;
                            width: 24px;
                            height: 24px;
                            border-radius: 3px;
                            align-items: center;
                            justify-content: center;
                            color: black !important;
                            font-size: 12px;
                            font-weight: bold;
                          "
                          :style="{
                            border:
                              '1px solid ' +
                              format.scoreToHuman(app.scores.userscore, 'meta', 'color'),
                          }">
                          {{ app.scores.userscore }}
                        </div>
                      </div>
                      <!-- </h3> -->
                      <small class="text-secondary">On Metacritic</small>
                    </div>
                  </div>
                </div>

                <div v-if="app.scores.oc" class="col-3">
                  <div
                    class="card card-sm card-data card-is-score"
                    :style="{
                      '--score-color': format.scoreToHuman(app.scores.oc, 'oc', 'color'),
                    }">
                    <div class="card-body">
                      <div class="text-black fw-bold m-0">
                        <img
                          :src="
                            'https://backlog.rip/img/scores/' +
                            format.scoreToHuman(app.scores.oc, 'oc', 'label') +
                            '-head.png'
                          "
                          style="
                            max-width: 17px;
                            max-height: 17px;
                            transform: translate(-2px, -2px);
                          " />
                        {{ app.scores.oc }}
                      </div>
                      <small class="text-secondary">On Opencritic</small>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Single line layout -->
              <div class="d-flex d-none align-items-center">
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
                  {{ app.scores.steamscore }}% · {{ app.scores.steamscoreAlt }}
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
                    style="
                      max-width: 18px;
                      max-height: 18px;
                      margin-right: 3px;
                      transform: translate(-1px, -1px);
                    " />

                  {{ app.scores.oc }}
                </div>
              </div>
            </div>

            <div v-if="screenshots.length" class="col-12 my-4">
              <h5>Gallery ({{ screenshots.length }})</h5>
              <div id="game-gallery" class="game-gallery">
                <!-- Main large screenshot -->
                <a
                  v-if="screenshots[0]"
                  :href="screenshots[0].full"
                  data-pswp-width="1000"
                  data-pswp-height="1000"
                  :data-id="0"
                  class="game-gallery__item game-gallery__item--main"
                  @click.prevent="lightbox.loadAndOpen(0)">
                  <img :src="screenshots[0].thumb" :alt="`${app.name} screenshot 1`" />
                </a>

                <!-- 3 medium screenshots in a 2x2 grid -->
                <template v-for="index in 3" :key="index">
                  <a
                    v-if="screenshots[index]"
                    :href="screenshots[index].full"
                    data-pswp-width="300"
                    data-pswp-height="300"
                    :data-id="index"
                    class="game-gallery__item"
                    @click.prevent="lightbox.loadAndOpen(index)">
                    <img
                      :src="screenshots[index].thumb"
                      :alt="`${app.name} screenshot ${index + 1}`" />
                  </a>
                </template>

                <!-- View all button -->
                <a
                  v-if="screenshots.length > 4"
                  :href="screenshots[4].full"
                  data-pswp-width="1000"
                  data-pswp-height="1000"
                  class="game-gallery__item game-gallery__item--view-all">
                  <img
                    v-if="screenshots[4]"
                    :src="screenshots[4].thumb"
                    :alt="`${app.name} screenshot 5`" />
                  <div class="game-gallery__overlay">
                    <span>View all {{ screenshots.length }} screenshots</span>
                  </div>
                </a>
              </div>
            </div>

            <client-only>
              <div class="col-12 my-3">
                <div class="card">
                  <div class="card-body">
                    <div class="datagrid">
                      <div class="datagrid-item">
                        <div class="datagrid-title">Genres</div>
                        <div class="datagrid-content" v-html="genres"></div>
                      </div>
                      <div class="datagrid-item">
                        <div class="datagrid-title">Release date</div>
                        <div class="datagrid-content">{{ app.date.released }}</div>
                      </div>
                      <div v-if="$app.wip" class="datagrid-item">
                        <div class="datagrid-title">Port number</div>
                        <div class="datagrid-content">3306</div>
                      </div>
                      <div v-if="$app.wip" class="datagrid-item">
                        <div class="datagrid-title">Expiration date</div>
                        <div class="datagrid-content">–</div>
                      </div>
                      <div v-if="$app.wip" class="datagrid-item">
                        <div class="datagrid-title">Creator</div>
                        <div class="datagrid-content">
                          <div class="d-flex align-items-center">
                            <span class="avatar avatar-xs me-2 rounded"></span>
                            Kuna
                          </div>
                        </div>
                      </div>
                      <div v-if="$app.wip" class="datagrid-item">
                        <div class="datagrid-title">Age</div>
                        <div class="datagrid-content">15 days</div>
                      </div>
                      <div v-if="$app.wip" class="datagrid-item">
                        <div class="datagrid-title">Edge network</div>
                        <div class="datagrid-content">
                          <span class="status status-green">Active</span>
                        </div>
                      </div>
                      <div v-if="$app.wip" class="datagrid-item">
                        <div class="datagrid-title">Avatars list</div>
                        <div class="datagrid-content">
                          <div class="avatar-list avatar-list-stacked">
                            <span class="avatar avatar-xs rounded"></span>
                            <span class="avatar avatar-xs rounded">JL</span>
                            <span class="avatar avatar-xs rounded"></span>
                            <span class="avatar avatar-xs rounded"></span>
                            <span class="avatar avatar-xs rounded"></span>
                            <span class="avatar avatar-xs rounded">+3</span>
                          </div>
                        </div>
                      </div>

                      <div v-if="$app.wip" class="datagrid-item">
                        <div class="datagrid-title">Longer description</div>
                        <div class="datagrid-content">
                          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <pre>
      {{ app }}
    </pre
              > -->
            </client-only>

            <div class="col-12 my-3 text-muted" style="zoom: 0.9">
              <h5>Data sources</h5>

              <a href="https://www.igdb.com" target="_blank">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="15"
                  viewBox="0 0 34 16"
                  fill="none">
                  <path
                    d="M6.71685e-05 0.000911468C11.3331 0.000683823 22.6665 0.00250409 33.9998 0C34 5.33326 34.0002 10.6667 33.9995 16C31.7937 15.6524 29.5779 15.3612 27.354 15.1482C19.3291 14.3685 11.2122 14.4991 3.21778 15.5367C2.14257 15.6731 1.07109 15.8359 6.71685e-05 15.9993C-0.00016551 10.6665 0.000299847 5.33371 6.71685e-05 0.000911468ZM1.00082 0.980238C1.00128 5.60575 1.00082 10.2315 1.00082 14.857C11.5847 13.2721 22.4154 13.2708 32.999 14.8575C32.9997 10.2315 32.9992 5.60552 32.9992 0.979555C22.333 0.981149 11.6668 0.98001 1.00082 0.980238Z"
                    fill="black" />
                  <path
                    d="M8.31926 4.618C9.01287 3.95737 9.98594 3.60544 10.9497 3.62023C11.6077 3.61796 12.2794 3.7188 12.8712 4.01269C13.1762 4.16157 13.4549 4.35689 13.7151 4.57156C13.3877 4.95833 13.0575 5.34259 12.7339 5.73209C12.5391 5.58936 12.3497 5.43706 12.1343 5.32415C11.7017 5.08535 11.1921 5.00272 10.7005 5.03778C10.0988 5.08808 9.54827 5.44298 9.22228 5.93447C8.80207 6.55184 8.73668 7.3643 8.99123 8.05566C9.14527 8.47566 9.43937 8.84832 9.82678 9.08621C10.2121 9.32842 10.68 9.42562 11.1342 9.39899C11.6 9.38146 12.0742 9.25717 12.4535 8.98468C12.4498 8.65687 12.4535 8.32883 12.4516 8.00102C11.9297 8.00239 11.4076 8.00057 10.8857 8.00194C10.8845 7.56213 10.8885 7.12232 10.8838 6.68273C11.9104 6.67636 12.9372 6.68501 13.9638 6.67841C13.9701 7.68255 13.9631 8.68692 13.9673 9.69106C13.2607 10.2879 12.3688 10.6795 11.4374 10.7685C10.5281 10.8662 9.56944 10.7025 8.79439 10.2119C8.17337 9.82468 7.69359 9.23076 7.44253 8.5542C7.19472 7.88857 7.14586 7.1551 7.285 6.46124C7.42996 5.76373 7.79247 5.10971 8.31926 4.618Z"
                    fill="black" />
                  <path
                    d="M3.78761 3.73952C4.30811 3.74066 4.82861 3.73861 5.34912 3.74066C5.34795 6.05079 5.34912 8.36116 5.34865 10.6715C4.82838 10.6713 4.30811 10.6706 3.78784 10.6718C3.78761 8.36116 3.78808 6.05034 3.78761 3.73952Z"
                    fill="black" />
                  <path
                    d="M15.8643 3.73975C16.8165 3.73997 17.7686 3.73975 18.7207 3.73997C19.5863 3.74931 20.4628 4.01201 21.1401 4.54902C21.7323 5.01228 22.1522 5.6786 22.3123 6.40364C22.5061 7.27916 22.3798 8.23391 21.8993 9.00403C21.518 9.62481 20.919 10.1081 20.2345 10.3792C19.7549 10.5698 19.2377 10.6699 18.72 10.6713C17.7683 10.6713 16.8165 10.6708 15.8646 10.6715C15.8646 8.36093 15.865 6.05034 15.8643 3.73975ZM17.4303 5.11654C17.4279 6.50927 17.4305 7.902 17.4289 9.29496C17.7276 9.2945 18.0266 9.29473 18.3254 9.29473C18.566 9.29291 18.8086 9.30588 19.0469 9.26263C19.5139 9.19161 19.9639 8.97193 20.2727 8.61749C20.5426 8.31381 20.6994 7.92431 20.7466 7.52707C20.7906 7.12368 20.7557 6.70573 20.5958 6.32875C20.4313 5.92809 20.1237 5.58526 19.7352 5.3797C19.3843 5.18848 18.979 5.11631 18.5806 5.11609C18.1972 5.117 17.8137 5.11608 17.4303 5.11654Z"
                    fill="black" />
                  <path
                    d="M24.1838 3.74407C25.1459 3.73406 26.1089 3.74271 27.0713 3.73975C27.3356 3.74339 27.6006 3.72905 27.864 3.75568C28.3319 3.79825 28.8061 3.93188 29.1805 4.21939C29.506 4.46502 29.7345 4.83176 29.7976 5.23036C29.8432 5.60734 29.822 6.00891 29.6324 6.34878C29.4711 6.6536 29.1933 6.87988 28.8946 7.0497C29.2927 7.1963 29.6864 7.41256 29.9342 7.76131C30.1652 8.08343 30.2327 8.49046 30.2101 8.87655C30.2008 9.26901 30.054 9.6626 29.7792 9.95194C29.5016 10.2486 29.12 10.4309 28.7284 10.5368C28.4011 10.623 28.0625 10.6674 27.7237 10.6706C26.5445 10.6715 25.3653 10.6718 24.1861 10.6706C24.1842 8.36161 24.1886 6.05284 24.1838 3.74407ZM25.7078 5.08035C25.7094 5.5675 25.7064 6.05489 25.7092 6.54228C26.2257 6.53909 26.7423 6.54296 27.2588 6.54023C27.4931 6.52794 27.7358 6.49538 27.9429 6.37974C28.1065 6.28914 28.2307 6.12683 28.2552 5.94244C28.2896 5.7346 28.2531 5.50126 28.0979 5.34578C27.9113 5.15774 27.633 5.09765 27.3749 5.08262C26.8193 5.07807 26.2634 5.08262 25.7078 5.08035ZM25.7076 7.81527C25.7083 8.32132 25.709 8.82783 25.7071 9.33411C26.2011 9.33867 26.6953 9.33457 27.1895 9.33593C27.4361 9.33297 27.6853 9.34936 27.9296 9.30634C28.1437 9.27265 28.3645 9.19388 28.509 9.02861C28.6547 8.86311 28.6852 8.62773 28.6486 8.41898C28.6195 8.24187 28.5058 8.08275 28.3485 7.99146C28.1351 7.86444 27.8796 7.82437 27.6334 7.81618C26.9915 7.81436 26.3495 7.81618 25.7076 7.81527Z"
                    fill="black" />
                </svg>
              </a>

              🔸

              <a href="https://store.steampowered.com" target="_blank">
                <svg
                  id="Layer_1"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  height="15"
                  viewBox="0 0 355.666 89.333"
                  enable-background="new 0 0 355.666 89.333"
                  xml:space="preserve"
                  style="margin-right: -10px">
                  <g>
                    <path
                      fill="black"
                      d="M44.238,0.601C21,0.601,1.963,18.519,0.154,41.29l23.71,9.803c2.009-1.374,4.436-2.179,7.047-2.179
c0.234,0,0.467,0.008,0.698,0.021l10.544-15.283c0-0.073-0.001-0.144-0.001-0.216c0-9.199,7.483-16.683,16.683-16.683
c9.199,0,16.682,7.484,16.682,16.683c0,9.199-7.483,16.684-16.682,16.684c-0.127,0-0.253-0.003-0.379-0.006l-15.038,10.73
c0.008,0.195,0.015,0.394,0.015,0.592c0,6.906-5.617,12.522-12.522,12.522c-6.061,0-11.129-4.326-12.277-10.055L1.678,56.893
c5.25,18.568,22.309,32.181,42.56,32.181c24.432,0,44.237-19.806,44.237-44.235C88.475,20.406,68.669,0.601,44.238,0.601" />
                    <path
                      fill="black"
                      d="M27.875,67.723l-5.434-2.245c0.963,2.005,2.629,3.684,4.841,4.606c4.782,1.992,10.295-0.277,12.288-5.063
c0.965-2.314,0.971-4.869,0.014-7.189c-0.955-2.321-2.757-4.131-5.074-5.097c-2.299-0.957-4.762-0.922-6.926-0.105l5.613,2.321
c3.527,1.47,5.195,5.52,3.725,9.047C35.455,67.526,31.402,69.194,27.875,67.723" />
                    <path
                      fill="black"
                      d="M69.95,33.436c0-6.129-4.986-11.116-11.116-11.116c-6.129,0-11.116,4.987-11.116,11.116
c0,6.13,4.987,11.115,11.116,11.115C64.964,44.55,69.95,39.565,69.95,33.436 M50.502,33.417c0-4.612,3.739-8.35,8.351-8.35
c4.612,0,8.351,3.738,8.351,8.35s-3.739,8.35-8.351,8.35C54.241,41.767,50.502,38.028,50.502,33.417" />
                    <path
                      fill="black"
                      d="M135.718,30.868l-2.964,5.21c-2.283-1.595-5.377-2.555-8.078-2.555c-3.087,0-4.997,1.278-4.997,3.567
c0,2.781,3.393,3.428,8.436,5.238c5.421,1.917,8.537,4.17,8.537,9.135c0,6.793-5.342,10.608-13.02,10.608
c-3.742,0-8.256-0.966-11.726-3.077l2.162-5.776c2.819,1.489,6.191,2.372,9.197,2.372c4.052,0,5.978-1.495,5.978-3.705
c0-2.529-2.937-3.289-7.678-4.859c-5.403-1.804-9.147-4.171-9.147-9.666c0-6.197,4.963-9.756,12.104-9.756
C129.499,27.604,133.499,29.181,135.718,30.868" />
                    <polygon
                      fill="black"
                      points="158.888,34.161 158.888,61.5 151.909,61.5 151.909,34.161 141.779,34.161 141.779,28.175
168.988,28.175 168.988,34.161 	" />
                    <polygon
                      fill="black"
                      points="183.7,34.143 183.7,41.652 197.056,41.652 197.056,47.638 183.7,47.638 183.7,55.459
199.196,55.459 199.196,61.5 176.723,61.5 176.723,28.175 199.196,28.175 199.196,34.143 	" />
                    <path
                      fill="black"
                      d="M214.773,55.03l-2.206,6.471h-7.316l12.495-33.325h7.025L237.619,61.5h-7.563l-2.254-6.471H214.773z
 M221.219,36.125l-4.551,13.343h9.196L221.219,36.125z" />
                    <polygon
                      fill="black"
                      points="273.436,41.056 264.316,60.529 260.378,60.529 251.406,41.23 251.406,61.5 244.723,61.5
244.723,28.175 251.391,28.175 262.591,52.231 273.393,28.175 280.119,28.175 280.119,61.5 273.437,61.5 	" />
                    <path
                      fill="black"
                      d="M293.611,32.379c0,2.864-2.146,4.649-4.609,4.649c-2.472,0-4.623-1.785-4.623-4.649
c0-2.863,2.151-4.636,4.623-4.636C291.466,27.743,293.611,29.516,293.611,32.379 M285.154,32.379c0,2.396,1.726,3.901,3.848,3.901
c2.114,0,3.833-1.505,3.833-3.901c0-2.403-1.719-3.885-3.833-3.885C286.886,28.494,285.154,29.994,285.154,32.379 M289.066,30.01
c1.195,0,1.597,0.632,1.597,1.315c0,0.626-0.371,1.046-0.823,1.26l1.071,2.007h-0.877l-0.903-1.779H288.2v1.779h-0.73V30.01
H289.066z M288.207,32.142h0.814c0.527,0,0.838-0.331,0.838-0.747c0-0.42-0.223-0.69-0.84-0.69h-0.813V32.142z" />
                  </g>
                </svg>
              </a>
              <template v-if="app.hltb">
                🔸
                <a href="https://howlongtobeat.com" target="_blank">
                  <img
                    src="https://backlog.rip/img/logos/hltb.png"
                    style="height: 25px; filter: brightness(0.4); margin: 0 -5px" />
                </a>
              </template>
              <template v-if="app.scores.metascore">
                🔸
                <a href="https://www.metacritic.com" target="_blank">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 176 40">
                    <path d="M36.978 19.49a17.49 17.49 0 1 1 0-.021" fill="#000" />
                    <path
                      d="m17.209 32.937 3.41-3.41-6.567-6.567c-.276-.276-.576-.622-.737-1.014-.369-.783-.53-2.004.369-2.903 1.106-1.106 2.58-.645 4.009.784l6.313 6.313 3.41-3.41-6.59-6.59c-.276-.276-.599-.691-.76-1.037-.438-.898-.415-2.027.392-2.834 1.129-1.129 2.603-.714 4.24.922l6.128 6.129 3.41-3.41L27.6 9.274c-3.364-3.364-6.52-3.249-8.686-1.083-.83.83-1.337 1.705-1.59 2.696a6.71 6.71 0 0 0-.092 2.81l-.046.047c-1.66-.691-3.549-.277-5 1.175-1.936 1.935-1.866 3.986-1.636 5.184l-.07.07-1.681-1.36-2.95 2.949c1.037.945 2.282 2.097 3.687 3.502l7.673 7.673Z"
                      fill="#F2F2F2" />
                    <path
                      d="M19.982 0A20 20 0 1 0 40 20v-.024A20 20 0 0 0 19.982 0Zm-.091 4.274A15.665 15.665 0 0 1 35.57 19.921v.018A15.665 15.665 0 1 1 19.89 4.274Z"
                      fill="#FFBD3F" />
                  </svg>
                </a>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \components\game\Folio.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 21st November 2024
 * Modified: Mon 16 December 2024 - 17:13:11
 **/

export default {
  name: 'GameFolio',
  props: {
    game: {
      type: Object,
      default: () => ({}),
    },
  },

  emits: ['close'],

  data() {
    return {
      state: '1',
      lightbox: null,

      ui: {
        showTitle: true,
      },
    }
  },

  computed: {
    ...mapStores(useGameStore, useJournalStore),
    ...mapState(useRepositoryStore, {
      _genres: 'keyedGenres',
    }),

    app() {
      const data = {
        ...this.gameStore.app,
        ...this.game,
      }
      return data
    },

    //+-------------------------------------------------
    // screenshots()
    // Builds an array of screenshots
    // -----
    // Created on Thu Nov 21 2024
    //+-------------------------------------------------
    screenshots() {
      if (!this.app?.screenshots) return []

      return this.app.screenshots.data.map((hash, i) => ({
        id: i,
        width: 1920,
        height: 1080,

        src: this.app.screenshots.base + hash + this.app.screenshots.full,
        full: this.app.screenshots.base + hash + this.app.screenshots.full,
        thumb: this.app.screenshots.base + hash + this.app.screenshots.thumb,
      }))
    },

    genre() {
      if (!this.app.genres) return

      return this._genres[this.app.genres[0]]
    },

    genres() {
      if (!this.app.genres) return

      return this.app.genres
        .map((id) => (this._genres[id] ? this._genres[id].name : undefined))
        .filter(Boolean)
        .join(', ')

      return app.genres.map((id) => this._genres[id]?.name).join(', ')
    },

    //+-------------------------------------------------
    // hltbSource()
    // -----
    // Created on Fri Nov 22 2024
    //+-------------------------------------------------
    hltbSource() {
      if (!this.app?.source?.providers?.hltb) return false

      return 'https://howlongtobeat.com/game/' + this.app.source.providers.hltb
    },
  },

  methods: {
    // async load() {
    //   this.state = 4
    //   this.app = this.game
    //   this.gameStore.load(this.game.uuid)
    //   this.state = 5
    // },

    initLightbox() {
      // debugger
      if (this.lightbox) {
        this.lightbox.destroy()
        this.lightbox = null
      }

      this.lightbox = new this.$PhotoSwipeLightbox({
        // gallery: '#game-gallery',
        // children: 'a',
        dataSource: this.screenshots,
        pswpModule: this.$PhotoSwipe,

        showHideAnimationType: 'zoom',
        bgOpacity: 0.6,
        maxWidth: '90vw',
        maxHeight: '90vh',

        // Add click event handlers
        // showHideOpacity: true,
        tapAction: 'next',
        imageClickAction: 'next',
        closeOnVerticalDrag: true,
        clickToCloseNonZoomable: true,

        // Optional but recommended for better UX
        // preloadFirstSlide: true,
        // arrowPrev: false,
        // arrowNext: false,
        zoom: false,
      })

      const galleryEl = document.querySelector('#game-gallery')

      this.lightbox.addFilter('thumbEl', (thumbEl, data, index) => {
        const el = galleryEl.querySelector('[data-id="' + data.id + '"] img')
        if (el) {
          return el
        }
        return thumbEl
      })

      // This is the placeholder image, used while the image is loading
      // displayed when the user clicks and the image zooms in
      this.lightbox.addFilter('placeholderSrc', (placeholderSrc, slide) => {
        const el = galleryEl.querySelector('[data-id="' + slide.data.id + '"] img')
        if (el) {
          return 'el.src'
        }
        return placeholderSrc
      })

      // this.lightbox.on('uiRegister', function () {
      //   console.warn()
      //   this.ui.registerElement({
      //     name: 'custom-caption',
      //     order: 9,
      //     isButton: false,
      //     appendTo: 'root',
      //     html: 'Caption text',
      //     onInit: (el, pswp) => {
      //       pswp.on('change', () => {
      //         const currSlideElement = pswp.currSlide.data.element
      //         const caption = currSlideElement.getAttribute('data-caption')
      //         el.innerHTML = caption || ''
      //       })
      //     },
      //   })
      // })

      this.lightbox.init()
    },

    init() {
      this.state = 3

      this.$nextTick(() => {
        this.initLightbox()
        // this.getCoverColor()
      })
    },
  },

  mounted() {
    this.state = 2
    this.init()
  },
}
</script>
