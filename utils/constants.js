// Constants for Nuxt 3 application
// This file is automatically imported by Nuxt 3, so you can use these constants directly in your components

export const constants = {
  // API endpoints
  api: {
    baseUrl: process.env.API_BASE_URL || 'https://api.example.com',
    version: 'v1',
  },

  // Authentication
  auth: {
    jwtTokenKey: 'jwt_token',
    refreshTokenKey: 'refresh_token',
  },

  // Pagination
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },

  // Date formats
  dateFormats: {
    date: 'YYYY-MM-DD',
    dateTime: 'YYYY-MM-DD HH:mm:ss',
  },

  // File upload
  fileUpload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  },

  // UI constants
  ui: {
    breakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },

  // Feature flags
  features: {
    enableDarkMode: true,
    enableNotifications: true,
  },

  // Social media links
  socialMedia: {
    facebook: 'https://facebook.com/yourpage',
    twitter: 'https://twitter.com/yourhandle',
    instagram: 'https://instagram.com/yourprofile',
  },

  // App-specific constants
  app: {
    name: 'Your Nuxt 3 App',
    version: '1.0.0',
    supportEmail: 'support@example.com',
  },

  // Add more constants as needed for your specific application
}

// Example usage in a component:
//
// <script setup>
// const apiBaseUrl = constants.api.baseUrl
// const appName = constants.app.name
// const isMobileView = useMediaQuery(`(max-width: ${constants.ui.breakpoints.md}px)`)
// </script>
//
// <template>
//   <div>
//     <h1>{{ appName }}</h1>
//     <p>API Base URL: {{ apiBaseUrl }}</p>
//     <p>Is Mobile View: {{ isMobileView }}</p>
//   </div>
// </template>
