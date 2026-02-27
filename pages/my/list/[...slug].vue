<template>
  <!-- <ClientOnly> -->
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
        <div class="col-lg-9" v-if="mode == 'viewer'">
          <list-viewer v-if="mode == 'viewer'" @showEditor="mode = 'editor'" />
        </div>

        <template v-if="mode == 'editor'">
          <list-editor v-if="mode == 'editor'" ref="editor" @stored="mode = 'viewer'" />
        </template>

        <div class="col-lg-3">
          <div style="position: sticky; top: 20px">
            <list-cover :list="list" class="my-3" />

            <!-- <div class="text-center">
              <h2 class="mb-1">{{ list.name }}</h2>
            </div> -->
            <div class="card">
              <div class="card-body">
                <h2 class="lh-1">{{ list.name }}</h2>

                <div class="text-secondary mb-2" v-if="list.description">
                  {{ list.description }}
                </div>
              </div>

              <div
                class="card-footer small"
                style="display: flex; flex-direction: column; line-height: 23px">
                <span>
                  <Icon
                    name="tabler:calendar-week"
                    class="me-1"
                    style="transform: translateY(1px)" />
                  Created
                  {{ $moment(list.created_at).format('MMMM, YYYY') }}
                </span>

                <span>
                  <Icon
                    name="tabler:rotate-clockwise-2"
                    class="me-1"
                    style="transform: translateY(1px)" />
                  Last updated
                  {{ $moment(list.updated_at).format('LL') }}
                </span>
              </div>

              <div class="card-footer p-2">
                <template v-if="mode == 'viewer'">
                  <v-btn
                    class="my-2"
                    block
                    variant="tonal"
                    color="rgb(135 140 195)"
                    @click="mode = 'editor'">
                    Edit games
                  </v-btn>
                  <v-btn
                    class="my-2"
                    block
                    variant="tonal"
                    color="rgb(135 140 195)"
                    @click.stop="$refs.crud.edit(list)">
                    List details
                  </v-btn>
                </template>
                <template v-if="mode == 'editor'">
                  <v-btn
                    block
                    variant="tonal"
                    color="green-darken-2"
                    @click="$refs.editor.submit()"
                    class="mb-2">
                    Save changes
                  </v-btn>
                  <v-btn block color="secondary" variant="text" @click="backToList">
                    Cancel edits
                  </v-btn>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- </ClientOnly> -->

  <list-crud-dialog ref="crud" @stored="$forceUpdate()" @deleted="$forceUpdate()" />
</template>

<script>
/**
 * @file:    \pages\my\list\[...slug].vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 30th September 2024
 * Modified: 27th February 2026 - 13:56:59
 **/

export default {
  name: 'MyList',

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
    ...mapStores(useDataStore, useListStore),
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
      const slug = this.$route.params.slug[0]

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

      const slug = this.$route.params.slug[0]
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
  --corner-gradient:
    transparent 0px, transparent calc(var(--r) - var(--transition-length)), black var(--r);
  --fill-gradient:
    black, black var(--inset), transparent calc(var(--inset) + var(--transition-length)),
    transparent calc(100% - var(--transition-length) - var(--inset)),
    black calc(100% - var(--inset));
  --fill-narrow-size: calc(100% - (var(--inset) + var(--r)) * 2);
  --fill-farther-position: calc(var(--inset) + var(--r));
  -webkit-mask-image:
    linear-gradient(to right, var(--fill-gradient)),
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
