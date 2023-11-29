/*
 * @file:    \.eslintrc.js
 * @desc:    https://vueschool.io/articles/vuejs-tutorials/eslint-and-prettier-with-vite-and-vue-js-3/
 * -------------------------------------------
 * Created Date: 11th November 2023
 * Modified: Wed Nov 29 2023
 */

module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
  },

  // If you have multiple rulesets in your extend section,
  // each following ruleset will extend or overwrite the previous ones.
  // So you will only have one setting for each rule
  extends: [
    'eslint:recommended',
    // "plugin:vue/vue3-essential" ... base, plus rules to prevent errors or unintended behavior.
    // "plugin:vue/vue3-strongly-recommended" ... Above, plus rules to considerably improve code readability and/or dev experience.
    // "plugin:vue/vue3-recommended" ... Above, plus rules to enforce subjective community defaults to ensure consistency.
    'plugin:vue/vue3-strongly-recommended',
    '@nuxt/eslint-config',
    'prettier',
  ],

  globals: {
    markRaw: true,
    useNuxtApp: true,
    useCookie: true,
    navigateTo: true,

    mapStores: true,
    defineStore: true,
    acceptHMRUpdate: true,
    defineNuxtConfig: true,
    defineNuxtPlugin: true,

    log: true,
    delay: true,
    dates: true,
  },

  ignorePatterns: ['node_modules', 'build', 'dist', 'public'],

  rules: {
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
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    // "vue/require-default-prop": "off",
  },
}
