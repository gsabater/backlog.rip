<template>
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
  <div class="b-menu dropdown-menu show" style="min-width: 280px; letter-spacing: normal">
    <template v-if="withUser">
      <span class="dropdown-header">
        <span class="text-muted">User</span>
      </span>

      <label
        class="dropdown-item ps-1"
        :class="{ active: f.sortBy == 'user' }"
        @click="sortBy('user')">
        <div class="d-flex justify-center" style="width: 30px">
          <Icon size="16" width="2" class="me-1">User</Icon>
        </div>

        <div class="pe-3">User position</div>
        <tippy
          class="text-muted ms-auto cursor-help ps-4"
          :content="'This is the original order in which the games were added to the list'">
          <Icon width="2" style="background: rgb(0 0 0 / 20%); border-radius: 50%">
            HelpSmall
          </Icon>
        </tippy>
      </label>

      <div class="dropdown-divider"></div>
    </template>

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
        <div v-if="f.sortBy == 'name'" class="text-muted" style="font-size: 0.75rem">
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
        <div v-if="f.sortBy == 'score'" class="text-muted" style="font-size: 0.75rem">
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
      v-if="$app.wip"
      class="dropdown-item ps-1"
      :class="{ active: f.sortBy == 'added' }"
      @click="sortBy('added', 'desc', true)">
      <div class="d-flex justify-center" style="width: 30px">
        <Icon size="16" class="me-1">CalendarDot</Icon>
      </div>
      <div>
        🔸 Date added to your library
        <div v-if="f.sortBy == 'added'" class="text-muted" style="font-size: 0.75rem">
          {{ f.sortDir == 'asc' ? 'Oldest' : 'Newest' }}
          <Icon size="14" width="2" class="mx-1">Repeat</Icon>
        </div>
      </div>
    </label>

    <label
      class="dropdown-item ps-1"
      :class="{ active: f.sortBy == 'released' }"
      @click="sortBy('released', 'desc', true)">
      <div class="d-flex justify-center" style="width: 30px">
        <Icon size="16" class="me-1">CalendarDot</Icon>
      </div>
      <div>
        Release date
        <div v-if="f.sortBy == 'released'" class="text-muted" style="font-size: 0.75rem">
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
        <div v-if="f.sortBy == 'playtime'" class="text-muted" style="font-size: 0.75rem">
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
        <div v-if="f.sortBy == 'hltb'" class="text-muted" style="font-size: 0.75rem">
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
</template>

<script>
/**
 * @file:    \components\search\sortMenu.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 21st October 2024
 * Modified: Wed 30 October 2024 - 15:52:20
 **/

export default {
  name: 'SortMenu',

  props: {
    f: {
      type: Object,
      default: () => ({}),
    },

    withUser: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['sort'],

  data() {
    return {
      ui: {
        dice: 4,
      },
    }
  },

  methods: {
    //+-------------------------------------------------
    // sortBy()
    // Notifies the parent to apply the new sorting
    // -----
    // Created on Tue Oct 22 2024
    //+-------------------------------------------------
    sortBy(by, dir = 'desc', toggle = false) {
      if (by == 'rand') {
        this.ui.dice = Math.floor(Math.random() * 6) + 1
      }

      if (by == 'rand' || by == 'user') {
        dir = null
      }

      this.$emit('sort', {
        by,
        dir,
        toggle,
      })

      // this.$refs.tippySort.hide()
    },
  },

  mounted() {},
}
</script>
