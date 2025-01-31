<template>
  <div class="page-body">
    <div class="container">
      <template v-if="pending">
        <div>Loading...</div>
      </template>

      <template v-else-if="error">
        <h1>Data Not Found</h1>
        <p>Sorry, we couldn't find the data you're looking for.</p>
      </template>

      <template v-else-if="app">
        <div id="game-folio">
          <game-folio :game="app" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
/**
 * @file:    \pages\game\[slug].vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 18th December 2023
 * Modified: Thu 23 January 2025 - 17:07:05
 **/

const route = useRoute()
const slug = computed(() => route.params.slug)
const $data = useDataStore()

const { data, pending, error } = await useFetch(
  () => `https://api.backlog.rip/get/${slug.value}.json`
)

const app = dataService.prepareToData({ ...unref(data) })

watchEffect(() => {
  console.log({
    k: '🔸',
    // data: unref(data),
    // app: unref(app),
    // pending: unref(pending),
    // error: unref(error),

    route: route.params,
    data: data.id,
    app: app.id,
  })
})

useHead(() => ({
  title: app.name ?? 'Data Not Found',
  meta: [
    {
      name: 'description',
      content: data.value?.description ?? 'Data not found',
    },
    {
      property: 'og:title',
      content: data.value?.title ?? 'Data Not Found',
    },
    {
      property: 'og:description',
      content: data.value?.description ?? 'Data not found',
    },
  ],
}))
</script>
