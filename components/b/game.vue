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
              <small v-if="visible.includes('released')" class="text-muted me-2">
                {{ app._.released_at ?? '' }}
              </small>

              <small
                v-if="visible.includes('score') && app.score"
                class="text-muted me-2">
                <Icon
                  size="12"
                  width="1.5"
                  style="transform: translateY(-1px); margin-right: 0px">
                  Diamond
                </Icon>
                {{ app.score ?? 'Unscored' }}
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
          'is-disabled': disabled,
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
        <div v-if="visible.length" class="card-game__details">
          <slot name="details:prepend"></slot>

          <span
            v-if="visible.includes('name') || visible.includes('default')"
            class="details__name font-serif d-block text-truncate">
            {{ app.name }}
          </span>

          <small v-if="visible.includes('score') && app.score" class="text-muted me-2">
            <Icon
              note="Diamond?"
              size="13"
              width="1.5"
              style="transform: translateY(-1px); margin-right: 3px">
              Star
            </Icon>
            {{ app.score ?? 'Unscored' }}
          </small>

          <small
            v-if="visible.includes('metascore') && app.scores && app.scores.metascore"
            class="text-muted me-2">
            <b-logo
              name="metacritic"
              size="12"
              style="opacity: 0.6; transform: translateY(-1px); margin-right: 3px" />
            <span v-if="app.scores">
              {{ app.scores.metascore ?? 'Unscored' }}
            </span>
          </small>

          <small
            v-if="visible.includes('oc') && app.scores && app.scores.oc"
            class="text-muted text-capitalize">
            <b-logo
              name="opencritic"
              size="12"
              style="opacity: 0.6; transform: translateY(-1px); margin-right: 3px" />

            {{ app.scores.oc ?? 'Unscored' }}
            <img
              :src="
                'https://backlog.rip/img/scores/' +
                format.scoreToHuman(app.scores.oc, 'oc', 'label') +
                '-head.png'
              "
              class="ms-2"
              style="
                max-width: 14px;
                max-height: 14px;
                transform: translate(-1px, -2px);
              " />
            {{ format.scoreToHuman(app.scores.oc, 'oc', 'label') }}
          </small>

          <small
            v-if="visible.includes('steamscore') && app.scores && app.scores.steamscore"
            class="text-muted">
            <b-logo
              name="steam"
              size="12"
              color="#fff"
              style="opacity: 0.6; transform: translateY(-1px); margin-right: 3px" />

            {{ app.scores.steamscore ?? 'Unscored' }}
          </small>

          <small
            v-if="visible.includes('steamdb') && app.scores && app.scores.steamdb"
            class="d-block text-muted text-truncate">
            <b-logo
              name="steamdb"
              size="12"
              color="#fff"
              style="opacity: 0.6; transform: translateY(-1px); margin-right: 3px" />

            {{ Math.round(app.scores.steamdb) ?? 'Unscored db' }}

            <Icon
              v-if="app.scores.steamCount > 100000"
              v-tippy="
                'This game has ' + format.num(app.scores.steamCount) + ' ratings on Steam'
              "
              class="ms-1"
              width="1"
              size="12">
              Sparkles
            </Icon>
            <Icon
              v-else-if="app.scores.steamCount > 10000"
              v-tippy="
                'This game has ' + format.num(app.scores.steamCount) + ' ratings on Steam'
              "
              class="ms-1"
              width="1"
              size="12">
              Comet
            </Icon>

            {{ app.scores.steamscoreAlt }}
          </small>

          <small v-if="visible.includes('playtime')" class="d-block text-muted">
            <Icon
              size="12"
              width="1.4"
              style="transform: translateY(-1px); margin-right: 3px">
              ClockHour3
            </Icon>
            <template v-if="app._.playtime == 0">Not played</template>
            <template v-else>Played {{ dates.minToHours(app._.playtime) }}</template>
          </small>

          <small
            v-if="visible.includes('released') && app._.released"
            class="d-block text-muted">
            <Icon
              size="12"
              width="1.4"
              style="transform: translateY(-1px); margin-right: 3px">
              Calendar
            </Icon>
            {{ app._.released }}
          </small>

          <small v-if="visible.includes('date.lib')" class="d-block text-muted">
            <Icon
              size="12"
              width="1.4"
              style="transform: translateY(-1px); margin-right: 3px">
              Calendar
            </Icon>
            {{ app._.owned_at }}
          </small>

          <small v-if="visible.includes('genres')" class="d-block text-muted">
            <Icon
              size="12"
              width="1.4"
              style="transform: translateY(-1px); margin-right: 3px">
              Graph
            </Icon>

            <span style="font-size: 0.775rem">
              <template v-if="app.genres && app.genres.length">
                {{ app.genres.map((g) => g).join(', ') }}
              </template>
            </span>
          </small>

          <small
            v-if="visible.includes('hltb') && app.hltb && app.hltb.main"
            class="d-block text-muted">
            <Icon
              size="12"
              width="1.4"
              style="transform: translateY(-1px); margin-right: 3px">
              SquareRoundedCheck
            </Icon>
            {{ dates.minToHours(app.hltb.main / 60) }}
          </small>

          <div
            v-if="visible.includes('achievements') && app._.astats"
            class="d-block text-muted"
            v-tippy="
              app._.astats.hidden
                ? app._.astats.hidden +
                  ' achievements are hidden or marked as bugged. Achievements count is adjusted accordingly'
                : false
            ">
            <Icon
              size="12"
              width="1.4"
              style="transform: translateY(-1px); margin-right: 3px">
              Trophy
            </Icon>
            {{ app._.astats.completed }} / {{ app._.astats.total }} ({{
              app._.astats.percentage
            }}%)
            <small class="cursor-help" v-if="app._.astats.hidden > 0">˟</small>
          </div>

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
 * Modified: Sat 07 June 2025 - 18:58:55
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
    // This uuid is also the API UUID if not local:
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

    // visible
    // Is an array of strings used to specify which
    // components to show. If the value is an empty
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    visible: {
      type: Array,
      default: () => ['default'],
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

      this.$mitt.emit('game:dialog', {
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
    // updateData()
    // Performs a re-load of the data from the store
    // -----
    // Created on Thu Mar 06 2025
    //+-------------------------------------------------
    updateData(payload) {
      this.app = this.dataStore.get(payload.uuid)
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
      if (this.uuid) this.app = this.dataStore.get(this.uuid?.uuid || this.uuid)
      if (this.data?.uuid) this.app = dataService.prepareToData(this.data)
      if (this.tracking) this.initTracking()
    },
  },

  mounted() {
    this.init()

    this.$mitt.on('game:data', (payload) => {
      if (payload.uuid != this.app.uuid) return
      this.updateData(payload)
    })

    this.$mitt.on('state:change', (payload) => {
      if (payload.uuid != this.app.uuid) return

      if (payload.state == 'fav') {
        this.app.is.fav = payload.fav
      } else {
        this.app.state = payload.state
      }

      this.$forceUpdate()
    })

    this.$mitt.on('pinned:change', (payload) => {
      if (payload.uuid != this.app.uuid) return
      this.app.is.pinned = payload.pinned
      this.$forceUpdate()
    })

    this.$mitt.on('data:deleted', (payload) => {
      if (payload.uuid != this.app.uuid) return

      this.app.state = null
      this.app.is.fav = false
      this.app.is.lib = false
      // this.app.is.dirty = false
      this.app.is.pinned = false
      this.app.is.hidden = false

      this.$forceUpdate()
    })
  },

  beforeUnmount() {
    this.$mitt.off('game:data')
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
