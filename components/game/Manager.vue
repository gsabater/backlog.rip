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
          <div style="width: 30px">
            <Icon size="18" class="text-muted" width="1.5">Background</Icon>
          </div>

          <span>Assign a state</span>

          <span class="text-muted ms-auto">
            <Icon size="14">CaretRightFilled</Icon>
          </span>
          <b-dropdown placement="right-start" style="overflow: visible; min-width: 240px">
            <div
              v-for="(state, i) in states"
              :key="'state' + i"
              class="dropdown-item px-2"
              :class="{ active: app.state == state.id }"
              @click="setState(state)">
              <div
                v-if="app.state"
                class="selection"
                style="margin-right: 0.55rem; transform: translateY(-1px)">
                <!-- <input
                  type="checkbox"
                  class="form-check-input"
                  style="transform: scale(0.8)" /> -->
                <Icon v-if="app.state == state.id" style="color: var(--tblr-primary)">
                  SquareCheck
                </Icon>
                <Icon v-else style="color: #666">Square</Icon>
              </div>
              <div class="content d-flex align-items-center w-100 px-1">
                <span
                  class="status-dot me-2"
                  :style="{ 'background-color': state.color || '' }"
                  :class="{ 'status-dot-animated': app.state == state.id }"></span>

                <span class="me-4">
                  {{ state.name }}
                </span>

                <tippy
                  class="text-muted ms-auto ms-1 cursor-help"
                  :content="state.description">
                  <span class="form-help">?</span>
                </tippy>
              </div>
            </div>
          </b-dropdown>
        </div>

        <!--
          *+---------------------------------
          *| Add to library
          *| Click to add a game to library
          *+--------------------------------- -->
        <div v-if="!app.is || !app.is.lib" @click="addToLibrary" class="dropdown-item">
          <div class="d-flex" style="width: 30px">
            <Icon size="18" class="text-muted" width="1.5">SquareRoundedPlus</Icon>
          </div>

          <span>Add to your library</span>
          <tippy
            :allow-h-t-m-l="true"
            class="text-muted ms-auto cursor-help"
            content="Adding a game to your library will include it in your games collection">
            <span class="form-help">?</span>
          </tippy>
        </div>

        <!--
          *+---------------------------------
          *| Favorite
          *| Simple item with fav option
          *+--------------------------------- -->
        <div @click="setState({ id: 'fav' })" class="dropdown-item">
          <template v-if="app.is && app.is.fav">
            <div class="d-flex" style="width: 30px">
              <Icon size="18" width="1.5" style="color: red; fill: pink">Heart</Icon>
            </div>
            <span>Remove favorite</span>
          </template>

          <template v-else>
            <div class="d-flex" style="width: 30px">
              <Icon size="18" width="1.5" class="text-muted">Heart</Icon>
              <!-- <Icon size="18" width="1.5" class="text-muted">BookmarkPlus</Icon> -->
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
            <div class="d-flex" style="width: 30px">
              <Icon size="18" width="1.5" class="text-green">BookmarkFilled</Icon>
            </div>
            <span>Unpin</span>
          </template>

          <template v-else>
            <div class="d-flex" style="width: 30px">
              <Icon size="18" width="1.5" class="text-muted">BookmarkPlus</Icon>
            </div>

            <span>Pin this</span>
          </template>

          <tippy
            :allow-h-t-m-l="true"
            class="text-muted ms-auto cursor-help"
            content="Add this game to a special list for quick access. This does not add the game to your library">
            <span class="form-help">?</span>
          </tippy>
        </div>

        <!--
          *+---------------------------------
          *| Hide
          *| Click to hide a game
          *+--------------------------------- -->
        <div class="dropdown-divider"></div>
        <div
          v-if="app.is && !app.is.hidden"
          @click="setState({ id: 'hidden' })"
          class="dropdown-item">
          <div class="d-flex" style="width: 30px">
            <Icon size="18" class="text-muted" width="1.5">Cancel</Icon>
          </div>

          <span>Hide this game</span>
          <tippy
            :allow-h-t-m-l="true"
            class="text-muted ms-auto cursor-help"
            content="Hidden games will not be displayed in any list or search result.<br>Use this to hide games you don't want to see">
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
            <div class="d-flex" style="width: 30px">
              <Icon size="18" class="text-muted" width="2">PlaylistX</Icon>
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
            <div style="width: 30px">
              <Icon size="18" class="text-muted" width="2">Code</Icon>
            </div>

            <span>Debug</span>

            <span class="text-muted ms-auto">
              <Icon size="14">CaretRightFilled</Icon>
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
        class="dropdown-item ps-1"
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
 * Modified: 24 July 2024 - 12:06:25
 **/

export default {
  name: 'GameRightMenu',
  props: {},

  data() {
    return {
      appUUID: null,
      app: {},

      ui: {
        top: '0px',
        left: '0px',
        backdrop: false,
      },
    }
  },

  computed: {
    ...mapStores(useDataStore, useStateStore, useGameStore),
    ...mapState(useStateStore, ['states']),
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

    // onChange() {
    //   // console.warn('onChange', value, this.modelValue)
    //   this.$emit('change', this.value)
    //   this.$emit('update:modelValue', this.value)
    //   if (this.value == null) this.$emit('clear', null)
    // },

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
