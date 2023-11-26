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
                  <div class="text-muted">Working in Kare</div>
                </div>
                <div class="col-auto">
                  <a href="#" class="btn">Subscribe</a>
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
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-xl-3">
          <!-- <pre>
                  {{ $db }}
                </pre> -->
          <b-btn @click="check">check</b-btn>
          <b-btn @click="anadir">anadir</b-btn>
          <b-btn @click="leer">leer</b-btn>
          <b-btn @click="testemit">test emit</b-btn>
          <hr />
          <fieldset>
            <legend>Add new friend</legend>
            <label>
              Name:
              <input v-model="friendName" type="text" />
            </label>
            <br />
            <label>
              Age:
              <input v-model="friendAge" type="number" />
            </label>
            <br />
            <button @click="addFriend">Add Friend</button>
            <p>{{ status }}</p>
          </fieldset>
          <div class="card card-sm">
            <div class="card-body">
              <pre>
                      {{ $auth.user }}
                    </pre
              >
              <div class="row align-items-center">
                <div class="col-auto">
                  <span class="bg-primary text-white avatar">
                    <!-- Download SVG icon from http://tabler-icons.io/i/currency-dollar -->
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
                      <path
                        d="M16.7 8a3 3 0 0 0 -2.7 -2h-4a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-4a3 3 0 0 1 -2.7 -2"></path>
                      <path d="M12 3v3m0 12v3"></path>
                    </svg>
                  </span>
                </div>
                <div class="col">
                  <div class="font-weight-medium">132 Sales</div>
                  <div class="text-muted">12 waiting payments</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {},

  data() {
    return {
      show: false,
      element: null,

      status: '',
      friendName: '',
      friendAge: this.defaultAge,
    }
  },

  computed: {
    // ...mapStores(useUserStore),
  },

  methods: {
    async check() {
      const t = await this.$db.friends
        .where('super')
        .below(60)

        .each(function (user) {
          console.log('Found user: ' + user.name)
        })
      console.log(t)
    },

    async anadir() {
      await this.$db.config.setItem('xxdd', 'heeey' + Math.random())
      await this.$db.config.setItem('440', {
        appid: 440,
        is_deleted: 0,
        slug: 'team-fortress-2',
        name: 'Team Fortress 2',
        short_description:
          'Nine distinct classes provide a broad range of tactical abilities and personalities. Constantly updated with new game modes, maps, equipment and, most importantly, hats!',
        type: 'game',
        has_demo: 0,
        attributes: {
          cards: true,
          inApp: true,
          workshop: true,
          controller: true,
          multiPlayer: true,
          achievements: 520,
        },
        platforms: {
          windows: true,
          mac: true,
          linux: true,
        },
        price: 0,
        stores: [],
        scores: {
          metascore: 92,
          userscore: 90,
          steamscore: 93,
          metacriticURL: 'https://www.metacritic.com/game/pc/team-fortress-2',
          steamscoreAlt: 'Very Positive',
          steamscoreCount: 19225,
        },
        charts: {
          current: '70,844',
          peaktoday: '75,517',
          peakall: '150,037',
        },
        hltb: {
          url: 'https://howlongtobeat.com/game/9632',
          main: null,
          extras: null,
          completionist: null,
        },
        tags: [
          'Free to Play',
          'Hero Shooter',
          'Multiplayer',
          'FPS',
          'Shooter',
          'Action',
          'Class-Based',
          'Team-Based',
          'Funny',
          'First-Person',
          'Online Co-Op',
          'Competitive',
          'Cartoony',
          'Trading',
          'Co-op',
        ],
        languages: [
          'English',
          'Danish',
          'Dutch',
          'Finnish',
          'French',
          'German',
          'Italian',
          'Japanese',
          'Norwegian',
          'Polish',
          'Portuguese - Portugal',
          'Russian',
          'Simplified Chinese',
          'Spanish - Spain',
          'Swedish',
          'Traditional Chinese',
          'Korean',
          'Czech',
          'Hungarian',
          'Portuguese - Brazil',
          'Turkish',
          'Greek',
          'Bulgarian',
          'Romanian',
          'Thai',
          'Ukrainian',
        ],
        screenshots: [
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_ea21f7bbf4f79bada4554df5108d04b6889d3453.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_ea21f7bbf4f79bada4554df5108d04b6889d3453.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_e3aedb2ab36bba8cfe611b1e0eaa807e4bb2d742.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_e3aedb2ab36bba8cfe611b1e0eaa807e4bb2d742.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_ee24a769dc1d81dcbd7b250d16530394adee4264.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_ee24a769dc1d81dcbd7b250d16530394adee4264.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_9faaa506d91bf19dbb398e0c06a684b337f85f91.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_9faaa506d91bf19dbb398e0c06a684b337f85f91.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_7de978f22a7059151c31d0488dc57c5c7703c48b.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_7de978f22a7059151c31d0488dc57c5c7703c48b.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_e79f2490af3247b4b0f8d412d437b72c321cfe3b.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_e79f2490af3247b4b0f8d412d437b72c321cfe3b.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_8f28c75172e3d08e65222725202b82f58bfe7df7.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_8f28c75172e3d08e65222725202b82f58bfe7df7.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002574.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002574.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002575.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002575.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002576.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002576.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002577.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002577.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002578.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002578.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002579.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002579.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002580.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002580.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002581.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002581.1920x1080.jpg',
          },
        ],
        updated_at: '2023-06-25 17:05:18',
        released_at: '2007-10-10 00:00:00',
      })
      console.warn('anadido')
    },

    async addFriend() {
      try {
        // Add the new friend!
        const id = await this.$db.friends.add({
          name: this.friendName,
          age: this.friendAge,
          super: Math.random() * 100,
        })

        this.status = `Friend ${this.friendName}
          successfully added. Got id ${id}`

        // Reset form:
        this.friendName = ''
        this.friendAge = this.defaultAge
      } catch (error) {
        this.status = `Failed to add
          ${this.friendName}: ${error}`
      }
    },

    async leer() {
      console.warn(await this.$db.config.getItem('xxdd'))
    },

    testemit() {
      console.log('testemit')
      this.$mitt.emit('data:updated', 'loaded')
    },
  },

  mounted() {
    // This is just a test, ensures that i can do both
    // this.userstore and this.$auth, and is reactive
    // ...mapStores(useUserStore),
    // this.userStore.isChecked = 'pepe'
    // this.$auth.redirectTo = 'pepes'
    // console.warn(JSON.stringify(this.userStore), JSON.stringify(this.$auth))
  },
}
</script>
