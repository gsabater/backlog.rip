<template>
  <div class="row g-2 align-items-center">
    <div class="col">
      <h3>Your account</h3>
    </div>
  </div>

  <ul class="nav nav-pills nav-vertical">
    <!--

      <li>Account history</li>

      <li>Give Feedback</li>

      <li>---</li> -->
    <li class="nav-item">
      <NuxtLink
        to="/account/me"
        class="nav-link"
        :style="$route.path.includes('me') ? 'color: white; ' : ''">
        <Icon size="14" class="me-2">Fingerprint</Icon>
        Your account
      </NuxtLink>
    </li>

    <li class="nav-item">
      <NuxtLink
        to="/account/preferences"
        class="nav-link"
        :style="$route.path.includes('preferences') ? 'color: white; ' : ''">
        <Icon size="14" class="me-2">Settings</Icon>
        Preferences
      </NuxtLink>
    </li>

    <li v-if="$app.wip" class="nav-item">
      <NuxtLink
        to="/account/community"
        class="nav-link"
        :style="$route.path.includes('community') ? 'color: white; ' : ''">
        <Icon size="14" class="me-2">Components</Icon>
        Community
      </NuxtLink>
    </li>

    <li class="nav-item">
      <NuxtLink
        to="/account/backups"
        class="nav-link"
        :style="isCloud ? 'color: white; n-padding-bottom: 0.25rem;' : ''">
        <Icon size="14" class="me-2">CloudRain</Icon>
        Backups
      </NuxtLink>
    </li>

    <!-- <template v-if="isCloud">
      <li>
        <a href="#settings" class="nav-link ms-2 pb-0">
          <Icon size="6" width="1" class="me-2">PointFilled</Icon>
          Cloud settings
        </a>
      </li>

      <li>
        <a href="#status" class="nav-link ms-2 pb-0">
          <Icon size="6" width="1" class="me-2">PointFilled</Icon>
          Synchronization status
        </a>
      </li>
      <li>
        <a href="#quota" class="nav-link ms-2">
          <Icon size="6" width="1" class="me-2">PointFilled</Icon>
          Used quota
        </a>
      </li>
    </template> -->

    <li class="nav-item">
      <NuxtLink
        to="/account/integrations"
        class="nav-link"
        :style="$route.path.includes('integrations') ? 'color: white; ' : ''">
        <Icon size="14" class="me-2">CloudNetwork</Icon>
        Integrations
      </NuxtLink>
    </li>

    <!-- <li class="nav-item">
      <NuxtLink to="/account/history" class="nav-link">
        <Icon size="14" class="me-2">Clock</Icon>
        history
      </NuxtLink>
    </li> -->
  </ul>

  <div class="row g-2 align-items-center mt-4">
    <div class="col">
      <h3>Your data</h3>
    </div>
  </div>

  <ul class="nav nav-pills nav-vertical">
    <li class="nav-item">
      <NuxtLink
        to="/account/lists"
        class="nav-link"
        :style="$route.path.includes('lists') ? 'color: white; npadding-bottom: 0.25rem;' : ''">
        <Icon size="14" class="me-2">Mist</Icon>
        Lists
        <small class="ms-auto badge bg-secondary-lt">
          {{ format.num($app.count.lists) }}
        </small>
      </NuxtLink>
    </li>

    <!-- <template v-if="$route.path.includes('lists')">
      <li @click.prevent="$mitt.emit('list:create')">
        <a href="#" class="nav-link ms-2">
          <Icon size="14" width="1" class="me-2">SquareRoundedPlus</Icon>
          Create a new list
        </a>
      </li>
    </template> -->

    <li class="nav-item">
      <NuxtLink
        to="/account/states"
        class="nav-link"
        :style="$route.path.includes('states') ? 'color: white; ' : ''">
        <Icon size="14" class="me-2">Background</Icon>
        States

        <small class="ms-auto badge bg-secondary-lt">
          {{ format.num(Object.keys($app.count.states).length) }}
        </small>
      </NuxtLink>
    </li>

    <li class="nav-item">
      <NuxtLink
        to="/account/database"
        class="nav-link"
        :style="$route.path.includes('database') ? 'color: white; ' : ''">
        <Icon size="14" class="me-2">Database</Icon>
        Database
      </NuxtLink>
    </li>
  </ul>

  <div class="row g-2 align-items-center mt-4">
    <div class="col">
      <h3>The site</h3>
    </div>
  </div>

  <ul class="nav nav-pills nav-vertical">
    <li class="nav-item">
      <NuxtLink
        to="/platform/additions"
        class="nav-link"
        :style="$route.path.includes('additions') ? 'color: white; npadding-bottom: 0.25rem;' : ''">
        <Icon size="14" class="me-2">Mist</Icon>
        Additions
      </NuxtLink>
    </li>

    <li class="nav-item">
      <NuxtLink
        to="/account/logs"
        class="nav-link"
        :style="$route.path.includes('logs') ? 'color: white; ' : ''">
        <Icon size="14" class="me-2">Bug</Icon>
        Logs
      </NuxtLink>
    </li>

    <li class="nav-item">
      <NuxtLink to="/changelog" class="nav-link">
        <Icon size="14" class="me-2">Bug</Icon>
        Changelog
        <span class="badge bg-primary-lt ms-auto">{{ $app.v }}</span>
      </NuxtLink>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'AccountSidebar',

  data() {
    return {}
  },

  computed: {
    isCloud() {
      return this.$route.path.includes('backups') && this.$auth.hasCloud
    },
  },

  methods: {},
}
</script>
