<template>
  <NuxtLink :to="$attrs['to']" class="text-decoration-none">
    <v-list-item
      variant="tonal"
      link
      nav
      lines="two"
      append-icon="mdi-chevron-right"
      class="text-decoration-none ps-3 shadow-sm"
      style="outline: rgb(117 106 132 / 61%) solid 1px; outline-offset: 1px">
      <!-- <template v-slot:prepend>
        <div class="p-2">
          <Icon size="18" width="1.5" class="text-muted">Flask</Icon>
        </div>
      </template> -->
      <template #title>
        <span
          class="text-body-2 px-1 font-serif text-purple-lighten-4"
          style="font-weight: 100; letter-spacing: 1px !important">
          <slot mdc-unwrap="p" />
        </span>
      </template>
      <template #subtitle>
        <small class="text-muted px-1">
          {{ $attrs['subtitle'] }}
        </small>
      </template>
      <!-- <template v-slot:append>
        <v-btn icon>
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template> -->
    </v-list-item>
  </NuxtLink>
</template>

<script>
/**
 * @file:    \components\content\Linker.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 31st January 2025
 * Modified: 26th June 2025 - 08:16:41
 **/

export default {
  name: 'ContentLink',
}
</script>
