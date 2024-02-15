<template>
  <pre
    v-if="ui.dialog"
    class="my-3"
    style="
      position: fixed;
      bottom: 10px;
      left: 200px;
      z-index: 9999;
      max-height: 120vh;
      overflow-y: scroll;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      padding: 10px;
      border-radius: 5px;
      width: auto;
    "
    >{{ app }}
</pre
  >

  <VueFinalModal
    v-model="ui.dialog"
    class="details-modal"
    content-class="details-modal-content movie_card"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade">
    <Icon>ChevronRight</Icon>
    <div class="modal-back"></div>
    <div class="info_section">
      <div class="movie_header">
        <!-- <img
          class="locandina"
          src="https://mr.comingsoon.it/imgdb/locandine/235x336/53750.jpg" /> -->

        <game-asset
          ref="cover"
          :app="app"
          asset="cover"
          class="locandina"
          :priority="['steam', 'igdb']"></game-asset>

        <h1>{{ app.name }}</h1>
        <!-- <h4>{{ app.released_at }}, {{ app.developer }}</h4> -->
        <span class="minutes">125 min</span>
        <p class="type">{{ app.genres }}</p>
      </div>
      <div class="movie_desc">
        <p class="text">
          {{ app.description || 'No description available' }}
        </p>
        <pre>
          {{ $prev }}
          {{ $next }}
        </pre>
      </div>
      <div class="movie_social">
        <ul>
          <li><Icon>Clock</Icon></li>
          <li><Icon>Clock</Icon></li>
          <li><Icon>Note</Icon></li>
        </ul>
      </div>
    </div>
    <div
      class="blur_back"
      :style="`background-image: url(https://cdn.akamai.steamstatic.com/steam/apps/${app.steam_id}/page.bg.jpg);`"></div>
  </VueFinalModal>

  <!-- <b-dialog v-model="ui.dialog" class="game-details">
    <div class="row">
      <div class="col-4 details-sidebar" style="position: relative">
        <game-asset :app="app" asset="logo" :priority="['steam', 'igdb']"></game-asset>
      </div>
      <div class="col-8 details-content">
        <h1>{{ app.name }}</h1>

        <pre>{{ app }}</pre>
        <pre>{{ timeline }}</pre>
        <ul>
          <li>Amount of data: 0 / lite / full</li>
          <li>
            {{ app.updated_at }}
          </li>
          <li>
            <BState :app="app.uuid" :state="app.state"></BState>
          </li>
        </ul>
        <textarea
          v-model="status.note"
          class="form-control"
          name="note"
          rows="2"
          @blur="setNote"></textarea>
        <span v-if="status.noteObject" class="d-block text-muted">
          Note created at {{ status.noteObject.created_at }}
        </span>
      </div>
    </div>
  </b-dialog> -->
</template>

<script>
/**
 * @file:    \components\b\details.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 1st December 2023
 * Modified: Thu Feb 15 2024
 **/

export default {
  name: 'GameDetails',
  data() {
    return {
      $list: null,
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
    ...mapStores(useGameStore, useJournalStore),
    // ...mapState(useDataStore, ['app']),
    ...mapState(useGameStore, ['app']),

    $prev() {
      if (!this.app || !this.$data.$list || !this.$data.$list.items) return

      const index = this.$data.$list.items.indexOf(this.app.uuid)
      return this.$data.$list.items[index - 1]
    },

    $next() {
      if (!this.app || !this.$data.$list || !this.$data.$list.items) return
      console.warn(this.app.uuid, this.$data.$list.items[this.app.uuid])

      const index = this.$data.$list.items.indexOf(this.app.uuid)
      return this.$data.$list.items[index + 1]
    },
  },

  methods: {
    async show() {
      this.ui.dialog = true
    },

    confirm() {
      console.log('confirm✅✅✅✅')
      this.show = false
    },

    async load(payload) {
      this.$list = payload.$list
      this.gameStore.load(payload.uuid)
      // const timeline = await this.journalStore.getForRef(app)

      // this.app = { ...data }
      // this.timeline = { ...timeline }

      // const note = await this.journalStore.getNoteForRef(app)
      // this.status.noteObject = note || null
      // this.status.note = note?.data.note || ''

      // // console.warn(app, this.app, timeline)

      // this.evaluate()

      this.show()
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

    //+-------------------------------------------------
    // setNote()
    // update or create a note for the current app
    // TODO: if note is empty, delete note
    // -----
    // Created on Tue Dec 26 2023
    //+-------------------------------------------------
    setNote() {
      if (!this.status.note) return

      this.journalStore.updateOrCreateNote(this.app.uuid, this.status.note)
      this.$toast.success('Note saved for ' + this.app.name, {
        description: 'Monday, January 3rd at 6:00pm',
      })
    },
  },

  mounted() {
    this.$mitt.on('game:modal', (payload) => {
      this.load(payload)
    })
  },
}
</script>
