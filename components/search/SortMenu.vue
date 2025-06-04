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

    <!-- <label
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
    </label> -->

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

    <!--
      *+---------------------------------
      *| Median score
      *+--------------------------------- -->
    <label
      class="dropdown-item ps-1"
      :class="{ active: f.sortBy == 'score' }"
      @click="sortBy('score', 'desc', true)">
      <div class="d-flex justify-center" style="width: 30px">
        <Icon size="16" class="me-1">Star</Icon>
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
        :content="'Sorting by median will rank games based on their middle review score when arranged in order. This method avoids being skewed by extreme values, making it a fairer representation of overall sentiment.'">
        <Icon width="2" style="background: rgb(0 0 0 / 20%); border-radius: 50%">
          HelpSmall
        </Icon>
      </tippy>
    </label>

    <!--
      *+---------------------------------
      *| Metacritic score
      *+--------------------------------- -->
    <label
      class="dropdown-item ps-1"
      :class="{
        'active': f.sortBy == 'metascore',
        'disabled cursor-not-allowed': f.source == 'all',
      }"
      @click="sortBy('metascore', 'desc', true)">
      <div class="d-flex justify-center" style="width: 30px">
        <b-logo name="metacritic" size="14" class="me-1" style="opacity: 0.6" />
      </div>
      <div>
        Metacritic
        <small v-if="f.source == 'all'" class="d-block text-muted">
          Not available yet on
          <strong>all games</strong>
        </small>

        <div
          v-else-if="f.sortBy == 'metascore'"
          class="text-muted"
          style="font-size: 0.75rem">
          {{ f.sortDir == 'asc' ? 'Ascending' : 'Descending' }}
          <Icon size="14" width="2" class="mx-1">Repeat</Icon>
        </div>
      </div>
      <tippy
        class="text-muted ms-auto cursor-help ps-4"
        :content="'Sorting by Metacritic will only show games with a known Metacritic score. Not all games in the database have a Metacritic rating.'">
        <Icon width="2" style="background: rgb(0 0 0 / 20%); border-radius: 50%">
          HelpSmall
        </Icon>
      </tippy>
    </label>

    <!--
      *+---------------------------------
      *| Opencritic score
      *+--------------------------------- -->
    <label
      class="dropdown-item ps-1"
      :class="{
        'active': f.sortBy == 'oc',
        'disabled cursor-not-allowed': f.source == 'all',
      }"
      @click="sortBy('oc', 'desc', true)">
      <div class="d-flex justify-center" style="width: 30px">
        <b-logo name="opencritic" size="14" class="me-1" style="opacity: 0.6" />
      </div>
      <div>
        Opencritic
        <small v-if="f.source == 'all'" class="d-block text-muted">
          Not available yet on
          <strong>all games</strong>
        </small>

        <div v-else-if="f.sortBy == 'oc'" class="text-muted" style="font-size: 0.75rem">
          {{ f.sortDir == 'asc' ? 'Ascending' : 'Descending' }}
          <Icon size="14" width="2" class="mx-1">Repeat</Icon>
        </div>
      </div>
      <tippy
        class="text-muted ms-auto cursor-help ps-4"
        :content="'Sorting by OpenCritic will rank games based on their OpenCritic score. Only games with a known OpenCritic rating will be included.'">
        <Icon width="2" style="background: rgb(0 0 0 / 20%); border-radius: 50%">
          HelpSmall
        </Icon>
      </tippy>
    </label>

    <!--
      *+---------------------------------
      *| SteamDB rating
      *+--------------------------------- -->
    <label
      class="dropdown-item ps-1"
      :class="{
        'active': f.sortBy == 'steamdb',
        'disabled cursor-not-allowed': f.source == 'all',
      }"
      @click="sortBy('steamdb', 'desc', true)">
      <div class="d-flex justify-center" style="width: 30px">
        <b-logo color="#fff" name="steamdb" size="14" class="me-1" style="opacity: 0.6" />
      </div>
      <div>
        SteamDB rating
        <small v-if="f.source == 'all'" class="d-block text-muted">
          Not available yet on
          <strong>all games</strong>
        </small>

        <div
          v-else-if="f.sortBy == 'steamdb'"
          class="text-muted"
          style="font-size: 0.75rem">
          {{ f.sortDir == 'asc' ? 'Ascending' : 'Descending' }}
          <Icon size="14" width="2" class="mx-1">Repeat</Icon>
        </div>
      </div>
      <tippy
        class="text-muted ms-auto cursor-help ps-4"
        :content="'Sorting by SteamDB rating will only show games with a known Steam rating. This metric, calculated by SteamDB.info, adjusts a game\'s Steam rating based on the number of reviews it has, making it a more reliable representation of overall player sentiment.'">
        <Icon width="2" style="background: rgb(0 0 0 / 20%); border-radius: 50%">
          HelpSmall
        </Icon>
      </tippy>
    </label>

    <!--
      *+---------------------------------
      *| Scores block
      *+--------------------------------- -->
    <!-- <label
      class="dropdown-item ps-1"
      :class="{
        'active': f.sortBy == 'steamscore',
        'disabled cursor-not-allowed': f.source == 'all',
      }"
      @click="sortBy('steamscore', 'desc', true)">
      <div class="d-flex justify-center" style="width: 30px">
        <b-logo color="#fff" name="steam" size="14" class="me-1" style="opacity: 0.6" />
      </div>
      <div>
        Steam recommendations
        <small v-if="f.source == 'all'" class="d-block text-muted">
          Not available yet on
          <strong>all games</strong>
        </small>

        <div
          v-else-if="f.sortBy == 'steamscore'"
          class="text-muted"
          style="font-size: 0.75rem">
          {{ f.sortDir == 'asc' ? 'Ascending' : 'Descending' }}
          <Icon size="14" width="2" class="mx-1">Repeat</Icon>
        </div>
      </div>
      <tippy
        class="text-muted ms-auto cursor-help ps-4"
        :content="'Sorting by Steam recommendations will show only games with known Steam score. Please note that not all games in the database are linked with Steam.'">
        <Icon width="2" style="background: rgb(0 0 0 / 20%); border-radius: 50%">
          HelpSmall
        </Icon>
      </tippy>
    </label> -->

    <div class="dropdown-divider"></div>

    <span class="dropdown-header">
      <span class="text-muted">By Time</span>
    </span>

    <label
      class="dropdown-item ps-1"
      :class="{ active: f.sortBy == 'date.released' }"
      @click="sortBy('date.released', 'desc', true)">
      <div class="d-flex justify-center" style="width: 30px">
        <Icon size="16" class="me-1">CalendarDot</Icon>
      </div>
      <div>
        Release date
        <div
          v-if="f.sortBy == 'date.released'"
          class="text-muted"
          style="font-size: 0.75rem">
          {{ f.sortDir == 'asc' ? 'Oldest' : 'Newest' }}
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

    <div class="dropdown-divider"></div>

    <span class="dropdown-header">
      <span class="text-muted">Your library</span>
    </span>

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
      :class="{ active: f.sortBy == 'date.lib' }"
      @click="sortBy('date.lib', 'desc', true)">
      <div class="d-flex justify-center" style="width: 30px">
        <Icon size="16" class="me-1">CalendarDot</Icon>
      </div>
      <div>
        Date added to your library
        <div v-if="f.sortBy == 'date.lib'" class="text-muted" style="font-size: 0.75rem">
          {{ f.sortDir == 'asc' ? 'Oldest' : 'Newest' }}
          <Icon size="14" width="2" class="mx-1">Repeat</Icon>
        </div>
      </div>
    </label>

    <label
      class="dropdown-item ps-1"
      :class="{ active: f.sortBy == 'achievements' }"
      @click="sortBy('achievements', 'desc', true)">
      <div class="d-flex justify-center" style="width: 30px">
        <Icon size="16" class="me-1">Trophy</Icon>
      </div>
      <div>
        Achievements
        <div
          v-if="f.sortBy == 'achievements'"
          class="text-muted"
          style="font-size: 0.75rem">
          {{ f.sortDir == 'asc' ? 'Ascending' : 'Descending' }}
          <Icon size="14" width="2" class="mx-1">Repeat</Icon>
        </div>
      </div>
      <tippy
        class="text-muted ms-auto cursor-help ps-4"
        :content="'Games will be sorted by the number of achievements you have unlocked. This metric is only available for games that support Steam achievements.'">
        <Icon width="2" style="background: rgb(0 0 0 / 20%); border-radius: 50%">
          HelpSmall
        </Icon>
      </tippy>
    </label>

    <div
      v-if="!ui.showAdvanced"
      class="dropdown-item small text-muted"
      @click="ui.showAdvanced = true">
      <Icon size="14" class="me-2">Sparkles</Icon>
      Show advanced filters
    </div>
  </div>
</template>

<script>
/**
 * @file:    \components\search\sortMenu.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 21st October 2024
 * Modified: Tue 13 May 2025 - 17:56:25
 **/

export default {
  name: 'SortMenu',

  props: {
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
        showAdvanced: false,
      },
    }
  },

  computed: {
    ...mapState(useSearchStore, ['f']),
  },

  methods: {
    //+-------------------------------------------------
    // sortBy()
    // Notifies the parent to apply the new sorting
    // -----
    // Created on Tue Oct 22 2024
    // Created on Tue Apr 01 2025 - Handles toggle
    //+-------------------------------------------------
    sortBy(by, dir = 'desc', toggle = false) {
      // Handle random sorting
      if (by === 'rand') {
        this.ui.dice = Math.floor(Math.random() * 6) + 1
        dir = null
      }

      // Handle user sorting
      if (by === 'user') {
        dir = null
      }

      // Toggle direction if the same sort field is selected
      if (toggle && by === this.f.sortBy) {
        dir = this.f.sortDir === 'asc' ? 'desc' : 'asc'
      }

      // Emit the sort event with the updated parameters
      this.$emit('sort', { by, dir, toggle })
    },
  },

  mounted() {},
}
</script>
