<template>
  <div class="docs-navigation">
    <div v-for="(section, index) in sections" :key="index" class="mb-4">
      <h5 class="mb-2">{{ section.title }}</h5>
      <ContentNavigation v-slot="{ navigation }" :query="section.query">
        <ul class="list-unstyled ps-1">
          <li v-for="link of navigation" :key="link._path" class="mb-1">
            <NuxtLink
              :to="link._path"
              class="d-block py-1 text-decoration-none"
              :class="{ 'fw-bold': isActive(link._path) }">
              {{ link.title }}
            </NuxtLink>
            <ul v-if="link.children && link.children.length" class="list-unstyled ps-3">
              <li v-for="child of link.children" :key="child._path">
                <NuxtLink
                  :to="child._path"
                  class="d-block py-1 text-decoration-none"
                  :class="{ 'fw-bold': isActive(child._path) }">
                  {{ child.title }}
                </NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </ContentNavigation>
    </div>
  </div>
</template>

<script setup>
/**
 * @file:    \components\docs\Navigation.vue
 * @desc:    Sidebar navigation component for documentation pages
 * -------------------------------------------
 * Created Date: 25th June 2025
 */

const route = useRoute()

// Sections for the navigation
const sections = [
  {
    title: 'User Guides',
    query: { where: { _path: { $contains: 'documentation' } } },
  },
  {
    title: 'Changelog',
    query: { where: { _path: { $contains: 'changelog' } } },
  },
  {
    title: 'For Developers',
    query: { where: { _path: { $contains: 'developer' } } },
  },
]

// Check if the current route matches a navigation link
const isActive = (path) => {
  return route.path === path
}
</script>

<style scoped>
.docs-navigation :deep(a) {
  color: inherit;
  transition: all 0.2s ease;
}

.docs-navigation :deep(a:hover) {
  color: var(--primary-color, #5965f2);
}

.docs-navigation :deep(a.fw-bold) {
  color: var(--primary-color, #5965f2);
}
</style>
