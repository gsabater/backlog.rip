<template>
  <tippy
    ref="tippy"
    tag="div"
    content-tag="div"
    :animate-fill="false"
    :interactive="true"
    :interactive-debounce="55"
    animation="shift-away-subtle"
    :duration="[200, 250]"
    placement="right-start"
    follow-cursor="initial"
    trigger="click"
    theme="dropdown"
    :on-hide="hideBackdrop">
    <template #content="{ hide }">
      <!-- <div class="card nope-card-stacked"> -->
      <!-- <button @click="hide()">close</button> -->
      <div
        class="b-menu dropdown-menu show"
        style="overflow: visible; min-width: 240px"
        ntyle="
            display: inline-block;
            width: 100%;
            position: relative;
            top: 0;
            box-shadow: none;
          ">
        <!-- <div class="row m-0 mb-2">
        <div class="text-center p-2 col-6 active">Status</div>
        <div class="text-center p-2 col-6 active">Collections</div>
      </div> -->

        <span class="dropdown-header">{{ app.name }}</span>

        <!--
          *+---------------------------------
          *| States block
          *| Inner dropdown with states
          *+--------------------------------- -->
        <div class="dropdown-item">
          <div class="d-flex nope-justify-content-center" style="width: 30px">
            <span
              v-if="app.state && state"
              class="status-dot status-dot-animated"
              style="margin-left: 5px"
              :style="{ 'background-color': state?.color || 'transparent' }"></span>
            <Icon v-else size="16" width="1" class="text-muted">Background</Icon>
          </div>

          <span>
            {{ app.state && state ? state.name : 'Assign a state' }}
          </span>

          <span class="text-muted ms-auto">
            <Icon size="12">CaretRightFilled</Icon>
          </span>
          <b-dropdown placement="right-start" style="overflow: visible; min-width: 240px">
            <div
              v-for="(state, i) in states"
              :key="'state-' + i"
              class="dropdown-item"
              :class="{ active: app.state == state.id }"
              @click="setState(state)">
              <!-- <div
                v-if="app.state"
                class="selection"
                style="margin-right: 0.55rem; transform: translateY(-1px)">
                <!-- <input
                  type="checkbox"
                  class="form-check-input"
                  style="transform: scale(0.8)" /> - ->
                <Icon v-if="app.state == state.id" style="color: var(--tblr-primary)">
                  SquareCheck
                </Icon>
                <Icon v-else style="color: #666">Square</Icon>
              </div> -->
              <div class="d-flex justify-center" style="width: 30px">
                <span
                  class="status-dot me-2"
                  :style="{ 'background-color': state.color || '' }"
                  :class="{ 'status-dot-animated': app.state == state.id }"></span>
              </div>
              <div>
                {{ state.name }}

                <div
                  v-if="app.state == state.id"
                  class="text-muted"
                  style="font-size: 0.75rem">
                  <span
                    v-if="
                      app && app.is && app.is.state && app.is.state['state_' + state.id]
                    ">
                    {{ dates.timeAgo(app.is.state['state_' + state.id] * 1000) }}
                  </span>

                  <code class="mx-2">
                    <Icon size="10" width="1" class="">ArrowBack</Icon>
                    Undo
                  </code>
                </div>
              </div>

              <tippy class="text-muted ms-auto cursor-help" :content="state.description">
                <span class="form-help">?</span>
              </tippy>

              <!-- <tippy
                class="text-muted ms-auto cursor-help ps-4"
                :content="state.description">
                <Icon width="2" style="background: rgb(0 0 0 / 20%); border-radius: 50%">
                  HelpSmall
                </Icon>
              </tippy> -->
              <!-- <div
                class="content d-flex align-items-center w-100 px-1"
                :class="{ 'control-hover': app.state }">
                <div>
                  <span
                    class="status-dot me-2"
                    :style="{ 'background-color': state.color || '' }"
                    :class="{ 'status-dot-animated': app.state == state.id }"></span>

                  <span class="me-4" nope:class="{ 'hide-hover': app.state == state.id }">
                    {{ state.name }}
                  </span>
                  <small
                    class="d-block text-muted pe-4 me-4"
                    style="margin-left: -2px"
                    v-if="app.state == state.id">
                    <Icon size="12" width="1" style="margin-right: 2px; margin-top: -1px">
                      ToggleLeft
                    </Icon>
                    Click again to reset
                  </small>
                </div>

                <tippy
                  v-if="state.description"
                  class="text-muted ms-auto ms-1 cursor-help"
                  :content="state.description">
                  <span class="form-help">?</span>
                </tippy>
              </div> -->
            </div>
          </b-dropdown>
        </div>

        <!--
          *+---------------------------------
          *| Lists block
          *| Inner dropdown with lists
          *+--------------------------------- -->
        <div class="dropdown-item">
          <div class="d-flex nope-justify-content-center" style="width: 30px">
            <Icon size="18" width="1" class="text-muted">Books</Icon>
          </div>

          <span>Add to a list</span>

          <span class="text-muted ms-auto">
            <Icon size="12">CaretRightFilled</Icon>
          </span>
          <b-dropdown placement="right-start" style="overflow: visible; min-width: 240px">
            <div class="dropdown-item" @click="createList">
              <div class="d-flex nope-justify-content-center" style="width: 30px">
                <Icon size="17" width="1.5" class="text-muted">SquareRoundedPlus</Icon>
              </div>

              <span>Create a new list</span>
            </div>
            <div class="dropdown-divider"></div>
            <div
              v-for="(list, i) in lists"
              :key="'list-' + i"
              class="dropdown-item control-hover"
              @click="modifyList(list, app)">
              <!-- <div
                v-if="app.state"
                class="selection"
                style="margin-right: 0.55rem; transform: translateY(-1px)">
                <!-- <input
                  type="checkbox"
                  class="form-check-input"
                  style="transform: scale(0.8)" /> - ->
                <Icon v-if="app.state == state.id" style="color: var(--tblr-primary)">
                  SquareCheck
                </Icon>
                <Icon v-else style="color: #666">Square</Icon>
              </div> -->

              <div class="d-flex" style="width: 30px">
                <Icon size="17" width="1.5" class="text-muted">Mist</Icon>
              </div>

              <div class="me-1">
                {{ list.name }}
              </div>

              <template v-if="listHasApp(list, app)">
                <small
                  class="text-muted ms-auto hide-hover text-end"
                  style="min-width: 40px">
                  <Icon size="12" width="1">Check</Icon>
                  Added
                </small>
                <small
                  class="text-muted ms-auto show-hover text-end"
                  style="min-width: 40px">
                  Remove
                </small>
              </template>

              <template v-else>
                <small
                  class="text-muted ms-auto hide-hover text-end"
                  style="min-width: 40px">
                  {{ list.games?.length || 0 }}
                </small>
                <small
                  class="text-muted ms-auto show-hover text-end"
                  style="min-width: 40px">
                  Add
                </small>
              </template>

              <!-- <tippy
                class="text-muted ms-auto cursor-help ps-4"
                :content="state.description">
                <Icon width="2" style="background: rgb(0 0 0 / 20%); border-radius: 50%">
                  HelpSmall
                </Icon>
              </tippy> -->
              <!-- <div
                class="content d-flex align-items-center w-100 px-1"
                :class="{ 'control-hover': app.state }">
                <div>
                  <span
                    class="status-dot me-2"
                    :style="{ 'background-color': state.color || '' }"
                    :class="{ 'status-dot-animated': app.state == state.id }"></span>

                  <span class="me-4" nope:class="{ 'hide-hover': app.state == state.id }">
                    {{ state.name }}
                  </span>
                  <small
                    class="d-block text-muted pe-4 me-4"
                    style="margin-left: -2px"
                    v-if="app.state == state.id">
                    <Icon size="12" width="1" style="margin-right: 2px; margin-top: -1px">
                      ToggleLeft
                    </Icon>
                    Click again to reset
                  </small>
                </div>

                <tippy
                  v-if="state.description"
                  class="text-muted ms-auto ms-1 cursor-help"
                  :content="state.description">
                  <span class="form-help">?</span>
                </tippy>
              </div> -->
            </div>
          </b-dropdown>
        </div>

        <div class="dropdown-divider"></div>

        <!--
          *+---------------------------------
          *| Add to library
          *| Click to add a game to library
          *+--------------------------------- -->
        <div v-if="!app.is || !app.is.lib" @click="addToLibrary" class="dropdown-item">
          <div class="d-flex nope-justify-content-center" style="width: 30px">
            <Icon size="17" width="1.5" class="text-muted">SquareRoundedPlus</Icon>
          </div>

          <span>Add to your library</span>
          <!-- <tippy
            :allow-h-t-m-l="true"
            class="text-muted ms-auto cursor-help"
            content="Adding a game to your library will include it in your games list">
            <span class="form-help">?</span>
          </tippy> -->
        </div>

        <!--
          *+---------------------------------
          *| Favorite
          *| Simple item with fav option
          *+--------------------------------- -->
        <div @click="setState({ id: 'fav' })" class="dropdown-item">
          <template v-if="app.is && app.is.fav">
            <div class="d-flex nope-justify-content-center" style="width: 30px">
              <Icon
                size="17"
                width="1.5"
                style="
                  color: red;
                  fill: #ff000094;
                  filter: drop-shadow(1px 1px 6px #00000069);
                ">
                Heart
              </Icon>
            </div>
            <span>No longer favorite</span>
          </template>

          <template v-else>
            <div class="d-flex nope-justify-content-center" style="width: 30px">
              <Icon size="17" width="1.5" class="text-muted">Heart</Icon>
              <!-- <Icon size="17" width="1.5" class="text-muted">BookmarkPlus</Icon> -->
            </div>

            <span>Add to favorites</span>
            <tippy
              :allow-h-t-m-l="true"
              class="text-muted ms-auto cursor-help"
              content="Add this game to your favorites list. Marking as favorite will also add the game to your library">
              <span class="form-help">?</span>
            </tippy>
          </template>
        </div>

        <!--
          *+---------------------------------
          *| Pinned
          *| Simple item with pin option
          *+--------------------------------- -->
        <div @click="setState({ id: 'pinned' })" class="dropdown-item">
          <template v-if="app.is && app.is.pinned">
            <div class="d-flex nope-justify-content-center" style="width: 30px">
              <Icon
                size="17"
                width="1.5"
                style="
                  fill: #1f4112d9 !important;
                  filter: drop-shadow(rgba(0, 0, 0, 0.41) 1px 1px 6px);
                  stroke: #0b651c;
                ">
                BookmarkFilled
              </Icon>
            </div>
            <span>Unpin</span>
          </template>

          <template v-else>
            <div class="d-flex nope-justify-content-center" style="width: 30px">
              <Icon size="17" width="1.5" class="text-muted">BookmarkPlus</Icon>
            </div>

            <span>Pin this</span>
          </template>

          <tippy
            :allow-h-t-m-l="true"
            class="text-muted ms-auto cursor-help"
            content="Add this game to a special list for quick access ~ This does not add the game to your library">
            <span class="form-help">?</span>
          </tippy>
        </div>

        <!--
          *+---------------------------------
          *| Hide
          *| Click to hide a game
          *+--------------------------------- -->
        <div class="dropdown-divider"></div>

        <div @click="setState({ id: 'hidden' })" class="dropdown-item">
          <template v-if="app.is && app.is.hidden">
            <div class="d-flex nope-justify-content-center" style="width: 30px">
              <Icon size="17" width="1.5">Restore</Icon>
            </div>
            <span class="me-3">Restore visibility</span>
          </template>

          <template v-else>
            <div class="d-flex nope-justify-content-center" style="width: 30px">
              <Icon size="17" width="1.5" class="text-muted">Cancel</Icon>
            </div>

            <span>Hide this game</span>
          </template>

          <tippy
            :allow-h-t-m-l="true"
            class="text-muted ms-auto cursor-help"
            content="Hidden games will not be displayed in any list or search result ~ Those games are still part of your library, just hidden">
            <span class="form-help">?</span>
          </tippy>
        </div>

        <!--
          *+---------------------------------
          *| Delete this
          *| Simple item
          *+--------------------------------- -->
        <template v-if="app.is && app.is.lib">
          <div class="dropdown-item" @click="deleteme">
            <div class="d-flex nope-justify-content-center" style="width: 30px">
              <Icon size="17" width="1.5" class="text-muted">PlaylistX</Icon>
            </div>

            <span>Remove from library</span>

            <tippy
              :allow-h-t-m-l="true"
              class="text-muted ms-auto cursor-help"
              content="Delete this game from your library.<br>You might want to do it to fix duplicates or errors">
              <span class="form-help">?</span>
            </tippy>
          </div>
        </template>

        <template v-if="$app.dev">
          <!--
          *+---------------------------------
          *| DEV
          *| xxx
          *+--------------------------------- -->
          <div class="dropdown-item">
            <div class="d-flex nope-justify-content-center" style="width: 30px">
              <Icon size="17" width="1.5" class="text-muted">Code</Icon>
            </div>

            <span>Debug</span>

            <span class="text-muted ms-auto">
              <Icon size="12">CaretRightFilled</Icon>
            </span>
            <b-dropdown placement="right-start">
              <div
                class="d-flex"
                style="flex-direction: column; text-align: center; align-items: center">
                <h4>{{ app.name }}</h4>
                <h5>{{ appUUID }}</h5>
                <pre style="text-align: left; max-width: 100%">{{ app }}</pre>
              </div>
            </b-dropdown>
          </div>

          <div class="dropdown-item" v-if="!ui.isRightClick">
            <div class="d-flex nope-justify-content-center" style="width: 30px">
              <Icon size="17" class="text-muted">Mouse</Icon>
            </div>

            <div>
              <span href="javascript:void(0)" class="dropdown-header p-0">
                Did you know?
              </span>
              <small class="d-block text-secondary">
                Open this menu with right click on the game
              </small>
            </div>
          </div>

          <!-- <div class="dropdown-item">
            <div class="d-flex align-items-center">
              <div
                class="avatar avatar-sm rounded-circle bg-green-lt"
                style="--tblr-bg-opacity: 0.3">
                <Icon size="17" width="1.2">MouseFilled</Icon>
              </div>
              <div class="ms-3">
                <a href="javascript:void(0)" class="text-body">Did you know?</a>
                <small class="d-block text-secondary">
                  you can open this menu with right click
                </small>
              </div>
            </div>
          </div> -->
        </template>
      </div>
    </template>
  </tippy>

  <!-- <div
    v-if="ui.show"
    class="card nope-card-stacked"
    style="position: fixed; z-index: 9999"
    :style="{ top: ui.top, left: ui.left }">
    <div
      class="dropdown-menu"
      style="
        display: inline-block;
        width: 100%;
        position: relative;
        top: 0;
        box-shadow: none;
      ">
      <div class="row m-0 mb-2">
        <div class="text-center p-2 col-6 active">Status</div>
        <div class="text-center p-2 col-6 active">Collections</div>
      </div>
      <div class="dropdown-item">
        {{ appUUID }}
      </div>
      <label
        v-for="(state, i) in states"
        :key="'state' + i"
        class="dropdown-item"
        @click="setState(state)">
        <div class="d-flex justify-center" style="width: 30px">
          <Icon v-if="isFav(state.name)" style="color: red; fill: pink">Heart</Icon>
          <span
            v-else
            class="badge"
            :style="{ 'background-color': state.color || '' }"></span>
        </div>

        <span class="pe-3">
          {{ state.name }}
        </span>
        <tippy class="text-muted ms-auto cursor-help" :content="state.description">
          <Icon>HelpCircleFilled</Icon>
        </tippy>
        <span class="badge bg-primary text-primary-fg ms-auto">12</span>
      </label>
    </div>
  </div> -->
  <div
    v-if="ui.backdrop"
    class="dropdown-control"
    style="
      background-color: rgba(0, 0, 0, 0.7);
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0px;
      left: 0px;
      z-index: 9998;
      backdrop-filter: blur(0.5px);
    "
    click="hide"></div>

  <!-- prettier-ignore-start -->
  <!-- prettier-ignore-end -->

  <component :is="'style'" id="dynamic-state-vars" type="text/css">
    <template v-for="(state, i) in states" :key="'state' + i">
      --bckg-state-{{ state.id }}: {{ state.color }};
    </template>
  </component>
  <component :is="'style'" id="dynamic-states" type="text/css">
    <template v-for="(state, i) in states" :key="'state' + i">
      .bckg-state-{{ state.id }}{ color: {{ state.color }}; }
    </template>
  </component>
</template>

<script>
/**
 * @file:    \components\b\stateMenu.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 29th November 2023
 * Modified: Wed 30 October 2024 - 17:53:16
 **/

export default {
  name: 'GameRightMenu',
  props: {},

  data() {
    return {
      appUUID: null,
      app: {},

      ui: {
        backdrop: false,
        isRightClick: false,
      },
    }
  },

  computed: {
    ...mapStores(useDataStore, useStateStore, useGameStore, useListStore),
    ...mapState(useStateStore, ['states']),
    ...mapState(useListStore, ['lists']),

    // state() {
    //   return this.states.find((state) => state.id == this.app.state)
    // },
  },

  methods: {
    //+-------------------------------------------------
    // function()
    // Displays the component on event position
    // -----
    // Created on Thu Jan 04 2024
    // Updated on Tue Feb 06 2024 - move logic to tippy
    //+-------------------------------------------------
    show(event, app) {
      this.$refs.tippy.setProps({
        appendTo: () => document.body,

        getReferenceClientRect: () => ({
          width: 0,
          height: 0,
          top: event.clientY,
          bottom: event.clientY,
          left: event.clientX,
          right: event.clientX,
        }),

        // popperOptions: {
        //   strategy: 'fixed',
        // },
      })

      this.appUUID = app
      this.app = this.dataStore.get(app)
      this.ui.backdrop = true
      this.ui.isRightClick = event.button !== 0 || event.type == 'contextmenu'

      this.$refs.tippy.show()
    },

    hide() {
      this.ui.backdrop = false
      this.$refs.tippy.hide()
    },

    hideBackdrop() {
      this.ui.backdrop = false
    },

    //+-------------------------------------------------
    // addToLibrary()
    // Adds a game to the user library
    // NOTE: There should be a method in dataStore that does this
    // -----
    // Created on Tue Jul 23 2024
    //+-------------------------------------------------
    addToLibrary() {
      let app = { ...this.app }
      app.is.lib = dates.stamp()
      app.is.dirty = true

      this.gameStore.update(this.appUUID, { ...app })
      this.$nuxt.$toast.success(app.name + ' has been added to your library')

      this.hide()
    },

    //+-------------------------------------------------
    // modifyList()
    // Modifies a list and adds or removes an item from it
    // -----
    // Created on Thu Oct 24 2024
    //+-------------------------------------------------
    async modifyList(list, app) {
      await this.listStore.modify(list.uuid, app)
      this.$nuxt.$toast.success(`${app.name} has been added to ${list.name}`)

      this.hide()
    },

    //+-------------------------------------------------
    // listHasApp()
    // Looks if a list has an app
    // -----
    // Created on Fri Oct 25 2024
    //+-------------------------------------------------
    listHasApp(list, app) {
      return this.listStore.hasApp(list, app)
    },

    //+-------------------------------------------------
    // createList()
    // Creates a new list
    // -----
    // Created on Thu Sep 19 2024
    //+-------------------------------------------------
    createList() {
      let app = { ...this.app }
      this.$mitt.emit('list:create')

      this.hide()
    },

    //+-------------------------------------------------
    // setState()
    // Change state on item
    // -----
    // Created on Sat Jan 06 2024
    //+-------------------------------------------------
    setState(state) {
      this.value = state?.id || null
      this.stateStore.set(this.appUUID, state.id)

      this.hide()
    },

    deleteme() {
      this.dataStore.delete(this.appUUID)
      this.hide()
    },

    init() {},
  },

  mounted() {
    this.init()

    this.$mitt.on('game:manager', (payload) => {
      this.show(payload.$ev, payload.app)
    })
  },
}
</script>
