/*
 * @file:    \.eslintrc.js
 * @desc:    https://vueschool.io/articles/vuejs-tutorials/eslint-and-prettier-with-vite-and-vue-js-3/
 * -------------------------------------------
 * Created Date: 11th November 2023
 * Modified: Sun Nov 12 2023
 */

module.exports = {
  env: {
    browser: true,
    node: true,
  },

  extends: [
    'eslint:recommended',
    // "plugin:vue/vue3-essential" ... base, plus rules to prevent errors or unintended behavior.
    // "plugin:vue/vue3-strongly-recommended" ... Above, plus rules to considerably improve code readability and/or dev experience.
    // "plugin:vue/vue3-recommended" ... Above, plus rules to enforce subjective community defaults to ensure consistency.
    'plugin:vue/vue3-strongly-recommended',
    'prettier',
  ],

  globals: {
    useNuxtApp: true,
    log: true,
    delay: true,
  },

  ignorePatterns: ['node_modules', 'build', 'dist', 'public'],

  rules: {
    'vue/first-attribute-linebreak': 'off',

    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    // "vue/require-default-prop": "off",
  },
}
