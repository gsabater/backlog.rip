<template>
  <nav class="toc-container">
    <span class="font-serif">On this page</span>

    <ul class="list-unstyled" v-if="links">
      <li v-for="item in links" :key="item.path">
        <a :href="`#${item.id}`" class="toc-link">
          {{ item.text }}
        </a>
      </li>
    </ul>
    <div class="community-links mt-5">
      <pre class="d-block">
        {{ toc }}
        {{ links }}
      </pre>

      <ul class="list-unstyled">
        <li class="mb-2">
          <a
            href="https://discord.gg/F2sPE5B"
            target="_blank"
            class="d-inline-flex align-items-center gap-2 text-decoration-none">
            <svg
              width="16"
              height="16"
              viewBox="0 -28.5 256 256"
              version="1.1"
              preserveAspectRatio="xMidYMid">
              <g>
                <path
                  d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
                  fill="#5865F2"
                  fill-rule="nonzero"></path>
              </g>
            </svg>
            Discord
          </a>
        </li>
        <li class="mb-2">
          <a
            href="https://github.com/gsabater/backlog.rip"
            target="_blank"
            class="d-inline-flex align-items-center gap-2 text-decoration-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-github"
              viewBox="0 0 16 16">
              <path
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.7-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub
          </a>
        </li>
        <li>
          <a
            href="https://www.patreon.com/c/BacklogRIP"
            target="_blank"
            class="d-inline-flex align-items-center gap-2 text-decoration-none">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M14.82 2.41c3.96 0 7.18 3.24 7.18 7.21c0 3.96-3.22 7.18-7.18 7.18c-3.97 0-7.21-3.22-7.21-7.18c0-3.97 3.24-7.21 7.21-7.21M2 21.6h3.5V2.41H2V21.6Z" />
            </svg>
            Support on Patreon
          </a>
        </li>
      </ul>

      <pre class="d-block">
        {{ hasToc ? 'Table of Contents' : 'No Table of Contents available' }}

      </pre>
    </div>
  </nav>
</template>

<script>
/**
 * @file:    \components\docs\TableOfContents.vue
 * @desc:    Table of contents component for documentation pages
 * -------------------------------------------
 * Created Date: 25th June 2025
 * Modified: 25th June 2025 - 01:32:11
 **/

export default {
  name: 'TableOfContents',
  props: {
    toc: {
      type: Object,
      required: true,
    },
  },
  computed: {
    hasToc() {
      return this.toc && this.toc.length > 0
    },

    links() {
      return this.toc?.links || []
    },
  },
}
</script>

<style scoped>
.toc-container {
  position: sticky;
  top: 2rem;
  font-size: 0.875rem;
}

.toc-link {
  color: inherit;
  opacity: 0.8;
  transition: all 0.2s ease;
}

.toc-link:hover {
  color: var(--primary-color, #5965f2);
  opacity: 1;
}

.community-links a {
  color: inherit;
  opacity: 0.8;
  transition: all 0.2s ease;
}

.community-links a:hover {
  color: var(--primary-color, #5965f2);
  opacity: 1;
}
</style>
