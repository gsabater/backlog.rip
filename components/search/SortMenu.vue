<template>
  <div class="b-menu dropdown-menu show" style="min-width: 280px; letter-spacing: normal">
    <span class="dropdown-header">
      <span class="text-muted">General sorting</span>
    </span>

    <!-- <label
      class="dropdown-item ps-1"
      :class="{ active: f.sortBy == 'rand' }"
      @click="sortBy('rand')">
      <div class="d-flex justify-center" style="width: 30px">
        <Icon
          name="tabler:dice-5"
          size="16"
          width="2"
          class="me-1"
          :icon="'Dice' + ui.dice" />
      </div>

      <div class="pe-3">Random</div>
      <tippy
        class="text-muted ms-auto cursor-help ps-4"
        :content="'Every click triggers a re-sort!'">
        <Icon
          name="tabler:help-small"
          width="2"
          style="background: rgb(0 0 0 / 20%); border-radius: 50%" />
      </tippy>
    </label> -->

    <label
      v-if="ui.hasNoneOption"
      class="dropdown-item ps-1"
      :class="{ active: f.sortBy == 'none' }"
      @click="sortBy('none')">
      <div class="d-flex justify-center" style="width: 30px">
        <Icon size="16" width="2" class="me-1" name="tabler:circle-dashed" />
      </div>

      <div class="pe-3">Not sorted</div>
      <tippy
        class="text-muted ms-auto cursor-help ps-4"
        :content="'This is the original order in which the games were added to the list'">
        <Icon
          name="tabler:help-small"
          width="2"
          customize="stroke-width='8'"
          style="background: rgb(0 0 0 / 20%); border-radius: 50%" />
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
          :name="
            'tabler:' + (f.sortDir == 'asc' ? 'sort-ascending-letters' : 'sort-descending-letters')
          " />
      </div>
      <div>
        Name
        <div v-if="f.sortBy == 'name'" class="text-muted" style="font-size: 0.75rem">
          {{ f.sortDir == 'asc' ? 'Ascending' : 'Descending' }}
          <Icon name="tabler:repeat" size="14" width="2" class="mx-1" />
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
        <Icon name="tabler:star" size="16" class="me-1" />
      </div>
      <div>
        Median score
        <div v-if="f.sortBy == 'score'" class="text-muted" style="font-size: 0.75rem">
          {{ f.sortDir == 'asc' ? 'Ascending' : 'Descending' }}
          <Icon name="tabler:repeat" size="14" width="2" class="mx-1" />
        </div>
      </div>
      <tippy
        class="text-muted ms-auto cursor-help ps-4"
        :content="'Sorting by median will rank games based on their middle review score when arranged in order. This method avoids being skewed by extreme values, making it a fairer representation of overall sentiment.'">
        <Icon
          name="tabler:help-small"
          width="2"
          style="background: rgb(0 0 0 / 20%); border-radius: 50%" />
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

        <div v-else-if="f.sortBy == 'metascore'" class="text-muted" style="font-size: 0.75rem">
          {{ f.sortDir == 'asc' ? 'Ascending' : 'Descending' }}
          <Icon name="tabler:repeat" size="14" width="2" class="mx-1" />
        </div>
      </div>
      <tippy
        class="text-muted ms-auto cursor-help ps-4"
        :content="'Sorting by Metacritic will only show games with a known Metacritic score. Not all games in the database have a Metacritic rating.'">
        <Icon
          name="tabler:help-small"
          width="2"
          style="background: rgb(0 0 0 / 20%); border-radius: 50%" />
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
          <Icon name="tabler:repeat" size="14" width="2" class="mx-1" />
        </div>
      </div>
      <tippy
        class="text-muted ms-auto cursor-help ps-4"
        :content="'Sorting by OpenCritic will rank games based on their OpenCritic score. Only games with a known OpenCritic rating will be included.'">
        <Icon
          name="tabler:help-small"
          width="2"
          style="background: rgb(0 0 0 / 20%); border-radius: 50%" />
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

        <div v-else-if="f.sortBy == 'steamdb'" class="text-muted" style="font-size: 0.75rem">
          {{ f.sortDir == 'asc' ? 'Ascending' : 'Descending' }}
          <Icon name="tabler:repeat" size="14" width="2" class="mx-1" />
        </div>
      </div>
      <tippy
        class="text-muted ms-auto cursor-help ps-4"
        :content="'Sorting by SteamDB rating will only show games with a known Steam rating. This metric, calculated by SteamDB.info, adjusts a game\'s Steam rating based on the number of reviews it has, making it a more reliable representation of overall player sentiment.'">
        <Icon
          name="tabler:help-small"
          width="2"
          style="background: rgb(0 0 0 / 20%); border-radius: 50%" />
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
          <Icon name="tabler:repeat" size="14" width="2" class="mx-1" />
        </div>
      </div>
      <tippy
        class="text-muted ms-auto cursor-help ps-4"
        :content="'Sorting by Steam recommendations will show only games with known Steam score. Please note that not all games in the database are linked with Steam.'">
        <Icon name="tabler:help-small" width="2" style="background: rgb(0 0 0 / 20%); border-radius: 50%" />
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
        <Icon name="tabler:calendar-dot" size="16" class="me-1" />
      </div>
      <div>
        Release date
        <div v-if="f.sortBy == 'date.released'" class="text-muted" style="font-size: 0.75rem">
          {{ f.sortDir == 'asc' ? 'Oldest' : 'Newest' }}
          <Icon name="tabler:repeat" size="14" width="2" class="mx-1" />
        </div>
      </div>
    </label>

    <label
      class="dropdown-item ps-1"
      :class="{ active: f.sortBy == 'hltb' }"
      @click="sortBy('hltb', 'desc', true)">
      <div class="d-flex justify-center" style="width: 30px">
        <Icon name="tabler:time-duration-30" size="16" class="me-1" />
      </div>
      <div>
        How long to beat
        <div v-if="f.sortBy == 'hltb'" class="text-muted" style="font-size: 0.75rem">
          {{ f.sortDir == 'asc' ? 'Ascending' : 'Descending' }}
          <Icon name="tabler:repeat" size="14" width="2" class="mx-1" />
        </div>
      </div>
      <tippy
        class="text-muted ms-auto cursor-help ps-4"
        :content="'How long to beat is a metric that measures how much time is needed to complete a game. Data provided from howlongtobeat.com'">
        <Icon
          name="tabler:help-small"
          width="2"
          style="background: rgb(0 0 0 / 20%); border-radius: 50%" />
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
        <Icon name="tabler:alarm-average" size="16" class="me-1" />
      </div>
      <div>
        Your playtime
        <div v-if="f.sortBy == 'playtime'" class="text-muted" style="font-size: 0.75rem">
          {{ f.sortDir == 'asc' ? 'Unplayed' : 'Most played' }}
          <Icon name="tabler:repeat" size="14" width="2" class="mx-1" />
        </div>
      </div>
    </label>

    <label
      class="dropdown-item ps-1"
      :class="{ active: f.sortBy == 'date.lib' }"
      @click="sortBy('date.lib', 'desc', true)">
      <div class="d-flex justify-center" style="width: 30px">
        <Icon name="tabler:calendar-dot" size="16" class="me-1" />
      </div>
      <div>
        Date added to your library
        <div v-if="f.sortBy == 'date.lib'" class="text-muted" style="font-size: 0.75rem">
          {{ f.sortDir == 'asc' ? 'Oldest' : 'Newest' }}
          <Icon name="tabler:repeat" size="14" width="2" class="mx-1" />
        </div>
      </div>
    </label>

    <label
      class="dropdown-item ps-1"
      :class="{ active: f.sortBy == 'achievements' }"
      @click="sortBy('achievements', 'desc', true)">
      <div class="d-flex justify-center" style="width: 30px">
        <Icon name="tabler:trophy" size="16" class="me-1" />
      </div>
      <div>
        Achievements
        <div v-if="f.sortBy == 'achievements'" class="text-muted" style="font-size: 0.75rem">
          {{ f.sortDir == 'asc' ? 'Ascending' : 'Descending' }}
          <Icon name="tabler:repeat" size="14" width="2" class="mx-1" />
        </div>
      </div>
      <tippy
        class="text-muted ms-auto cursor-help ps-4"
        :content="'Games will be sorted by the number of achievements you have unlocked. This metric is only available for games that support Steam achievements.'">
        <Icon
          name="tabler:help-small"
          width="2"
          style="background: rgb(0 0 0 / 20%); border-radius: 50%" />
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
 * Modified: 28th January 2026 - 17:56:53
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
        dice: 1,
        hasNoneOption: false,
      },
    }
  },

  watch: {
    'f.sortBy'() {
      this.sortAsNone()
    },
  },

  computed: {
    ...mapState(useSearchStore, ['f']),
  },

  methods: {
    sortAsNone() {
      if (this.f.sortBy !== 'none') return
      this.ui.hasNoneOption = true
    },

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

  mounted() {
    this.sortAsNone()
  },
}
</script>
