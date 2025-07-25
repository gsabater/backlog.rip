<template>
  <div class="card mb-3" style="padding: 0.5rem">
    <div class="card-body">
      <div>
        <div class="d-flex mb-3">
          <h1 class="m-0">Your states</h1>
        </div>
      </div>
      <p>
        States help you track your progress through games in your collection. From
        "Playing" to "Completed", they represent your current engagement with each game,
        making it easy to know where you are with every title.
      </p>
      <p>
        You can create custom states, edit existing ones, and arrange them in the order
        that works best for you. While special states that power recommendations cannot be
        deleted, you can freely manage any custom states you create to match your
        preferences.
      </p>
    </div>
  </div>

  <div class="row mb-3">
    <div class="col-6">
      <v-btn variant="tonal" color="primary" @click="$refs.crud.create()">
        Create a new state
      </v-btn>
    </div>
  </div>

  <div class="card mb-2">
    <div class="list-group card-list-group">
      <div
        class="list-group-item px-3"
        style="padding-top: 0.8rem; padding-bottom: 0.8rem">
        <div class="row g-3 align-items-center">
          <div class="col-auto" style="align-self: baseline">
            <span style="--tblr-status-color: #666">
              <span class="status-dot"></span>
            </span>
            <div class="v-list-item-subtitle">&nbsp;</div>
          </div>
          <div class="col">
            <span class="font-serif">
              {{ empty.name }}
              <small class="text-muted mx-2">
                ∷ {{ format.num($app.count.states['state_-1']) }} games
              </small>
            </span>
            <div class="v-list-item-subtitle">
              <small class="text-muted">{{ empty.description }}</small>
            </div>
          </div>
          <div class="col-auto text-secondary">
            <div class="d-flex">
              <span
                v-tippy="'Display in sidebar'"
                class="btn-action cursor-pointer"
                @click="pinSidebar(-1)">
                <Icon v-if="isPinned(-1)" class="icon" size="13" style="color: #575ac6">
                  BookmarkFilled
                </Icon>
                <Icon v-else class="icon" size="13" style="color: #575ac6">Bookmark</Icon>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div v-if="states.length" class="list-group card-list-group">
      <template v-for="(item, i) in states" :key="item.id">
        <div
          v-if="item.id > -1"
          class="list-group-item px-3"
          style="padding-top: 0.8rem; padding-bottom: 0.8rem">
          <div class="row g-3 align-items-center">
            <div class="col-auto" style="align-self: baseline">
              <span :style="{ '--tblr-status-color': item.color || '' }">
                <span class="status-dot status-dot-animated"></span>
              </span>
              <div class="v-list-item-subtitle">&nbsp;</div>
            </div>
            <div class="col">
              <span class="font-serif">
                {{ item.name }}
                <small class="text-muted mx-2">
                  ∷ {{ format.num(stateStore.count(item.id)) }} games
                </small>
              </span>
              <div class="v-list-item-subtitle">
                <small class="text-muted">
                  {{ item.description }}
                </small>
              </div>
            </div>
            <div class="col-auto text-secondary">
              <div class="d-flex">
                <span
                  v-tippy="'Display in sidebar'"
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
                </span>

                <div style="position: relative">
                  <v-btn
                    variant="text"
                    icon="mdi-chevron-right"
                    size="x-small"
                    color="grey-lighten-1">
                    <Icon size="18" width="2">DotsVertical</Icon>
                  </v-btn>
                  <b-dropdown
                    trigger="mouseenter focus click hover manual"
                    placement="bottom-end"
                    :debounce="15"
                    style="min-width: 180px">
                    <template v-if="i > 0">
                      <div class="dropdown-item" @click.stop="sort('up', item.id)">
                        <Icon size="16" class="me-2 text-muted">ChevronUp</Icon>
                        Move upwards
                      </div>
                    </template>

                    <template v-if="i < states.length - 1">
                      <div class="dropdown-item" @click.stop="sort('down', item.id)">
                        <Icon size="16" class="me-2 text-muted">ChevronDown</Icon>
                        Move downwards
                      </div>
                    </template>

                    <div class="dropdown-item" @click.stop="edit(item)">
                      <Icon size="16" class="me-2 text-muted">Pencil</Icon>
                      Edit state
                    </div>

                    <template v-if="stateStore.canBeDeleted(item)">
                      <div class="dropdown-divider"></div>
                      <div
                        class="dropdown-item text-red"
                        @click.stop="
                          $mitt.emit('ask:confirm', {
                            item,
                            title: 'Delete state',
                            message: 'Are you sure you want to delete this state?',
                            onConfirm: () => this.delete(item),
                          })
                        ">
                        <Icon size="16" class="me-2 text-red">Trash</Icon>
                        Delete state
                      </div>
                    </template>
                    <template v-else>
                      <div class="dropdown-divider"></div>
                      <div class="dropdown-item text-muted cursor-not-allowed">
                        <Icon size="16" class="me-2">Trash</Icon>
                        This state cannot be deleted
                      </div>
                    </template>
                  </b-dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>

  <state-crud-dialog ref="crud" @stored="onStored" @deleted="$forceUpdate()" />
</template>

<script>
/**
 * @file:    \pages\account\sections\states.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 3rd January 2024
 * Modified: 24th July 2025 - 04:05:22
 **/

export default {
  name: 'AccountStates',

  data() {
    return {}
  },

  computed: {
    ...mapStores(useStateStore),
    ...mapState(useStateStore, ['states', 'empty']),
    // ...mapState(useStateStore, { states: 'statesWithNoState' }),
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
      this.$auth.setConfig('menu')
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
    },

    async delete(item) {
      this.$refs.crud.delete(item)
      this.$toast.success('The state has been deleted')
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
    //   await this.getData()
    //   this.ui.loading = false
    // },
  },

  mounted() {
    // this.init()
  },
}
</script>
