<template>
  <div class="card mb-3" style="padding: 2.5rem">
    <div class="card-body">
      <div>
        <div class="d-flex mb-3">
          <h1 class="m-0">Linked libraries</h1>
        </div>
      </div>
      <p>
        Here you can link your profiles from other stores and platforms to your
        backlog.rip account.
      </p>
    </div>
  </div>

  <div class="card mb-3">
    <div class="card-body">
      <div class="row g-2 align-items-center">
        <div class="col-auto">
          <span class="avatar avatar-md bg-primary-lt" style="background-image: url(...)">
            <span v-if="!$auth.user.steam" class="badge bg-danger"></span>
            <Icon>BrandSteam</Icon>
          </span>
        </div>
        <div class="col ps-3">
          <h4 class="card-title m-0">
            <span>Steam Library</span>
          </h4>
          <div v-if="$auth.user.steam_updated_at" class="text-muted">
            Last sync, {{ dates.timeAgo($auth.user.steam_updated_at) }}
          </div>
          <!-- <div class="d-flex flex-direction-row">asdsadsad</div> -->
          <!-- <div class="small mt-1">
                    <span class="badge bg-green"></span> Online
                  </div> -->
        </div>
        <div class="col-auto me-5">
          <template v-if="$auth.user.steam">
            <span
              style="--tblr-status-color: #74b816; transform: translateY(-1px)"
              class="status-dot status-dot-animated me-2"></span>
            {{ $auth.user.steam_data.personaname }}
          </template>
          <template v-else>
            <div class="btn btn-outlined bg-secondary-subtle">
              <Icon class="me-2">LayersIntersect</Icon>
              Enable
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <div class="row align-items-center">
        <div class="col-auto">
          <label class="form-check form-switch m-0">
            <input
              v-model="$auth.config.autosync_steam"
              class="form-check-input position-static"
              type="checkbox"
              @change="update('config', 'autosync_steam')" />
            <span class="form-check-label form-check-label-on">
              Auto updates are enabled
            </span>
            <span class="form-check-label form-check-label-off">
              Enable automatic updates
            </span>
          </label>
        </div>
        <div class="col-auto ms-auto">
          <small
            v-tippy="{
              content:
                'Enable automatic updates to keep your Steam library in sync with your backlog.rip account. The update will run every 24 hours.',
              placement: 'top',
            }"
            class="text-muted cursor-help">
            More information
            <span class="form-help mx-2">?</span>
          </small>
        </div>
      </div>
    </div>
  </div>

  <div v-if="false" class="card mb-3">
    <div class="card-body">
      <div class="row g-2 align-items-center">
        <div class="col-auto">
          <span class="avatar avatar-md bg-primary-lt" style="background-image: url(...)">
            <span class="badge bg-danger"></span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-brand-steam"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path
                d="M16.5 5a4.5 4.5 0 1 1 -.653 8.953l-4.347 3.009l0 .038a3 3 0 0 1 -2.824 2.995l-.176 .005a3 3 0 0 1 -2.94 -2.402l-2.56 -1.098v-3.5l3.51 1.755a2.989 2.989 0 0 1 2.834 -.635l2.727 -3.818a4.5 4.5 0 0 1 4.429 -5.302z"></path>
              <circle cx="16.5" cy="9.5" r="1" fill="currentColor"></circle>
            </svg>
          </span>
        </div>
        <div class="col ps-3">
          <h4 class="card-title m-0">
            <a href="#">Steam Library</a>
            for private accounts
          </h4>
          <div class="text-muted">Not linked</div>
          <!-- <div class="small mt-1">
                    <span class="badge bg-green"></span> Online
                  </div> -->
        </div>
        <div class="col-auto">
          <a href="#" class="btn">Activate</a>
        </div>
        <div class="col-auto">
          <div class="dropdown">
            <a
              href="#"
              class="btn-action"
              data-bs-toggle="dropdown"
              aria-expanded="false">
              <!-- Download SVG icon from http://tabler-icons.io/i/dots-vertical -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
              </svg>
            </a>
            <div class="dropdown-menu dropdown-menu-end">
              <a href="#" class="dropdown-item">Import</a>
              <a href="#" class="dropdown-item">Export</a>
              <a href="#" class="dropdown-item">Download</a>
              <a href="#" class="dropdown-item text-danger">Delete</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="false" class="card mb-3">
    <div class="card-body">
      <div class="row g-2 align-items-center">
        <div class="col-auto">
          <span class="avatar avatar-md bg-primary-lt" style="background-image: url(...)">
            <span class="badge bg-danger"></span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-brand-steam"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path
                d="M16.5 5a4.5 4.5 0 1 1 -.653 8.953l-4.347 3.009l0 .038a3 3 0 0 1 -2.824 2.995l-.176 .005a3 3 0 0 1 -2.94 -2.402l-2.56 -1.098v-3.5l3.51 1.755a2.989 2.989 0 0 1 2.834 -.635l2.727 -3.818a4.5 4.5 0 0 1 4.429 -5.302z"></path>
              <circle cx="16.5" cy="9.5" r="1" fill="currentColor"></circle>
            </svg>
          </span>
        </div>
        <div class="col ps-3">
          <h4 class="card-title m-0">
            <a href="#">GOG Library</a>
          </h4>
          <div class="text-muted">Not linked</div>
          <!-- <div class="small mt-1">
                    <span class="badge bg-green"></span> Online
                  </div> -->
        </div>
        <div class="col-auto">
          <a href="#" class="btn">Activate</a>
        </div>
        <div class="col-auto">
          <div class="dropdown">
            <a
              href="#"
              class="btn-action"
              data-bs-toggle="dropdown"
              aria-expanded="false">
              <!-- Download SVG icon from http://tabler-icons.io/i/dots-vertical -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
              </svg>
            </a>
            <div class="dropdown-menu dropdown-menu-end">
              <a href="#" class="dropdown-item">Import</a>
              <a href="#" class="dropdown-item">Export</a>
              <a href="#" class="dropdown-item">Download</a>
              <a href="#" class="dropdown-item text-danger">Delete</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer disabled">
      <div class="row align-items-center">
        <div class="col-auto">
          <label class="form-check form-switch m-0">
            <input
              class="form-check-input position-static disabled"
              type="checkbox"
              disabled="" />
            <span class="form-check-label form-check-label-on">
              Auto updates are enabled
            </span>
            <span class="form-check-label form-check-label-off">
              Auto updates are not available
            </span>
          </label>
        </div>
        <div class="col-auto ms-auto">
          <small
            v-tippy="{
              content: 'Automatic updates are disabled for GOG libraries',
              placement: 'top',
            }"
            class="text-muted cursor-help">
            More information
            <span class="form-help mx-2">?</span>
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\account\sections\accounts.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 3rd January 2024
 * Modified: Tue Feb 20 2024
 **/

export default {
  name: 'AccountLinked',

  data() {
    return {}
  },

  computed: {
    section() {
      return this.$route.params.section
    },
  },

  methods: {
    async update(store, field) {
      if (store == 'config') this.$auth.updateConfig(field)
      else this.$auth.updateAccount(field)

      this.$toast.success('Your preferences have been updated')
    },
  },
}
</script>
