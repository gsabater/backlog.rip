<template>
  <div class="page-body">
    <div class="container-xl">
      <div class="row justify-content-center">
        <div class="col-8 row mt-5">
          <div class="col-5 d-none d-md-block">
            <div
              class="card card-sponsor"
              style="
                background-size: cover;
                min-height: 350px;
                outline: 3px solid rgba(33, 15, 47, 0.61);
                outline-offset: -2px;
              "
              :style="'background-image: url(' + tabs[set][step].image + ')'"
              @click="set = set == 'one' ? 'two' : 'one'">
              <div class="card-body"></div>
            </div>
          </div>
          <div class="col col-1 d-none d-md-block"></div>
          <div class="col-12 col-md-5 text-center">
            <div class="row onboarding-steps">
              <div v-for="(tab, i) in tabs.one" :key="'tab' + i" class="col-2">
                <div
                  class="bullet"
                  :class="{ past: i < step, active: i == step }"
                  @click="step = i"></div>
              </div>
            </div>
            <div v-if="step == 0">
              <h1>Welcome to Backlog.rip</h1>
              <p>
                With Backlog.rip you can organize, keep track of your progress and have a
                single place for all your games.
              </p>

              <!-- <div class="card-body text-center my-5">
                <span
                  class="avatar avatar-xl rounded"
                  :style="`background-image: url(${$auth.user.avatar})`"></span>
                <div class="card-title mb-1">{{ $auth.user.username }}</div>
              </div> -->

              <div class="btn w-100 my-4" @click="step++">Get started</div>
            </div>

            <div v-if="step == 1">
              <h1>This is your ground</h1>

              <p>
                Everything is stored in your browser, you own your data and you can export
                and modify it at any time.
              </p>
              <p>
                With zero ads, zero tracking and zero bullshit, you can be sure that your
                data is safe. The project is open source.
              </p>
              <div class="btn w-100 my-4" @click="step++">Continue</div>
            </div>

            <div v-if="step == 2">
              <h1>Bring your games</h1>
              <p>
                You can automatically import your library from Steam (Public profiles),
                with more to come.
              </p>

              <div class="btn w-100 my-4" @click="step++">Continue</div>
            </div>

            <div v-if="step == 3">
              <h1>Keep a journal</h1>
              <p>
                Everything you do is recorded automatically in your journal. But you can
                add your own notes too.
              </p>
              <div class="btn w-100 my-4" @click="step++">Continue</div>
            </div>

            <div v-if="step == 4">
              <h1>Your games, your way</h1>
              <p>
                You can manually add any games to your Backlog, even if you don't have
                them in any library. Then, you can add a state to any game to keep track
                of your progress.
              </p>
              <p>You start with 7 states, but you can modify them to fit your needs.</p>
              <div class="btn btn-primary w-100 mb-2">
                <Icon class="me-2">ArrowsTransferDown</Icon>
                Import your library
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\welcome.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 19th January 2024
 * Modified: Thu Feb 01 2024
 **/

export default {
  name: 'Onboarding',
  data() {
    return {
      step: 0,
      set: 'one',

      tabs: {
        one: [
          {
            image: '/img/illustrations/_545b83a8-77ee-4cf8-a565-995a7c8b5057.jpg',
            link: 'Continue',
            prompt: 'You can use lorem ipsum',
          },
          {
            image: 'img/illustrations/_b51641e9-154a-4cc5-a871-4d9258e43f9f.jpeg',
            link: 'Continue',
            prompt: 'You can use lorem ipsum',
          },
          {
            image: '/img/illustrations/_78ccd6f6-7612-449e-909f-6784e9f6562b.jpg',
            link: 'Continue',
            prompt: 'You can use lorem ipsum',
          },
          {
            image: 'img/illustrations/_b11d2f73-91ab-4c7e-bae2-a93f7abe84c9.jpg',
            link: 'Continue',
            prompt: 'You can use lorem ipsum',
          },
          {
            image: 'img/illustrations/_d69c1929-5ff6-4943-88d3-2a86f811e727.jpg',
            link: 'Continue',
            prompt: 'You can use lorem ipsum',
          },
        ],
        two: [
          {
            image: '/img/illustrations/_e0724e4c-8e38-4fc4-8b4d-39a5991c20b2.jpg',
            link: 'Continue',
            prompt: 'You can use lorem ipsum',
          },
          {
            image: 'img/illustrations/_a93d86c4-87c6-4ed3-8ba2-b6f12f67dba8.jpg',
            link: 'Continue',
            prompt: 'You can use lorem ipsum',
          },
          {
            image: '/img/illustrations/_5fcdad47-41c2-42cc-ad81-532a30957a73.jpg',
            link: 'Continue',
            prompt: 'You can use lorem ipsum',
          },
          {
            image: 'img/illustrations/_9ce11824-4e49-471a-8887-e67015ac598f.jpg',
            link: 'Continue',
            prompt: 'You can use lorem ipsum',
          },
          {
            image: 'img/illustrations/_d4780673-addf-46dc-a0cb-cc822fa5a690.jpg',
            link: 'Continue',
            prompt: 'You can use lorem ipsum',
          },
        ],
      },
    }
  },

  methods: {
    async init() {},
  },

  mounted() {
    this.init()
  },
}
</script>

<style>
.onboarding-steps {
  justify-content: space-evenly;
  margin-top: 20px;
  margin-bottom: 40px;
}

.onboarding-steps .bullet {
  background-color: #ddd;
  border-radius: 100%;
  height: 10px;
  width: 10px;
  cursor: pointer;
  margin: auto;
}

.onboarding-steps .bullet.past {
  background-color: #182433;
}

.onboarding-steps .bullet.active {
  background-color: #446184;
}
</style>
