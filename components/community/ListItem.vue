<template>
  <nuxtLink
    :to="listHref(list)"
    class="list-group-item px-3 cursor-pointer text-decoration-none control-hover"
    style="padding-top: 0.8rem; padding-bottom: 0.8rem">
    <div class="list__marquee">
      <common-backgrquee
        :images="listService.getCovers(list)"
        :columns="3"
        :gap="5"
        :rotation="0"
        :speed="100"
        :scale="1"
        :image-height="70" />
    </div>
    <div class="row g-3 align-items-center">
      <div class="col">
        <div class="mb-1">
          <span class="font-serif">{{ list.name }}</span>
        </div>
        <div class="v-list-item-subtitle">
          <div class="small text-muted">
            <!-- By -->
            <!-- <span class="avatar avatar-xs rounded">
              {{ list.author.username.substring(0, 2) }}
            </span> -->

            {{ list.games.length }} games &nbsp;&middot;&nbsp;
            <small>
              <span class="font-mono">by {{ list.author.username }}</span>
            </small>
            <small class="font-mono show-hover-inline">
              &nbsp;&middot;&nbsp;{{ $moment(list.created_at).format('LL') }}
              &middot; Updated
              {{ dates.timeAgo(list.updated_at) }}
            </small>
          </div>
        </div>
      </div>

      <div class="col-auto text-secondary">
        <v-btn variant="text" icon="mdi-chevron-right" size="small"></v-btn>
      </div>
    </div>
  </nuxtLink>
</template>

<script>
/**
 * @file:    \components\community\ListItem.vue
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 21st January 2026
 * Modified: 15th February 2026 - 11:02:30
 **/

export default {
  name: 'CommunityListItem',

  props: {
    list: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {}
  },

  methods: {
    //+-------------------------------------------------
    // listHref()
    // Is the href link to a list
    // -----
    // Created on Wed Jan 21 2026
    //+-------------------------------------------------
    listHref(list) {
      const slug = list.slug || list.uuid
      const author = list.author?.slug || 'unknown'

      return `/@${author}/list/${slug}`
    },
  },
}
</script>
