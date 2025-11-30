<template>
  <v-dialog v-model="ui.show" max-width="650">
    <!-- Main Card -->
    <v-card style="flex: 1">
      <template v-slot:title>
        <img
          src="https://backlog.rip/favicon.png"
          alt=""
          style="max-height: 25px; margin-right: 3px" />
        <span class="font-serif mx-2">About Backlog.rip</span>
        <span class="ms-auto">
          <v-btn icon @click="ui.show = false" size="small" variant="text">
            <Icon class="m-0" width="2">X</Icon>
          </v-btn>
        </span>
      </template>

      <v-card-text>
        <div class="row gy-3 mb-4 text-body-2">
          <div class="col-6">
            <h4 class="text-white mb-0" style="font-weight: 100; letter-spacing: 0px !important">
              Backlog.rip
            </h4>
            <span class="text-secondary">v{{ $app.v }}</span>
          </div>

          <div class="col-6">
            <h4 class="text-white mb-0" style="font-weight: 100; letter-spacing: 0px !important">
              Repository
            </h4>
            <a
              href="https://github.com/gsabater/backlog.rip"
              class="text-secondary"
              target="_blank"
              rel="noopener">
              https://github.com/sabater/backlog.rip
              <Icon width="1" size="11" style="transform: translateY(-1px)">ExternalLink</Icon>
            </a>
          </div>

          <div class="col-12">
            <div
              class="divider"
              style="border-top: 1px dashed rgb(204 204 204 / 25%); margin: 0.5rem 1rem"></div>
          </div>

          <div class="col-12">
            <h4 class="text-white mb-1" style="font-weight: 100; letter-spacing: 0px !important">
              Resources used
            </h4>
            <span class="text-secondary">
              This application would not be possible without those amazing resources and open source
              projects:
            </span>
          </div>

          <div class="col-6">
            <h4 class="text-white mb-0" style="font-weight: 100; letter-spacing: 0px !important">
              Nuxt
            </h4>
            <span class="text-secondary">
              v3.17
              <a
                href="https://nuxt.com"
                class="badge text-secondary ms-1"
                target="_blank"
                rel="noopener">
                Nuxt.com
                <Icon width="1" size="11" style="transform: translateY(-0px)">ExternalLink</Icon>
              </a>
            </span>
          </div>

          <div class="col-6">
            <h4 class="text-white mb-0" style="font-weight: 100; letter-spacing: 0px !important">
              Tabler
            </h4>
            <span class="text-secondary">
              v1.4
              <a
                href="https://tabler.io"
                class="badge text-secondary ms-1"
                target="_blank"
                rel="noopener">
                tabler.io
                <Icon width="1" size="11" style="transform: translateY(-0px)">ExternalLink</Icon>
              </a>
            </span>
          </div>

          <div class="col-6">
            <h4 class="text-white mb-0" style="font-weight: 100; letter-spacing: 0px !important">
              Vuetify
            </h4>
            <span class="text-secondary">
              v3.10
              <a
                href="https://vuetifyjs.com"
                class="badge text-secondary ms-1"
                target="_blank"
                rel="noopener">
                vuetifyjs.com
                <Icon width="1" size="11" style="transform: translateY(-0px)">ExternalLink</Icon>
              </a>
            </span>
          </div>

          <div class="col-6">
            <h4 class="text-white mb-0" style="font-weight: 100; letter-spacing: 0px !important">
              Dexie.js
            </h4>
            <span class="text-secondary">
              v3.4
              <a
                href="https://dexie.org"
                class="badge text-secondary ms-1"
                target="_blank"
                rel="noopener">
                dexie.org
                <Icon width="1" size="11" style="transform: translateY(-0px)">ExternalLink</Icon>
              </a>
            </span>
          </div>

          <div class="col-6">
            <h4 class="text-white mb-0" style="font-weight: 100; letter-spacing: 0px !important">
              Transhumans
            </h4>

            <a
              href="https://transhumans.xyz"
              class="badge text-secondary"
              style="margin-left: -2px; margin-top: 1px"
              target="_blank"
              rel="noopener">
              transhumans.xyz
              <Icon width="1" size="11" style="transform: translateY(-0px)">ExternalLink</Icon>
            </a>
          </div>

          <div class="col-12">
            <div
              class="divider"
              style="border-top: 1px dashed rgb(204 204 204 / 25%); margin: 0.5rem 1rem"></div>
          </div>

          <div class="col-12">
            <h4 class="text-white mb-1" style="font-weight: 100; letter-spacing: 0px !important">
              Other great libraries used
            </h4>
            <span class="text-secondary">
              axios, Bootstrap, dayjs, mitt, pinia, swiper, Tabler Icons, uuid, vue final modal, vue
              sonner, vue tippy
            </span>
          </div>

          <!-- <div class="col-12">
            <div class="text-muted">History of releases</div>

          </div> -->
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
/**
 * @file:    \components\common\AboutDialog.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 14th October 2025
 * Modified: 19th October 2025 - 01:43:55
 **/

export default {
  name: 'AboutDialog',

  data: () => ({
    ui: {
      show: false,
    },
  }),

  methods: {},

  mounted() {
    this.$mitt.on('dialog:about', (payload) => {
      this.ui.show = true
    })
  },
}
</script>
