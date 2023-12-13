<template>
  <b-dialog v-model="ui.dialog">
    <h1>{{ app.name }}</h1>
    <pre>{{ app }}</pre>
    <pre>{{ timeline }}</pre>
    <ul>
      <li>Amount of data: 0 / lite / full</li>
      <li>
        {{ app.updated_at }}
      </li>
      <li>State of game: {{ app.state }} (change)</li>
      <li>Notes: {{ app.notes }}</li>
      <li v-if="status.noteObject">Note created at {{ status.noteObject.created_at }}</li>
    </ul>
    <textarea v-model="status.note" name="note" rows="2" @blur="setNote"></textarea>
  </b-dialog>
</template>
<script>
/**
 * @file:    \components\b\details.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 1st December 2023
 * Modified: Tue Dec 12 2023
 **/

export default {
  data() {
    return {
      app: {},
      timeline: [],

      status: {
        note: '',
        noteObject: null,
        needs_update: false,
      },

      ui: {
        dialog: false,
        loading: false,
      },
    }
  },

  computed: {
    ...mapStores(useDataStore, useJournalStore),
  },

  methods: {
    async show() {
      this.ui.dialog = true
    },

    async load(app) {
      const data = this.dataStore.get(app)
      const timeline = await this.journalStore.getForRef(app)

      this.app = { ...data }
      this.timeline = { ...timeline }

      const note = await this.journalStore.getNoteForRef(app)
      this.status.noteObject = note || null
      this.status.note = note?.data.note || ''

      // console.warn(app, this.app, timeline)

      this.evaluate()
    },

    //+-------------------------------------------------
    // evaluate()
    // Evaluates the status of the loaded data
    // And determines if it needs to be updated and more
    // -----
    // Created on Tue Dec 12 2023
    //+-------------------------------------------------
    evaluate() {
      if (!this.app.api_id) {
        this.status.needs_update = true
      }
    },

    setNote() {
      this.journalStore.updateOrCreateNote(this.app.uuid, this.status.note)
      this.$toast.success('Note saved for ' + this.app.name, {
        description: 'Monday, January 3rd at 6:00pm',
      })
    },
  },

  mounted() {
    this.$mitt.on('game:modal', (app) => {
      this.load(app)
      this.show(app)
    })
  },
}
</script>
