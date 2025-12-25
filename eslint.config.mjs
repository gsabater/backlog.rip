/*
 * @file:    \eslint.config.mjs
 * ----------------------------------------------
 * Created Date: 11th November 2023
 * Modified: 24th December 2025 - 18:29:39
 */

/**
 * ESLint Configuration File
 * ----------------------------------------------
 * The project uses ESLint and Prettier for code quality and formatting.
 * While the project uses both, there is a clear separation of concerns:
 * ESLint is dedicated only to enforce code quality (logic, vue and best practices)
 * and Prettier is dedicated to maintain consistent code formatting.
 *
 * Eslint and prettier will work together, but formatting is enforced only via IDE settings
 * using Format on Save, keeping the linting process faster and less noisy.
 */

import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import prettierConfig from 'eslint-config-prettier'
import { createConfigForNuxt } from '@nuxt/eslint-config'

export default createConfigForNuxt({
  features: {
    tooling: true,
  },
}).append(
  // Vue and JS recommended rules
  // Extends only strongly-recommended ruleset
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  js.configs.recommended,
  vue.configs['flat/strongly-recommended'],

  // Manual project recommendations
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  {
    files: ['**/*.js', '**/*.ts', '**/*.vue'],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        // markRaw: true,
        // useNuxtApp: true,
        // useRoute: true,
        // useRouter: true,
        // useCookie: true,
        // navigateTo: true,

        // mapStores: true,
        // defineStore: true,
        // acceptHMRUpdate: true,
        // defineNuxtConfig: true,
        // defineNuxtPlugin: true,
        // defineNuxtRouteMiddleware: true,

        // useDataStore: true,
        // useUserStore: true,
        // useGameStore: true,
        // useStateStore: true,
        // useBackupStore: true,
        // useGuildStore: true,
        // useJournalStore: true,
        // useLibraryStore: true,
        // useRepositoryStore: true,

        // log: true,
        // delay: true,
        // dates: true,
        // format: true,
        // helpers: true,

        // dataService: true,
        // gameService: true,
        // queueService: true,
        // searchService: true,
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

    // Finally, prettier rules
    prettierConfig,
  }
)
