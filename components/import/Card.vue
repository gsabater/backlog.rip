<template>
  <div class="card card-md">
    <div class="card-body" style="padding: 1.9rem">
      <div class="d-flex align-items-center mb-4">
        <div class="me-3">
          <img
            :src="module?.manifest.source.logo"
            style="max-width: 40px; max-height: 40px" />
        </div>
        <div>
          <small class="text-secondary">Syncronize your library with</small>
          <h3 class="card-title lh-2 mb-1">{{ module?.manifest.source.name }}</h3>
        </div>
        <!-- <div class="ms-auto text-center">
          <Icon>ChevronRight</Icon>
        </div>
        <div class="ms-auto text-center">
          <span
            class="avatar avatar mb-1"
            :style="`background-image: url('${integration?.avatar || ''}')`"></span>

          <h3 class="card-title mb-0">{{ integration?.username }}</h3>
        </div> -->
      </div>
      <div v-if="integration?.username" class="d-flex align-items-center mb-4">
        <div class="me-3">
          <span
            class="avatar avatar mb-1"
            :style="`background-image: url('${integration?.avatar || ''}')`"></span>
        </div>
        <div>
          <small class="text-secondary">
            Your profile on {{ module?.manifest.source.name }}
          </small>
          <h3 class="card-title lh-2 mb-1">{{ integration?.username }}</h3>
        </div>

        <div class="ms-auto text-center"></div>
      </div>
      <div class="text-secondary">
        {{ module?.manifest.description }}
      </div>
    </div>
    <div class="card-body" style="padding: 1.9rem">
      <slot name="card:action"></slot>
    </div>
    <slot name="card:footer">
      <!-- <div v-if="manifest.autoupdates" class="card-footer">
        <div class="row align-items-center">
          <div class="col-auto">
            <label class="form-check form-switch m-0">
              <input
                v-model="$auth.config.autosync_steam"
                class="form-check-input position-static"
                type="checkbox"
                @change="storeConfig('autosync_steam')" />
              <span class="form-check-label form-check-label-on">
                Auto updates are enabled
              </span>
              <span class="form-check-label form-check-label-off">
                Enable automatic updates
              </span>
            </label>
          </div>
          <div class="col-auto ms-auto">
            <small
              v-tippy="{
                content:
                  'Your Steam library will be automatically updated to stay synchronized with your backlog.rip account. This update process occurs every 24 hours',
                placement: 'top',
              }"
              class="text-muted">
              What is this?
              <span class="form-help mx-2">?</span>
            </small>
          </div>
        </div>
      </div> -->
    </slot>
  </div>
</template>

<script>
/**
 * @file:    \components\import\Card.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 4th December 2024
 * Modified: Thu 12 December 2024 - 16:46:34
 **/

export default {
  name: 'AccountImportCard',
  props: {
    module: {
      type: Object,
      default: {},
    },

    integration: {
      type: Object,
      default: {},
    },
  },

  computed: {
    manifest() {
      return this.module?.manifest || {}
    },
  },
}
</script>
