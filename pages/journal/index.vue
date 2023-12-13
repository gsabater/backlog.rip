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
                    <li class="step-item">
                      <!-- <pre>{{ item }}</pre> -->
                      <div class="h4 m-0">{{ eventTitle(item) }}</div>
                      <div class="text-secondary" v-html="eventMessage(item)"></div>
                      <div v-if="item.data?.note" class="text-secondary">
                        {{ item.data.note }}
                      </div>
                      <small class="text-secondary d-inline-block border-top pt-2 mt-2">
                        {{ item.created_at }}
                      </small>
                      <div class="pull-right">
                        <Icon>Trash</Icon>
                      </div>
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
 * Modified: Tue Dec 12 2023
 **/

export default {
  name: 'Journal',
  data() {
    return {
      journal: {},

      db: {
        data: [],
        states: [],
      },
    }
  },

  computed: {
    ...mapStores(useDataStore, useJournalStore),

    items() {
      if (!this.db?.data?.length) return []
      const items = []

      this.db.data.forEach((item) => {
        const mom = this.$moment(item?.created_at)
        items.push({
          ...item,
          created_at: mom.format('LLL'),
          diff: mom.fromNow(),
        })
      })

      return items
    },
  },

  methods: {
    eventTitle(item) {
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
    },

    eventMessage(item) {
      if (item.data.message) return item.data.message

      if (item.event == 'note') {
        const app = this.dataStore.get(item.ref)
        return `Note added for ${app.name}`
      }

      if (item.event == 'state') {
        const app = this.dataStore.get(item.ref)
        const old = this.db.states.find((s) => s.id == item.data.old)
        const state = this.db.states.find((s) => s.id == item.data.state)
        return `State for ${app.name}, changed from ${old.name} to <strong>${state.name}</strong>`
      }
    },

    groupByDay() {
      const grouped = {}

      this.db.data.reverse().forEach((entry) => {
        // Extract the date part from the 'created_at' field
        const day = entry.created_at.split(' ')[0]

        // Initialize the array if this is the first entry for the day
        if (!grouped[day]) {
          grouped[day] = []
        }

        // TODO - Instead of using eventMessage, set here the message
        // and render based on conditions

        // Add the entry to the appropriate day
        grouped[day].push(entry)
      })

      this.journal = grouped
    },

    async getData() {
      const jxr = await this.journalStore.list()
      this.db.data = jxr
    },

    async getStates() {
      this.db.states = this.dataStore.states()
    },

    async init() {
      await this.getData()
      await this.getStates()

      this.groupByDay()
    },
  },

  mounted() {
    this.init()

    window.dev = this
  },
}
</script>
