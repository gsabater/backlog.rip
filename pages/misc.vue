<template>
  <div>
    <h1>Miscellaneous</h1>
    <p>Here are some miscellaneous things.</p>
    <ul>
      <li>
        Routes - <a href="https://nuxt.com/docs/api/composables/use-route">link</a>
      </li>
    </ul>
  </div>
</template>

<script setup>

const route = useRoute()
// When accessing /posts/1, route.params.id will be 1
console.log(route, route.params, route.query)
</script>
