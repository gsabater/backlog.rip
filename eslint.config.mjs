/*
 * @file:    \eslint.config.mjs
 * @desc:    https://vueschool.io/articles/vuejs-tutorials/eslint-and-prettier-with-vite-and-vue-js-3/
 * @note:    Migrated from .eslintrc.js using npx @eslint/migrate-config .eslintrc.js
 *           https://eslint.org/docs/latest/use/configure/migration-guide
 * ----------------------------------------------
 * Created Date: 11th November 2023
 * Modified: 27th November 2025 - 04:32:30
 */

/**
 * ESLint Configuration File
 * ----------------------------------------------
 * The project uses ESLint and Prettier for code quality and formatting.
 * ESLint is configured to enforce coding standards and catch potential errors,
 * while Prettier is used to maintain consistent code formatting across the codebase.
 *
 */

import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import nuxtConfig from '@nuxt/eslint-config'
import globals from 'globals'

export default [
  {
    ignores: [
      '**/node_modules',
      '**/build',
      '**/public',
      '**/dist',
      '**/schema',
      '**/*.tmpl.*',
      '**/sw.js',
    ],
  },

  // Base configuration rules
  js.configs.recommended,

  // Nuxt 3 rules
  // Provided by @nuxt/eslint-config
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  nuxtConfig,

  // Vue 3 rules
  // Provided by eslint-plugin-vue
  // Extends only strongly-recommended ruleset
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  {
    plugins: { vue },
    ...vue.configs['vue3-strongly-recommended'],
  },

  // Prettier rules
  // Those rules disable conflicting rules and activate the plugin
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
    },
  },

  // Personalized rules
  // Specific for the project
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        markRaw: true,
        useNuxtApp: true,
        useRoute: true,
        useRouter: true,
        useCookie: true,
        navigateTo: true,

        mapStores: true,
        defineStore: true,
        acceptHMRUpdate: true,
        defineNuxtConfig: true,
        defineNuxtPlugin: true,
        defineNuxtRouteMiddleware: true,

        useDataStore: true,
        useUserStore: true,
        useGameStore: true,
        useStateStore: true,
        useBackupStore: true,
        useGuildStore: true,
        useJournalStore: true,
        useLibraryStore: true,
        useRepositoryStore: true,

        log: true,
        delay: true,
        dates: true,
        format: true,
        helpers: true,

        dataService: true,
        gameService: true,
        queueService: true,
        searchService: true,
      },
    },

    rules: {
      'no-debugger': 'warn',
      'no-unreachable': 'warn',

      'vue/no-v-html': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/no-multiple-template-root': 'off',

      'vue/order-in-components': [
        'error',
        {
          order: [
            'el',
            'name',
            'key',
            'parent',
            'functional',
            ['delimiters', 'comments'],
            ['components', 'directives', 'filters'],
            'extends',
            'mixins',
            ['provide', 'inject'],
            'ROUTER_GUARDS',
            'layout',
            'middleware',
            'validate',
            'scrollToTop',
            'transition',
            'loading',
            'inheritAttrs',
            'model',
            ['props', 'propsData'],
            'emits',
            'setup',
            'asyncData',
            'data',
            'fetch',
            'head',
            'computed',
            'watch',
            'watchQuery',
            'methods',
            'LIFECYCLE_HOOKS',
            ['template', 'render'],
            'renderError',
          ],
        },
      ],
    },
  },
]
