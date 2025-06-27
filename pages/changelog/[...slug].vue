<template>
  <div class="page-body">
    <div class="container-xl">
      <div v-if="post" class="row justify-content-center">
        <!-- Breadcrumbs Navigation -->
        <div class="col-md-8 mb-4">
          <div class="d-flex align-items-center mb-4">
            <NuxtLink to="/changelog" class="text-decoration-none text-muted">
              <v-icon class="me-1" size="small">mdi-arrow-left</v-icon>
              Back to Changelog
            </NuxtLink>
          </div>
        </div>

        <!-- Changelog Item Header -->
        <div class="col-md-8">
          <div class="d-flex align-items-center flex-wrap mb-3">
            <span v-if="post.version" class="version-chip me-3">v{{ post.version }}</span>
            <div class="release-date text-muted">
              {{ formatDate(post.date) }}
            </div>
          </div>
          <h1 class="display-6 mb-4">{{ post.title }}</h1>

          <!-- Content Card -->
          <div class="card shadow-sm mb-5">
            <div class="card-body p-4">
              <div class="changelog-content">
                <ContentRenderer :value="post" />
              </div>
            </div>
          </div>

          <!-- Navigation Between Changelog Items -->
          <div class="d-flex justify-content-between mb-5">
            <div v-if="prevPost">
              <NuxtLink
                :to="`/changelog/${prevPost.slug}`"
                class="btn btn-outline-primary">
                <v-icon class="me-1" size="small">mdi-arrow-left</v-icon>
                Previous: {{ prevPost.title }}
              </NuxtLink>
            </div>
            <div class="ms-auto" v-if="nextPost">
              <NuxtLink
                :to="`/changelog/${nextPost.slug}`"
                class="btn btn-outline-primary">
                Next: {{ nextPost.title }}
                <v-icon class="ms-1" size="small">mdi-arrow-right</v-icon>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else class="row justify-content-center">
        <div class="col-md-8 text-center py-5">
          <div class="mb-4">
            <v-icon size="x-large" color="error">mdi-alert-circle-outline</v-icon>
          </div>
          <h2 class="mb-3">Changelog Entry Not Found</h2>
          <p class="text-muted mb-4">
            The changelog entry you're looking for doesn't exist or has been removed.
          </p>
          <NuxtLink to="/changelog" class="btn btn-primary">Return to Changelog</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\changelog\[...slug].vue
 * @desc:    Individual changelog entry page
 * -------------------------------------------
 * Created Date: 23rd June 2025
 **/

export default {
  name: 'ChangelogItem',

  // async asyncData({ params, error, $content }) {
  //   const slug = params.slug || ['index']
  //   const path = slug.join('/')

  //   try {
  //     console.log(`Fetching changelog entry for path: ${path}`)
  //     // Fetch the requested post by static slug in frontmatter
  //     const post = await queryCollection('changelog').path(path)

  //     if (!post) {
  //       return error({
  //         statusCode: 404,
  //         message: 'Changelog entry not found',
  //       })
  //     }

  //     // Fetch all posts to determine previous and next
  //     const allPosts = await queryCollection('changelog').order('date', 'DESC').find()

  //     // Find current post index
  //     // Use the static slug from frontmatter for navigation
  //     const currentIndex = allPosts.findIndex((p) => p.slug === post.slug)

  //     // Get previous and next posts
  //     const prevPost =
  //       currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  //     const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null

  //     return {
  //       post,
  //       prevPost,
  //       nextPost,
  //     }
  //   } catch (err) {
  //     return error({
  //       statusCode: 404,
  //       message: 'Changelog entry not found',
  //     })
  //   }
  // },

  data() {
    return {
      post: null,
      prevPost: null,
      nextPost: null,
      posts: [],
    }
  },

  methods: {
    // Logic to load the post data
    async loadPosts() {
      let route = useRoute()
      let slug = route.params.slug || ['index']
      slug = Array.isArray(slug) ? slug.join('/') : slug
      debugger

      console.warn('Loading changelog posts...')
      let posts = await queryCollection('changelog').order('date', 'DESC').all()
      let post = await queryCollection('changelog').path(`/changelog/${slug}`).first()
      this.post = post
    },
    formatDate(date) {
      if (!date) return ''
      if (typeof this.$moment === 'function') {
        return this.$moment(date).format('LL')
      }
      return new Date(date).toLocaleDateString()
    },

    slugify(text) {
      if (!text) return ''
      return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
    },
  },

  head() {
    if (!this.post) {
      return {
        title: 'Changelog Entry Not Found',
      }
    }

    const version = this.post.version ? `v${this.post.version} - ` : ''

    return {
      title: `${version}${this.post.title} | Changelog`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Changelog entry for ${version}${this.post.title}. View the details of this update and improvements.`,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${version}${this.post.title} | Changelog`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: `Changelog entry for ${version}${this.post.title}. View the details of this update and improvements.`,
        },
      ],
    }
  },
  async mounted() {
    await this.loadPosts()
  },
}
</script>

<style scoped>
.version-chip {
  display: inline-block;
  padding: 0.25rem 0.7rem;
  background-color: rgba(0, 253, 207, 0.15);
  color: #00fdcf;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 600;
  border: 1px solid rgba(0, 253, 207, 0.3);
}

.release-date {
  font-size: 1.1rem;
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
  margin-bottom: 0.5rem;
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

.btn-primary {
  background-color: #00fdcf;
  border-color: #00fdcf;
  color: #111;
}

.btn-primary:hover {
  background-color: #00c9a0;
  border-color: #00c9a0;
}
</style>
