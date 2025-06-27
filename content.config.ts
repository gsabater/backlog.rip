/*
 * @file:    \content.config.ts
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 18th June 2025
 * Modified: 26th June 2025 - 06:33:53
 */


import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        title: z.string(),
        date: z.date()
      })
    }),

    changelog: defineCollection({
      type: 'page',
      source: '*changelog/*.md',
      schema: z.object({
        title: z.string(),
        version: z.string(),
        date: z.date()
      })
    })
  }
})
