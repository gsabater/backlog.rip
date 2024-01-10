<template>
  <div class="page-header d-print-none">
    <div class="container-xl">
      <div class="row g-2 align-items-center">
        <div class="col">
          <h2 class="page-title">Account and library options</h2>
        </div>
      </div>
    </div>
  </div>

  <div class="page-body">
    <div class="container-xl">
      <div class="row gx-lg-5">
        <div class="d-none d-lg-block col-lg-3">
          <pre>
            {{ navigation }}
          </pre>
          <ContentNavigation v-slot="{ navigation }">
            <ul>
              <li v-for="link of navigation" :key="link._path">
                <NuxtLink :to="link._path">{{ link.title }}</NuxtLink>
              </li>
            </ul>
          </ContentNavigation>

          <account-sidebar></account-sidebar>
        </div>
        <div class="col-lg-9">
          <ContentDoc />

          <ContentList v-slot="{ list }" path="/docs/articles">
            <div v-for="article in list" :key="article._path">
              <h2>{{ article.title }}</h2>
              <p>{{ article.description }}</p>
            </div>
          </ContentList>

          <div class="footer">
            <a :href="githubLink" target="_blank">Edit this page on GitHub</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \pages\docs\[...slug].vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 26th October 2023
 * Modified: Tue Jan 09 2024
 **/
export default {
  data() {
    return {
      navigation: null,
      githubLink: '',
    }
  },
  async created() {
    try {
      const navigationData = await fetchContentNavigation()
      this.navigation = navigationData
    } catch (error) {
      console.error('Failed to fetch navigation data:', error)
    }

    // Update the link to the GitHub file
    this.githubLink = 'https://github.com/[YourGitHubRepoPath]/pages/docs/[...slug].vue'
  },
}
</script>
