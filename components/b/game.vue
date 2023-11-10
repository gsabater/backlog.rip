<template>
  <div class="card card-game">
    <div class="background">
      <img :src="'https://steamcdn-a.akamaihd.net/steam/apps/'+app+'/library_600x900.jpg'" alt="">
    </div>
                  <div class="card-body">
                    <div class="d-flex align-items-center">
                      <div class="subheader">Sales</div>
                      <div class="ms-auto lh-1">
                        <div class="dropdown">
                          <a class="dropdown-toggle text-secondary" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Last 7 days</a>
                          <div class="dropdown-menu dropdown-menu-end">
                            <a class="dropdown-item active" href="#">Last 7 days</a>
                            <a class="dropdown-item" href="#">Last 30 days</a>
                            <a class="dropdown-item" href="#">Last 3 months</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="h1 mb-3">75%</div>
                    <div class="d-flex mb-2">
                      <div>Conversion rate</div>
                      <div class="ms-auto">
                        <span class="text-green d-inline-flex align-items-center lh-1">
                          7% <!-- Download SVG icon from http://tabler-icons.io/i/trending-up -->
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon ms-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 17l6 -6l4 4l8 -8"></path><path d="M14 7l7 0l0 7"></path></svg>
                        </span>
                      </div>
                    </div>
                    <div class="progress progress-sm">
                      <div class="progress-bar bg-primary" style="width: 75%" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" aria-label="75% Complete">
                        <span class="visually-hidden">75% Complete</span>
                      </div>
                    </div>
                  </div>
                </div>
</template>

<script>
export default {
  name: 'Game',
  props: ['app'],
  //  {
  //   app: {
  //     type: Object,
  //     required: true,
  //   },
  // },
  data() {
    return {
      //
    }
  },
  methods: {
    //
  },
}
</script>

<style>
.card.card-game {
  aspect-ratio: 2 / 3;
  border: 1px solid red;
  /* background: url(https://steamcdn-a.akamaihd.net/steam/apps/2114740/library_600x900.jpg) 0% 0% /
    cover; */
}

.card-game img {
  outline: 1px solid rgba(255, 255, 255, 0.15);
  outline-offset: -1px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.36);
}
/*
.card.card-game::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(120 120 120 / 50%); adjust opacity as needed
} */
</style>
