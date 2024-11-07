<template>
  <div class="card mb-3" style="padding: 0.5rem">
    <div class="card-body">
      <div>
        <div class="d-flex mb-3">
          <h1 class="m-0">Your lists</h1>
        </div>
      </div>
      <!-- <p>
        Lists are perfect way to organize your games. You can create as many lists as you
        want, and you can add many games to them.
      </p>

      <p>You can add many games to a list, and you can add a game to many lists.</p>
      <p>
        Lists are different from states in that states are used to categorize your games,
        and used to generate personalized recommendations and insights on your dashboard.
        A game can only have a single state, but can be in multiple lists.
      </p> -->

      <p>
        Lists are the perfect way to organize your games exactly how you want. Create as
        many lists as you need - like "Favorite RPGs" or "Local Co-op Games". You can add
        games to multiple lists, giving you complete flexibility in how you organize your
        collection of games.
      </p>

      <p>
        While states (like "Playing" or "Completed") are used to track your progress and
        help generate personalized recommendations, lists are your personal way to group
        games however you prefer. Think of them like playlists - a game can only have one
        state, but it can be part of as many lists as you want.
      </p>

      <p>
        You can create both private lists that stay on your device and public lists to
        share with the community (coming soon!). Whether you're organizing games by genre,
        mood, or your own unique categories, lists give you the freedom to arrange your
        games your way.
      </p>
    </div>
  </div>

  <!-- <div
    class="hr-text font-serif w-75 mx-auto"
    style="margin-top: 2rem !important; margin-bottom: 2rem !important">
    ◈ ◈ ◈
  </div> -->

  <!-- <div
    class="divider"
    style="border-top: 1px dashed rgb(204 204 204 / 25%); margin: 2rem"></div> -->

  <div class="row mb-3">
    <div class="col-6">
      <v-btn variant="tonal" color="primary" @click="$mitt.emit('list:create')">
        Create a new list
      </v-btn>
      <!-- <a class="btn btn-primary px-3" @click="$mitt.emit('list:create')">
        Create a new list
      </a> -->
    </div>
    <!-- <div class="col-auto ms-auto">
      <v-btn variant="tonal" color="secondary" style="min-width: 40px" class="me-2">
        <Icon>Trash</Icon>
      </v-btn>

      <v-btn variant="tonal" color="secondary" style="min-width: 40px">
        <Icon>Badge</Icon>
      </v-btn>
    </div> -->
  </div>

  <div class="card mb-3">
    <div class="list-group card-list-group">
      <template v-for="item in lists" :key="item.uuid">
        <div
          @click="goToList(item)"
          class="list-group-item px-3 cursor-pointer text-decoration-none"
          style="padding-top: 0.8rem; padding-bottom: 0.8rem">
          <div class="row g-3 align-items-center">
            <!-- <div class="col-auto text-secondary">
            <v-btn variant="text" icon="mdi-chevron-right" size="small">
              <Icon>Badge</Icon>
            </v-btn>
          </div> -->
            <div class="col">
              <span class="font-serif">{{ item.name }}</span>
              <div class="v-list-item-subtitle">
                <small class="text-muted">
                  Public 🔸 {{ item.games.length }} games 🔸
                  {{ $moment(item.created_at).format('LL') }} 🔸
                  <Icon size="16" width="1">Replace</Icon>
                  {{ dates.timeAgo(item.updated_at) }}
                </small>
              </div>
            </div>

            <!-- <div class="col-auto">
              <v-btn variant="tonal" size="small" color="blue-grey-lighten-1">
                Modify list
              </v-btn>
            </div> -->

            <div class="col-auto text-secondary" @click.prevent="() => {}">
              <div style="position: relative">
                <v-btn
                  variant="text"
                  icon="mdi-chevron-right"
                  size="x-small"
                  color="grey-lighten-1">
                  <Icon size="18" width="2">DotsVertical</Icon>
                </v-btn>
                <b-dropdown
                  trigger="mouseenter focus click hover manual"
                  placement="bottom-end"
                  :debounce="15"
                  style="min-width: 180px">
                  <div
                    class="dropdown-item"
                    @click.stop="$mitt.emit('list:edit', { item })">
                    <Icon size="16" class="me-2 text-muted">Pencil</Icon>
                    Edit details
                  </div>

                  <div class="dropdown-item" @click.stop="goToList(item, 'edit')">
                    <Icon size="16" class="me-2 text-muted">Replace</Icon>
                    Modify list
                  </div>
                  <div class="dropdown-divider"></div>
                  <div
                    class="dropdown-item text-red"
                    @click.stop="
                      $mitt.emit('ask:confirm', {
                        item,
                        title: 'Delete list',
                        message: 'Are you sure you want to delete this list?',
                        onConfirm: () => $mitt.emit('list:delete', { item }),
                      })
                    ">
                    <Icon size="16" class="me-2 text-red">Trash</Icon>
                    Delete list
                  </div>
                </b-dropdown>
              </div>
            </div>

            <!-- <div class="col-auto text-secondary">
            <v-btn variant="tonal" icon="mdi-chevron-right" size="small">
              <Icon>ChevronRight</Icon>
            </v-btn>
          </div> -->
          </div>
        </div>
      </template>
    </div>

    <!--
      *+---------------------------------
      *| Empty block
      *| Message when there are no results
      *+--------------------------------- -->
    <div
      v-if="Object.keys(lists).length == 0"
      class="empty"
      style="
        border: 1px dashed #cccccc73;
        border-radius: 4px;
        height: auto;
        padding: 2.5rem;
      ">
      <p class="empty-title mb-3 font-serif" style="font-weight: 300">
        You don't have any lists yet
      </p>
      <p class="empty-subtitle text-secondary">Go ahead and create your first list.</p>
      <p class="empty-subtitle text-secondary">
        Lists are perfect way to organize your games. You can create as many lists as you
        want, and you can add many games to them. Also, lists can be private or shared
        with others.
      </p>
    </div>
  </div>

  <!-- <div class="card mb-3" style="border-radius: 4px; margin-top: 5px">
    <v-list-item
      append-icon="mdi-chevron-right"
      lines="two"
      density="comfortable"
      class="text-decoration-none"
      link
      href="https://discord.gg/F2sPE5B"
      target="_blank">
      <template v-slot:prepend>
        <div class="p-2">
          <Icon size="18" width="1.5" class="text-muted">Flask</Icon>
        </div>
      </template>
      <template v-slot:title>
        <span class="text-body-2 px-1 font-serif">Lists are currently in beta</span>
      </template>
      <template v-slot:subtitle>
        <small class="text-muted px-1">Share feedback and report bugs</small>
      </template>
      <template v-slot:append>
        <v-btn icon>
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </v-list-item>
    <v-list-item
      append-icon="mdi-chevron-right"
      lines="two"
      density="comfortable"
      class="text-decoration-none"
      link
      href="https://discord.gg/F2sPE5B"
      target="_blank">
      <template v-slot:title>
        <span class="text-body-2 px-1 font-serif">Lists are currently in beta</span>
      </template>
      <template v-slot:subtitle>
        <small class="text-muted px-1">Share feedback and report bugs</small>
      </template>
    </v-list-item>
  </div> -->
  <!-- <list-crud-dialog
    ref="crud"
    @close="selected = null"
    @stored="$forceUpdate()"
    @deleted="$forceUpdate()" /> -->
</template>

<script>
/**
 * @file:    \pages\account\sections\lists.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 27th September 2024
 * Modified: Wed 06 November 2024 - 14:01:05
 **/

export default {
  name: 'AccountLists',

  data() {
    return {}
  },

  computed: {
    ...mapState(useListStore, ['lists']),
  },

  methods: {
    //+-------------------------------------------------
    // goToList()
    // -----
    // Created on Fri Oct 11 2024
    //+-------------------------------------------------
    goToList(item, edit = false) {
      let slug = item.slug || item.uuid
      navigateTo('/my/list/' + slug + (edit ? '/edit' : ''))
    },

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
        this.download(blob, 'my.backlog', 'application/json')
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
      this.log = `Progress: ${completedRows} of ${totalRows} rows completed`
      // this.log.push(`Progress: ${completedRows} of ${totalRows} rows completed`)
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
        window.location.reload()
      } catch (error) {
        console.error('' + error)
      }
    },

    // async getData() {
    //   this.db.tables = await Promise.all(
    //     this.$db.tables.map(async (table) => ({
    //       name: table.name,
    //       count: await table.count(),
    //       primKey: table.schema.primKey.src,
    //     }))
    //   )
    // },

    async init() {
      // await this.getData()
      // this.ui.loading = false
    },
  },

  mounted() {
    this.init()
  },
}
</script>
