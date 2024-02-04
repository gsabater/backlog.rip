<template>
  <div class="card mb-3" style="padding: 1rem">
    <div class="card-body">
      <div>
        <div class="d-flex mb-3">
          <h1 class="m-0">Your local database</h1>
        </div>
      </div>
      <p>
        Your database is where all your games, states, and other information is stored.
        You can export your database to a file, or import a database file to replace your
        current one.
      </p>
      <p>
        You can also reset any database to its default state. This will delete all your
        games and states, and replace them with the default ones. This can help resolving
        any issues you may be having.
      </p>
    </div>
  </div>

  <div class="row row-cards">
    <div class="col-6">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Resources</h3>
        </div>
        <div class="list-group list-group-flush list-group-hoverable">
          <div v-for="(table, i) in db.tables" :key="i" class="list-group-item">
            <div class="row align-items-center">
              <div class="col-auto">
                <span
                  style="--tblr-status-color: green"
                  class="status-dot status-dot-animated"></span>
              </div>
              <div class="col-auto">
                <a href="#">
                  <span class="avatar">
                    {{ table.name[0] }}
                  </span>
                </a>
              </div>
              <div class="col text-truncate">
                <a href="#" class="text-reset d-block" style="text-transform: capitalize">
                  {{ table.name }}
                </a>
                <div class="d-block text-secondary text-truncate mt-n1">
                  {{ table.count }} rows
                </div>
              </div>
              <div class="col-auto">
                <b-btn class="btn-sm btn-outline-warning">
                  <Icon size="16" class="mr-1">Restore</Icon>
                  Reset data
                </b-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-6">
      <pre @click="ui.dialog = true">
        {{ log }}
      </pre>
      <div class="card">
        Export
        <b-btn @click="exportAndDownload">do</b-btn>
      </div>
      <div class="card">
        Import

        <div @click="openFileDialog">
          Click to select a file
          <input ref="fileInput" type="file" style="display: none" @change="handleFile" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\account\sections\database.vue
 * @desc:    https://dexie.org/docs/ExportImport/dexie-export-import
 * -------------------------------------------
 * Created Date: 18th January 2024
 * Modified: Sat Feb 03 2024
 **/

export default {
  name: 'AccountDatabase',

  data() {
    return {
      log: [],
      db: {
        tables: [],
      },

      ui: {
        dialog: false,
      },
    }
  },

  methods: {
    //+-------------------------------------------------
    // clear()
    // Clears (empties) a table in database.
    // -----
    // Created on Thu Jan 18 2024
    //+-------------------------------------------------
    async clear(table) {
      return await this.$db[table].clear()
    },

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Sat Feb 03 2024
    //+-------------------------------------------------
    async reset() {
      this.db.tables.forEach(async (table) => {
        await this.clear(table.name)
      })
      return true
    },

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Sat Feb 03 2024
    //+-------------------------------------------------
    async exportAndDownload() {
      const progressCallback = this.progressCallback

      try {
        const blob = await this.$db.export({ prettyJson: false, progressCallback })
        this.download(blob, 'dexie-export.json', 'application/json')
      } catch (error) {
        console.error('' + error)
      }
    },

    download(blob, filename) {
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: 'application/json' })
      )
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    progressCallback({ totalRows, completedRows }) {
      this.log.push(`Progress: ${completedRows} of ${totalRows} rows completed`)
    },

    openFileDialog() {
      this.$refs.fileInput.click()
    },

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Sat Feb 03 2024
    //+-------------------------------------------------
    async handleFile(e) {
      const file = e.target.files[0]
      if (!file) return
      await this.selectAndImport(file)
    },

    //+-------------------------------------------------
    // function()
    //
    // -----
    // Created on Sat Feb 03 2024
    //+-------------------------------------------------
    async selectAndImport(file) {
      try {
        const progressCallback = this.progressCallback

        if (!file) throw new Error(`Only files can be dropped here`)
        console.log('Importing ' + file.name)
        // await this.$db.delete()
        await this.reset()
        await this.$db.import(file, {
          progressCallback,
        })
        console.log('Import complete')
      } catch (error) {
        console.error('' + error)
      }
    },

    async getData() {
      this.db.tables = await Promise.all(
        this.$db.tables.map(async (table) => ({
          name: table.name,
          count: await table.count(),
          primKey: table.schema.primKey.src,
        }))
      )
    },

    async init() {
      await this.getData()
      // this.ui.loading = false
    },
  },

  mounted() {
    this.init()
  },
}
</script>
