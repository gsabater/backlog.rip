<template>
  <div class="page-body">
    <div class="container-xl">
      <div class="row justify-content-center">
        <div class="col-7">
          <div class="row g-0">
            <div class="col-6">
              <h1>Journal</h1>
            </div>
            <div class="col-6 d-flex justify-content-end">
              <div class="btn" @click="$refs.crud.create()">Add a new entry</div>
            </div>
          </div>
          <template v-for="(events, day) in journal" :key="'journal' + day">
            <h2 v-if="events[0] && events[0].newMonth" class="capitalize">
              {{ $moment(day).format('MMMM') }}
            </h2>
            <div class="card mb-3">
              <div class="card-body">
                <h3 class="card-title">{{ $moment(day).format('LL') }}</h3>
                <ul class="steps steps-vertical">
                  <template v-for="(item, i) in events" :key="'event' + i">
                    <li v-if="item" class="step-item">
                      <div v-if="item.event == 'log'">
                        <div class="h4 mb-1">
                          {{ _eventTitle(item) }}
                        </div>
                        <div class="text-secondary">
                          {{ item.data.message }}
                        </div>
                      </div>

                      <div v-if="item.event == 'note'">
                        <div class="h4 mb-1">
                          <span
                            style="transform: translateY(-1px); display: inline-block">
                            <Icon class="text-secondary mr-1" size="18">Note</Icon>
                          </span>
                          {{ _eventTitle(item) }}
                        </div>
                        <template v-if="item.ref">
                          A note has been added for
                          <GameChip :app="item.ref"></GameChip>
                        </template>

                        <div v-if="item.data?.note" class="text-secondary">
                          <Icon>Quote</Icon>
                          {{ item.data.note }}
                        </div>
                      </div>

                      <div v-if="item.event == 'state'">
                        <div class="h4 mb-2">
                          <span
                            style="transform: translateY(-1px); display: inline-block">
                            <Icon class="text-secondary mr-1" size="18">Background</Icon>
                          </span>

                          {{ _eventTitle(item) }}
                        </div>

                        <GameChip :app="item.ref"></GameChip>

                        {{ item.data.old ? 'changed state' : 'has been added to' }}

                        <BState
                          :state="item.data.state"
                          :from="item.data.old"
                          :label="true"
                          :manager="false"></BState>
                      </div>

                      <div v-if="item.event == 'added'">
                        <div class="h4 mb-1">
                          <Icon class="text-secondary" size="17">StepInto</Icon>
                          {{ _eventTitle(item) }}
                        </div>
                        You have updated your library with
                        {{ item.data.games.length }} games

                        <gameList
                          :apps="item.data.games"
                          cols="3"
                          class="pt-3"></gameList>
                      </div>

                      <small class="text-secondary d-inline-block border-top pt-2 mt-2">
                        Entry added {{ dates.format(item.created_at, 'LL h:m:s') }}
                      </small>

                      <!-- <ul
                        style="
                          background: #f0f0f0;
                          list-style-type: none;
                          border-radius: 4px;
                          padding: 8px;
                          margin-bottom: 10px;
                        ">
                        <li>
                          <strong>Event type: {{ item.event }}</strong>
                        </li>
                        <li>Ref: {{ item.ref }}</li>
                        <li>name: {{ _appName(item) }}</li>
                        <li>
                          <pre>{{ item }}</pre>
                        </li>
                      </ul> -->
                      <!-- <div class="pull-right">
                        <Icon class="text-secondary" size="10">Trash</Icon>
                      </div> -->
                      <div>&nbsp;</div>
                    </li>
                  </template>
                </ul>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>

  <journal-crud-dialog ref="crud" @stored="onStored" />
</template>

<script>
/**
 * @file:    \pages\journal\index.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 4th December 2023
 * Modified: Fri Mar 08 2024
 **/

export default {
  name: 'Journal',
  data() {
    return {
      journal: {},

      db: {
        apps: {},
        data: [],
        states: [],
      },
    }
  },

  computed: {
    ...mapStores(useDataStore, useJournalStore),
    ...mapState(useStateStore, ['states']),
  },

  watch: {
    '$app.ready': function () {
      this.init()
    },
  },

  methods: {
    onStored() {
      this.init()
    },

    get(uuid) {
      if (this.db.apps[uuid]) return this.db.apps[uuid]

      this.db.apps[uuid] = this.dataStore.get(uuid)
      return this.db.apps[uuid]
    },

    _appName(item) {
      if (!item.ref) return 'Unknown app'
      this.get(item.ref)

      const app = this.db.apps[item.ref]
      return app?.name || 'Unknown app'
    },

    _eventTitle(item) {
      if (item.event == 'log') {
        return 'Event recorded'
      }

      if (item.event == 'note') {
        if (item.data?.title) return item.data.title
        // const app = this.dataStore.get(item.ref)
        return `Note added`
      }

      if (item.event == 'state') {
        return 'State changed'
      }

      if (item.event == 'added') {
        return 'Library updated'
      }
    },

    groupByDay() {
      const grouped = {}

      let prev = null
      let prevMonth = null

      this.db.data.reverse().forEach((entry) => {
        // Extract the date part from the 'created_at' field
        const day = entry.created_at.split(' ')[0]
        const month = entry.created_at.split('-')[1]

        // Initialize the array if this is the first entry for the day
        if (!grouped[day]) {
          grouped[day] = []
        }

        // Control duplicated
        if (
          entry.event == 'state' &&
          prev &&
          prev.event == entry.event &&
          prev.ref == entry.ref
        ) {
          //take the previous item in the grouped[day] and update it
          const previous = grouped[day].pop()
          if (previous) {
            if (entry.event == 'state' && entry.data.old) {
              previous.data.old = entry.data.old
            }

            grouped[day].push(previous)
            return
          }
        }

        // control possible mistakes
        if (entry.event == 'state') {
          if (entry.data && entry.data?.old == entry.data?.state) {
            delete entry.data.old
          }
        }

        if (entry.event == 'added') {
          entry.show = 12
        }

        // Add the entry to the appropriate day
        // entry.prev = prev
        grouped[day].push(entry)

        if (prevMonth !== month) {
          entry.newMonth = true
          prevMonth = month
        }

        prev = { ...entry }
        if (prev.prev) delete prev.prev
      })

      this.journal = grouped
    },

    async getData() {
      const jxr = await this.journalStore.list()
      this.db.data = jxr
    },

    async init() {
      if (!this.$app.ready) return

      await this.getData()
      this.groupByDay()
    },
  },

  mounted() {
    this.init()
  },
}
</script>
