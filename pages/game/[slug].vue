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
 * Modified: Fri 22 November 2024 - 14:26:09
 **/

const route = useRoute()
const slug = computed(() => route.params.slug)
const $data = useDataStore()

const { data, pending, error } = await useFetch(
  () => `https://api.backlog.rip/get/5c1c9b5a-1c02-4a56-85df-f0cf97929a48.json`
)

const app = $data.prepareToData({ ...unref(data) })

watchEffect(() => {
  console.log({
    k: '🔸',
    // data: unref(data),
    // app: unref(app),
    // pending: unref(pending),
    // error: unref(error),
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
