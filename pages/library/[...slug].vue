<template>
  <div class="page-header d-print-none">
    <div class="container-xl">
      <div class="row g-2 align-items-center">
        <div class="col">
          <div class="page-pretitle">Your games</div>
          <h2 class="page-title text-capitalize cursor-pointer d-inline-block">
            {{ source }}
            <Icon
              size="12"
              class="text-muted ms-1"
              style="width: 1rem; transform: translateY(2px)">
              ChevronDown
            </Icon>

            <b-dropdown style="overflow: visible; min-width: 240px">
              <span class="dropdown-header">This is your complete library</span>

              <NuxtLink to="/library" class="dropdown-item">
                <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
                  <Icon size="18" width="1.5">LayoutDashboard</Icon>
                </span>
                <span class="nav-link-title">Your library</span>
                <small class="ms-auto text-secondary me-1">
                  {{ format.num($app.count.library) }}
                </small>
              </NuxtLink>

              <NuxtLink
                v-if="$auth.config.favorites"
                to="/library/favorites"
                class="dropdown-item pe-2">
                <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
                  <Icon size="18" width="1.5">Heart</Icon>
                </span>
                <span class="nav-link-title">Favorites</span>
              </NuxtLink>

              <NuxtLink
                v-for="(state, i) in pinnedStates"
                :to="'/library/' + state.slug"
                :key="'state' + i"
                class="dropdown-item ps-3">
                <span
                  class="status-dot ms-1 me-4"
                  :style="{ 'background-color': state.color || '' }"></span>

                <span class="nav-link-title">{{ state.name }}</span>
                <small class="ms-auto text-secondary me-1">
                  {{ format.num(stateStore.count(state.id)) }}
                </small>
              </NuxtLink>

              <div class="dropdown-item" v-if="unPinnedStates.length > 0">
                <div style="width: 30px">
                  <Icon size="18" class="text-muted" width="1.5">Background</Icon>
                </div>

                <span>Other states</span>

                <span class="text-muted ms-auto">
                  <Icon size="14">CaretRightFilled</Icon>
                </span>
                <b-dropdown
                  placement="right-start"
                  style="overflow: visible; min-width: 240px">
                  <NuxtLink
                    v-for="(state, i) in unPinnedStates"
                    :to="'/library/' + state.slug"
                    :key="'state' + i"
                    class="dropdown-item px-2">
                    <div class="content d-flex align-items-center w-100 px-1">
                      <span
                        class="status-dot ms-1 me-4"
                        :style="{ 'background-color': state.color || '' }"></span>

                      <span class="me-4">
                        {{ state.name }}
                      </span>

                      <small class="ms-auto text-secondary me-1">
                        {{ format.num(stateStore.count(state.id)) }}
                      </small>
                    </div>

                    <!-- <div class="d-flex justify-center" style="width: 30px">
                <Icon v-if="isFav(state.name)" style="color: red; fill: pink">Heart</Icon>
                <span
                  v-else
                  class="badge"
                  :style="{ 'background-color': state.color || '' }"></span>
              </div>

              <span class="pe-3">
                {{ state.name }}
              </span>
              <tippy class="text-muted ms-auto cursor-help" :content="state.description">
                <Icon>HelpCircleFilled</Icon>
              </tippy> -->
                    <!-- <span class="badge bg-primary text-primary-fg ms-auto">12</span> -->
                  </NuxtLink>
                </b-dropdown>
              </div>

              <div
                v-if="$auth.config.pinned || $auth.config.hidden"
                class="dropdown-divider"></div>

              <NuxtLink
                v-if="$auth.config.pinned"
                to="/library/pinned"
                class="dropdown-item pe-2">
                <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
                  <Icon size="18" width="1.5">Bookmark</Icon>
                </span>
                <span class="nav-link-title">Pinned games</span>
              </NuxtLink>

              <NuxtLink
                v-if="$auth.config.hidden"
                to="/library/hidden"
                class="dropdown-item pe-2">
                <span class="d-none nav-link-icon d-md-none d-lg-inline-block">
                  <Icon size="18" width="1.5">Cancel</Icon>
                </span>
                <span class="nav-link-title">Hidden games</span>
              </NuxtLink>

              <!-- <NuxtLink to="/library" class="dropdown-item">
                Library
                <small class="text-secondary ms-auto me-0">
                  {{ format.num($app.count.library) }}
                </small>
              </NuxtLink>
              <NuxtLink to="/journal" class="dropdown-item">Journal</NuxtLink>
              <div class="dropdown-divider"></div>
              <NuxtLink to="/account/me" class="dropdown-item">Account</NuxtLink> -->
            </b-dropdown>
          </h2>
        </div>
        <div class="col-auto ms-auto">
          <div class="text-secondary mt-1 text-right" style="text-align: right">
            {{ format.num($app.count.library) }} games
            <!-- <br />
            <span class="text-muted" style="zoom: 0.8">(0.19 seconds)</span> -->
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="page-body">
    <div class="container-xl">
      <search-interface :source="is"></search-interface>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\library.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 18th December 2023
 * Modified: 22 July 2024 - 12:33:45
 **/

export default {
  data() {
    return {
      is: 'library',
    }
  },

  computed: {
    ...mapStores(useDataStore, useStateStore),
    ...mapState(useStateStore, ['states', 'pinnedStates', 'unPinnedStates']),

    source() {
      let slug = this.$route.params?.slug[0] || null
      if (['pinned', 'hidden', 'favorites'].includes(slug)) return slug

      let state = this.states.find((state) => state.slug == slug)
      return state ? state.name : 'Library'
    },
  },

  methods: {
    init() {},
  },

  mounted() {
    this.init()
  },
}
</script>
