/*
 * @file:    \eslint.config.mjs
 * @desc:    https://vueschool.io/articles/vuejs-tutorials/eslint-and-prettier-with-vite-and-vue-js-3/
 * @note:    Migrated from .eslintrc.js using npx @eslint/migrate-config .eslintrc.js
 *           https://eslint.org/docs/latest/use/configure/migration-guide
 * ----------------------------------------------
 * Created Date: 11th November 2023
 * Modified: Thu 12 December 2024 - 15:07:45
 */

import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: [
      '**/node_modules',
      '**/build',
      '**/dist',
      '**/public',
      '**/dist',
      '**/node_modules',
      '**/schema',
      '**/*.tmpl.*',
      '**/sw.js',
    ],
  },

  // If you have multiple rulesets in your extend section,
  // each following ruleset will extend or overwrite the previous ones.
  // So you will only have one setting for each rule
  ...compat.extends(
    'eslint:recommended',
    // "plugin:vue/vue3-essential" ... base, plus rules to prevent errors or unintended behavior.
    // "plugin:vue/vue3-strongly-recommended" ... Above, plus rules to considerably improve code readability and/or dev experience.
    // "plugin:vue/vue3-recommended" ... Above, plus rules to enforce subjective community defaults to ensure consistency.

    'plugin:vue/vue3-strongly-recommended',
    '@nuxt/eslint-config',
    'prettier'
  ),
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
        useCloudStore: true,
        useJournalStore: true,
        useLibraryStore: true,
        useRepositoryStore: true,

        log: true,
        delay: true,
        dates: true,
        format: true,
      },
    },

    rules: {
      'no-debugger': 'warn',
      'vue/no-v-html': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/no-multiple-template-root': 'off',

      // override/add rules settings here, such as:
      // 'vue/no-unused-vars': 'error'
      // "vue/require-default-prop": "off",

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
