<template>
  <div class="card">
    <div class="card-body">
      <h2 class="mb-4">Profile</h2>
      <p>This is how others will see  you</p>
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
      <h3 class="card-title mt-4">Business Profile</h3>
      <div class="row g-3">
        <div class="col-md nope-col-lg-8">
          <div class="form-label">Username</div>
          <b-input
            v-model="user.username"
            hint="Lorem" />
        </div>

        <div class="col-12">
          <b-btn @click="ins">Update profile</b-btn>
        </div>


      </div>
      <h3 class="card-title mt-4">Email</h3>
      <p class="card-subtitle">This contact will be shown to others publicly, so choose it carefully.</p>
      <div>
        <div class="row g-2">
          <div class="col-auto">
            <input type="text" class="form-control w-auto" value="paweluna@howstuffworks.com">
          </div>
          <div class="col-auto"><a href="#" class="btn">
              Change
            </a></div>
        </div>
      </div>
      <h3 class="card-title mt-4">Password</h3>
      <p class="card-subtitle">You can set a permanent password if you don't want to use temporary login codes.</p>
13956300      <div>
        <a href="#" class="btn">
          Set new password
        </a>
      </div>
      <h3 class="card-title mt-4">Public profile</h3>
      <p class="card-subtitle">Making your profile public means that anyone on the Dashkit network will be able to find
        you.</p>
      <div>
        <label class="form-check form-switch form-switch-lg">
          <input class="form-check-input" type="checkbox">
          <span class="form-check-label form-check-label-on">You're currently visible</span>
          <span class="form-check-label form-check-label-off">You're
            currently invisible</span>
        </label>
      </div>
    </div>
                    <div class="card-footer bg-transparent mt-auto">
                      <div class="btn-list justify-content-end">
                        <a href="#" class="btn">
                          Cancel
                        </a>
                        <a href="#" class="btn btn-primary">
                          Submit
                        </a>
                      </div>
                    </div>


              </div>

</template>

<script>
export default {
  data() {
    return {
      user: {},

      db: {
        user: {},
      },
    }
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

    async getData() {
      this.db.user = await this.$db.get('config', 'me')
      this.user = { ...this.db.user }
    },

    async init() {
      await this.getData()
      // this.ui.loading = false
    },
  },

  mounted() {
    this.init()
  },
}
</script>
