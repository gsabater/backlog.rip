<template>
  <div class="col-3 px-4 offset-1">
    <h1 class="display-6 mb-3 mt-5">{{ post.title }}</h1>
    <div class="d-flex align-items-center flex-wrap mb-3">
      <span v-if="post.version" class="version-chip me-3">v{{ post.version }}</span>
      <div class="release-date text-muted">
        {{ formatDate(post.date) }}
      </div>
    </div>
  </div>
  <div class="col-7">
    <!-- Content Card -->
    <div class="card shadow-sm mb-5">
      <div class="card-body p-4 pt-0">
        <div class="changelog-content">
          <ContentRenderer :value="post" />
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
/* Latest Release Section Styling */
.version-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #00fdcf;
}

/* Button styling */
.btn-outline-primary {
  color: #00fdcf;
  border-color: #00fdcf;
  background-color: transparent;
  transition: all 0.2s ease;
}

.btn-outline-primary:hover {
  color: #111;
  background-color: #00fdcf;
  border-color: #00fdcf;
}

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
</style>
