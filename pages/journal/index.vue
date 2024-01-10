<template>
  <div class="page-body">
    <div class="container-xl">
      <div class="row justify-content-center">
        <div class="col-6">
          <h1>Journal</h1>
          <template v-for="(events, day) in journal" :key="'journal' + day">
            <div class="card mb-3">
              <div class="card-body">
                <h3 class="card-title">{{ $moment(day).format('LL') }}</h3>
                <ul class="steps steps-vertical">
                  <template v-for="(item, i) in events" :key="'event' + i">
                    <li v-if="item" class="step-item">
                      <div v-if="item.event == 'log'">
                        <div class="h4 m-0">
                          {{ _eventTitle(item) }}
                        </div>
                        <div class="text-secondary">
                          {{ item.data.message }}
                        </div>
                      </div>

                      <div v-if="item.event == 'note'">
                        <div class="h4 m-0">
                          <Icon class="text-secondary" size="17">Note</Icon>
                          {{ _eventTitle(item) }}
                        </div>
                        A note has been added for
                        <GameChip :app="item.ref"></GameChip>
                        <div v-if="item.data?.note" class="text-secondary">
                          <Icon>Quote</Icon>
                          {{ item.data.note }}
                        </div>
                      </div>

                      <div v-if="item.event == 'state'">
                        <div class="h4 mb-2">
                          <Icon class="text-secondary" size="17">Background</Icon>
                          {{ _eventTitle(item) }}
                        </div>

                        <GameChip :app="item.ref"></GameChip>

                        {{ item.data.old ? 'changed state from' : 'has been added to' }}

                        <BState
                          :state="item.data.state"
                          :from="item.data.old"
                          :label="true"
                          :manager="false"></BState>
                      </div>

                      <div v-if="item.event == 'added'">
                        <div class="h4 m-0">
                          <Icon class="text-secondary" size="17">StepInto</Icon>
                          {{ _eventTitle(item) }}
                        </div>
                        Your library has been updated with
                        {{ item.data.games.length }} new games

                        <gameList
                          :apps="item.data.games"
                          cols="3"
                          max="12"
                          class="pt-3"></gameList>

                        <div v-if="item.data.games.length > 12">
                          <div class="text-secondary">
                            <b-btn class="my-1">
                              <Icon class="text-secondary me-2" size="12">
                                PlusCircled
                              </Icon>
                              Show {{ item.data.games.length - 12 }} more
                            </b-btn>
                          </div>
                        </div>
                      </div>

                      <small class="text-secondary d-inline-block border-top pt-2 mt-2">
                        Entry added {{ item.created_at }}
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
</template>

<script>
/**
 * @file:    \pages\journal\index.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 4th December 2023
 * Modified: Mon Jan 08 2024
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

  methods: {
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
      this.db.data.reverse().forEach((entry) => {
        // Extract the date part from the 'created_at' field
        const day = entry.created_at.split(' ')[0]

        // Initialize the array if this is the first entry for the day
        if (!grouped[day]) {
          grouped[day] = []
        }

        // Control duplicated
        if (prev && prev.event == entry.event && prev.ref == entry.ref) {
          //take the previous item in the grouped[day] and update it
          const previous = grouped[day].pop()

          if (entry.event == 'state' && entry.data.old) {
            previous.data.old = entry.data.old
          }

          grouped[day].push(previous)
          return
        }

        // control possible mistakes
        if (entry.event == 'state') {
          if (entry.data?.old == entry.data?.state) {
            delete entry.data.old
          }
        }

        // Add the entry to the appropriate day
        // entry.prev = prev
        grouped[day].push(entry)

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
      await this.getData()

      this.groupByDay()
    },
  },

  mounted() {
    this.init()
  },
}
</script>
