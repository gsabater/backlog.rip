<template>
  <div class="card mb-3" style="padding: 1rem">
    <div class="card-body">
      <div>
        <div class="d-flex mb-3">
          <h1 class="m-0">Your states</h1>
        </div>
      </div>
      <p>
        Here you can manage the states used to categorize your games. You can create new
        states, edit existing ones, and delete them. You can also change the order in
        which they appear in the dropdown menu.
      </p>
      <p>
        Some States are special and cannot be deleted. These are the states that are used
        to generate personalized recommendations and statistics.
      </p>
      <div class="mt-2">
        <a class="btn btn-primary px-5" @click="$refs.crud.create()">
          Create a new state
        </a>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-body">
      <div v-if="states.length">
        <div v-for="(item, i) in states" :key="item.id">
          <div v-if="item" class="row">
            <div class="col-auto">
              <!-- <span class="form-colorinput-color bg-lime"></span>
              <span class="avatar">JL</span> -->
              <span :style="{ '--tblr-status-color': item.color || '' }">
                <span class="status-dot status-dot-animated"></span>
              </span>
            </div>
            <div class="col">
              <div class="text-truncate">
                <strong>{{ item.name }}</strong>
              </div>
              <div class="text-secondary">
                {{ item.description }}
                <span v-if="item.key" class="badge">
                  This is your {{ item.key }}. It represents a unique state utilized for
                  generating personalized recommendations and statistics.
                </span>
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
                    v-tippy="'Move upwards'"
                    class="btn-action cursor-pointer"
                    @click="sort('up', item.id)">
                    <Icon class="icon">ChevronUp</Icon>
                  </span>
                  <span
                    v-tippy="'Move downwards'"
                    class="btn-action cursor-pointer"
                    @click="sort('down', item.id)">
                    <Icon class="icon">ChevronDown</Icon>
                  </span>

                  <span
                    v-tippy="'Edit this state'"
                    class="btn-action cursor-pointer"
                    :class="{ disabled: item.key }"
                    @click="edit(item)">
                    <Icon class="icon">Pencil</Icon>
                  </span>

                  <template v-if="item.key">
                    <span v-tippy="'This state cannot be deleted'" class="btn-action">
                      <Icon class="icon" color="red">TrashOff</Icon>
                    </span>
                  </template>

                  <template v-else>
                    <span
                      v-tippy="'Delete'"
                      class="btn-action cursor-pointer"
                      :class="{ disabled: item.key }"
                      @click="remove(item.id)">
                      <Icon class="icon" color="red">Trash</Icon>
                    </span>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <hr />
        </div>
      </div>
    </div>
  </div>

  <states-crud-dialog
    ref="crud"
    @close="selected = null"
    @stored="$forceUpdate()"
    @deleted="$forceUpdate()" />
</template>

<script>
/**
 * @file:    \pages\account\sections\states.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 3rd January 2024
 * Modified: Thu Jan 18 2024
 **/

// import { liveQuery } from 'dexie'
// import { useObservable } from '@vueuse/rxjs'

export default {
  name: 'AccountStates',

  data() {
    return {}
  },

  computed: {
    ...mapStores(useStateStore),
    ...mapState(useStateStore, ['states']),

    // //+-------------------------------------------------
    // // $states
    // // Live query of Dexie states table.
    // // -----
    // // Created on Wed Jan 03 2024
    // //+-------------------------------------------------
    // $states() {
    //   if (!this.$db?.states) return []
    //   return useObservable(liveQuery(() => this.$db.states.toArray()))
    // },
  },

  methods: {
    sort(direction, id) {
      this.stateStore.sortState(direction, id)
    },

    edit(item) {
      this.$refs.crud.edit(item)
    },

    remove(id) {
      this.stateStore.delete(id)
      this.$toast.success('The state has been deleted', {
        description: 'Monday, January 3rd at 6:00pm',
      })
    },

    async ins() {
      await this.$db.config.put(
        {
          id: 5,
          uuid: null,
          steam: 76561198061541150,
          gog: null,
          epic: null,
          name: 'Gaspar S.',
          username: 'Gohrum',
          slug: null,
          email: null,
          avatar:
            'https://avatars.akamai.steamstatic.com/be9372d5ab3d163fd96fbe3e97b3330cc10c1165_medium.jpg',
          created_at: '2022-04-29T12:36:13.000000Z',
          updated_at: '2023-03-21T17:42:31.000000Z',
        },
        'me'
      )
      log('hey')
    },

    noti(a, b) {
      console.log(a, b, this.user.username)
    },

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Mon Dec 18 2023
    //+-------------------------------------------------
    async update() {
      this.$toast.success('Your data has been updated', {
        description: 'Monday, January 3rd at 6:00pm',
      })
    },

    async getData() {
      this.db.user = await this.$db.account.get('me')
      this.user = { ...this.db.user }
    },

    async init() {
      await this.getData()
      // this.ui.loading = false
    },
  },

  mounted() {
    // this.init()
  },
}
</script>
