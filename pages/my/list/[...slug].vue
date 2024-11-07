<template>
  <div class="page-body">
    <div class="container-xl">
      <div v-if="!ui.ready" class="row row-cards">
        <div class="col-lg-2"></div>
        <div class="col-lg-8">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="subheader">Loading list</div>
              </div>
              <div class="h3 m-0">
                {{ list.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="ui.ready" class="row row-cards">
        <div class="col-lg-2" style="width: 20%">
          <div class="p-2 pt-4">
            <ClientOnly>
              <list-cover :games="list.games" class="mb-3" />
            </ClientOnly>
          </div>

          <div class="text-center">
            <h2 class="mb-1">{{ list.name }}</h2>
            <p>
              Local only 🔸 {{ $moment(list.created_at).format('YYYY') }} 🔸
              {{ list.games.length }} games
              <!-- 🔸 By @gsabater -->
            </p>

            <small v-if="list.description" class="d-block text-muted my-3">
              {{ list.description }}
            </small>
          </div>

          <div v-if="mode == 'viewer'" class="d-flex justify-content-center mb-4">
            <v-btn
              class="me-2"
              color="primary"
              @click.stop="$refs.crud.edit(list)"
              variant="tonal">
              Edit details
            </v-btn>

            <v-btn color="primary" @click="mode = 'editor'" variant="tonal">
              Add games
            </v-btn>
          </div>

          <div v-else class="d-flex justify-content-center mb-4">
            <v-btn class="me-2" color="secondary" variant="text" @click="backToList">
              <Icon size="16" width="1" class="me-1">ArrowLeft</Icon>
              Cancel
            </v-btn>

            <v-btn color="primary" variant="tonal" @click="$refs.editor.submit()">
              Save list
            </v-btn>
          </div>
        </div>
        <div class="col"></div>
        <div class="col-lg-9">
          <list-viewer v-if="mode == 'viewer'" />
          <list-editor ref="editor" v-if="mode == 'editor'" @stored="mode = 'viewer'" />

          <list-crud-dialog
            ref="crud"
            @stored="$forceUpdate()"
            @deleted="$forceUpdate()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\my\list\[...slug].vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 30th September 2024
 * Modified: Thu 07 November 2024 - 11:59:18
 **/

export default {
  name: 'MyList',

  // async setup() {
  //   // Preload data during SSR using useAsyncData
  //   const { data, error } = await useAsyncData(
  //     'userData',
  //     () => $fetch('https://jsonplaceholder.typicode.com/users/1') // Example API to fetch user data
  //   )

  //   return { data, error }
  // },

  data() {
    return {
      mode: 'viewer',

      ui: {
        ready: false,
        loading: false,
      },
    }
  },

  computed: {
    ...mapStores(useDataStore, useStateStore, useListStore),
    ...mapState(useStateStore, ['states']),
    ...mapState(useListStore, ['list']),
  },

  watch: {
    '$app.ready': function () {
      this.init()
    },
  },

  methods: {
    async backToList() {
      this.loadData()
      this.mode = 'viewer'
      let slug = this.$route.params.slug[0]

      navigateTo('/my/list/' + slug, { replace: true })
    },

    //+-------------------------------------------------
    // loadData()
    // Requests the store to load the list from the slug
    // -----
    // Created on Tue Oct 15 2024
    //+-------------------------------------------------
    async loadData() {
      this.ui.ready = false

      let slug = this.$route.params.slug[0]
      await this.listStore.use(slug)

      this.ui.ready = true
    },

    //+-------------------------------------------------
    // init()
    // Initializes and loads the list when ready
    // -----
    // Created on Tue Oct 15 2024
    //+-------------------------------------------------
    async init() {
      if (!this.$app.ready) return

      this.loadData()

      if (this.$route.params.slug.includes('edit')) {
        this.mode = 'editor'
      }
    },
  },

  mounted() {
    this.init()
  },
}
</script>

<style>
.list-gold {
  color: #f1c40f;
}
.list-silver {
  color: #e3c800;
}
.list-bronze {
  color: #c9a000;
}

.blur-vignette {
  --radius: 12px;
  --inset: 14px;
  --transition-length: 60px;
  --blur: 21px;

  position: absolute;
  inset: 0;
  border-radius: var(--radius);
  -webkit-backdrop-filter: blur(var(--blur));
  backdrop-filter: blur(var(--blur));
  --r: max(var(--transition-length), calc(var(--radius) - var(--inset)));
  --corner-size: calc(var(--r) + var(--inset)) calc(var(--r) + var(--inset));
  --corner-gradient: transparent 0px,
    transparent calc(var(--r) - var(--transition-length)), black var(--r);
  --fill-gradient: black, black var(--inset),
    transparent calc(var(--inset) + var(--transition-length)),
    transparent calc(100% - var(--transition-length) - var(--inset)),
    black calc(100% - var(--inset));
  --fill-narrow-size: calc(100% - (var(--inset) + var(--r)) * 2);
  --fill-farther-position: calc(var(--inset) + var(--r));
  -webkit-mask-image: linear-gradient(to right, var(--fill-gradient)),
    linear-gradient(to bottom, var(--fill-gradient)),
    radial-gradient(at bottom right, var(--corner-gradient)),
    radial-gradient(at bottom left, var(--corner-gradient)),
    radial-gradient(at top left, var(--corner-gradient)),
    radial-gradient(at top right, var(--corner-gradient));
  -webkit-mask-size:
    100% var(--fill-narrow-size),
    var(--fill-narrow-size) 100%,
    var(--corner-size),
    var(--corner-size),
    var(--corner-size),
    var(--corner-size);
  -webkit-mask-position:
    0 var(--fill-farther-position),
    var(--fill-farther-position) 0,
    0 0,
    100% 0,
    100% 100%,
    0 100%;
  -webkit-mask-repeat: no-repeat;
}

@-webkit-keyframes animateBg {
  0% {
    background-position: 0% 54%;
  }
  50% {
    background-position: 100% 47%;
  }
  100% {
    background-position: 0% 54%;
  }
}

@keyframes animateBg {
  0% {
    background-position: 0% 54%;
  }
  50% {
    background-position: 100% 47%;
  }
  100% {
    background-position: 0% 54%;
  }
}
</style>
