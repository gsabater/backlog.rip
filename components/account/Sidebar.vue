<template>
  <client-only>
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
          <Icon name="tabler:fingerprint" size="14" class="me-2" />
          Your account
        </NuxtLink>
      </li>

      <li class="nav-item">
        <NuxtLink
          to="/account/preferences"
          class="nav-link"
          :style="$route.path.includes('preferences') ? 'color: white; ' : ''">
          <Icon name="tabler:settings" size="14" class="me-2" />
          Preferences
        </NuxtLink>
      </li>

      <li class="nav-item">
        <NuxtLink
          to="/account/integrations"
          class="nav-link"
          :style="$route.path.includes('integrations') ? 'color: white; ' : ''">
          <Icon name="tabler:transfer" size="14" class="me-2" />
          Integrations
        </NuxtLink>
      </li>

      <li class="nav-item">
        <NuxtLink
          to="/account/community"
          class="nav-link"
          :style="$route.path.includes('community') ? 'color: white; ' : ''">
          <Icon name="tabler:components" size="14" class="me-2" />
          Community
        </NuxtLink>
      </li>

      <!-- <li class="nav-item">
      <NuxtLink to="/account/history" class="nav-link">
        <Icon name="tabler:clock" size="14" class="me-2" />
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
          <Icon name="tabler:mist" size="14" class="me-2" />
          Lists
          <small class="ms-auto badge bg-secondary-lt font-mono">
            {{ format.num($app.count.lists) }}
          </small>
        </NuxtLink>
      </li>

      <li class="nav-item">
        <NuxtLink
          to="/account/states"
          class="nav-link"
          :style="$route.path.includes('states') ? 'color: white; ' : ''">
          <Icon name="tabler:background" size="14" class="me-2" />
          States

          <small class="ms-auto badge bg-secondary-lt font-mono">
            {{ format.num(Object.keys($app.count.states).length) }}
          </small>
        </NuxtLink>
      </li>

      <li class="nav-item">
        <NuxtLink
          to="/account/backups"
          class="nav-link"
          :style="isCloud ? 'color: white; n-padding-bottom: 0.25rem;' : ''">
          <Icon name="tabler:cloud-rain" size="14" class="me-2" />
          Backups
          <small
            v-if="$cloud.backup.is == 'local'"
            class="ms-auto badge bg-secondary-lt text-danger font-mono">
            Offline
          </small>
        </NuxtLink>
      </li>

      <li class="nav-item">
        <NuxtLink
          to="/account/database"
          class="nav-link"
          :style="$route.path.includes('database') ? 'color: white; ' : ''">
          <Icon name="tabler:database" size="14" class="me-2" />
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
      <!-- <li class="nav-item">
        <NuxtLink
          to="/platform/additions"
          class="nav-link"
          :style="
            $route.path.includes('additions') ? 'color: white; npadding-bottom: 0.25rem;' : ''
          ">
          <Icon name="tabler:refresh" size="14" class="me-2" />
          Updates
        </NuxtLink>
      </li> -->

      <li class="nav-item">
        <NuxtLink
          to="/account/logs"
          class="nav-link"
          :style="$route.path.includes('logs') ? 'color: white; ' : ''">
          <Icon name="tabler:bug" size="14" class="me-2" />
          Logs
        </NuxtLink>
      </li>

      <li class="nav-item">
        <NuxtLink to="/changelog" class="nav-link">
          <Icon name="tabler:broadcast" size="14" class="me-2" />
          Changelog
          <span class="badge bg-primary-lt ms-auto font-mono">{{ $app.v }}</span>
        </NuxtLink>
      </li>
    </ul>
  </client-only>
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
