<template>
  <div class="card mb-3" style="padding: 1rem">
    <div class="card-body">
      <div>
        <div class="d-flex mb-3">
          <h1 class="m-0">Application logs</h1>
        </div>
      </div>
      <p>
        Here are the application logs, which capture what happens at the appliction while
        is running. These logs are helpful for identifying and fixing issues. However,
        they aren't saved and will be cleared each time the application is restarted.
      </p>
      <p>
        If you have found any issues, please report them on the
        <a href="https://discord.gg/F2sPE5B" target="_blank">Discord server</a>
      </p>
    </div>
  </div>

  <div
    class="divider"
    style="border-top: 1px dashed rgb(204 204 204 / 25%); margin: 2rem"></div>

  <ul v-if="logs && logs.length" class="timeline timeline-simple">
    <template v-for="(l, i) in logs" :key="i">
      <li class="timeline-event">
        <div class="timeline-event-icon bg-twitter-lt">
          <Icon>BrandTwitter</Icon>
        </div>
        <div class="card timeline-event-card">
          {{ l }}
          <div class="card-body">
            <div class="text-secondary float-end">10 hrs ago</div>
            <h4>{{ l.message }}</h4>
            <p class="text-secondary">
              <template v-if="l.args.length > 1">
                <span v-for="(arg, i) in l.args" :key="i" v-if="i > 0" class="d-block">
                  {{ arg }}
                </span>
              </template>
            </p>
          </div>
        </div>
      </li>
    </template>
  </ul>
</template>

<script>
/**
 * @file:    \pages\account\sections\logs.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 10th September 2024
 * Modified: Tue 10 September 2024 - 16:17:56
 **/

export default {
  name: 'ApplicationLogs',

  data() {
    return {}
  },

  computed: {
    logs() {
      return this.$app.log
    },
  },

  methods: {},
}
</script>
