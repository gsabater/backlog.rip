<template>
  <div class="page-body">
    <div class="container-xl">
      <h2>Hey</h2>
      <strong>Buttons</strong>

      <b-btn>Button</b-btn>
      <b-btn variant="outline">Outline</b-btn>
      <b-btn variant="outline" color="success">Outline green</b-btn>
      <b-btn variant="ghost" color="warning">Text</b-btn>
      <b-btn disabled>Disabled</b-btn>
      <b-btn variant="icon" color="youtube">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon"
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
            d="M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8z"></path>
          <path d="M10 9l5 3l-5 3z"></path>
        </svg>
      </b-btn>
      <b-btn color="warning" block>BLOCK</b-btn>

      <hr />

      <icon icon="Search"></icon>
      <icon>Circle-x</icon>
      <icon>Ad</icon>
      <icon>Circlex</icon>
      <icon>CircleX</icon>
      <icon>Search</icon>

      <h1>Inputs</h1>
      <div class="row">
        <div class="col-3">
          <b-input label="Text field"></b-input>
        </div>

        <div class="col-3">
          <b-input label="Password" type="password"></b-input>
        </div>

        <div class="col-3">
          <b-input
            v-model="one"
            label="Disabled > 3"
            :disabled="one.length > 3"></b-input>
        </div>

        <div class="col-3">
          <b-input label="Required" required></b-input>
        </div>

        <div class="col-3">
          <b-input label="floating" variant="floating"></b-input>
        </div>

        <div class="col-3">
          <b-input label="Prepend icon: search" prepend-icon="Search"></b-input>
        </div>

        <div class="col-3">
          <b-input label="Clearable" clearable></b-input>
        </div>

        <div class="col-3">
          <b-input label="Loading" loading></b-input>
        </div>
      </div>

      <hr />
      <strong>Select</strong>
      <div class="row">
        <div class="col">
          <pre>{{ two }}</pre>
        </div>
        <div class="col">
          <b-select
            v-model="two"
            label="Single select"
            :items="
              Array.from({ length: 30 }, () =>
                Math.random().toString(36).substring(2, 12)
              )
            "></b-select>
        </div>
        <div class="col">
          <b-select
            v-model="two"
            label="Multiple select"
            multiple
            :items="
              Array.from({ length: 30 }, () =>
                Math.random().toString(36).substring(2, 12)
              )
            "></b-select>
        </div>
      </div>

      <hr />

      <strong>Dropdown</strong>
      <div class="row">
        <div class="col">
          <div class="btn">Dropdown</div>
          <b-menu v-if="one.length < 5">
            <a class="dropdown-item" href="#">Last 30 days</a>
          </b-menu>

          --

          <div class="dropdown">
            <div class="btn">OPEN</div>
            <b-menu>
              <a class="dropdown-item" href="#">OUT</a>
              <a class="dropdown-item" href="#">Another OUT</a>
            </b-menu>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="dropdown-menu dropdown-menu-demo">
            <h6 class="dropdown-header">Dropdown header</h6>
            <a href="#" class="dropdown-item">
              <!-- Download SVG icon from http://tabler-icons.io/i/activity -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon dropdown-item-icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M3 12h4l3 8l4 -16l3 8h4"></path>
              </svg>
              Item 1
            </a>
            <a href="#" class="dropdown-item">
              <!-- Download SVG icon from http://tabler-icons.io/i/edit -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon dropdown-item-icon"
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
                  d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
                <path
                  d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
                <path d="M16 5l3 3"></path>
              </svg>
              Item 2
            </a>
            <div class="dropdown-item">
              <a href="#" class="text-reset">My profile</a>
              <label class="form-check m-0 ms-auto">
                <input type="checkbox" class="form-check-input" />
                Public
              </label>
            </div>
            <label class="dropdown-item">
              <input class="form-check-input m-0 me-2" type="radio" />
              Radio input
            </label>
            <label class="dropdown-item">
              <input class="form-check-input m-0 me-2" type="checkbox" />
              Checkbox input
            </label>
            <label class="dropdown-item form-switch">
              <input class="form-check-input m-0 me-2" type="checkbox" />
              Checkbox input
            </label>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item">Dropdown item 1</a>
            <a href="#" class="dropdown-item">Dropdown item 2</a>
            <a href="#" class="dropdown-item disabled">Dropdown disabled</a>
            <a href="#" class="dropdown-item active">Dropdown active</a>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item">
              <span
                class="avatar avatar-xs rounded me-2"
                style="background-image: url(./static/avatars/000m.jpg)"></span>
              Paweł Kuna
            </a>
            <a href="#" class="dropdown-item">
              <span class="avatar avatar-xs rounded me-2">JL</span>
              Jeffie Lewzey
            </a>
            <a href="#" class="dropdown-item">
              <span
                class="avatar avatar-xs rounded me-2"
                style="background-image: url(./static/avatars/002m.jpg)"></span>
              Mallory Hulme
            </a>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item">
              <!-- Download SVG icon from http://tabler-icons.io/i/logout -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon dropdown-item-icon"
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
                  d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"></path>
                <path d="M9 12h12l-3 -3"></path>
                <path d="M18 15l3 -3"></path>
              </svg>
              Logout
            </a>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="dropdown-menu dropdown-menu-demo">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
          </div>
          <div class="dropdown-menu dropdown-menu-demo">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#">Separated link</a>
          </div>
          <div class="dropdown-menu dropdown-menu-demo">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <a class="dropdown-item active" href="#">Active action</a>
          </div>
          <div class="dropdown-menu dropdown-menu-demo">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <a class="dropdown-item disabled" href="#">Disabled action</a>
          </div>
          <div class="dropdown-menu dropdown-menu-demo">
            <span class="dropdown-header">Dropdown header</span>
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
          </div>
          <div class="dropdown-menu dropdown-menu-demo">
            <span class="dropdown-header">Dropdown header</span>
            <a class="dropdown-item" href="#">
              <!-- Download SVG icon from http://tabler-icons.io/i/settings -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon dropdown-item-icon"
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
                  d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
                <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
              </svg>
              Action
            </a>
            <a class="dropdown-item" href="#">
              <!-- Download SVG icon from http://tabler-icons.io/i/edit -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon dropdown-item-icon"
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
                  d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
                <path
                  d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
                <path d="M16 5l3 3"></path>
              </svg>
              Another action
            </a>
          </div>
          <div class="dropdown-menu dropdown-menu-demo dropdown-menu-arrow">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="dropdown-menu dropdown-menu-demo">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
          </div>
          <div class="dropdown-menu dropdown-menu-demo">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#">Separated link</a>
          </div>
          <div class="dropdown-menu dropdown-menu-demo">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <a class="dropdown-item active" href="#">Active action</a>
          </div>
          <div class="dropdown-menu dropdown-menu-demo">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <a class="dropdown-item disabled" href="#">Disabled action</a>
          </div>
          <div class="dropdown-menu dropdown-menu-demo">
            <span class="dropdown-header">Dropdown header</span>
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
          </div>
          <div class="dropdown-menu dropdown-menu-demo">
            <a class="dropdown-item" href="#">
              <!-- Download SVG icon from http://tabler-icons.io/i/settings -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon dropdown-item-icon"
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
                  d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
                <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
              </svg>
              Action
            </a>
            <a class="dropdown-item" href="#">
              <!-- Download SVG icon from http://tabler-icons.io/i/edit -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon dropdown-item-icon"
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
                  d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
                <path
                  d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
                <path d="M16 5l3 3"></path>
              </svg>
              Another action
            </a>
          </div>
          <div class="dropdown-menu dropdown-menu-demo">
            <a class="dropdown-item" href="#">
              Action
              <span class="badge bg-primary text-primary-fg ms-auto">12</span>
            </a>
            <a class="dropdown-item" href="#">
              Another action
              <span class="badge bg-green ms-auto"></span>
            </a>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="dropdown-menu dropdown-menu-demo" data-bs-theme="dark">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
          </div>
          <div class="dropdown-menu dropdown-menu-demo" data-bs-theme="dark">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#">Separated link</a>
          </div>
          <div
            class="dropdown-menu dropdown-menu-end dropdown-menu-demo dropdown-menu-arrow"
            data-bs-theme="dark">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
          </div>
          <div
            class="dropdown-menu dropdown-menu-end dropdown-menu-demo dropdown-menu-arrow"
            data-bs-theme="dark">
            <a class="dropdown-item" href="#">
              <!-- Download SVG icon from http://tabler-icons.io/i/settings -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon dropdown-item-icon"
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
                  d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
                <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
              </svg>
              Action
            </a>
            <a class="dropdown-item" href="#">
              <!-- Download SVG icon from http://tabler-icons.io/i/edit -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon dropdown-item-icon"
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
                  d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
                <path
                  d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
                <path d="M16 5l3 3"></path>
              </svg>
              Another action
            </a>
          </div>
          <div class="dropdown-menu dropdown-menu-demo">
            <label class="dropdown-item">
              <input class="form-check-input m-0 me-2" type="checkbox" />
              Option 1
            </label>
            <label class="dropdown-item">
              <input class="form-check-input m-0 me-2" type="checkbox" />
              Option 2
            </label>
            <label class="dropdown-item">
              <input class="form-check-input m-0 me-2" type="checkbox" />
              Option 3
            </label>
          </div>
          <div class="dropdown-menu dropdown-menu-demo">
            <label class="dropdown-item">
              <input class="form-check-input m-0 me-2" type="radio" />
              Option 1
            </label>
            <label class="dropdown-item">
              <input class="form-check-input m-0 me-2" type="radio" />
              Option 2
            </label>
            <label class="dropdown-item">
              <input class="form-check-input m-0 me-2" type="radio" />
              Option 3
            </label>
          </div>
          <div class="dropdown-menu dropdown-menu-demo">
            <a href="#" class="dropdown-item">
              <span
                class="avatar avatar-xs rounded me-2"
                style="background-image: url(./static/avatars/000m.jpg)"></span>
              Paweł Kuna
            </a>
            <a href="#" class="dropdown-item">
              <span class="avatar avatar-xs rounded me-2">JL</span>
              Jeffie Lewzey
            </a>
            <a href="#" class="dropdown-item">
              <span
                class="avatar avatar-xs rounded me-2"
                style="background-image: url(./static/avatars/002m.jpg)"></span>
              Mallory Hulme
            </a>
            <a href="#" class="dropdown-item">
              <span
                class="avatar avatar-xs rounded me-2"
                style="background-image: url(./static/avatars/003m.jpg)"></span>
              Dunn Slane
            </a>
            <a href="#" class="dropdown-item">
              <span
                class="avatar avatar-xs rounded me-2"
                style="background-image: url(./static/avatars/000f.jpg)"></span>
              Emmy Levet
            </a>
          </div>
        </div>
      </div>

      <hr />

      <button @click="$toast('My first toast')">Render a toast</button>
      <button
        @click="
          $toast('Event has been created', {
            description: 'Monday, January 3rd at 6:00pm',
          })
        ">
        Render a toast
      </button>
      <button
        @click="
          $toast.success('Event has been created', {
            description: 'Monday, January 3rd at 6:00pm',
          })
        ">
        Render a toast
      </button>
      <button
        @click="
          $toast.error('Event has been created', {
            description: 'Monday, January 3rd at 6:00pm',
          })
        ">
        Render a toast
      </button>
      <button
        @click="
          $toast('Event has been created', {
            action: {
              label: 'Undo',
              onClick: () => console.log('Undo'),
            },
          })
        ">
        Render a toast
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'UserInterface',
  data() {
    return {
      one: false,
      two: false,
      three: false,
    }
  },

  methods: {},
}
</script>

<style></style>
