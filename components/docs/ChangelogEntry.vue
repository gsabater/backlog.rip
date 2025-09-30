<template>
  <div class="row">
    <div class="col-12 col-lg-3 px-2 px-lg-4 offset-lg-1 mb-3 mb-lg-0">
      <h1 class="display-6 mb-3 mt-0 mt-lg-5 text-center text-md-start pt-md-3">
        {{ post.title }}
      </h1>
      <div
        class="d-flex align-items-center flex-wrap mb-3 justify-content-center justify-content-lg-start">
        <span v-if="post.version" class="version-chip me-3">v{{ post.version }}</span>
        <div class="release-date text-muted">
          {{ formatDate(post.date) }}
        </div>
      </div>
    </div>
    <div class="col-12 col-lg-7 px-3 px-lg-0">
      <!-- Content Card -->
      <div class="card shadow-sm mb-3 mb-lg-5 changelog-card p-md-3">
        <div class="card-body p-2 p-md-5 pt-1 pt-lg-0">
          <div class="changelog-content">
            <ContentRenderer :value="post" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \components\docs\ChangelogEntry.vue
 * @desc:    Displays a single changelog entry with its details
 * -------------------------------------------
 * Created Date: June 23, 2025
 */

export default {
  name: 'ChangelogEntry',

  props: {
    post: {
      type: Object,
      required: true,
    },
  },

  methods: {
    formatDate(date) {
      if (!date) return ''
      if (typeof this.$moment === 'function') {
        return this.$moment(date).format('LL')
      }
      return new Date(date).toLocaleDateString()
    },
  },
}
</script>

<style scoped>
/* Markdown Content Styling */
:deep(.changelog-content) {
  line-height: 1.6;
}

:deep(.changelog-content h2) {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 1.5rem;
}

:deep(.changelog-content h3) {
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  font-size: 1.25rem;
}

:deep(.changelog-content ul) {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

:deep(.changelog-content li) {
  margin-bottom: 0.4rem;
}

:deep(.changelog-content pre) {
  border-radius: 4px;
  padding: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.changelog-content code) {
  font-family: monospace;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.2);
  font-size: 0.9em;
}

:deep(.changelog-content p > code) {
  color: #00fdcf;
}

/* Mobile responsive adjustments for content */
@media (max-width: 991.98px) {
  :deep(.changelog-content h2) {
    font-size: 1.3rem;
    margin-top: 1.25rem;
  }

  :deep(.changelog-content h3) {
    font-size: 1.1rem;
    margin-top: 1rem;
  }

  :deep(.changelog-content pre) {
    padding: 0.75rem;
    font-size: 0.85rem;
  }

  :deep(.changelog-content ul) {
    padding-left: 1.25rem;
  }

  /* Make first image in changelog card bigger and remove padding on mobile */
  /* .changelog-card .card-body {
    padding: 0 !important;
  } */

  .changelog-card :deep(.changelog-content img:first-child) {
    width: 100% !important;
    height: auto !important;
    max-width: none !important;
    border-radius: 0.375rem 0.375rem 0 0;
    transform: scale(1.12) translateY(-15px);
    transform-origin: center top;
    margin-bottom: 1rem;
  }

  .changelog-card :deep(.changelog-content) {
    padding: 1rem;
  }

  .changelog-card :deep(.changelog-content img:first-child + *) {
    margin-top: 0.5rem;
  }
}
</style>
