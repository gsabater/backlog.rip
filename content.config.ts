/*
 * @file:    \content.config.ts
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 18th June 2025
 * Modified: 23rd June 2025 - 11:55:44
 */


import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md'
    }),

    changelog: defineCollection({
      type: 'page',
      source: 'changelog/*.md',
      schema: z.object({
        title: z.string(),
        version: z.string(),
        date: z.date()
      })
    })
  }
})
