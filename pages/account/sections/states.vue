<template>
  <div class="card mb-3" style="padding: 1rem">
    <div class="card-body">
      <div>
        <div class="d-flex mb-3">
          <h1 class="m-0">Your states</h1>
        </div>
      </div>
      <p>
        Here you can manage the states used to categorize your games. You can create more
        states, edit existing ones, and delete the states you don't need anymore.Also, you
        can also change the order in which they appear on the dropdown menus.
      </p>
      <p>
        Some states are special and cannot be deleted. Those are used to generate
        personalized recommendations and insights on your dashboard.
      </p>
    </div>
  </div>

  <div
    class="divider"
    style="border-top: 1px dashed rgb(204 204 204 / 25%); margin: 2rem"></div>

  <div class="card mb-4">
    <div class="card-body">
      <h2>New State</h2>
      <!-- <p class="card-subtitle">Profile details and personal settings</p> -->

      <!-- <h3 class="card-title mb-3">
        <Icon style="transform: translateY(-2px)">Bookmark</Icon>
        Pinned games
      </h3>
      <p class="card-subtitle mb-2">
        Enable a special category for pinned games.
        <br />
        This will allow you to quickly pin a game and access it from the sidebar.
      </p>
      <div class="mb-3">
        <label class="form-check form-switch form-switch-lg">
          <input
            v-model="$auth.config.debug"
            class="form-check-input"
            type="checkbox"
            @change="update('config', 'debug')" />
          <span class="form-check-label form-check-label-on">Debugging enabled</span>
          <span class="form-check-label form-check-label-off">Developer mode is off</span>
        </label>
      </div> -->

      <!--
      <h3 class="card-title mt-4">Public profile</h3>
      <p class="card-subtitle">
        Making your profile public means that anyone on the Dashkit network will be able
        to find you.
      </p>
      <div>
        <label class="form-check form-switch form-switch-lg">
          <input class="form-check-input" type="checkbox" />
          <span class="form-check-label form-check-label-on">
            You're currently visible
          </span>
          <span class="form-check-label form-check-label-off">
            You're currently invisible
          </span>
        </label>
      </div>
      -->
      <!-- <div class="p-3"></div> -->
      <!-- <h3 class="card-title mb-3">Create a new state</h3> -->
      <p class="card-subtitle mb-4">
        Create a new state to categorize your library. You can edit and delete it later.
      </p>
      <div>
        <a class="btn btn-primary px-5" @click="$refs.crud.create()">
          Create a new state
        </a>
      </div>
    </div>
  </div>

  <div class="card">
    <div v-if="states.length">
      <template v-for="(item, i) in states" :key="item.id">
        <div class="card-body">
          <div v-if="item" class="row">
            <div class="col-auto">
              <!-- <span class="form-colorinput-color bg-lime"></span>
              <span class="avatar">JL</span> -->
              <span :style="{ '--tblr-status-color': item.color || '' }">
                <span class="status-dot status-dot-animated"></span>
              </span>
            </div>
            <div class="col">
              <div class="text-truncate mb-2">
                <strong>{{ item.name }}</strong>
              </div>
              <div class="text-secondary">
                {{ item.description }}
                <!-- <span v-if="item.key" class="badge">
                  This is your {{ item.key }}. It represents a unique state utilized for
                  generating personalized recommendations and statistics.
                </span> -->
              </div>
            </div>
            <div class="col-auto align-self-center">
              <!-- <div>
                <b-btn class="p-2 me-2">
                  <Icon>Pencil</Icon>
                </b-btn>

                <b-btn class="p-2 me-2">
                  <Icon>ChevronUp</Icon>
                </b-btn>

                <b-btn class="p-2">
                  <Icon>ChevronDown</Icon>
                </b-btn>
              </div> -->
              <div>
                <div class="d-flex">
                  <span
                    v-tippy="'Display list in the sidebar'"
                    class="btn-action cursor-pointer"
                    @click="pinSidebar(item.id)">
                    <Icon
                      v-if="isPinned(item.id)"
                      class="icon"
                      size="13"
                      style="color: #575ac6">
                      BookmarkFilled
                    </Icon>
                    <Icon v-else class="icon" size="13" style="color: #575ac6">
                      Bookmark
                    </Icon>
                    <!-- <Icon class="icon">Pin</Icon>
                    <Icon class="icon">PinnedFilled</Icon> -->
                  </span>

                  <span
                    v-if="i > 0"
                    v-tippy="'Move upwards'"
                    class="btn-action cursor-pointer"
                    @click="sort('up', item.id)">
                    <Icon class="icon">ChevronUp</Icon>
                  </span>

                  <span
                    v-if="i < states.length - 1"
                    v-tippy="'Move downwards'"
                    class="btn-action cursor-pointer"
                    @click="sort('down', item.id)">
                    <Icon class="icon">ChevronDown</Icon>
                  </span>

                  <span
                    v-tippy="'Edit'"
                    class="btn-action cursor-pointer"
                    :class="{ disabled: item.key }"
                    @click="edit(item)">
                    <Icon class="icon">Pencil</Icon>
                  </span>

                  <template v-if="!item.key || item.key.includes('state_')">
                    <span
                      v-tippy="'Delete'"
                      class="btn-action cursor-pointer"
                      :class="{ disabled: item.key }"
                      @click="remove(item)">
                      <Icon class="icon text" color="red">Trash</Icon>
                    </span>
                  </template>

                  <template v-else>
                    <span v-tippy="'This state cannot be deleted'" class="btn-action">
                      <Icon class="icon" color="red" style="opacity: 0.5">TrashOff</Icon>
                    </span>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>

  <!-- <states-crud-dialog
    ref="crud"
    @close="selected = null"
    @stored="$forceUpdate()"
    @deleted="$forceUpdate()" /> -->

  <dialog-crud-states
    ref="crud"
    @close="selected = null"
    @stored="onStored"
    @deleted="$forceUpdate()" />
</template>

<script>
/**
 * @file:    \pages\account\sections\states.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 3rd January 2024
 * Modified: 19 July 2024 - 11:41:24
 **/

export default {
  name: 'AccountStates',

  data() {
    return {}
  },

  computed: {
    ...mapStores(useStateStore),
    ...mapState(useStateStore, ['states']),
  },

  methods: {
    //+-------------------------------------------------
    // pinSidebar()
    // Pins states on the sidebar and stores at config
    // -----
    // Created on Thu Jul 18 2024
    //+-------------------------------------------------
    async pinSidebar(id) {
      let pinned = this.$auth?.menu?.states || []
      if (pinned.includes(id)) {
        pinned = pinned.filter((item) => item !== id)
      } else {
        pinned.push(id)
      }

      this.$auth.config.menu.states = pinned
      this.$auth.storeConfig('menu')
      this.$toast.success('Sidebar updated')
    },

    isPinned(id) {
      const pinned = this.$auth?.menu?.states || []
      return pinned.includes(id)
    },

    sort(direction, id) {
      this.stateStore.sort(direction, id)
    },

    edit(item) {
      this.$refs.crud.edit(item)
      this.$toast.success('State updated')
    },

    async remove(item) {
      this.$refs.crud.delete(item)
      this.$toast.success('The element has been deleted')
    },

    //+-------------------------------------------------
    // onStored()
    // -----
    // Created on Tue Jun 18 2024
    //+-------------------------------------------------
    async onStored() {
      this.$toast.success('Your new state has been created')
      this.$forceUpdate()
    },

    // async init() {
    // await this.getData()
    // this.ui.loading = false
    // },
  },

  mounted() {
    // this.init()
  },
}
</script>
