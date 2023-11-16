<template>
  <div class="card">
    <div class="list-group card-list-group">

      <div class="list-group-item"
        v-for="(app, i) in elements" :key="'game'+i">

        <div class="row g-2 align-items-center">
          <!-- <div class="col-auto fs-3">
            <label class="form-check form-switch">
              <input class="form-check-input" type="checkbox"
                v-model="app.import">
            </label>
          </div> -->
          <div class="col-auto"><input type="checkbox" class="form-check-input"></div>

          <div class="col-auto">
          <img v-if="i<60" loading="lazy" :src="`https://cdn.akamai.steamstatic.com/steam/apps/${app.appid}/capsule_184x69.jpg?t=1699291031`" class="bl-image" style="max-width: 100%; cursor: pointer;">
          </div>
          <div class="col">
            {{ app.name }}
            <pre>
              {{ app }}
            </pre>
            <!-- <div class="text-secondary">
              GOLEC UORKIESTRA,
              Gromee,
              Bedoes
            </div> -->
          </div>
          <div class="col-auto text-secondary">
            03:41
          </div>
          <div class="col-auto">
            <a href="#" class="link-secondary">
              <button class="switch-icon" data-bs-toggle="switch-icon">
                <span class="switch-icon-a text-muted">
                  <!-- Download SVG icon from http://tabler-icons.io/i/heart -->
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                </span>
                <span class="switch-icon-b text-red">
                  <!-- Download SVG icon from http://tabler-icons.io/i/heart -->
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                </span>
              </button>
            </a>
          </div>
          <div class="col-auto lh-1">
            <div class="dropdown">
              <a href="#" class="link-secondary" data-bs-toggle="dropdown"><!-- Download SVG icon from http://tabler-icons.io/i/dots -->
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path><path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path></svg>
              </a>
              <b-menu>
                <a class="dropdown-item" href="#">
                  Action
                </a>
                <a class="dropdown-item" href="#">
                  Another action
                </a>
              </b-menu>
            </div>
          </div>
        </div>
      </div>



    </div>
  </div>
</template>

<script>
export default {
  name: 'Games Browser',
  components: {},

  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {}
  },

  computed: {
    elements() {
      return this.items
        .sort((a, b) => b.playtime_forever - a.playtime_forever)
        .map((item) => ({
          ...item,
          import: true,
        }))
        .slice(0, 10)
    },
  },

  methods: {},
}
</script>

<style>
</style>
