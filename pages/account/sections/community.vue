<template>
  <div class="card mb-3">
    <div class="card-body" style="padding: 1.6rem">
      <div>
        <div class="d-flex mb-3">
          <h1 class="m-0">Community</h1>
        </div>
      </div>
      <p>Be part of the Backlog.rip community and showcase your library to the world.</p>
    </div>
    <div class="card-footer">
      <div class="row align-items-center">
        <div class="col-auto">
          <label class="form-check form-switch m-0">
            <input
              v-model="$auth.config.guild"
              class="form-check-input position-static"
              type="checkbox"
              @change="update('guild')" />
            <span class="form-check-label form-check-label-on">
              I'm a part of the community and my profile is public
            </span>
            <span class="form-check-label form-check-label-off">
              My profile is private and I don't want to appear in the community
            </span>
          </label>
        </div>
      </div>
    </div>
  </div>

  <div v-if="$auth.config.guild" class="card mb-3">
    <div class="card-body">
      <h2 class="mb-2">Account</h2>
      <p class="card-subtitle">Basic information</p>
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

      <!-- <h3 class="card-title mt-4">Your profile</h3> -->
      <div class="row">
        <div class="col-md-6">
          <div class="form-label font-serif">Your username</div>
          <!-- <h4 class="card-title mb-2">Username2</h4> -->
          <v-text-field
            :value="$auth.me.username"
            disabled
            density="comfortable"
            persistent-hint
            hint="Your username. To change it, go to your profile settings."
            @change="update('username', $auth.me.username)" />
        </div>

        <div class="col-md-6">
          <label class="form-label font-serif">Your public profile URL</label>
          <div class="input-group input-group-flat">
            <span class="smadll input-group-text">https://backlog.rip/@</span>
            <input
              v-model="$auth.me.slug"
              type="text"
              class="form-control ps-0"
              placeholder="yourusername"
              autocomplete="off"
              @change="update('slug', $auth.me.slug)" />
          </div>

          <div class="v-input__details v-messages" style="transform: translate(6px, 0px)">
            <small class="form-hint">
              Your profile url must be 4-20 characters long, contain letters and numbers,
              and must not contain spaces, special characters, or emoji.
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\account\sections\community.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 23rd December 2024
 * Modified: Mon 30 December 2024 - 16:36:29
 **/

export default {
  name: 'AccountCommunity',

  data() {
    return {}
  },

  methods: {
    //+-------------------------------------------------
    // update()
    // Updates a field in the db via $auth
    // -----
    // Created on Mon Dec 18 2023
    //+-------------------------------------------------
    async update(field, value) {
      this.$auth.update(field, value)
      this.$toast.success('Your preferences have been updated')
    },

    // //+-------------------------------------------------
    // // storeConfig()
    // // Updates a field in the db via $auth
    // // -----
    // // Created on Mon Dec 18 2023
    // //+-------------------------------------------------
    // async storeConfig(field) {
    //   this.$auth.storeConfig(field)
    //   // this.$toast.success('Sidebar updated')
    //   this.$toast.success('Your preferences have been updated')
    // },

    async init() {},
  },

  mounted() {
    this.init()
  },
}
</script>
