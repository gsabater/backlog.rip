<template>
  <div class="card">
    <div class="card-body">
      <h2 class="mb-3">Account</h2>
      <p class="card-subtitle">Profile details and personal settings</p>
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
      <div class="row g-3">
        <div class="col-md nope-col-lg-8">
          <!-- <div class="form-label">Username</div> -->
          <!-- <h4 class="card-title mb-2">Username</h4> -->
          <b-input
            v-model="$auth.local.username"
            label="Username"
            hint="This is only you display name"
            @change="update('account', 'username')" />
        </div>

        <div class="my-2"></div>

        <label class="form-label pb-2">Developer options</label>
        <p class="card-subtitle">Enable debugging and help us improve the platform</p>
        <div class="m-0">
          <label class="form-check form-switch form-switch-lg">
            <input
              v-model="$auth.config.debug"
              class="form-check-input"
              type="checkbox"
              @change="update('config', 'debug')" />
            <span class="form-check-label form-check-label-on">Debugging enabled</span>
            <span class="form-check-label form-check-label-off">
              Developer mode is off
            </span>
          </label>
        </div>
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
      Registered {{ $moment($auth.user.created_at).format('LL') }}
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\account\sections\me.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th November 2023
 * Modified: Tue Feb 20 2024
 **/

export default {
  name: 'AccountIndex',

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
    async update(store, field) {
      if (store == 'config') this.$auth.updateConfig(field)
      else this.$auth.updateAccount(field)

      this.$toast.success('Your preferences have been updated')
    },

    async init() {},
  },

  mounted() {
    this.init()
  },
}
</script>
