<template>

        <!-- Page header -->
        <div class="page-header d-print-none">
          <div class="container-xl">
            <div class="row g-2 align-items-center">
              <div class="col">
                <h2 class="page-title">
                  Dashboard
                </h2>
              </div>
            </div>
          </div>
        </div>

        <!-- Page body -->
        <div class="page-body">
          <div class="container-xl">
            <div class="row row-cards">

              <div class="col-md-6">
                <div class="card">
                  <div class="card-body">
                    <div class="row g-2 align-items-center">
                      <div class="col-auto">
                        <span class="avatar avatar-lg"
                        :style="`background-image: url(${$auth.user.avatar})`"></span>
                      </div>
                      <div class="col">
                        <h4 class="card-title m-0">
                          <a href="#">{{ $auth.user.username }}</a>
                        </h4>
                        <div class="text-muted">
                          Working in Kare
                        </div>
                      </div>
                      <div class="col-auto">
                        <a href="#" class="btn">
                          Subscribe
                        </a>
                      </div>
                      <div class="col-auto">
                        <div class="dropdown">
                          <a href="#" class="btn-action" data-bs-toggle="dropdown" aria-expanded="false">
                            <!-- Download SVG icon from http://tabler-icons.io/i/dots-vertical -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path><path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path><path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path></svg>
                          </a>
                          <div class="dropdown-menu dropdown-menu-end">
                            <a href="#" class="dropdown-item">Import</a>
                            <a href="#" class="dropdown-item">Export</a>
                            <a href="#" class="dropdown-item">Download</a>
                            <a href="#" class="dropdown-item text-danger">Delete</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-xl-3">
                <!-- <pre>
                  {{ $db }}
                </pre> -->
                <b-btn @click="check">check</b-btn>
                <b-btn @click="anadir">anadir</b-btn>
                <b-btn @click="leer">leer</b-btn>
                <hr><fieldset>
    <legend>Add new friend</legend>
    <label>
      Name:
      <input v-model="friendName" type="text" />
    </label>
    <br />
    <label>
      Age:
      <input v-model="friendAge" type="number" />
    </label>
    <br />
    <button @click="addFriend">Add Friend</button>
    <p>{{ status }}</p>
  </fieldset>
                <div class="card card-sm">
                  <div class="card-body">
                    <div class="row align-items-center">
                      <div class="col-auto">
                        <span class="bg-primary text-white avatar"><!-- Download SVG icon from http://tabler-icons.io/i/currency-dollar -->
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M16.7 8a3 3 0 0 0 -2.7 -2h-4a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-4a3 3 0 0 1 -2.7 -2"></path><path d="M12 3v3m0 12v3"></path></svg>
                        </span>
                      </div>
                      <div class="col">
                        <div class="font-weight-medium">
                          132 Sales
                        </div>
                        <div class="text-muted">
                          12 waiting payments
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-xl-3">
                <div class="card card-sm">
                  <div class="card-body">
                    <div class="row align-items-center">
                      <div class="col-auto">
                        <span class="bg-green text-white avatar"><!-- Download SVG icon from http://tabler-icons.io/i/shopping-cart -->
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M17 17h-11v-14h-2"></path><path d="M6 5l14 1l-1 7h-13"></path></svg>
                        </span>
                      </div>
                      <div class="col">
                        <div class="font-weight-medium">
                          78 Orders
                        </div>
                        <div class="text-muted">
                          32 shipped
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-xl-3">
                <div class="card card-sm">
                  <div class="card-body">
                    <div class="row align-items-center">
                      <div class="col-auto">
                        <span class="bg-red text-white avatar"><!-- Download SVG icon from http://tabler-icons.io/i/user -->
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path></svg>
                        </span>
                      </div>
                      <div class="col">
                        <div class="font-weight-medium">
                          1352 Members
                        </div>
                        <div class="text-muted">
                          163 registered today
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-xl-3">
                <div class="card card-sm">
                  <div class="card-body">
                    <div class="row align-items-center">
                      <div class="col-auto">
                        <span class="bg-yellow text-white avatar"><!-- Download SVG icon from http://tabler-icons.io/i/message -->
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4"></path><path d="M8 9l8 0"></path><path d="M8 13l6 0"></path></svg>
                        </span>
                      </div>
                      <div class="col">
                        <div class="font-weight-medium">
                          132 Comments
                        </div>
                        <div class="text-muted">
                          16 waitings
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-xl-3">
                <div class="card card-sm">
                  <div class="card-body">
                    <div class="row align-items-center">
                      <div class="col-auto">
                        <div class="chart-sparkline chart-sparkline-square" id="sparkline-sales" style="min-height: 41px;"><div id="apexchartsy4zpi4f9" class="apexcharts-canvas apexchartsy4zpi4f9 apexcharts-theme-light" style="width: 40px; height: 41px;"><svg id="SvgjsSvg1001" width="40" height="41" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;"><g id="SvgjsG1003" class="apexcharts-inner apexcharts-graphical" transform="translate(0, 0)"><defs id="SvgjsDefs1002"><clipPath id="gridRectMasky4zpi4f9"><rect id="SvgjsRect1005" width="46" height="42" x="-3" y="-1" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMasky4zpi4f9"></clipPath><clipPath id="nonForecastMasky4zpi4f9"></clipPath><clipPath id="gridRectMarkerMasky4zpi4f9"><rect id="SvgjsRect1006" width="44" height="44" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG1007" class="apexcharts-radialbar"><g id="SvgjsG1008"><g id="SvgjsG1009" class="apexcharts-tracks"><g id="SvgjsG1010" class="apexcharts-radialbar-track apexcharts-track" rel="1"><path id="apexcharts-radialbarTrack-0" d="M 20 4.146341463414631 A 15.85365853658537 15.85365853658537 0 1 1 19.99723301461454 4.1463417048796565" fill="none" fill-opacity="1" stroke="rgba(242,242,242,0.85)" stroke-opacity="1" stroke-linecap="butt" stroke-width="2.3658536585365857" stroke-dasharray="0" class="apexcharts-radialbar-area" data:pathOrig="M 20 4.146341463414631 A 15.85365853658537 15.85365853658537 0 1 1 19.99723301461454 4.1463417048796565"></path></g></g><g id="SvgjsG1012"><g id="SvgjsG1014" class="apexcharts-series apexcharts-radial-series" seriesName="series-1" rel="1" data:realIndex="0"><path id="SvgjsPath1015" d="M 20 4.146341463414631 A 15.85365853658537 15.85365853658537 0 1 1 14.061114982430661 34.699256230936875" fill="none" fill-opacity="0.85" stroke="rgba(32,107,196,0.85)" stroke-opacity="1" stroke-linecap="butt" stroke-width="2.439024390243903" stroke-dasharray="0" class="apexcharts-radialbar-area apexcharts-radialbar-slice-0" data:angle="202" data:value="56" index="0" j="0" data:pathOrig="M 20 4.146341463414631 A 15.85365853658537 15.85365853658537 0 1 1 14.061114982430661 34.699256230936875"></path></g><circle id="SvgjsCircle1013" r="14.670731707317076" cx="20" cy="20" class="apexcharts-radialbar-hollow" fill="transparent"></circle></g></g></g><line id="SvgjsLine1016" x1="0" y1="0" x2="40" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line><line id="SvgjsLine1017" x1="0" y1="0" x2="40" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line></g><g id="SvgjsG1004" class="apexcharts-annotations"></g></svg><div class="apexcharts-legend"></div></div></div>
                      </div>
                      <div class="col">
                        <div class="font-weight-medium">
                          132 Sales
                        </div>
                        <div class="text-muted">
                          12 waiting payments
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-xl-3">
                <div class="card card-sm">
                  <div class="card-body">
                    <div class="row align-items-center">
                      <div class="col-auto">
                        <div class="chart-sparkline chart-sparkline-square" id="sparkline-orders" style="min-height: 41px;"><div id="apexchartseb20kzct" class="apexcharts-canvas apexchartseb20kzct apexcharts-theme-light" style="width: 40px; height: 41px;"><svg id="SvgjsSvg1018" width="40" height="41" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;"><g id="SvgjsG1020" class="apexcharts-inner apexcharts-graphical" transform="translate(0, 0)"><defs id="SvgjsDefs1019"><clipPath id="gridRectMaskeb20kzct"><rect id="SvgjsRect1022" width="46" height="42" x="-3" y="-1" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMaskeb20kzct"></clipPath><clipPath id="nonForecastMaskeb20kzct"></clipPath><clipPath id="gridRectMarkerMaskeb20kzct"><rect id="SvgjsRect1023" width="44" height="44" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG1024" class="apexcharts-radialbar"><g id="SvgjsG1025"><g id="SvgjsG1026" class="apexcharts-tracks"><g id="SvgjsG1027" class="apexcharts-radialbar-track apexcharts-track" rel="1"><path id="apexcharts-radialbarTrack-0" d="M 20 4.146341463414631 A 15.85365853658537 15.85365853658537 0 1 1 19.99723301461454 4.1463417048796565" fill="none" fill-opacity="1" stroke="rgba(242,242,242,0.85)" stroke-opacity="1" stroke-linecap="butt" stroke-width="2.3658536585365857" stroke-dasharray="0" class="apexcharts-radialbar-area" data:pathOrig="M 20 4.146341463414631 A 15.85365853658537 15.85365853658537 0 1 1 19.99723301461454 4.1463417048796565"></path></g></g><g id="SvgjsG1029"><g id="SvgjsG1031" class="apexcharts-series apexcharts-radial-series" seriesName="series-1" rel="1" data:realIndex="0"><path id="SvgjsPath1032" d="M 20 4.146341463414631 A 15.85365853658537 15.85365853658537 0 1 1 14.061114982430661 34.699256230936875" fill="none" fill-opacity="0.85" stroke="rgba(47,179,68,0.85)" stroke-opacity="1" stroke-linecap="butt" stroke-width="2.439024390243903" stroke-dasharray="0" class="apexcharts-radialbar-area apexcharts-radialbar-slice-0" data:angle="202" data:value="56" index="0" j="0" data:pathOrig="M 20 4.146341463414631 A 15.85365853658537 15.85365853658537 0 1 1 14.061114982430661 34.699256230936875"></path></g><circle id="SvgjsCircle1030" r="14.670731707317076" cx="20" cy="20" class="apexcharts-radialbar-hollow" fill="transparent"></circle></g></g></g><line id="SvgjsLine1033" x1="0" y1="0" x2="40" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line><line id="SvgjsLine1034" x1="0" y1="0" x2="40" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line></g><g id="SvgjsG1021" class="apexcharts-annotations"></g></svg><div class="apexcharts-legend"></div></div></div>
                      </div>
                      <div class="col">
                        <div class="font-weight-medium">
                          78 Orders
                        </div>
                        <div class="text-muted">
                          32 shipped
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-xl-3">
                <div class="card card-sm">
                  <div class="card-body">
                    <div class="row align-items-center">
                      <div class="col-auto">
                        <div class="chart-sparkline chart-sparkline-square" id="sparkline-members" style="min-height: 41px;"><div id="apexchartstg9h0l8z" class="apexcharts-canvas apexchartstg9h0l8z apexcharts-theme-light" style="width: 40px; height: 41px;"><svg id="SvgjsSvg1035" width="40" height="41" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;"><g id="SvgjsG1037" class="apexcharts-inner apexcharts-graphical" transform="translate(0, 0)"><defs id="SvgjsDefs1036"><clipPath id="gridRectMasktg9h0l8z"><rect id="SvgjsRect1039" width="46" height="42" x="-3" y="-1" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMasktg9h0l8z"></clipPath><clipPath id="nonForecastMasktg9h0l8z"></clipPath><clipPath id="gridRectMarkerMasktg9h0l8z"><rect id="SvgjsRect1040" width="44" height="44" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG1041" class="apexcharts-radialbar"><g id="SvgjsG1042"><g id="SvgjsG1043" class="apexcharts-tracks"><g id="SvgjsG1044" class="apexcharts-radialbar-track apexcharts-track" rel="1"><path id="apexcharts-radialbarTrack-0" d="M 20 4.146341463414631 A 15.85365853658537 15.85365853658537 0 1 1 19.99723301461454 4.1463417048796565" fill="none" fill-opacity="1" stroke="rgba(242,242,242,0.85)" stroke-opacity="1" stroke-linecap="butt" stroke-width="2.3658536585365857" stroke-dasharray="0" class="apexcharts-radialbar-area" data:pathOrig="M 20 4.146341463414631 A 15.85365853658537 15.85365853658537 0 1 1 19.99723301461454 4.1463417048796565"></path></g></g><g id="SvgjsG1046"><g id="SvgjsG1048" class="apexcharts-series apexcharts-radial-series" seriesName="series-1" rel="1" data:realIndex="0"><path id="SvgjsPath1049" d="M 20 4.146341463414631 A 15.85365853658537 15.85365853658537 0 1 1 14.061114982430661 34.699256230936875" fill="none" fill-opacity="0.85" stroke="rgba(214,57,57,0.85)" stroke-opacity="1" stroke-linecap="butt" stroke-width="2.439024390243903" stroke-dasharray="0" class="apexcharts-radialbar-area apexcharts-radialbar-slice-0" data:angle="202" data:value="56" index="0" j="0" data:pathOrig="M 20 4.146341463414631 A 15.85365853658537 15.85365853658537 0 1 1 14.061114982430661 34.699256230936875"></path></g><circle id="SvgjsCircle1047" r="14.670731707317076" cx="20" cy="20" class="apexcharts-radialbar-hollow" fill="transparent"></circle></g></g></g><line id="SvgjsLine1050" x1="0" y1="0" x2="40" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line><line id="SvgjsLine1051" x1="0" y1="0" x2="40" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line></g><g id="SvgjsG1038" class="apexcharts-annotations"></g></svg><div class="apexcharts-legend"></div></div></div>
                      </div>
                      <div class="col">
                        <div class="font-weight-medium">
                          1352 Members
                        </div>
                        <div class="text-muted">
                          163 registered today
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-xl-3">
                <div class="card card-sm">
                  <div class="card-body">
                    <div class="row align-items-center">
                      <div class="col-auto">
                        <div class="chart-sparkline chart-sparkline-square" id="sparkline-comments" style="min-height: 41px;"><div id="apexchartsi2119g64" class="apexcharts-canvas apexchartsi2119g64 apexcharts-theme-light" style="width: 40px; height: 41px;"><svg id="SvgjsSvg1052" width="40" height="41" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;"><g id="SvgjsG1054" class="apexcharts-inner apexcharts-graphical" transform="translate(0, 0)"><defs id="SvgjsDefs1053"><clipPath id="gridRectMaski2119g64"><rect id="SvgjsRect1056" width="46" height="42" x="-3" y="-1" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMaski2119g64"></clipPath><clipPath id="nonForecastMaski2119g64"></clipPath><clipPath id="gridRectMarkerMaski2119g64"><rect id="SvgjsRect1057" width="44" height="44" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG1058" class="apexcharts-radialbar"><g id="SvgjsG1059"><g id="SvgjsG1060" class="apexcharts-tracks"><g id="SvgjsG1061" class="apexcharts-radialbar-track apexcharts-track" rel="1"><path id="apexcharts-radialbarTrack-0" d="M 20 4.146341463414631 A 15.85365853658537 15.85365853658537 0 1 1 19.99723301461454 4.1463417048796565" fill="none" fill-opacity="1" stroke="rgba(242,242,242,0.85)" stroke-opacity="1" stroke-linecap="butt" stroke-width="2.3658536585365857" stroke-dasharray="0" class="apexcharts-radialbar-area" data:pathOrig="M 20 4.146341463414631 A 15.85365853658537 15.85365853658537 0 1 1 19.99723301461454 4.1463417048796565"></path></g></g><g id="SvgjsG1063"><g id="SvgjsG1065" class="apexcharts-series apexcharts-radial-series" seriesName="series-1" rel="1" data:realIndex="0"><path id="SvgjsPath1066" d="M 20 4.146341463414631 A 15.85365853658537 15.85365853658537 0 1 1 14.061114982430661 34.699256230936875" fill="none" fill-opacity="0.85" stroke="rgba(245,159,0,0.85)" stroke-opacity="1" stroke-linecap="butt" stroke-width="2.439024390243903" stroke-dasharray="0" class="apexcharts-radialbar-area apexcharts-radialbar-slice-0" data:angle="202" data:value="56" index="0" j="0" data:pathOrig="M 20 4.146341463414631 A 15.85365853658537 15.85365853658537 0 1 1 14.061114982430661 34.699256230936875"></path></g><circle id="SvgjsCircle1064" r="14.670731707317076" cx="20" cy="20" class="apexcharts-radialbar-hollow" fill="transparent"></circle></g></g></g><line id="SvgjsLine1067" x1="0" y1="0" x2="40" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line><line id="SvgjsLine1068" x1="0" y1="0" x2="40" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line></g><g id="SvgjsG1055" class="apexcharts-annotations"></g></svg><div class="apexcharts-legend"></div></div></div>
                      </div>
                      <div class="col">
                        <div class="font-weight-medium">
                          132 Comments
                        </div>
                        <div class="text-muted">
                          16 waitings
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-xl-3">
                <div class="card card-sm">
                  <div class="card-body">
                    <div class="row align-items-center">
                      <div class="col-auto">
                        <span class="bg-green-lt avatar"><!-- Download SVG icon from http://tabler-icons.io/i/arrow-up -->
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 5l0 14"></path><path d="M18 11l-6 -6"></path><path d="M6 11l6 -6"></path></svg>
                        </span>
                      </div>
                      <div class="col">
                        <div class="font-weight-medium">
                          $5,256.99
                          <span class="float-right font-weight-medium text-green">+4%</span>
                        </div>
                        <div class="text-muted">
                          Revenue last 30 days
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-xl-3">
                <div class="card card-sm">
                  <div class="card-body">
                    <div class="row align-items-center">
                      <div class="col-auto">
                        <span class="bg-red-lt avatar"><!-- Download SVG icon from http://tabler-icons.io/i/arrow-down -->
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 5l0 14"></path><path d="M18 13l-6 6"></path><path d="M6 13l6 6"></path></svg>
                        </span>
                      </div>
                      <div class="col">
                        <div class="font-weight-medium">
                          342
                          <span class="float-right font-weight-medium text-red">-4.3%</span>
                        </div>
                        <div class="text-muted">
                          Sales last 30 days
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-xl-3">
                <div class="card card-sm">
                  <div class="card-body">
                    <div class="row align-items-center">
                      <div class="col-auto">
                        <span class="bg-green-lt avatar"><!-- Download SVG icon from http://tabler-icons.io/i/arrow-up -->
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 5l0 14"></path><path d="M18 11l-6 -6"></path><path d="M6 11l6 -6"></path></svg>
                        </span>
                      </div>
                      <div class="col">
                        <div class="font-weight-medium">
                          132
                          <span class="float-right font-weight-medium text-green">+6.8%</span>
                        </div>
                        <div class="text-muted">
                          Customers last 30 days
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-xl-3">
                <div class="card card-sm">
                  <div class="card-body">
                    <div class="row align-items-center">
                      <div class="col-auto">
                        <span class="bg-red-lt avatar"><!-- Download SVG icon from http://tabler-icons.io/i/arrow-down -->
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 5l0 14"></path><path d="M18 13l-6 6"></path><path d="M6 13l6 6"></path></svg>
                        </span>
                      </div>
                      <div class="col">
                        <div class="font-weight-medium">
                          78
                          <span class="float-right font-weight-medium text-red">-2%</span>
                        </div>
                        <div class="text-muted">
                          Members registered today
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-lg-4">
                <div class="row row-cards">
                  <div class="col-12">
                    <div class="card card-sm">
                      <div class="card-body">
                        <div class="row align-items-center">
                          <div class="col">
                            <div class="font-weight-medium">
                              1700
                            </div>
                            <div class="text-muted">
                              Users
                            </div>
                          </div>
                          <div class="col-auto">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="card card-sm">
                      <div class="card-body">
                        <div class="row align-items-center">
                          <div class="col-auto">
                            <span class="bg-red text-white avatar"><!-- Download SVG icon from http://tabler-icons.io/i/heart -->
                              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                            </span>
                          </div>
                          <div class="col">
                            <div class="font-weight-medium">
                              1700
                            </div>
                            <div class="text-muted">
                              Users
                            </div>
                          </div>
                          <div class="col-auto">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="card card-sm">
                      <div class="card-body">
                        <div class="row align-items-center">
                          <div class="col-auto">
                            <span class="bg-green text-white avatar"><!-- Download SVG icon from http://tabler-icons.io/i/brand-github -->
                              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"></path></svg>
                            </span>
                          </div>
                          <div class="col">
                            <div class="font-weight-medium">
                              1700
                            </div>
                            <div class="text-muted">
                              Users
                            </div>
                          </div>
                          <div class="col-auto">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="card card-sm">
                      <div class="card-body">
                        <div class="row align-items-center">
                          <div class="col-auto">
                            <span class="avatar">HS</span>
                          </div>
                          <div class="col">
                            <div class="font-weight-medium">
                              1700
                            </div>
                            <div class="text-muted">
                              Users
                            </div>
                          </div>
                          <div class="col-auto">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="card card-sm">
                      <div class="card-body">
                        <div class="row align-items-center">
                          <div class="col-auto">
                            <span class="avatar" style="background-image: url(./static/avatars/006m.jpg)"></span>
                          </div>
                          <div class="col">
                            <div class="font-weight-medium">
                              1700
                            </div>
                            <div class="text-muted">
                              Users
                            </div>
                          </div>
                          <div class="col-auto">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="card card-sm">
                      <div class="card-body">
                        <div class="row align-items-center">
                          <div class="col-auto">
                            <span class="avatar" style="background-image: url(./static/avatars/000m.jpg)"></span>
                          </div>
                          <div class="col">
                            <div class="font-weight-medium">
                              1700
                            </div>
                            <div class="text-muted">
                              Users
                            </div>
                          </div>
                          <div class="col-auto">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="card card-sm">
                      <div class="card-body">
                        <div class="row align-items-center">
                          <div class="col-auto">
                            <span class="avatar" style="background-image: url(./static/avatars/003m.jpg)"></span>
                          </div>
                          <div class="col">
                            <div class="font-weight-medium">
                              1700
                            </div>
                            <div class="text-muted">
                              Users
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="card card-sm">
                      <div class="card-body">
                        <div class="row align-items-center">
                          <div class="col-auto">
                            <span class="avatar" style="background-image: url(./static/avatars/002m.jpg)"></span>
                          </div>
                          <div class="col">
                            <div class="font-weight-medium">
                              1700
                              <!-- Download SVG icon from http://tabler-icons.io/i/trending-down -->
                              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-sm ms-1 text-red" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 7l6 6l4 -4l8 8"></path><path d="M21 10l0 7l-7 0"></path></svg>
                            </div>
                            <div class="text-muted">
                              Users
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="card">
                      <div class="card-header">
                        <h3 class="card-title">Card with code</h3>
                      </div>
                      <div class="card-code">
                        <figure class="highlight">
                          <pre><code class="language-scss" data-lang="scss"><span class="nc">.card-footer</span> <span class="p">{</span>
	<span class="nl">background</span><span class="p">:</span> <span class="nb">transparent</span><span class="p">;</span>

	<span class="k">&amp;</span><span class="nd">:last-child</span> <span class="p">{</span>
		<span class="nl">border-radius</span><span class="p">:</span> <span class="m">0</span> <span class="m">0</span> <span class="m">1</span> <span class="m">2</span><span class="p">;</span>
	<span class="p">}</span>
<span class="p">}</span></code></pre>
                        </figure>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-lg-4">
                <div class="row row-cards">
                  <div class="col-12">
                    <div class="card">
                      <div class="card-body p-4 py-5 text-center">
                        <span class="avatar avatar-xl mb-4 rounded">W</span>
                        <h3 class="mb-0">New website</h3>
                        <p class="text-muted">Due to: 28 Aug 2019</p>
                        <p class="mb-3">
                          <span class="badge bg-red-lt">Waiting</span>
                        </p>
                        <div>
                          <div class="avatar-list avatar-list-stacked">
                            <span class="avatar avatar-sm rounded" style="background-image: url(./static/avatars/000m.jpg)"></span>
                            <span class="avatar avatar-sm rounded">JL</span>
                            <span class="avatar avatar-sm rounded" style="background-image: url(./static/avatars/002m.jpg)"></span>
                            <span class="avatar avatar-sm rounded" style="background-image: url(./static/avatars/003m.jpg)"></span>
                            <span class="avatar avatar-sm rounded" style="background-image: url(./static/avatars/000f.jpg)"></span>
                          </div>
                        </div>
                      </div>
                      <div class="progress card-progress">
                        <div class="progress-bar" style="width: 38%" role="progressbar" aria-valuenow="38" aria-valuemin="0" aria-valuemax="100" aria-label="38% Complete">
                          <span class="visually-hidden">38% Complete</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-lg-4">
                <div class="row row-cards">
                  <div class="col-12">
                    <div class="card">
                      <div class="progress card-progress">
                        <div class="progress-bar bg-red" style="width: 20%" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" aria-label="20% Complete">
                          <span class="visually-hidden">20% Complete</span>
                        </div>
                      </div>
                      <div class="card-body">
                        <h3 class="card-title">
                          <a href="#">Tabler UI</a>
                          <span class="badge ms-2">v1.0</span>
                        </h3>
                        <div class="avatar-list avatar-list-stacked mb-3">
                          <span class="avatar avatar-sm rounded" style="background-image: url(./static/avatars/000m.jpg)"></span>
                          <span class="avatar avatar-sm rounded">JL</span>
                          <span class="avatar avatar-sm rounded" style="background-image: url(./static/avatars/002m.jpg)"></span>
                          <span class="avatar avatar-sm rounded" style="background-image: url(./static/avatars/003m.jpg)"></span>
                        </div>
                        <div class="card-meta d-flex justify-content-between">
                          <div class="d-flex align-items-center">
                            <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon me-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>
                            <span>5/10</span>
                          </div>
                          <span>Due 72 days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="card">
                      <div class="progress card-progress">
                        <div class="progress-bar bg-green" style="width: 20%" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" aria-label="20% Complete">
                          <span class="visually-hidden">20% Complete</span>
                        </div>
                      </div>
                      <div class="card-body">
                        <h3 class="card-title">
                          <a href="#">Tabler React</a>
                        </h3>
                        <div class="avatar-list avatar-list-stacked mb-3">
                          <span class="avatar avatar-sm rounded" style="background-image: url(./static/avatars/009f.jpg)"></span>
                          <span class="avatar avatar-sm rounded" style="background-image: url(./static/avatars/010f.jpg)"></span>
                          <span class="avatar avatar-sm rounded" style="background-image: url(./static/avatars/011m.jpg)"></span>
                          <span class="avatar avatar-sm rounded" style="background-image: url(./static/avatars/012m.jpg)"></span>
                          <span class="avatar avatar-sm rounded" style="background-image: url(./static/avatars/011f.jpg)"></span>
                          <span class="avatar avatar-sm rounded" style="background-image: url(./static/avatars/012f.jpg)"></span>
                          <span class="avatar avatar-sm rounded" style="background-image: url(./static/avatars/013m.jpg)"></span>
                        </div>
                        <div class="card-meta d-flex justify-content-between">
                          <div class="d-flex align-items-center">
                            <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon me-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>
                            <span>5/10</span>
                          </div>
                          <span>Due 2 days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="card">
                      <div class="card-body">
                        <div class="card-title">Basic info</div>
                        <div class="mb-2">
                          <!-- Download SVG icon from http://tabler-icons.io/i/book -->
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon me-2 text-muted" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0"></path><path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0"></path><path d="M3 6l0 13"></path><path d="M12 6l0 13"></path><path d="M21 6l0 13"></path></svg>
                          Went to: <strong>University of Ljubljana</strong>
                        </div>
                        <div class="mb-2">
                          <!-- Download SVG icon from http://tabler-icons.io/i/briefcase -->
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon me-2 text-muted" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path><path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2"></path><path d="M12 12l0 .01"></path><path d="M3 13a20 20 0 0 0 18 0"></path></svg>
                          Worked at: <strong>Devpulse</strong>
                        </div>
                        <div class="mb-2">
                          <!-- Download SVG icon from http://tabler-icons.io/i/home -->
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon me-2 text-muted" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l-2 0l9 -9l9 9l-2 0"></path><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path></svg>
                          Lives in: <strong>Šentilj v Slov. Goricah, Slovenia</strong>
                        </div>
                        <div class="mb-2">
                          <!-- Download SVG icon from http://tabler-icons.io/i/map-pin -->
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon me-2 text-muted" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 11m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path></svg>
                          From: <strong><span class="flag flag-country-si"></span>
                            Slovenia</strong>
                        </div>
                        <div class="mb-2">
                          <!-- Download SVG icon from http://tabler-icons.io/i/calendar -->
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon me-2 text-muted" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 5m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M16 3l0 4"></path><path d="M8 3l0 4"></path><path d="M4 11l16 0"></path><path d="M11 15l1 0"></path><path d="M12 15l0 3"></path></svg>
                          Birth date: <strong>13/01/1985</strong>
                        </div>
                        <div>
                          <!-- Download SVG icon from http://tabler-icons.io/i/clock -->
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon me-2 text-muted" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path><path d="M12 7l0 5l3 3"></path></svg>
                          Time zone: <strong>Europe/Ljubljana</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="card">
                      <div class="card-header">
                        <h3 class="card-title">
                          Configuration
                        </h3>
                        <div class="card-actions">
                          <a href="#">
                            Edit configuration<!-- Download SVG icon from http://tabler-icons.io/i/edit -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon ms-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path><path d="M16 5l3 3"></path></svg>
                          </a>
                        </div>
                      </div>
                      <div class="card-body">
                        <dl class="row">
                          <dt class="col-5">Date:</dt>
                          <dd class="col-7">2020-01-05 16:42:29 UTC</dd>
                          <dt class="col-5">Account:</dt>
                          <dd class="col-7">tabler</dd>
                          <dt class="col-5">Location:</dt>
                          <dd class="col-7"><span class="flag flag-country-pl"></span>
                            Poland</dd>
                          <dt class="col-5">IP Address:</dt>
                          <dd class="col-7">46.113.11.3</dd>
                          <dt class="col-5">Operating system:</dt>
                          <dd class="col-7">OS X 10.15.2 64-bit</dd>
                          <dt class="col-5">Browser:</dt>
                          <dd class="col-7">Chrome</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

</template>

<script>
export default {
  setup() {},

  data() {
    return {
      show: false,
      element: null,

      status: '',
      friendName: '',
      friendAge: this.defaultAge,
    }
  },

  computed: {
    // ...mapStores(useUserStore),
  },

  methods: {
    async check() {
      let t = await this.$db.friends
        .where('super')
        .below(60)

        .each(function (user) {
          console.log('Found user: ' + user.name)
        })
      console.log(t)
    },

    async anadir() {
      await this.$db.config.setItem('xxdd', 'heeey' + Math.random())
      await this.$db.config.setItem('440', {
        appid: 440,
        is_deleted: 0,
        slug: 'team-fortress-2',
        name: 'Team Fortress 2',
        short_description:
          'Nine distinct classes provide a broad range of tactical abilities and personalities. Constantly updated with new game modes, maps, equipment and, most importantly, hats!',
        type: 'game',
        has_demo: 0,
        attributes: {
          cards: true,
          inApp: true,
          workshop: true,
          controller: true,
          multiPlayer: true,
          achievements: 520,
        },
        platforms: {
          windows: true,
          mac: true,
          linux: true,
        },
        price: 0,
        stores: [],
        scores: {
          metascore: 92,
          userscore: 90,
          steamscore: 93,
          metacriticURL: 'https://www.metacritic.com/game/pc/team-fortress-2',
          steamscoreAlt: 'Very Positive',
          steamscoreCount: 19225,
        },
        charts: {
          current: '70,844',
          peaktoday: '75,517',
          peakall: '150,037',
        },
        hltb: {
          url: 'https://howlongtobeat.com/game/9632',
          main: null,
          extras: null,
          completionist: null,
        },
        tags: [
          'Free to Play',
          'Hero Shooter',
          'Multiplayer',
          'FPS',
          'Shooter',
          'Action',
          'Class-Based',
          'Team-Based',
          'Funny',
          'First-Person',
          'Online Co-Op',
          'Competitive',
          'Cartoony',
          'Trading',
          'Co-op',
        ],
        languages: [
          'English',
          'Danish',
          'Dutch',
          'Finnish',
          'French',
          'German',
          'Italian',
          'Japanese',
          'Norwegian',
          'Polish',
          'Portuguese - Portugal',
          'Russian',
          'Simplified Chinese',
          'Spanish - Spain',
          'Swedish',
          'Traditional Chinese',
          'Korean',
          'Czech',
          'Hungarian',
          'Portuguese - Brazil',
          'Turkish',
          'Greek',
          'Bulgarian',
          'Romanian',
          'Thai',
          'Ukrainian',
        ],
        screenshots: [
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_ea21f7bbf4f79bada4554df5108d04b6889d3453.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_ea21f7bbf4f79bada4554df5108d04b6889d3453.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_e3aedb2ab36bba8cfe611b1e0eaa807e4bb2d742.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_e3aedb2ab36bba8cfe611b1e0eaa807e4bb2d742.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_ee24a769dc1d81dcbd7b250d16530394adee4264.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_ee24a769dc1d81dcbd7b250d16530394adee4264.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_9faaa506d91bf19dbb398e0c06a684b337f85f91.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_9faaa506d91bf19dbb398e0c06a684b337f85f91.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_7de978f22a7059151c31d0488dc57c5c7703c48b.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_7de978f22a7059151c31d0488dc57c5c7703c48b.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_e79f2490af3247b4b0f8d412d437b72c321cfe3b.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_e79f2490af3247b4b0f8d412d437b72c321cfe3b.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_8f28c75172e3d08e65222725202b82f58bfe7df7.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/ss_8f28c75172e3d08e65222725202b82f58bfe7df7.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002574.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002574.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002575.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002575.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002576.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002576.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002577.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002577.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002578.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002578.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002579.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002579.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002580.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002580.1920x1080.jpg',
          },
          {
            t: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002581.600x338.jpg',
            f: 'https://cdn.akamai.steamstatic.com/steam/apps/440/0000002581.1920x1080.jpg',
          },
        ],
        updated_at: '2023-06-25 17:05:18',
        released_at: '2007-10-10 00:00:00',
      })
      console.warn('anadido')
    },

    async addFriend() {
      try {
        // Add the new friend!
        const id = await this.$db.friends.add({
          name: this.friendName,
          age: this.friendAge,
          super: Math.random() * 100,
        })

        this.status = `Friend ${this.friendName}
          successfully added. Got id ${id}`

        // Reset form:
        this.friendName = ''
        this.friendAge = this.defaultAge
      } catch (error) {
        this.status = `Failed to add
          ${this.friendName}: ${error}`
      }
    },

    async leer() {
      console.warn(await this.$db.config.getItem('xxdd'))
    },
  },

  mounted() {
    // This is just a test, ensures that i can do both
    // this.userstore and this.$auth, and is reactive
    // ...mapStores(useUserStore),
    // this.userStore.isChecked = 'pepe'
    // this.$auth.redirectTo = 'pepes'
    // console.warn(JSON.stringify(this.userStore), JSON.stringify(this.$auth))
  },
}
</script>
