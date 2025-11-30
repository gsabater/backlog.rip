<template>
  <div class="card">
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
      <div class="row g-3">
        <div class="col-md-12 nope-col-lg-8 mb-3">
          <div class="form-label font-serif">Your username</div>
          <!-- <h4 class="card-title mb-2">Username2</h4> -->
          <v-text-field
            v-model="$auth.me.username"
            density="comfortable"
            persistent-hint
            hint="This is only you display name"
            @change="update('username', $auth.me.username)" />
        </div>

        <!-- <div class="col-md-12">
          <div class="form-group form-group-default required">
            <label>Label1</label>
            <v-text-field
              density="comfortable"
              variant="default"
              placeholder="pepepe"
              hint="This is only you display name"
              :rules="[(v) => !!v || 'Label is required']"
              @change="update('username', $auth.me.username)" />
          </div>
        </div> -->

        <!-- <div class="mb-3">
          <label class="form-label">Floating inputs</label>
          <div class="form-floating mb-3">
            <input
              type="email"
              class="form-control"
              id="floating-input"
              value="name@example.com"
              autocomplete="off" />
            <label for="floating-input">Email address</label>
          </div>
          <div class="form-floating mb-3">
            <input
              type="password"
              class="form-control"
              id="floating-password"
              value="Password"
              autocomplete="off" />
            <label for="floating-password">Password</label>
          </div>
          <div class="form-floating">
            <select
              class="form-select"
              id="floatingSelect"
              aria-label="Floating label select example">
              <option selected="">Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
            <label for="floatingSelect">Select</label>
          </div>
        </div> -->

        <!-- <div v-if="false && $app.wip" class="mb-3">
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
        </div> -->
        <div v-if="$app.wip && $cloud.sub" class="mb-3">
          <div class="form-check-description ms-1" style="vertical-align: top">
            <Icon
              size="14"
              width="1.5"
              class="tabler-icon tabler-icon-click mt-1 me-2"
              style="vertical-align: top">
              Click
            </Icon>
            <div class="d-inline-block">
              To change your appearance on the site community pages
              <br />
              go to the
              <NuxtLink to="/account/community">community configuration</NuxtLink>
            </div>
          </div>
        </div>

        <!-- <div class="my-2"></div>

        <label class="form-label pb-2">Developer options</label>
        <p class="card-subtitle">Enable debugging and help us improve the platform</p>
        <div class="m-0">
          <label class="form-check form-switch form-switch-lg">
            <input
              type="checkbox"
              class="form-check-input"
              v-model="$auth.config.debug"
              @change="update('config', 'debug')" />
            <span class="form-check-label form-check-label-on">Debugging enabled</span>
            <span class="form-check-label form-check-label-off">
              Developer mode is off
            </span>
          </label>
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
      <small>
        Registered {{ $moment($auth.user.created_at).format('LL') }}
        <template v-if="$cloud.sub">
          🔸

          <span v-tippy="'This is your cloud user identifier'" class="text-muted cursor-help">
            <Icon width="1.2" size="14" class="me-1" style="transform: translateY(-1px)">
              CloudRain
            </Icon>
            <strong>... {{ ($cloud?.sub || '').substr(-8) }}</strong>
          </span>
        </template>
      </small>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\account\sections\me.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th November 2023
 * Modified: 31st October 2025 - 12:26:23
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
    async update(field, value) {
      this.$auth.update(field, value)
      this.$toast.success('Your preferences have been updated')

      // if (store == 'config') this.$auth.setConfig(field)
      // else this.$auth.updateAccount(field)
    },

    async init() {},
  },

  mounted() {
    this.init()
  },
}
</script>
