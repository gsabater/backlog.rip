<template>
  <slot>
    <!--
      *+---------------------------------
      *| Card type list
      *| Displays a list to be used with .list-group
      *+--------------------------------- -->
    <div
      v-if="type == 'list'"
      v-bind="$attrs"
      class="list-group-item text-decoration-none game game--list"
      @click.stop="handleAction">
      <div class="row align-items-center">
        <slot name="game:prepend"></slot>
        <div class="col-auto text-secondary">
          <div class="game__cover">
            <game-asset
              :app="app"
              asset="banner"
              fallback="cover"
              :priority="['steam', 'igdb']" />
          </div>
        </div>
        <div class="col">
          <span class="font-serif">{{ app.name }}</span>
          <div class="v-list-item-subtitle">
            <slot name="details">
              <small v-if="display.includes('released')" class="text-muted me-2">
                {{ app._.released_at ?? '' }}
              </small>

              <small
                v-if="display.includes('score') && app.score"
                class="text-muted me-2">
                <Icon
                  size="12"
                  width="1.5"
                  style="transform: translateY(-1px); margin-right: 0px">
                  Diamond
                </Icon>
                {{ app.score ?? 'Unscored' }}
                <!-- <template v-if="$app.dev">-- {{ app._.score }}</template> -->
              </small>
            </slot>
          </div>
        </div>

        <slot name="actions"></slot>

        <!-- <div class="col-auto text-secondary">
            <v-btn variant="tonal" icon="mdi-chevron-right" size="small">
              <Icon>ChevronRight</Icon>
            </v-btn>
          </div> -->
      </div>
    </div>

    <!--
      *+---------------------------------
      *| Card type card
      *| A card to be used in a row with cols
      *+--------------------------------- -->
    <div
      v-if="type == 'card'"
      v-bind="$attrs"
      ref="card"
      class="card-game"
      :uuid="app.uuid"
      :class="[
        app.state ? 'is-state_' + app.state : '',
        {
          'is-bordered': $auth.config.game_state_borders,
          'is-tracking': tracking,
        },
      ]">
      <slot name="game:prepend"></slot>

      <a :href="gameURL" class="card-game__cover" @click.prevent.stop="handleAction">
        <div
          v-if="app.error"
          style="
            color: rgba(152, 75, 75, 0.716);
            font-size: 1rem;
            text-align: center;
            z-index: 666;
          ">
          {{ app.error }}
        </div>
        <template v-else>
          <BState
            v-if="!disabled"
            :app="app.uuid"
            :state="app.state"
            :label="false"
            :fav="app.is?.fav || false"
            :pinned="app.is?.pinned || false"
            :hidden="app.is?.hidden || false" />
          <game-asset
            ref="cover"
            :app="app"
            asset="cover"
            fallback="banner"
            :priority="['steam', 'igdb']" />
        </template>
      </a>

      <slot name="game:details">
        <div v-if="display.length" class="card-game__details">
          <slot name="details:prepend"></slot>

          <span
            v-if="display.includes('name') || display.includes('*')"
            class="details__name font-serif d-block">
            {{ app.name }}
          </span>

          <small v-if="display.includes('score') && app.score" class="text-muted">
            <Icon
              size="13"
              width="1.5"
              style="transform: translateY(-1px); margin-right: 3px">
              Diamond
            </Icon>
            {{ app.score ?? 'Unscored' }}
            <template v-if="$app.dev">-- {{ app._.score }}</template>
          </small>

          <small v-if="display.includes('released')" class="d-block text-muted">
            <Icon
              size="12"
              width="1.8"
              style="transform: translateY(-1px); margin-right: 3px">
              Calendar
            </Icon>
            {{ app._.released_at }}
          </small>

          <small v-if="display.includes('playtime')" class="d-block text-muted">
            <Icon
              size="12"
              width="1.8"
              style="transform: translateY(-1px); margin-right: 3px">
              ClockHour3
            </Icon>

            <span style="font-size: 0.775rem">
              <template v-if="app._.playtime == 0">Not played</template>
              <template v-else>
                Played
                {{ dates.minToHours(app._.playtime, 'Not played') }}
                <!-- {{ dates.timeAgo(app.playtime.steam_last * 1000) }} -->
              </template>
            </span>
          </small>

          <small
            v-if="display.includes('hltb') && app.hltb && app.hltb.main"
            class="d-block text-muted">
            <Icon
              size="12"
              width="1.8"
              style="transform: translateY(-1px); margin-right: 3px">
              SquareRoundedCheck
            </Icon>
            {{ dates.minToHours(app.hltb.main / 60) }}
          </small>
          <slot name="details:append"></slot>
        </div>
      </slot>
    </div>
  </slot>
</template>

<script>
/**
 * @file:    \components\b\game.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th November 2023
 * Modified: Sat 23 November 2024 - 15:16:46
 **/

export default {
  name: 'GameCard',
  props: {
    // type
    // Defines the general layout of the item
    // Values: card, list, table
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    type: {
      type: String,
      default: 'card',
    },

    // uuid
    // Used to locate the app in $data
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    uuid: {
      type: [String, Object],
      default: null,
    },

    api: {
      type: [String],
      default: null,
    },

    // data
    // Uses the object as the app data
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    data: {
      type: Object,
      default: null,
    },

    body: {
      type: [Array, Boolean],
      default: false,
    },

    tracking: {
      type: [Boolean, Number],
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    action: {
      type: [String, Function],
      default: 'default',
    },

    // display
    // Is an array of strings used to specify which
    // components to show. If the value is an empty
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    display: {
      type: Array,
      default: () => ['*'],
    },
  },

  data() {
    return {
      app: {
        _: {},
        is: {},
        id: {},
      },

      animationFrame: null,
    }
  },

  computed: {
    ...mapStores(useDataStore),

    gameURL() {
      return this.app.slug ? `/game/${this.app.slug}` : 'javascript:void(0)'
    },
  },

  watch: {
    '$app.ready': function () {
      this.init()
    },
  },

  methods: {
    show(slot) {
      return this.display.includes('*') || this.display.includes(slot)
    },

    //+-------------------------------------------------
    // handleAction()
    //
    // -----
    // Updated on Wed Nov 06 2024 - Defined custom action
    //+-------------------------------------------------
    handleAction() {
      if (this.disabled || !this.action) return

      if (typeof this.action === 'function') {
        this.action(this.app)
        return
      }

      this.$mitt.emit('game:modal', {
        uuid: this.app.uuid,
        $list: this.$parent,
      })
    },

    manager($event) {
      if (this.disabled) return
      this.$mitt.emit('game:manager', $event, this.app.uuid)
    },

    loadApiData() {
      console.warn('Loading API for ', this.api)

      // make an api call
    },

    //+-------------------------------------------------
    // initTracking()
    // Appends a mouse event listener to the card
    // -----
    // Created on Tue Sep 24 2024
    //+-------------------------------------------------
    initTracking() {
      const el = this.$refs.card
      if (!el) return

      el.addEventListener('mousemove', this.onMouseUpdate)
      el.addEventListener('mouseenter', this.onMouseUpdate)
      el.addEventListener('mouseleave', this.resetProps)
    },

    //+-------------------------------------------------
    // setProp()
    // Sets the CSS values to the card
    // -----
    // Created on Tue Sep 24 2024
    //+-------------------------------------------------
    setProp(el, prop, value) {
      el.style.setProperty(prop, value)
    },

    //+-------------------------------------------------
    // onMouseUpdate()
    // Updates the CSS values to the card
    // -----
    // Created on Tue Sep 24 2024
    //+-------------------------------------------------
    onMouseUpdate(e) {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame)
      }
      this.animationFrame = requestAnimationFrame(() => {
        const el = this.$refs.card
        const width = el.offsetWidth
        const XRel = e.pageX - el.offsetLeft
        const YRel = e.pageY - el.offsetTop

        const strength = typeof this.tracking == 'number' ? this.tracking : 4

        const YAngle = -(0.5 - XRel / width) * strength
        const XAngle = (0.5 - YRel / width) * strength

        this.setProp(el, '--dy', `${YAngle}deg`)
        this.setProp(el, '--dx', `${XAngle}deg`)
      })
    },

    resetProps() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame)
        this.animationFrame = null
      }
      const el = this.$refs.card
      el.style.setProperty('--dy', '0')
      el.style.setProperty('--dx', '0')
    },

    //+-------------------------------------------------
    // init()
    // Loads data from dataStore and sets to this.app
    // -----
    // Created on Nov 16 2023
    // Updated on Tue Sep 24 2024 - Added data and api props
    //+-------------------------------------------------
    async init() {
      if (!this.$app.ready) return

      if (this.api) this.loadApiData()
      if (this.data) this.app = this.dataStore.prepareToData(this.data)
      if (this.uuid) this.app = this.dataStore.get(this.uuid?.uuid || this.uuid)

      if (this.tracking) this.initTracking()
    },
  },

  mounted() {
    this.init()

    this.$mitt.on('state:change', (payload) => {
      if (payload.uuid != this.app.uuid) return
      this.app.state = payload.state
      this.$forceUpdate()
    })

    this.$mitt.on('pinned:change', (payload) => {
      if (payload.uuid != this.app.uuid) return
      this.app.is.pinned = payload.pinned
      this.$forceUpdate()
    })

    this.$mitt.on('fav:change', (payload) => {
      if (payload.uuid != this.app.uuid) return
      this.app.is.fav = payload.fav
      this.$forceUpdate()
    })

    this.$mitt.on('data:deleted', (payload) => {
      if (payload.uuid != this.app.uuid) return

      this.app.state = null
      this.app.is.fav = false
      this.app.is.lib = false
      this.app.is.dirty = false
      this.app.is.pinned = false
      this.app.is.hidden = false

      this.$forceUpdate()
    })
  },

  beforeUnmount() {
    this.$mitt.off('fav:change')
    this.$mitt.off('data:deleted')
    this.$mitt.off('state:change')
    this.$mitt.off('pinned:change')

    const el = this.$refs.card
    if (!el) return

    el.removeEventListener('mousemove', this.onMouseUpdate)
    el.removeEventListener('mouseenter', this.onMouseUpdate)
    el.removeEventListener('mouseleave', this.resetProps)
  },
}
</script>
