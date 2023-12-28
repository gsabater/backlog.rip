<template>
  <header class="hero pt-7 pb-9 md:pt-10 md:pb-13">
    <div class="container">
      <h1 class="hero-title">Backlog.rip</h1>
      <p class="hero-description mt-4">
        Free and open source library manager for all your games.
        <br />
        Works in the cloud, without any launchers.
        <br />
        Organize and manage your games with ease.
      </p>

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

        <p class="text-muted my-3">
          V
          <strong>{{ $app.v }}</strong>
          <!-- <span class="px-1">·</span>
          <a href="/docs/5.3/getting-started/download/" class="link-secondary">
            Changelog
          </a>
          <span class="px-1">·</span>
          <a href="/docs/5.3/getting-started/download/" class="link-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon xl:mr-1 icon-tabler icon-tabler-brand-github"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path
                d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0c-2.4-1.6-3.5-1.3-3.5-1.3a4.2 4.2 0 0 0-.1 3.2 4.6 4.6 0 0 0-1.3 3.2c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2v3.5"></path>
            </svg>
            Source code
          </a> -->
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
