<template>
  <div
    v-if="app && app.uuid"
    class="card-game"
    nope-class="app.state ? 'has-state' + app.state : ''"
    :uuid="app.uuid">
    <div class="card-game__cover" @click.stop="showGameModal">
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
          :app="app.uuid"
          :state="app.state"
          :label="false"
          :fav="app.is.fav"
          :pinned="app.is.pinned"
          :hidden="app.is.hidden"></BState>
        <game-asset
          ref="cover"
          :app="app"
          asset="cover"
          fallback="banner"
          :priority="['steam', 'igdb']"></game-asset>
      </template>
    </div>

    <div v-if="body" class="card-game__details">
      <span
        v-if="body.includes('name') || body.includes('default')"
        class="details__name font-serif d-block">
        {{ app.name }}
      </span>

      <small
        v-if="body.includes('score') && app.score"
        class="details__secondary text-muted">
        <Icon
          size="12"
          width="1.8"
          style="transform: translateY(-1px); margin-right: 3px">
          Universe
        </Icon>
        {{ app.score ?? 'Unscored' }}
        <template v-if="$app.dev">-- {{ app._.score }}</template>
      </small>

      <small
        v-if="body.includes('released')"
        class="d-block details__secondary text-muted">
        <Icon
          size="12"
          width="1.8"
          style="transform: translateY(-1px); margin-right: 3px">
          Calendar
        </Icon>
        {{ app._.released_at }}
      </small>

      <small
        v-if="body.includes('playtime')"
        class="d-block details__secondary text-muted">
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
        v-if="body.includes('hltb') && app.hltb && app.hltb.main"
        class="d-block details__secondary text-muted">
        <Icon
          size="12"
          width="1.8"
          style="transform: translateY(-1px); margin-right: 3px">
          SquareRoundedCheck
        </Icon>
        {{ dates.minToHours(app.hltb.main / 60) }}
      </small>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \components\b\game.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th November 2023
 * Modified: Wed 11 September 2024 - 17:45:38
 **/

export default {
  name: 'Game',
  props: {
    uuid: {
      type: [String, Object],
      default: null,
    },

    body: {
      type: [Array, Boolean],
      default: false,
    },
  },

  data() {
    return {
      app: {},
    }
  },

  computed: {
    ...mapStores(useDataStore),
  },

  methods: {
    showGameModal() {
      this.$mitt.emit('game:modal', {
        uuid: this.app.uuid,
        $list: this.$parent,
      })
    },

    manage($event) {
      this.$mitt.emit('game:manager', $event, this.app.uuid)
    },

    async getData() {
      this.app = this.dataStore.get(this.uuid?.uuid || this.uuid)
    },
  },

  mounted() {
    this.getData()

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
  },
}
</script>
