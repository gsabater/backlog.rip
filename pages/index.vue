<template>
  <header class="hero pt-7 pb-9 md:pt-10 md:pb-13">
    <div class="container">
      <!-- <img
        src="/img/logo.png"
        width="130"
        alt="Backlog.rip"
        class="mb-3"
        style="text-shadow: 4px black" /> -->

      <h1 class="hero-title">Backlog.rip</h1>
      <p class="hero-description mt-3">
        Free and open source library manager for all your games.
        <br />
        All data is saved locally in your browser, without any cookies or trackers.
      </p>
      <p class="hero-description mt-3">Organize your library and games with ease.</p>

      <!-- <div class="my-7">
        <div class="text-muted h5">Available modules: </div>
        <div class="row justify-center g-3 md:g-4">
          <div class="col-auto">
            <a href="https://www.figma.com/community/plugin/1169807996149376642/Tabler-Icons" target="_blank" rel="noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-steam" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M16.5 5a4.5 4.5 0 1 1 -.653 8.953l-4.347 3.009l0 .038a3 3 0 0 1 -2.824 3l-.176 0a3 3 0 0 1 -2.94 -2.402l-2.56 -1.098v-3.5l3.51 1.755a2.989 2.989 0 0 1 2.834 -.635l2.727 -3.818a4.5 4.5 0 0 1 4.429 -5.302z"></path>
   <circle cx="16.5" cy="9.5" r="1" fill="currentColor"></circle>
</svg>
            </a>
          </div>
          <div class="col-auto">
            <a href="https://tabler.io/docs/icons/svelte" target="_blank" rel="noreferrer"><img src="/img/packages/logo-svelte.svg" alt="" /></a>
          </div>
          <div class="col-auto">
            <a href="https://tabler.io/docs/icons/solidjs" target="_blank" rel="noreferrer"><img src="/img/packages/logo-solidjs.svg" alt="" /></a>
          </div>
          <div class="col-auto">
            <a href="https://tabler.io/docs/icons/react" target="_blank" rel="noreferrer"><img src="/img/packages/logo-react.svg" alt="" /></a>
          </div>
          <div class="col-auto">
            <a href="https://tabler.io/docs/icons/preact" target="_blank" rel="noreferrer"><img src="/img/packages/logo-preact.svg" alt="" /></a>
          </div>
          <div class="col-auto">
            <a href="https://tabler.io/docs/icons/vue" target="_blank" rel="noreferrer"><img src="/img/packages/logo-vue.svg" alt="" /></a>
          </div>
          <div class="col-auto">
            <a href="https://tabler.io/docs/icons/svg" target="_blank" rel="noreferrer"><img src="/img/packages/logo-svg.svg" alt="" /></a>
          </div>
          <div class="col-auto">
            <a href="https://tabler.io/docs/icons/pdf" target="_blank" rel="noreferrer"><img src="/img/packages/logo-pdf.svg" alt="" /></a>
          </div>
          <div class="col-auto">
            <a href="https://tabler.io/docs/icons/png" target="_blank" rel="noreferrer"><img src="/img/packages/logo-png.svg" alt="" /></a>
          </div>
          <div class="col-auto">
            <a href="https://tabler.io/docs/icons/eps" target="_blank" rel="noreferrer"><img src="/img/packages/logo-eps.svg" alt="" /></a>
          </div>
          <div class="col-auto">
            <a href="https://tabler.io/docs/icons/webfont" target="_blank" rel="noreferrer"><img src="/img/packages/logo-webfont.svg" alt="" /></a>
          </div>
        </div>
      </div> -->
      <div class="my-5">
        <div class="row g-3 justify-center">
          <div class="col-auto">&nbsp;</div>
          <div class="col-auto">
            <b-btn to="import/steam" variant="outline" color="orange">
              <Icon>StepInto</Icon>
              Import your library
            </b-btn>
          </div>

          <div class="col-auto">
            <b-btn to="games" variant="ghost" color="secondary">Browse games</b-btn>
          </div>
          <!-- <div class="col-auto">
            <a
              href="https://github.com/tabler/tabler-icons/releases/download/v2.7.0/tabler-icons-2.7.0.zip"
              class="btn btn-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-download"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"></path>
                <path d="M7 11l5 5 5-5"></path>
                <path d="M12 4l0 12"></path>
              </svg>
              Login with Steam
            </a>
          </div> -->
        </div>

        <p class="text-muted my-4">
          Version
          <span style="font-size: 20px">α</span>
          {{ $app.v }}
          <span class="px-2">·</span>
          <!-- <a href="/docs/5.3/getting-started/download/" class="link-secondary">
            Changelog
          </a> -->

          <a href="https://discord.gg/F2sPE5B" class="link-secondary" target="_blank">
            <svg
              class="me-1"
              width="18"
              height="18"
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
            Get involved in the development!
          </a>

          <span class="px-2">·</span>
          <a
            href="https://github.com/gsabater/backlog.rip"
            class="link-secondary"
            target="_blank">
            <Icon class="me-1">BrandGithub</Icon>
            Source code on Github
          </a>
        </p>
      </div>
    </div>
  </header>

  <!-- <div class="page-body">
    <div class="container-xl">
      <div class="row row-deck row-cards">
        <div class="col">
          <b-game :app="440"></b-game>
        </div>
        <div class="col">
          <b-game :app="24720"></b-game>
        </div>
        <div class="col">
          <b-game :app="25600"></b-game>
        </div>
        <div class="col">
          <b-game :app="1282100"></b-game>
        </div>
        <div class="col">
          <b-game :app="1880330"></b-game>
        </div>
      </div>
    </div>
  </div> -->

  <!-- <div class="section">
    <div class="row row-cards">CARDS supabase, estilo masonry con algunas features</div>
  </div>

  <div class="section">
    <h3>What can you do with Backlog.rip</h3>
    <p>
      Backlog.rip is a free and open source library manager for all your games. Works in
      the cloud, without any launchers. Organize and manage your games with ease.
    </p>

    <div class="row row-cards">
      CARDS tipo supabase, with links to: (grid col-4) - import steam games - browse games
      from all stores - create a collection - Track your game status
    </div>
  </div> -->
</template>

<script></script>

<style>
/* https://codepen.io/thebabydino/pen/abjpEbz */
svg[height='0'] {
  position: fixed;
}

header.herod {
  background: radial-gradient(circle, #191a22, rgb(46, 18, 94), #191a22);
  /* background: url(https://images.unsplash.com/photo-1633596683562-4a47eb4983c5?w=1400) 50% /    cover; */

  /* filter: url(#grainy); */
  border-bottom: 2px solid #191a22;
}
</style>
