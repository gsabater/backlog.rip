<template>
  <div>
    <div class="card mb-3 intro-card">
      <div class="card-body">
        <h1 class="h4 mb-2 d-flex align-items-center">
          <Icon class="me-2">FileCode</Icon>
          Application logs
        </h1>
        <p class="mb-0 text-secondary">
          Quick view of what happened recently in the client. Logs reset on every restart.
        </p>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-body d-flex flex-column flex-md-row align-items-start gap-2">
        <input
          v-model="search"
          type="search"
          class="form-control"
          placeholder="Search level, tag or message" />
        <div class="ms-md-auto d-flex gap-2">
          <b-btn
            class="btn-sm"
            :class="showOnlyErrors ? 'btn-danger' : 'btn-outline-danger'"
            @click="toggleErrorFilter">
            <span class="badge bg-white text-dark me-1">{{ errorCount }}</span>
            Errors
            <span
              v-if="false"
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {{ errorCount }}
            </span>
          </b-btn>
          <b-btn class="btn-sm btn-outline-secondary" @click="exportLogs">Export JSON</b-btn>
        </div>
      </div>
    </div>

    <div class="card log-terminal">
      <div v-if="!filteredLogs.length" class="card-body text-center text-secondary py-5">
        No logs captured yet.
      </div>
      <template v-else>
        <div class="log-stats">
          <div class="log-stats-info">
            <span class="log-count">{{ totalLogCount }} logs</span>
            <span v-if="errorCount > 0" class="error-count">({{ errorCount }} errors)</span>
          </div>
          <div class="log-stats-actions">
            <div v-if="totalPages > 1" class="log-pagination">
              <button class="pagination-arrow" :disabled="currentPage === 1" @click="prevPage">
                ←
              </button>
              <span class="pagination-info">
                {{ paginationStart }} - {{ paginationEnd }} of {{ allFilteredLogs.length }}
              </span>
              <button
                class="pagination-arrow"
                :disabled="currentPage === totalPages"
                @click="nextPage">
                →
              </button>
            </div>
            <b-btn class="btn-sm btn-outline-secondary" @click="exportLogs">
              <Icon class="me-1" size="14">Download</Icon>
              Export
            </b-btn>
          </div>
        </div>
        <div class="log-stream">
          <div
            v-for="entry in filteredLogs"
            :key="entry.id"
            class="log-entry"
            :class="entry.levelClass">
            <span class="log-time">{{ entry.displayTime }}</span>
            <span class="log-level" :class="`log-level-${entry.level}`">
              {{ entry.levelLabel }}
            </span>
            <span v-if="entry.tag" class="log-tag">{{ entry.tag }}</span>
            <span class="log-message">{{ entry.summary }}</span>
            <template v-if="entry.details.length">
              <div v-for="(detail, index) in entry.details" :key="index" class="log-detail">
                <template v-if="detail.isJson">
                  <div class="json-preview" @click="toggleDetail(entry.id, index)">
                    <span class="json-expand-icon">
                      {{ isDetailExpanded(entry.id, index) ? '▼' : '▶' }}
                    </span>
                    <span>{{ detail.preview }}</span>
                  </div>
                  <pre v-if="isDetailExpanded(entry.id, index)" class="json-expanded">{{
                    detail.formatted
                  }}</pre>
                </template>
                <template v-else>
                  {{ detail }}
                </template>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import dates from '~/utils/dates'

export default {
  name: 'ApplicationLogs',

  data() {
    return {
      search: '',
      logs: [],
      showOnlyErrors: false,
      expandedDetails: new Set(),
      currentPage: 1,
      pageSize: 100,
    }
  },

  computed: {
    normalizedLogs() {
      const source = Array.isArray(this.logs) ? this.logs : []

      return source
        .slice()
        .reverse()
        .map((entry, index) => {
          if (!entry) {
            return null
          }

          const level = String(entry.level || 'info').toLowerCase()
          const messages = Array.isArray(entry.message) ? entry.message : [entry.message]
          const normalized = messages.map((part) => this.processLogPart(part))

          let summary = normalized[0]?.text || ''
          const details = normalized.slice(1).filter(Boolean)

          const tagMatch = summary.match(/\[[^\]]*\]/)
          const tag = tagMatch ? tagMatch[0].trim() : ''

          if (tagMatch) {
            summary = summary.replace(tagMatch[0], '').trim()
            summary = summary.replace(/^[-–—]\s*/, '')
          }

          const timestamp = entry.timestamp || ''
          const displayTime = this.formatDisplayTime(timestamp)

          // Create searchable text from details
          const detailsText = details
            .map((d) => {
              if (typeof d === 'object' && d?.text) {
                return d.isJson ? d.preview : d.text
              }
              return String(d)
            })
            .join(' ')

          const searchText = [level, tag, summary, detailsText, timestamp].join(' ').toLowerCase()

          return {
            id: `${timestamp || 'log'}-${index}`,
            level,
            levelLabel: level.toUpperCase(),
            levelClass: `level-${level}`,
            tag,
            summary: summary || 'No summary available',
            details,
            timestamp,
            displayTime,
            searchText,
          }
        })
        .filter(Boolean)
    },

    errorCount() {
      return this.normalizedLogs.filter((entry) => entry.level === 'error').length
    },

    totalLogCount() {
      return this.normalizedLogs.length
    },

    allFilteredLogs() {
      let logs = this.normalizedLogs

      // Filter by error level if enabled
      if (this.showOnlyErrors) {
        logs = logs.filter((entry) => entry.level === 'error')
      }

      // Filter by search term
      if (this.search) {
        const term = this.search.toLowerCase()
        logs = logs.filter((entry) => entry.searchText.includes(term))
      }

      return logs
    },

    totalPages() {
      return Math.ceil(this.allFilteredLogs.length / this.pageSize)
    },

    paginationStart() {
      return (this.currentPage - 1) * this.pageSize + 1
    },

    paginationEnd() {
      return Math.min(this.currentPage * this.pageSize, this.allFilteredLogs.length)
    },

    filteredLogs() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.allFilteredLogs.slice(start, end)
    },
  },

  watch: {
    allFilteredLogs() {
      // Reset to first page when filters change
      this.currentPage = 1
    },
  },

  mounted() {
    this.loadLogs()
  },

  methods: {
    loadLogs() {
      const rawLogs = this.$log?.getAll?.()
      this.logs = Array.isArray(rawLogs) ? rawLogs : []
    },

    formatDisplayTime(timestamp) {
      if (!timestamp) {
        return ''
      }

      const moment = this.$moment?.(timestamp)
      if (moment?.isValid?.()) {
        const time = moment.format('HH:mm:ss:SSS')
        const ago = this.formatTimeAgo(timestamp)
        return ago ? `${time} (${ago})` : time
      }

      const date = new Date(timestamp)
      if (!Number.isNaN(date.getTime())) {
        const time = date.toTimeString().slice(0, 8)
        const ago = this.formatTimeAgo(timestamp)
        return ago ? `${time} (${ago})` : time
      }

      return String(timestamp)
    },

    formatTimeAgo(timestamp) {
      if (!timestamp) {
        return ''
      }

      const now = Date.now()
      const then = new Date(timestamp).getTime()
      const diff = Math.abs(now - then)

      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)

      if (days > 0) return `${days}d ago`
      if (hours > 0) return `${hours}h ago`
      if (minutes > 0) return `${minutes}m ago`
      return `${seconds}s ago`
    },

    processLogPart(value) {
      if (value === null || value === undefined) {
        return { text: '', isJson: false }
      }
      if (typeof value === 'string') {
        return { text: value, isJson: false }
      }
      if (typeof value === 'number' || typeof value === 'boolean') {
        return { text: String(value), isJson: false }
      }

      // It's an object or array - treat as JSON
      try {
        const formatted = JSON.stringify(value, null, 2)
        const preview = this.createJsonPreview(value)
        return {
          text: formatted,
          isJson: true,
          preview,
          formatted,
          raw: value,
        }
      } catch (error) {
        return { text: String(value), isJson: false }
      }
    },

    createJsonPreview(obj) {
      if (Array.isArray(obj)) {
        const length = obj.length
        if (length === 0) return 'Array []'
        const preview = length === 1 ? '1 item' : `${length} items`
        return `Array [${preview}]`
      }

      if (typeof obj === 'object' && obj !== null) {
        const keys = Object.keys(obj)
        if (keys.length === 0) return 'Object {}'

        const previewKeys = keys.slice(0, 3)
        const preview = previewKeys
          .map((key) => {
            const val = obj[key]
            let displayVal = val

            if (typeof val === 'string') {
              displayVal = val.length > 15 ? `"${val.slice(0, 15)}..."` : `"${val}"`
            } else if (typeof val === 'object' && val !== null) {
              displayVal = Array.isArray(val) ? '[...]' : '{...}'
            } else {
              displayVal = String(val)
            }

            return `${key}: ${displayVal}`
          })
          .join(', ')

        const moreKeys = keys.length > 3 ? `, ... +${keys.length - 3} more` : ''
        return `Object {${preview}${moreKeys}}`
      }

      return String(obj)
    },

    toggleDetail(entryId, detailIndex) {
      const key = `${entryId}-${detailIndex}`
      if (this.expandedDetails.has(key)) {
        this.expandedDetails.delete(key)
      } else {
        this.expandedDetails.add(key)
      }
      // Force reactivity
      this.expandedDetails = new Set(this.expandedDetails)
    },

    isDetailExpanded(entryId, detailIndex) {
      return this.expandedDetails.has(`${entryId}-${detailIndex}`)
    },

    toggleErrorFilter() {
      this.showOnlyErrors = !this.showOnlyErrors
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },

    exportLogs() {
      const payload = Array.isArray(this.logs) ? this.logs : []
      const json = JSON.stringify(payload, null, 2)
      const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'backlog-logs.json'
      anchor.click()
      URL.revokeObjectURL(url)
    },
  },
}
</script>

<style scoped>
.intro-card h1 {
  font-weight: 600;
}

.log-terminal {
  background-color: #1e1e1e;
  color: #d4d4d4;
  overflow: hidden;
}

.log-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #252526;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.8125rem;
  gap: 1rem;
}

.log-stats-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.log-stats-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.log-pagination {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-arrow {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #d4d4d4;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  border-radius: 3px;
  transition: all 0.15s ease;
}

.pagination-arrow:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.pagination-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.pagination-info {
  color: #858585;
  font-size: 0.75rem;
  white-space: nowrap;
}

.log-count {
  color: #d4d4d4;
  font-weight: 500;
}

.error-count {
  color: #f44336;
  font-weight: 500;
}

.log-stream {
  /* padding: 1rem; */
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.8125rem;
  line-height: 1.6;
  max-height: 70vh;
  overflow-y: auto;
}

.log-entry {
  display: flex;
  flex-wrap: wrap;
  column-gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background-color 0.15s ease;
}

.log-entry:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

.log-entry:last-child {
  border-bottom: none;
}

.log-time {
  color: #858585;
  white-space: nowrap;
  flex-shrink: 0;
}

.log-level {
  font-weight: 200;
  text-transform: uppercase;
  font-size: 0.65rem;
  letter-spacing: 0.05em;
  white-space: nowrap;
  flex-shrink: 0;
  /* background-color: #1e1e1e63; */
  padding: 2px;
}

.log-level-info {
  color: #4fc3f7;
}

.log-level-warn,
.log-level-warning {
  color: #ffb74d;
}

.log-level-error {
  color: #f44336;
}

.log-level-debug {
  color: #9c27b0;
}

.log-level-success {
  color: #66bb6a;
}

.log-tag {
  color: #ce9178;
  white-space: nowrap;
  flex-shrink: 0;
}

.log-message {
  color: #d4d4d4;
  flex: 1;
  min-width: 0;
  word-break: break-word;
  letter-spacing: 0.5px;
}

.log-detail {
  width: 100%;
  color: #858585;
  padding-left: 0.5rem;
  font-size: 0.75rem;
  line-height: 1.5;
  word-break: break-word;
}

.json-preview {
  cursor: pointer;
  color: #ce9178;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
  transition: background-color 0.15s ease;
}

.json-preview:hover {
  background-color: rgba(206, 145, 120, 0.1);
}

.json-expand-icon {
  font-size: 0.625rem;
  color: #858585;
  display: inline-block;
  width: 0.75rem;
}

.json-expanded {
  margin-top: 0.25rem;
  margin-left: 1rem;
  padding: 0.5rem;
  background-color: #252526;
  border-left: 2px solid #ce9178;
  border-radius: 3px;
  color: #d4d4d4;
  font-size: 0.7rem;
  line-height: 1.4;
  overflow-x: auto;
  max-width: 100%;
}

/* Custom scrollbar for the log stream */
.log-stream::-webkit-scrollbar {
  width: 5px;
}

.log-stream::-webkit-scrollbar-track {
  background: #191a22;
}

.log-stream::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 2px;
}

.log-stream::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
