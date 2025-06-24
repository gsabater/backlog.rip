<template>
  <div class="page-body">
    <div class="container-xl">
      <!--
        *+---------------------------------
        *| Main Hero Section
        *| Support Backlog.rip
        *+--------------------------------- -->
      <div class="row align-items-center min-vh-75">
        <div class="col-6">
          <div class="text-center">
            <img
              src="/img/transhumans/jumping-air.png"
              alt="Support Backlog.rip"
              class="img-fluid"
              style="
                max-height: 500px;
                object-fit: cover;
                filter: drop-shadow(1px 1px 0px currentcolor);
                color: #00fdcf;
              " />
            <small class="text-muted d-block mt-2">
              Illustration from
              <strong>Transhumans</strong>
              by Pablo Stanley
            </small>
          </div>
        </div>
        <div class="col-6">
          <div class="pe-4">
            <!-- <h1 class="display-4 fw-bold mb-4" style="font-size: 2rem">
            Become a
            <span class="d-block loading-text">Backlog.rip Supporter</span>
          </h1> -->

            <h1
              class="display-4 fw-bold mb-1"
              style="font-size: 2rem; filter: drop-shadow(2px 2px 0px #000)">
              Become a
              <span class="d-block fancy">Backlog.rip Supporter</span>
            </h1>

            <p class="lead my-5">
              <!-- <strong>Backlog.rip is free to use and always will be.</strong>
              <br /> -->
              Built and maintained by a solo developer, I rely on community support to
              keep creating and maintaining a clean, independent platform for tracking
              your games. Without ads, trackers, or clutter. If you like it, consider
              supporting on Patreon to help keep it running and improving.

              <!-- Backlog.rip is free, but we rely on community support to innovate
            and continue creating an independent gaming library manager. That's why we
            created the Supporter plan for gamers like you to show their support. -->
            </p>

            <!-- Support Card -->
            <div class="card shadow-sm">
              <div class="card-body p-4">
                <div class="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <h4 class="mb-0">One time or Monthly contribution</h4>
                    <p class="text-muted mb-0">Help keep the project alive</p>
                  </div>
                  <div class="text-end">
                    <!-- <div class="h3 mb-0 text-primary fw-bold">$5</div> -->
                  </div>
                </div>

                <v-btn
                  size="large"
                  block
                  variant="tonal"
                  color="rgb(110 116 180)"
                  href="https://patreon.com/backlogrip"
                  target="_blank">
                  <v-icon start>mdi-heart</v-icon>
                  Become a Supporter
                </v-btn>

                <div class="text-center mt-3">
                  <small class="text-muted">
                    Every contribution gets the same benefits regardless of amount
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--
        *+---------------------------------
        *| Pricing Section
        *| Multiple options
        *+--------------------------------- -->
      <div id="pricing" class="row row-cards justify-content-center mb-5">
        <div class="col-12 text-center mb-4">
          <h2 class="display-6 fw-bold" style="text-shadow: 2px 2px 0px #000">
            Choose your Level
          </h2>
          <p class="text-muted">
            Every contribution helps keep the servers running and development active
          </p>

          <div class="d-flex justify-content-center mt-4 mb-3">
            <v-tabs
              v-model="ui.tab"
              color="rgb(110 116 180)"
              align-tabs="center"
              variant="pills"
              class="mx-auto">
              <v-tab
                value="monthly"
                class="mx-2"
                variant="tonal"
                style="border-radius: 3px">
                Monthly Support
              </v-tab>
              <v-tab
                value="onetime"
                class="mx-2"
                variant="tonal"
                style="border-radius: 3px">
                One-time Donation
              </v-tab>
            </v-tabs>
          </div>
        </div>

        <v-window v-model="ui.tab">
          <!-- Monthly Support Tab -->
          <v-window-item value="monthly">
            <div class="row justify-content-center">
              <div class="col-sm-6 col-lg-4">
                <div
                  class="card pricing-card p-3 h-100 border-primary"
                  style="border: 1px solid">
                  <div class="card-body">
                    <h2 class="display-6 mb-3" style="text-shadow: 2px 2px 0px #000">
                      Free forever
                    </h2>
                    <p class="text-secondary">
                      The website is free to use and always will be. You can manage your
                      library, track your games, and sync across devices without paying a
                      cent.
                    </p>
                    <ul class="list-unstyled lh-lg">
                      <li class="d-flex align-items-center">
                        <Icon class="text-success me-2" size="14" width="2">Check</Icon>
                        Unlimited games in your library
                      </li>
                      <li class="d-flex align-items-center">
                        <Icon class="text-success me-2" size="14" width="2">Check</Icon>
                        Advanced search and filtering
                      </li>
                      <li class="d-flex align-items-center">
                        <Icon class="text-success me-2" size="14" width="2">Check</Icon>
                        Custom lists, tags, and notes
                      </li>
                      <li class="d-flex align-items-center">
                        <Icon class="text-success me-2" size="14" width="2">Check</Icon>
                        Game progress tracking (status, hours, completion, etc.)
                      </li>
                      <li class="d-flex align-items-center">
                        <Icon class="text-success me-2" size="14" width="2">Check</Icon>
                        Import/export from Steam, CSV, and other platforms
                      </li>
                      <li class="d-flex align-items-center">
                        <Icon class="text-success me-2" size="14" width="2">Check</Icon>
                        Automatic Steam sync and achievements
                      </li>
                      <li class="d-flex align-items-center">
                        <Icon class="text-success me-2" size="14" width="2">Check</Icon>
                        Cloud backups and multi-device sync
                      </li>
                      <li class="d-flex align-items-center">
                        <Icon class="text-success me-2" size="14" width="2">Check</Icon>
                        Community features (reviews, comments, sharing)
                      </li>
                      <li class="d-flex align-items-center">
                        <Icon class="text-success me-2" size="14" width="2">Check</Icon>
                        Statistics and insights (charts, playtime, genres, etc.)
                      </li>
                      <li class="d-flex align-items-center">
                        <Icon class="text-success me-2" size="14" width="2">Check</Icon>
                        No ads, no trackers, no cookies
                      </li>
                      <li class="d-flex align-items-center">
                        <Icon class="text-success me-2" size="14" width="2">Check</Icon>
                        Open source and privacy-focused
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="col-sm-6 col-lg-4">
                <div
                  class="card pricing-card card-md border-primary"
                  style="border: 1px solid; background: #322b3f57">
                  <div class="card-body">
                    <h2
                      class="display-6 fancy mb-3"
                      style="
                        filter: drop-shadow(2px 2px 0px #000);
                        transform: translateY(-8px);
                      ">
                      Monthly Supporter
                    </h2>
                    <p class="text-secondary">
                      Become a recurring supporter and help ensure Backlog.rip continues
                      to evolve. Your monthly contribution provides sustainable support.
                    </p>
                    <p class="text-secondary">
                      The Supporter plan helps cover server costs and fund continued
                      development while keeping the service free for everyone.
                    </p>

                    <ul class="list-unstyled lh-lg">
                      <li class="d-flex align-items-center">
                        <Icon class="text-success me-2" size="14" width="2">Check</Icon>
                        Everything in Free
                      </li>
                      <li class="d-flex align-items-center">
                        <Icon class="text-success me-2" size="14" width="2">Check</Icon>
                        Access to a supporter Discord channel
                      </li>

                      <li class="mt-3"><strong>More cloud usage</strong></li>

                      <li class="d-flex align-items-center">
                        <Icon class="text-success me-2" size="14" width="2">Check</Icon>
                        Backup retention increased to a year
                      </li>

                      <li class="d-flex align-items-center">
                        <Icon class="text-success me-2" size="14" width="2">Check</Icon>
                        Unlimited achievements synchronization
                      </li>
                    </ul>
                    <div class="text-center mt-4">
                      <a
                        href="https://patreon.com/backlogrip"
                        target="_blank"
                        class="btn btn-primary w-100">
                        Become a Supporter
                      </a>
                      <p class="small text-muted p-0 m-0 mt-2">
                        Cancel anytime • No commitments
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-window-item>

          <!-- One-time Donation Tab -->
          <v-window-item value="onetime">
            <div class="row justify-content-center">
              <div class="col-sm-6 col-lg-4">
                <div
                  class="card pricing-card card-md border-primary"
                  style="border: 1px solid; background: #322b3f57">
                  <div class="card-body">
                    <h2
                      class="display-6 mb-3"
                      style="
                        filter: drop-shadow(2px 2px 0px #000);
                        transform: translateY(-8px);
                      ">
                      One-time
                      <span class="fancy">Donation</span>
                    </h2>
                    <p class="text-secondary">
                      Prefer to contribute just once? Your one-time donation helps with
                      immediate costs and lets you support the project on your terms.
                    </p>
                    <p class="text-secondary">
                      Every donation, no matter how small, helps keep Backlog.rip running
                      and shows that you value what we're creating.
                    </p>

                    <ul class="list-unstyled lh-lg">
                      <li class="d-flex align-items-center">
                        <Icon class="text-success me-2" size="14" width="2">Check</Icon>
                        Support independent development
                      </li>
                      <li class="d-flex align-items-center">
                        <Icon class="text-success me-2" size="14" width="2">Check</Icon>
                        Special thank-you mention
                      </li>
                      <li class="d-flex align-items-center">
                        <Icon class="text-success me-2" size="14" width="2">Check</Icon>
                        Warm fuzzy feeling
                      </li>
                      <li class="mt-3"><strong>Note</strong></li>
                      <li class="d-flex align-items-center text-muted">
                        <Icon class="text-muted me-2" size="14" width="2">Warning</Icon>
                        Supporter benefits require recurring support
                      </li>
                    </ul>
                    <div class="text-center mt-4">
                      <a
                        href="https://ko-fi.com/backlogrip"
                        target="_blank"
                        class="btn btn-primary w-100">
                        Make a Donation
                      </a>
                      <p class="small text-muted p-0 m-0 mt-2">
                        No recurring charges - donate what feels right
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-window-item>
        </v-window>
      </div>

      <!--
        *+---------------------------------
        *| Current supporters Section
        *| Support Backlog.rip
        *+--------------------------------- -->
      <div class="row my-5 py-4">
        <div class="col-12 text-center my-5">
          <h2 class="fw-bold mb-1" style="text-shadow: 2px 2px 0px #000">Thank you</h2>
          <p class="text-muted">Thanks to everyone who helps keep Backlog.rip running!</p>
        </div>

        <div class="col-12 row justify-content-center">
          <div class="col-lg-8">
            <div class="card p-2">
              <div class="row gy-3">
                <div
                  v-for="supporter in supporters"
                  :key="supporter.id"
                  class="col-6 px-3">
                  <div
                    class="card row d-flex flex-row align-items-center p-2"
                    :class="{ 'border-primary': supporter.level === 'Patron' }">
                    <div class="col-auto text-secondary">
                      <v-btn variant="text" icon size="small">
                        <Icon
                          v-if="supporter.level === 'Patron'"
                          size="14"
                          width="1"
                          style="color: goldenrod">
                          BadgeFilled
                        </Icon>

                        <Icon
                          v-if="supporter.level === 'Donation'"
                          size="16"
                          width="1"
                          style="color: #00fdcf">
                          Badges
                        </Icon>
                      </v-btn>
                    </div>
                    <div class="col-auto">
                      <span
                        class="avatar avatar-sm rounded-circle"
                        :style="{
                          backgroundImage: `url('${supporter.avatar}')`,
                          backgroundSize: 'cover',
                          width: '32px',
                          height: '32px',
                          display: 'inline-block',
                        }"></span>
                    </div>
                    <div class="col">
                      <span class="font-serif" style="letter-spacing: 0.6px">
                        {{ supporter.name }}
                      </span>
                      <div class="v-list-item-subtitle">
                        <small class="text-muted">
                          {{ supporter.level }}
                          <template v-if="supporter.date">
                            <span v-if="supporter.level === 'Patron'">
                              • Since
                              {{ $nuxt.$dayjs(supporter.date).format('MMMM YYYY') }}
                            </span>

                            <!-- <span v-if="supporter.level === 'Donation'">
                              {{ $nuxt.$dayjs(supporter.date).fromNow() }}
                            </span> -->
                          </template>
                        </small>
                      </div>
                    </div>

                    <div class="col-auto text-secondary">
                      <v-btn
                        v-if="supporter.steamId"
                        variant="text"
                        icon
                        size="small"
                        color="grey-lighten-1"
                        :href="`https://steamcommunity.com/id/${supporter.steamId}`"
                        target="_blank">
                        <v-icon>mdi-steam</v-icon>
                      </v-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="row justify-content-center my-5 py-4">
        <div class="col-12 text-center my-5">
          <h2 class="fw-bold mb-1" style="text-shadow: 2px 2px 0px #000">
            Frequently Asked Questions
          </h2>
          <p class="text-muted">Common questions about supporting Backlog.rip</p>
        </div>
        <div class="col-lg-8">
          <v-expansion-panels variant="accordion" class="mb-4">
            <v-expansion-panel
              v-for="faq in faqs"
              :key="faq.id"
              class="shadow-sm"
              style="
                background: #2b2d38;
                margin-bottom: 10px;
                border-radius: 4px !important;
                border: 1px solid hsl(0deg 0% 100% / 10%);
              ">
              <v-expansion-panel-title>
                <template v-slot:default="{ expanded }">
                  <div class="d-flex align-items-center">
                    <v-icon
                      class="me-3"
                      :class="expanded ? 'text-primary' : 'text-muted'">
                      {{ faq.icon }}
                    </v-icon>
                    <span>{{ faq.question }}</span>
                  </div>
                </template>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="ps-5">
                  <!-- Display as list if isList property is true -->
                  <ul v-if="faq.isList" class="mb-3">
                    <li v-for="(item, index) in faq.answer" :key="index">
                      {{ item }}
                    </li>
                  </ul>
                  <!-- Display as paragraph if not a list -->
                  <p v-else class="mb-3">
                    {{ faq.answer }}
                  </p>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\support.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 18th June 2025
 * Modified: 24th June 2025 - 11:09:07
 **/

export default {
  name: 'SupportPage',
  data() {
    return {
      faqs: [
        {
          id: 1,
          question: 'Is Backlog.rip really free?',
          answer:
            'Yes! All core features are free: unlimited games, advanced search, custom lists, Steam sync, cloud backups, and more. No ads, no tracking, no paywalls.',
          icon: 'mdi-help-circle-outline',
        },
        {
          id: 2,
          question: 'What do I get as a supporter?',
          answer: [
            'Priority email support',
            'Early access to new features',
            'Special supporter badge',
            'Access to the supporter Discord channel',
            'The satisfaction of supporting open-source gaming tools',
          ],
          icon: 'mdi-credit-card-outline',
          isList: true,
        },
        {
          id: 3,
          question: 'What features are included for free?',
          answer:
            'Everything you need: unlimited library, Steam sync, achievements, custom lists, stats, cloud sync, and more. See the full list above!',
          icon: 'mdi-star-outline',
        },
        {
          id: 4,
          question: 'Can I import/export my data?',
          answer:
            'Yes! You can import from Steam, CSV, and other platforms, and export your library at any time.',
          icon: 'mdi-database-arrow-down-outline',
        },
        {
          id: 5,
          question: 'How is my data stored and protected?',
          answer:
            'Your data is securely stored in the cloud and can be synced across devices. You can export or delete your data at any time.',
          icon: 'mdi-shield-lock-outline',
        },
        {
          id: 6,
          question: 'Can I cancel my support anytime?',
          answer:
            'Absolutely! You can cancel recurring support at any time. No contracts or fees.',
          icon: 'mdi-cancel',
        },
        {
          id: 7,
          question: 'Where does my support money go?',
          answer:
            '100% of contributions go to server costs, development, and keeping Backlog.rip independent and ad-free.',
          icon: 'mdi-server-outline',
        },
      ],

      supporters: [
        {
          name: 'SilverFolfy',
          steamId: 'silverfolfy',
          avatar:
            'https://avatars.akamai.steamstatic.com/b1644846927280aebcc3994c22ade12fc288f109_full.jpg',
          date: '2025-02-01',
          level: 'Patron',
        },

        {
          name: 'juanmote',
          steamId: 'juanmote',
          avatar:
            'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/4b/4b084cf6b27a3b0f7b9869a464ead2989bab85e1_full.jpg',
          date: '2023-09-05',
          level: 'Donation',
        },

        {
          id: 7,
          name: 'Minea',
          steamId: 'Minea87',
          avatar:
            'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/7b/7b09613c02c3ca8b2014fca95c2f8ea9d92f8fa9_full.jpg',

          level: 'Donation',
        },
      ],

      ui: {
        tab: 'monthly',
      },
    }
  },

  mounted() {
    if (this.$useSeoMeta) {
      this.$useSeoMeta({
        title: 'Support Backlog.rip - Open Source Gaming Library Manager',
        description:
          'Support the development of Backlog.rip, a free and open-source gaming library manager. Help us maintain servers and fund ethical software development.',
        ogTitle: 'Support Backlog.rip - Open Source Gaming Library Manager',
        ogDescription:
          'Support the development of Backlog.rip, a free and open-source gaming library manager. Help us maintain servers and fund ethical software development.',
      })
    }
  },
}
</script>

<style scoped>
/* Hero Section Styles */
.hero-section {
  background: linear-gradient(to bottom, #1d1630, #191a22);
  position: relative;
  overflow: hidden;
  border-bottom: 2px solid #453331;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.min-vh-50 {
  min-height: 50vh;
}

.text-white-75 {
  color: rgba(255, 255, 255, 0.75) !important;
}

.bg-gradient-primary {
  background: linear-gradient(to bottom, #1d1630, #191a22) !important;
}

.badge {
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Funding progress pill */
.funding-progress-pill {
  background: #2c2c2c;
  border: 1px solid #404040;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Feature highlight cards */
.bg-white.bg-opacity-10 {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.bg-white.bg-opacity-10:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  transform: translateY(-5px);
}

/* Progress bar in hero */
.progress {
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  border-radius: 10px;
}

/* Main support section */
.min-vh-75 {
  min-height: 75vh;
}

/* Support card styling */
.pricing-card {
  transition: all 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

/* Responsive image */
@media (max-width: 768px) {
  .min-vh-75 {
    min-height: auto;
  }

  .pe-4 {
    padding-right: 0 !important;
    margin-bottom: 2rem;
  }
}

/* Component specific styles */
.v-btn {
  text-transform: none !important;
  font-weight: 500 !important;
}

.v-btn.v-btn--variant-outlined {
  border-width: 2px !important;
}

.v-btn.v-btn--variant-flat {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

/* Pricing cards enhancement */
.pricing-card {
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.pricing-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Smooth scrolling for anchor links */
html {
  scroll-behavior: smooth;
}

/* Animation for elements */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-section .container-xl > .row > .col-lg-8 {
  animation: fadeInUp 0.8s ease-out;
}

.hero-section .row.g-4.mt-5 {
  animation: fadeInUp 1s ease-out 0.2s both;
}

/* Responsive improvements */
@media (max-width: 768px) {
  .display-3 {
    font-size: 2.5rem !important;
  }

  .lead {
    font-size: 1.1rem !important;
  }

  .min-vh-50 {
    min-height: 40vh;
  }

  .btn-lg {
    font-size: 1rem !important;
    padding: 0.75rem 1.5rem !important;
  }
}
</style>
