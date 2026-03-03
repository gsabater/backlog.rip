<template>
  <v-dialog v-model="ui.show" max-width="650">
    <!-- Main Card -->
    <v-card elevation="24" style="background: rgb(32, 34, 43); border: 2px solid rgb(61, 54, 67)">
      <template v-slot:title>
        <div class="d-flex align-center w-100">
          <!-- <img
            src="https://backlog.rip/favicon.png"
            alt="Backlog.rip"
            style="max-height: 28px; margin-right: 12px" /> -->
          <span class="font-serif text-h6 font-weight-medium">About Backlog.rip</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="ui.show = false" size="small" variant="text" color="secondary">
            <Icon name="tabler:x" size="16" />
          </v-btn>
        </div>
      </template>

      <v-card-text class="px-5 pb-6 pt-2">
        <div class="row gy-4 text-body-2">
          <div class="col-6">
            <div
              class="text-disabled font-serif font-weight-bold mb-1"
              style="letter-spacing: 0.03rem">
              Version
            </div>
            <div class="font-weight-regular text-white">{{ $app.v }}</div>
          </div>

          <div class="col-6">
            <div
              class="text-disabled font-serif font-weight-bold mb-1"
              style="letter-spacing: 0.03rem">
              Repository
            </div>
            <a
              href="https://github.com/gsabater/backlog.rip"
              class="text-decoration-none text-white d-inline-flex align-center"
              target="_blank"
              rel="noopener">
              <span class="font-weight-regular">gsabater/backlog.rip</span>
              <Icon name="tabler:external-link" class="ms-2 text-secondary" size="16" />
            </a>
          </div>

          <div class="col-12">
            <div
              class="divider"
              style="border-top: 1px dashed rgb(204 204 204 / 25%); margin: 0.25rem 0.5rem"></div>
          </div>

          <div class="col-12 pb-0">
            <div
              class="text-disabled font-serif font-weight-bold mb-1"
              style="letter-spacing: 0.03rem">
              Resources & Open Source Projects
            </div>
            <p class="text-secondary mb-0">
              This project is based on top of those amazing libraries and open source projects
            </p>
          </div>

          <div class="col-6">
            <div class="d-flex align-center">
              <Icon name="tabler:brand-nuxt" size="28" class="me-3" style="color: #00dc82" />
              <div>
                <div class="text-white font-weight-medium">
                  Nuxt
                  <span class="text-disabled text-caption ms-1">v3.17</span>
                </div>
                <a
                  href="https://nuxt.com"
                  class="text-secondary text-decoration-none text-caption d-flex align-center"
                  target="_blank">
                  nuxt.com
                  <Icon name="tabler:external-link" size="12" class="ms-1" />
                </a>
              </div>
            </div>
          </div>

          <div class="col-6">
            <div class="d-flex align-center">
              <Icon name="mdi:vuetify" size="28" class="me-3" style="color: #1867c0" />
              <div>
                <div class="text-white font-weight-medium">
                  Vuetify
                  <span class="text-disabled text-caption ms-1">v3.10</span>
                </div>
                <a
                  href="https://vuetifyjs.com"
                  class="text-secondary text-decoration-none text-caption d-flex align-center"
                  target="_blank">
                  vuetifyjs.com
                  <Icon name="tabler:external-link" size="12" class="ms-1" />
                </a>
              </div>
            </div>
          </div>

          <div class="col-6">
            <div class="d-flex align-center">
              <Icon name="tabler:database" size="28" class="me-3 text-info" />
              <div>
                <div class="text-white font-weight-medium">
                  Dexie.js
                  <span class="text-disabled text-caption ms-1">v3.4</span>
                </div>
                <a
                  href="https://dexie.org"
                  class="text-secondary text-decoration-none text-caption d-flex align-center"
                  target="_blank">
                  dexie.org
                  <Icon name="tabler:external-link" size="12" class="ms-1" />
                </a>
              </div>
            </div>
          </div>

          <div class="col-6">
            <div class="d-flex align-center">
              <Icon name="tabler:brand-tabler" size="28" class="me-3" style="color: #206bc4" />
              <div>
                <div class="text-white font-weight-medium">
                  Tabler
                  <span class="text-disabled text-caption ms-1">v1.4</span>
                </div>
                <a
                  href="https://tabler.io"
                  class="text-secondary text-decoration-none text-caption d-flex align-center"
                  target="_blank">
                  tabler.io
                  <Icon name="tabler:external-link" size="12" class="ms-1" />
                </a>
              </div>
            </div>
          </div>

          <div class="col-6">
            <div class="d-flex align-center">
              <img
                src="/img/transhumans/astro.png"
                class="img-fluid me-3"
                style="
                  max-height: 28px;
                  filter: drop-shadow(0px 0px 0px black);
                  object-fit: cover;
                " />
              <div>
                <div class="text-white font-weight-medium">Transhumans</div>
                <a
                  href="https://transhumans.xyz"
                  class="text-secondary text-decoration-none text-caption d-flex align-center"
                  target="_blank">
                  transhumans.xyz
                  <Icon name="tabler:external-link" size="12" class="ms-1" />
                </a>
              </div>
            </div>
          </div>

          <div class="col-12">
            <div
              class="divider"
              style="border-top: 1px dashed rgb(204 204 204 / 25%); margin: 0.25rem 0.5rem"></div>
          </div>

          <div class="col-12">
            <div
              class="text-disabled font-serif font-weight-bold mb-1"
              style="letter-spacing: 0.03rem">
              Other great libraries used
            </div>

            <div class="text-secondary text-caption" style="line-height: 1.6">
              <a href="https://axios-http.com" class="text-decoration-none" target="_blank">
                Axios
                <Icon name="tabler:external-link" size="10" />
              </a>
              ,
              <a href="https://getbootstrap.com" class="text-decoration-none" target="_blank">
                Bootstrap
                <Icon name="tabler:external-link" size="10" />
              </a>
              ,
              <a href="https://day.js.org" class="text-decoration-none" target="_blank">
                dayjs
                <Icon name="tabler:external-link" size="10" />
              </a>
              ,
              <a href="https://mitt.js.org" class="text-decoration-none" target="_blank">
                mitt
                <Icon name="tabler:external-link" size="10" />
              </a>
              , pinia, Swiper, Tabler Icons, uuid, vue final modal, vue sonner, vue tippy
            </div>
          </div>
          <div class="col-12">
            <div
              class="text-disabled font-serif font-weight-bold mb-1"
              style="letter-spacing: 0.03rem">
              AI transparency
            </div>

            <em class="text-caption text-disabled">
              While this project has been in development since 2016, it has recently been assisted
              by AI, while maintaining strictly human vibes.
            </em>
          </div>
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
 * Modified: 24th February 2026 - 12:30:49
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
