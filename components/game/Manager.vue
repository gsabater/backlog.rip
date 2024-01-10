<template>
  <div
    v-if="ui.show"
    class="card nope-card-stacked"
    style="position: fixed; z-index: 9999"
    :style="{ top: ui.top, left: ui.left }">
    <div
      class="dropdown-menu"
      style="
        display: inline-block;
        width: 100%;
        position: relative;
        top: 0;
        box-shadow: none;
      ">
      <!-- <div class="row m-0 mb-2">
        <div class="text-center p-2 col-6 active">Status</div>
        <div class="text-center p-2 col-6 active">Collections</div>
      </div> -->
      <label class="dropdown-item">{{ appUUID }}</label>
      <label
        v-for="(state, i) in states"
        :key="'state' + i"
        class="dropdown-item ps-1"
        @click="doAction(state)">
        <div class="d-flex justify-center" style="width: 30px">
          <Icon v-if="isFav(state.name)" style="color: red; fill: pink">Heart</Icon>
          <span
            v-else
            class="badge"
            :style="{ 'background-color': state.color || '' }"></span>
        </div>

        <span class="pe-3">
          {{ state.name }}
        </span>
        <tippy class="text-muted ms-auto cursor-help" :content="state.description">
          <Icon>HelpCircleFilled</Icon>
        </tippy>
        <!-- <span class="badge bg-primary text-primary-fg ms-auto">12</span> -->
      </label>
    </div>
  </div>
  <div
    v-if="ui.show"
    class="dropdown-control"
    style="
      background-color: rgba(0, 0, 0, 0.7);
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0px;
      left: 0px;
      z-index: 9998;
      backdrop-filter: blur(0.5px);
    "
    @click="hide"></div>
</template>

<script>
import { useJournalStore } from '../../stores/journalStore'
import { useStateStore } from '../../stores/stateStore'

/**
 * @file:    \components\b\stateMenu.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 29th November 2023
 * Modified: Wed Jan 10 2024
 **/

export default {
  name: 'GameManager',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },

    app: {
      type: String,
      default: null,
    },

    clearable: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['set', 'clear', 'change', 'update:modelValue'],

  data() {
    return {
      appUUID: null,
      value: '',
      item: {},

      db: {
        states: [],
      },

      ui: {
        top: '0px',
        left: '0px',
        show: false,
      },
    }
  },

  computed: {
    ...mapStores(useDataStore, useJournalStore, useStateStore),
    ...mapState(useStateStore, ['states']),
  },

  methods: {
    //+-------------------------------------------------
    // function()
    // Displays the component on event position
    // -----
    // Created on Thu Jan 04 2024
    //+-------------------------------------------------
    show(event, app) {
      const elementWidth = 200 // replace with the actual width of the element
      const elementHeight = 300 // replace with the actual height of the element

      const maxX = window.innerWidth - elementWidth
      const maxY = window.innerHeight - elementHeight

      let x = event.clientX - 10
      let y = event.clientY - 10

      // Correct x and y if needed
      if (x > maxX) {
        x = maxX
      }
      if (y > maxY) {
        y = maxY
      }

      this.appUUID = app
      this.ui.top = `${y}px`
      this.ui.left = `${x}px`
      this.ui.show = true
    },

    hide() {
      this.ui.show = false
    },

    isFav(state) {
      const favs = ['favorite', 'favourite', 'fav', 'favourites', 'favorites']
      return favs.includes(state.toLowerCase())
    },

    //+-------------------------------------------------
    // doAction()
    // Performs action when an item is clicked
    // -----
    // Created on Sat Jan 06 2024
    //+-------------------------------------------------
    doAction(state) {
      this.value = state?.id || null
      this.stateStore.set(this.appUUID, state.id)

      this.onChange(state)
      this.hide()
    },

    onChange() {
      // console.warn('onChange', value, this.modelValue)
      this.$emit('change', this.value)
      this.$emit('update:modelValue', this.value)
      if (this.value == null) this.$emit('clear', null)
    },

    // TODO: Move this to a store
    // setState(state) {
    //   this.$emit('set', state)
    //   // this.$parent.app.state = state.id
    //   // this.dataStore.update(this.$parent.app, 'state')

    //   this.$toast.success('Added to ' + state.name, {
    //     description: 'Monday, January 3rd at 6:00pm',
    //   })

    //   this.journalStore.add({
    //     event: 'state',
    //     ref: this.$parent.app.uuid,
    //     data: {
    //       state: state.id,
    //       old: state.id,
    //     },
    //   })
    // },

    getData() {
      // this.db.states = this.dataStore.states()
    },

    init() {
      this.getData()
    },
  },

  mounted() {
    this.init()

    this.$mitt.on('game:manager', (payload) => {
      this.show(payload.$ev, payload.app)
    })
  },
}
</script>
