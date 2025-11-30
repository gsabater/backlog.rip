<template>
  <div class="card mb-3" style="padding: 0.5rem">
    <div class="card-body">
      <div>
        <div class="d-flex mb-3">
          <h1 class="m-0">
            <Icon class="me-2" style="transform: translateY(-2px)">Mist</Icon>
            Your lists
          </h1>
        </div>
      </div>
      <p>
        <strong>Lists are like playlists for your games.</strong>
        Create as many as you need (like "Favorite RPGs", "Local Co-op Games", "My 2025 favorites")
        and add games to multiple lists for complete flexibility.
      </p>
      <p>
        <strong>What's the difference between lists and states?</strong>
        States track progress and power recommendations. Lists let you organize however you want. A
        game has one state but can be in unlimited lists.
      </p>
      <p>
        <strong>Keep your lists private or share them with the community.</strong>
        Lists stay on your device by default, with public sharing on the way. Organize by genre,
        mood, or any category you choose.
      </p>
    </div>
  </div>

  <div class="row mb-3">
    <div class="col-6">
      <v-btn
        variant="tonal"
        color="rgb(135 140 195)"
        style="
          filter: drop-shadow(0 0 1rem rgba(174, 62, 201, 0.2));
          outline: 1px solid #9e58581c;
          outline-offset: -1px;
        "
        @click="$mitt.emit('list:create')">
        Create a new list
      </v-btn>
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
              <div>
                <Icon size="12" class="text-muted me-2">Mist</Icon>
                <span class="font-serif">{{ item.name }}</span>
              </div>
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

            <div class="col-auto text-secondary" @click.stop.prevent="() => {}">
              <div style="position: relative">
                <v-btn variant="text" icon size="x-small" color="grey-lighten-1">
                  <Icon size="18" width="2">DotsVertical</Icon>
                </v-btn>
                <b-dropdown
                  trigger="mouseenter focus click"
                  singleton-group="list-actions"
                  :debounce="15"
                  placement="left-start"
                  style="
                    min-width: 220px;
                    max-width: 220px;
                    overflow: hidden;
                    letter-spacing: initial;
                    background: #24232a;
                    border: 1px solid #453331;
                  ">
                  <div class="dropdown-header">
                    {{ item.name }}
                  </div>

                  <div class="dropdown-item" @click.stop="$mitt.emit('list:edit', { item })">
                    <Icon size="16" class="me-2 text-muted">Pencil</Icon>
                    Edit list
                  </div>

                  <div class="dropdown-item" @click.stop="goToList(item, 'edit')">
                    <Icon size="16" class="me-2 text-muted">Replace</Icon>
                    Modify games
                  </div>
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
                    Delete
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
      style="border: 1px dashed #cccccc73; border-radius: 4px; height: auto; padding: 2.5rem">
      <p class="empty-title mb-3 font-serif" style="font-weight: 300">
        You don't have any lists yet
      </p>
      <p class="empty-subtitle text-secondary">Go ahead and create your first list.</p>
      <p class="empty-subtitle text-secondary">
        Lists are perfect way to organize your games. You can create as many lists as you want, and
        you can add many games to them. Also, lists can be private or shared with others.
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
</template>

<script>
/**
 * @file:    \pages\account\sections\lists.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 27th September 2024
 * Modified: 30th November 2025 - 06:17:18
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
  },
}
</script>
