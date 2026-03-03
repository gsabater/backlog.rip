<template>
  <div
    class="d-lg-block dropdown-menu bg-transparent thin-scroll"
    style="
      height: calc(100% - 250px);
      overflow-y: auto;
      overflow-x: hidden;
      border-radius: 4px;
      margin-right: 1px;
    ">
    <!--
      *+---------------------------------
      *| Explore
      *+--------------------------------- -->
    <span class="dropdown-header">
      <span class="text-muted my-2">Explore</span>
    </span>

    <!-- <div class="dropdown-item disabled text-white">
            <h6 class="m-0">Explore</h6>
          </div> -->

    <NuxtLink to="/games" class="dropdown-item">
      <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
        <Icon
          name="tabler:layout-dashboard"
          size="14"
          class="text-muted"
          style="transform: translateY(1px)" />
      </span>
      <span class="nav-link-title">Games</span>
    </NuxtLink>

    <NuxtLink to="/genres" class="dropdown-item">
      <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
        <Icon
          name="tabler:triangle"
          size="14"
          class="text-muted"
          style="transform: translateY(1px)" />
      </span>
      <span class="nav-link-title">Genres</span>
    </NuxtLink>

    <NuxtLink to="/community/lists" class="dropdown-item">
      <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
        <Icon name="tabler:mist" size="14" class="text-muted" style="transform: translateY(1px)" />
      </span>
      <span class="nav-link-title">Lists</span>
    </NuxtLink>

    <!-- <div class="dropdown-divider"></div>

    <span class="dropdown-header">
      <span class="text-muted my-2">Community</span>
    </span>



    <NuxtLink v-if="$app.dev" class="dropdown-item" style="opacity: 0.5">
      <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
        <Icon name="tabler:home" size="14" class="text-muted" style="transform: translateY(1px)">Components</Icon>
      </span>
      <span class="nav-link-title">Dashboard</span>
    </NuxtLink> -->
    <!--

          <NuxtLink to="/journal" class="dropdown-item">
            <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
              <Icon name="tabler:home" size="14" class="text-muted" style="transform: translateY(1px)">Notebook</Icon>
            </span>
            <span class="nav-link-title">Journal</span>
            <small class="ms-auto text-secondary font-mono">
              {{ $moment().format('DD/MM') }}
            </small>
          </NuxtLink> -->

    <!-- <div class="dropdown-divider"></div>
          <span class="dropdown-header control-hover" style="pointer-events: all">
            <Icon
              style="float: right; outline: none; transform: translateX(4px)"
              class="ms-auto text-secondary font-mono show-hover cursor-pointer"
              size="14" class="text-muted" style="transform: translateY(1px)"
              v-tippy="'Create a new list'"
              @click.prevent="$mitt.emit('list:create')">
              SquareRoundedPlus
            </Icon>
            <span class="text-muted my-2">Your Lists</span>
          </span> -->

    <div class="dropdown-divider"></div>

    <client-only>
      <span class="dropdown-header">
        <span class="text-muted my-2">Your library</span>
      </span>

      <NuxtLink to="/library" class="dropdown-item control-hover">
        <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
          <Icon
            name="tabler:cards"
            size="14"
            class="text-muted"
            style="transform: translateY(1px)" />
        </span>
        <span class="nav-link-title">Your games</span>

        <small class="ms-auto text-secondary font-mono hide-hover">
          {{ format.num($app.count.library) }}
        </small>

        <Icon
          v-tippy="'Import your library'"
          style="outline: none; transform: translateX(4px)"
          class="ms-auto me-1 text-secondary show-hover cursor-pointer"
          size="14"
          name="tabler:refresh"
          @click.prevent="goTo('/import')" />

        <!-- <Icon
          v-tippy="'Configure'"
          style="outline: none; transform: translateX(4px)"
          class="ms-auto me-1 text-secondary show-hover cursor-pointer"
          size="15"
          name="tabler:settings-2"
          @click.prevent="goTo('/account/preferences')" /> -->
      </NuxtLink>

      <NuxtLink to="/account/lists" class="dropdown-item control-hover">
        <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
          <Icon
            name="tabler:mist"
            size="14"
            class="text-muted"
            style="transform: translateY(1px)" />
        </span>

        <span class="nav-link-title">Your lists</span>

        <small class="ms-auto text-secondary font-mono hide-hover">
          {{ format.num($app.count.lists) }}
        </small>

        <Icon
          v-tippy="'Create a new list'"
          style="float: right; outline: none; transform: translateX(4px)"
          class="ms-auto me-1 text-secondary show-hover cursor-pointer"
          size="15"
          name="tabler:square-rounded-plus"
          @click.prevent="$mitt.emit('list:create')" />
      </NuxtLink>

      <NuxtLink v-if="$auth.menu.favorites" to="/library/favorites" class="dropdown-item">
        <div class="content d-flex align-items-center w-100">
          <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
            <Icon
              name="tabler:heart"
              size="14"
              class="text-muted"
              style="transform: translateY(1px)" />
          </span>
          <span class="nav-link-title me-4">Favorites</span>
          <small v-if="$app.count.fav > 0" class="ms-auto text-secondary font-mono">
            {{ format.num($app.count.fav) }}
          </small>
        </div>
      </NuxtLink>

      <NuxtLink v-if="$auth.menu.pinned" to="/library/pinned" class="dropdown-item">
        <div class="content d-flex align-items-center w-100">
          <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
            <Icon
              name="tabler:bookmark"
              size="14"
              class="text-muted"
              style="transform: translateY(1px)" />
          </span>

          <span class="nav-link-title me-4">Pinned</span>
          <small v-if="$app.count.pinned > 0" class="ms-auto text-secondary font-mono">
            {{ format.num($app.count.pinned) }}
          </small>
        </div>
      </NuxtLink>

      <NuxtLink
        v-for="(state, i) in pinnedStates"
        :key="'state' + i"
        :to="'/library/' + state.slug"
        class="dropdown-item ps-3">
        <div class="content d-flex align-items-center w-100 ps-1">
          <span
            v-if="state.id == -1"
            class="status-dot me-2"
            style="
              transform: translateX(-4px);
              background-color: transparent;
              border: 1px solid #8b8b8b;
            "></span>
          <span
            v-else
            class="status-dot me-2"
            style="transform: translateX(-4px)"
            :style="{ 'background-color': state.color || '' }"></span>

          <span class="ps-1 me-4">{{ state.name }}</span>

          <small v-if="$app.count.states[state.key] > 0" class="ms-auto text-secondary font-mono">
            {{ format.num($app.count.states[state.key]) }}
          </small>
        </div>
      </NuxtLink>

      <!-- <NuxtLink to="/import" class="dropdown-item">
        <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
          <Icon
            name="tabler:refresh"
            size="14"
            class="text-muted"
            style="transform: translateY(1px)" />
        </span>
        <span class="nav-link-title">Library sync</span>
        <small class="ms-auto text-secondary font-mono">
          <Icon
            name="tabler:sparkles-2"
            size="14"
            class="text-muted"
            style="transform: translateY(1px)" />
        </small>
      </NuxtLink> -->
    </client-only>
  </div>
</template>

<script>
/**
 * @file:    \components\common\layout\SidebarNav.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 26th March 2025
 * Modified: 17th February 2026 - 11:56:14
 **/

export default {
  name: 'SidebarNav',

  computed: {
    ...mapState(useStateStore, ['states', 'pinnedStates']),
  },

  methods: {
    goTo(path) {
      this.$router.push(path)
    },
  },
}
</script>
