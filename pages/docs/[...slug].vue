<template>
  <!-- <div class="page-header d-print-none">
    <div class="container-xl">
      <div class="row g-2 align-items-center">
        <div class="col">
          <h2 class="page-title">Documentation</h2>
        </div>
      </div>
    </div>
  </div> -->

  <div class="page-body">
    <div class="container-xl">
      <div class="row gx-lg-5">
        <!-- Left Sidebar Navigation -->
        <div class="d-none d-lg-block col-lg-2 pe-2" style="width: 20%">
          <div class="docs-sidebar mb-4">
            <span class="font-serif">Documentation</span>
            <!-- <DocsNavigation /> -->

            <nav v-if="navigation" class="docs-Navigation">
              <ul class="nav nav-pills nav-vertical">
                <li class="nav-item" v-for="item in navigation" :key="item.path">
                  <span class="font-serif">
                    <Icon class="me-3">Fingerprint</Icon>
                    {{ item.title }} - {{ item.path }}
                  </span>
                  <ul class="nav nav-pills nav-vertical">
                    <li v-for="child in item.children" class="nav-item">
                      <NuxtLink :to="`/docs${child.path}`" class="nav-link">
                        {{ child.title }}
                      </NuxtLink>
                    </li>
                  </ul>
                </li>
              </ul>

              <!-- <v-list nav variant="text" class="docs-Navigation">
                <v-list-item
                  v-for="(item, i) in navigation"
                  :key="item.path"
                  :value="item"
                  color="primary">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-page"></v-icon>
                    <Icon>Mist</Icon>
                  </template>

                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item>
                <v-list-group value="Actions">
                  <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" title="Actions">
                      <template v-slot:prepend>
                        <v-icon icon="mdi-page"></v-icon>
                        <Icon>Mist</Icon>
                      </template>
                    </v-list-item>
                  </template>

                  <v-list-item
                    v-for="([title, icon], i) in [
                      ['Create', 'mdi-plus-outline'],
                      ['Read', 'mdi-file-outline'],
                      ['Update', 'mdi-update'],
                      ['Delete', 'mdi-delete'],
                    ]"
                    :key="i"
                    :prepend-icon="icon"
                    :title="title"
                    :value="title"></v-list-item>
                </v-list-group>
                <v-btn @click="actions = !actions">open</v-btn>
                <v-list-group value="Actions" v-model="actions">
                  <v-list-item
                    v-for="([title, icon], i) in [
                      ['Create', 'mdi-plus-outline'],
                      ['Read', 'mdi-file-outline'],
                      ['Update', 'mdi-update'],
                      ['Delete', 'mdi-delete'],
                    ]"
                    :key="i"
                    :prepend-icon="icon"
                    :title="title"
                    :value="title"></v-list-item>
                </v-list-group>
              </v-list> -->
            </nav>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="col">
          <!-- Current document content -->

          <ContentRenderer v-if="page" :value="page" />

          <div v-else class="text-center my-5">
            <h2>Document not found</h2>
            <p class="mb-5">The requested document could not be found.</p>
          </div>
        </div>

        <!-- Right Sidebar - Table of Contents -->
        <div class="d-none d-lg-block col-lg-2">
          <DocsTableOfContents v-if="page && page.body" :toc="page.body.toc" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * @file:    \pages\docs\[...slug].vue
 * @desc:    Nuxt Content documentation page displaying user guides, changelog and developer docs
 * -------------------------------------------
 * Created Date: 26th October 2023
 * Modified: 27th June 2025 - 11:02:59
 **/

const route = useRoute()
const path = route.path
// console.log('Current route path:', path)

let actions = ref(false)

const relativePath = route.path == '/docs' ? '/' : route.path.replace('/docs', '')

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('content').path(relativePath).first()
})
// console.log('Page data:', page.value, 'looking for', route.path)

const { data: changelog } = await useAsyncData('changelog', () => {
  return queryCollection('changelog').order('date', 'DESC').all()
})

// console.log('Changelog data:', changelog.value, 'length:', changelog.value.length)
// const posts = ref(changelog?.value || [])
// console.log('Posts:', posts.value.length, posts.value)

const { data: navigation } = await useAsyncData('navigation', () => {
  return queryCollectionNavigation('content')
})

// console.log('Navigation data:', navigation.value)

const { data: surround } = await useAsyncData('surround', () => {
  return queryCollectionItemSurroundings('content', relativePath)
})

// console.log('Surrounding items:', surround.value)

const { data: everything } = await useAsyncData('everything', () => {
  return queryCollection('content').all()
})

// console.log('Everything :', everything.value)
</script>

<style scoped>
.docs-sidebar {
  position: sticky;
  top: 2rem;
}

.docs-toc {
  position: sticky;
  top: 2rem;
  font-size: 0.9rem;
}

.docs-index .card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.docs-index .card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Content styling */
:deep(h1) {
  margin-bottom: 1.5rem;
}

:deep(h2) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

:deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

:deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}

:deep(ul),
:deep(ol) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

:deep(li) {
  margin-bottom: 0.5rem;
}

:deep(pre) {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

:deep(code) {
  font-family: monospace;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.05);
  font-size: 0.9em;
}

.docs-Navigation {
  background-color: transparent;
  padding: 0;
}

.docs-Navigation ul {
  padding: 0;
  margin-left: 0;
}
</style>
