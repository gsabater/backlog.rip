<template>
  <div class="card">
    <div class="card-body">
      <h2 class="mb-4">Account</h2>
      <!-- <p>This is your information and personal settings</p> -->
      <!-- <h3 class="card-title">Profile Details</h3> -->
      <!-- <div class="row align-items-center">
        <div class="col-auto"><span class="avatar avatar-xl" style="background-image: url(./static/avatars/000m.jpg)"></span>
        </div>
        <div class="col-auto"><a href="#" class="btn">
            Change avatar
          </a></div>
        <div class="col-auto"><a href="#" class="btn btn-ghost-danger">
            Delete avatar
          </a></div>
      </div> -->
      <!-- <h3 class="card-title mt-4">Business Profile</h3> -->
      <div class="row g-3">
        <div class="col-md nope-col-lg-8">
          <!-- <div class="form-label">Username</div> -->
          <h3 class="card-title my-1">Username</h3>
          <!-- <b-input
            v-model="user.username"
            hint="This is only your preferred profile name"
            @change="update" /> -->
        </div>

        <!-- <div class="col-12">
          <b-btn @click="ins">Update profile</b-btn>
          <pre>
            {{ user }}
          </pre>
        </div> -->
        <!-- </div>
      <h3 class="card-title mt-4">Email</h3>
      <p class="card-subtitle">
        This contact will be shown to others publicly, so choose it carefully.
      </p>
      <div>
        <div class="row g-2">
          <div class="col-auto">
            <input
              type="text"
              class="form-control w-auto"
              value="paweluna@howstuffworks.com" />
          </div>
          <div class="col-auto"><a href="#" class="btn">Change</a></div>
        </div>
      </div>
      <h3 class="card-title mt-4">Password</h3>
      <p class="card-subtitle">
        You can set a permanent password if you don't want to use temporary login codes.
      </p>
      13956300
      <div>
        <a href="#" class="btn">Set new password</a>
      </div>
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
        </label> -->
      </div>
    </div>
    <div class="card-footer">
      Last updated { { user.updated_at } }
      <br />
      Reset defaults
    </div>
  </div>

  <pre v-if="$states.value">
    {{ $states.value[0] }}
  </pre>
  <div class="card">
    <div class="card-body">
      <div v-if="$states.value">
        <div
          v-for="item in $states.value.sort((a, b) => a.order - b.order)"
          :key="item.id">
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
                <span v-if="item.key" class="badge">This is your {{ key }}</span>
              </div>
            </div>
            <div class="col-auto align-self-center">
              <div>
                <b-btn class="p-2 me-2">
                  <Icon>Pencil</Icon>
                </b-btn>

                <b-btn class="p-2 me-2">
                  <Icon>ChevronUp</Icon>
                </b-btn>

                <b-btn class="p-2">
                  <Icon>ChevronDown</Icon>
                </b-btn>
              </div>
              <div>
                <div class="d-flex">
                  <a v-tippy="'Move upwards'" href="#" class="btn-action">
                    <Icon class="icon">ChevronUp</Icon>
                  </a>
                  <a v-tippy="'Move downwards'" href="#" class="btn-action">
                    <Icon class="icon">ChevronDown</Icon>
                  </a>

                  <a v-tippy="'Edit this state'" href="#" class="btn-action">
                    <Icon class="icon">Pencil</Icon>
                  </a>

                  <a v-tippy="'Delete'" href="#" class="btn-action">
                    <Icon class="icon" color="red">Trash</Icon>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\account\sections\states.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 3rd January 2024
 * Modified: Wed Jan 03 2024
 **/

import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'

export default {
  name: 'AccountStates',

  data() {
    return {
      // db: {
      //   states: [],
      // },
    }
  },

  computed: {
    //+-------------------------------------------------
    // $states
    // Live query of Dexie states table.
    // -----
    // Created on Wed Jan 03 2024
    //+-------------------------------------------------
    $states() {
      if (!this.$db?.states) return []
      return useObservable(liveQuery(() => this.$db.states.toArray()))
    },
  },

  methods: {
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
