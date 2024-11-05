<template>
  <!-- Page header -->
  <div class="page-header d-print-none">
    <div class="container-xl">
      <div class="row g-2 align-items-center">
        <div class="col">
          <h2 class="page-title">Tabler License</h2>
        </div>
      </div>
    </div>
  </div>
  <!-- Page body -->
  <div class="page-body">
    <div class="container-xl">
      <div class="row row-cards">
        <div class="col-lg-8">
          <div class="card card-lg">
            <div class="card-body">
              <div class="markdown">
                <p>
                  This is a legal agreement between you, the Purchaser, and Tabler.
                  Purchasing or downloading of any Tabler product (Tabler Free, Tabler
                  PRO, Tabler Email), constitutes your acceptance of the terms of this
                  license,
                  <a href="https://tabler.io/terms-of-service.html">
                    Tabler terms of service
                  </a>
                  and
                  <a href="https://tabler.io/privacy-policy.html">
                    Tabler private policy
                  </a>
                  .
                </p>
                <p>
                  A license grants you a non-exclusive and non-transferable right to use
                  and incorporate the item in your personal or commercial projects.
                </p>
                <h3 id="tabler-free-license">Tabler Free License</h3>
                <p>Tabler Free is available under MIT License</p>
                <p>Copyright 2024 Tabler</p>
                <p>
                  Permission is hereby granted, free of charge, to any person obtaining a
                  copy of this software and associated documentation files (the
                  “Software”), to deal in the Software without restriction, including
                  without limitation the rights to use, copy, modify, merge, publish,
                  distribute, sublicense, and/or sell copies of the Software, and to
                  permit persons to whom the Software is furnished to do so, subject to
                  the following conditions:
                </p>
                <p>
                  The above copyright notice and this permission notice shall be included
                  in all copies or substantial portions of the Software.
                </p>
                <p>
                  THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS
                  OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
                  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
                  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
                  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
                  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                </p>
                <h3 id="tabler-pro-and-tabler-email-license">
                  Tabler PRO and Tabler Email License
                </h3>
                <p>
                  After Purchasing you are granted the use products under the conditions
                  featured belowed.
                </p>
                <p>Rights</p>
                <ol>
                  <li>
                    You have rights to use our resources for any or all of your personal
                    and commercial projects.
                  </li>
                  <li>You may modify the resources according to your requirements.</li>
                  <li>
                    You are not required to attribute or link to Tabler in any of your
                    projects.
                  </li>
                </ol>
                <p>Restrictions</p>
                <ol>
                  <li>
                    You do not have the rights to redistribute, resell, lease, license,
                    sub-license or offer the file downloaded to any third party.
                  </li>
                  <li>
                    For any resalable web applications or software programs, you cannot
                    include our graphic resources as an additional attachment.
                  </li>
                  <li>
                    You cannot redistribute any of the software, or products created with
                    Tabler paid products.
                  </li>
                  <li>You cannot add our source code to any open source repository.</li>
                  <li>
                    The source code may not be placed on any website in a complete or
                    archived downloadable format.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="me-3">
                  <!-- Download SVG icon from http://tabler-icons.io/i/scale -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon icon-md">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M7 20l10 0"></path>
                    <path d="M6 6l6 -1l6 1"></path>
                    <path d="M12 3l0 17"></path>
                    <path d="M9 12l-3 -6l-3 6a3 3 0 0 0 6 0"></path>
                    <path d="M21 12l-3 -6l-3 6a3 3 0 0 0 6 0"></path>
                  </svg>
                </div>
                <div>
                  <small class="text-secondary">
                    tabler/tabler is licensed under the
                  </small>
                  <h3 class="lh-1">MIT License</h3>
                </div>
              </div>
              <div class="text-secondary mb-3">
                A short and simple permissive license with conditions only requiring
                preservation of copyright and license notices. Licensed works,
                modifications, and larger works may be distributed under different terms
                and without source code.
              </div>

              <h2 class="mb-2">Account</h2>
              <p class="card-subtitle">Preferences and profile details</p>
              <!-- <div class="row align-items-center">
        <div class="col-auto"><span class="avatar avatar-xl" style="background-image: url(./static/avatars/000m.jpg)"></span>
        </div>
        <div class="col-auto"><a href="#" class="btn">
            Change avatar
          </a></div>
        <div class="col-auto"><a href="#" class="btn btn-ghost-danger">
            Delete avatar
          </a></div>
      </div> -->

              <!-- <h3 class="card-title mt-4">Your profile</h3> -->
              <div class="row g-3">
                <div class="col-md-12 nope-col-lg-8">
                  <div class="form-label">Your username</div>
                  <!-- <h4 class="card-title mb-2">Username2</h4> -->
                  <v-text-field
                    v-model="$auth.me.username"
                    density="comfortable"
                    persistent-hint
                    hint="This is only you display name"
                    @change="update('account', 'username')" />
                </div>
              </div>

              <h4>Permissions</h4>
              <ul class="list-unstyled space-y-1">
                <li>
                  <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon text-green">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M5 12l5 5l10 -10"></path>
                  </svg>
                  Commercial use
                </li>
                <li>
                  <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon text-green">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M5 12l5 5l10 -10"></path>
                  </svg>
                  Modification
                </li>
                <li>
                  <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon text-green">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M5 12l5 5l10 -10"></path>
                  </svg>
                  Distribution
                </li>
                <li>
                  <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon text-green">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M5 12l5 5l10 -10"></path>
                  </svg>
                  Private use
                </li>
              </ul>
              <h4>Limitations</h4>
              <ul class="list-unstyled space-y-1">
                <li>
                  <!-- Download SVG icon from http://tabler-icons.io/i/x -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon text-red">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M18 6l-12 12"></path>
                    <path d="M6 6l12 12"></path>
                  </svg>
                  Liability
                </li>
                <li>
                  <!-- Download SVG icon from http://tabler-icons.io/i/x -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon text-red">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M18 6l-12 12"></path>
                    <path d="M6 6l12 12"></path>
                  </svg>
                  Warranty
                </li>
              </ul>
              <h4>Conditions</h4>
              <ul class="list-unstyled space-y-1">
                <li>
                  <!-- Download SVG icon from http://tabler-icons.io/i/info-circle -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon text-blue">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                    <path d="M12 9h.01"></path>
                    <path d="M11 12h1v4h1"></path>
                  </svg>
                  License and copyright notice
                </li>
              </ul>
            </div>
            <div class="card-footer">
              This is not legal advice.
              <a href="#" target="_blank">Learn more about repository licenses.</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\@[user]\lists\[slug].vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 30th September 2024
 * Modified: Mon 30 September 2024 - 16:20:57
 **/

export default {
  data() {
    return {}
  },

  computed: {
    ...mapStores(useDataStore, useStateStore),
    ...mapState(useStateStore, ['states', 'pinnedStates', 'unPinnedStates']),

    source() {
      let slug = this.$route.params?.slug[0] || null
      if (['pinned', 'hidden', 'favorites'].includes(slug)) return slug

      let state = this.states.find((state) => state.slug == slug)
      return state ? state.name : 'Library'
    },
  },
}
</script>
