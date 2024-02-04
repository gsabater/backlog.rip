<template>
  <!-- <div class="text-center mb-4">
    <a href="." class="navbar-brand navbar-brand-autodark">
      <img
        src="./static/logo.svg"
        width="110"
        height="32"
        alt="Tabler"
        class="navbar-brand-image" />
    </a>
  </div> -->
  <div class="card card-md" :style="step == 1 ? 'border: 2px solid green' : ''">
    <div v-if="step == 0" class="card-body">
      <h2 class="text-center mb-4">Update required</h2>

      <p class="mb-4">
        There is a new major version of Backlog.rip available. The new version includes
        important updates and a new database schema that is not compatible with the
        current version. To continue using the application, first you need to update the
        database.
      </p>
      <p class="mb-4">
        Before updating, downloading a backup of your data is recommended. Then, you can
        start the process by clicking the button below.
      </p>

      <div
        v-if="loading"
        class="progress progress-sm"
        style="position: absolute; height: 0.15rem">
        <div class="progress-bar progress-bar-indeterminate"></div>
      </div>

      <div class="btn btn-outline-primary w-100 mb-3" @click="exportAndDownload">
        Download a backup
      </div>

      <div class="btn btn-primary w-100" @click="updateDB">Update the database</div>
    </div>
    <div v-if="step == 1" class="card-body">
      <h2 class="text-center mb-4">Database updated</h2>
      <p class="mb-4">
        The database has been updated successfully. You can now continue using the
        application.
      </p>

      <div
        v-if="loading"
        class="progress progress-sm"
        style="position: absolute; height: 0.15rem">
        <div class="progress-bar progress-bar-indeterminate"></div>
      </div>

      <a href="https://backlog.rip" class="btn btn-outline-primary w-100">
        Go back to the site
      </a>
    </div>
  </div>
</template>

<script setup>
/**
 * @file:    \pages\account\update.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 2nd February 2024
 * Modified: Sat Feb 03 2024
 **/

import Dexie from 'dexie'

definePageMeta({
  layout: 'empty',
})

const db = new Dexie('backlog.rip')
await db.open()

const log = ref('')
const step = ref(0)
const loading = ref(false)

const progressCallback = ({ totalRows, completedRows }) => {
  log.value = `Progress: ${completedRows} of ${totalRows} rows completed`
}

const exportAndDownload = async () => {
  try {
    loading.value = true
    const blob = await db.export({
      prettyJson: false,
      progressCallback: progressCallback,
    })
    download(blob)
    loading.value = false
  } catch (error) {
    console.error('' + error)
    loading.value = false
  }
}

const download = (blob) => {
  const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'backup.json')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const updateDB = async () => {
  db.close()
  const update = await dexieToolkit.update()
  if (update) step.value = 1
}
</script>

<style></style>
