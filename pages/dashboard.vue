<template>
  <!-- Page header -->
  <div class="page-header d-print-none">
    <div class="container-xl">
      <div class="row g-2 align-items-center">
        <div class="col">
          <h2 class="page-title">Dashboard</h2>
        </div>
      </div>
    </div>
  </div>

  <!-- Page body -->
  <div class="page-body">
    <div class="container-xl">
      <div class="row row-cards">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="row g-2 align-items-center">
                <div class="col-auto">
                  <span
                    class="avatar avatar-lg"
                    :style="`background-image: url(${$auth.user.avatar})`"></span>
                </div>
                <div class="col">
                  <h4 class="card-title m-0">
                    <a href="#">{{ $auth.user.username }}</a>
                  </h4>
                  <!-- <div class="text-muted">Working in Kare</div> -->
                </div>
                <!-- <div class="col-auto">
                  <a href="#" class="btn">Subscribe</a>
                </div> -->
                <!-- <div class="col-auto">
                  <div class="dropdown">
                    <a
                      href="#"
                      class="btn-action"
                      data-bs-toggle="dropdown"
                      aria-expanded="false">
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
                        <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                        <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                        <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                      </svg>
                    </a>
                    <div class="dropdown-menu dropdown-menu-end">
                      <a href="#" class="dropdown-item">Import</a>
                      <a href="#" class="dropdown-item">Export</a>
                      <a href="#" class="dropdown-item">Download</a>
                      <a href="#" class="dropdown-item text-danger">Delete</a>
                    </div>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <div class="subheader">Currently playing</div>
              <div class="h3 m-0">3 games</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\dashboard.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 13th March 2023
 * Modified: Thu Jan 04 2024
 **/

export default {
  setup() {},

  data() {
    return {}
  },

  computed: {
    ...mapStores(useStateStore),
  },

  methods: {},

  mounted() {
    console.log(this, this.$app)
    // This is just a test, ensures that i can do both
    // this.userstore and this.$auth, and is reactive
    // ...mapStores(useUserStore),
    // this.userStore.isChecked = 'pepe'
    // this.$auth.redirectTo = 'pepes'
    // console.warn(JSON.stringify(this.userStore), JSON.stringify(this.$auth))
  },
}
</script>
