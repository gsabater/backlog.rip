/*
 * @file:    \services\backupService.js
 * @desc:    Only makes postgrest calls to the public tables
 * -------------------------------------------
 * Created Date: 24th October 2025
 * Modified: 15th February 2026 - 17:25:21
 */

import supabase from '../modules/integrations/supabase'

let $nuxt = null

export default {
  //+-------------------------------------------------
  // getNewLists()
  //
  // -----
  // Created on Mon Dec 29 2025
  //+-------------------------------------------------
  async getNewLists() {
    $nuxt ??= useNuxtApp()

    let url = supabase.domain
    url += `/rest/v1/lists`
    url += `?select=*,author:profiles(slug,username,avatar)`
    url += `&order=id.desc&limit=50`

    const xhr = await $nuxt.$axios
      .get(url, {
        headers: supabase.headers,
      })
      .catch((error) => {
        $nuxt.$log.error('[Supabase] Error retrieving  lists')
        $nuxt.$log.error(error.toJSON())
      })

    $nuxt.$log(`[ SupabaseService ] GET /lists(new) (${xhr.data.length} items)`)
    return xhr.data
  },

  //+-------------------------------------------------
  // getUpdatedLists()
  //
  // -----
  // Created on Mon Dec 29 2025
  //+-------------------------------------------------
  async getUpdatedLists() {
    $nuxt ??= useNuxtApp()

    let url = supabase.domain
    url += `/rest/v1/lists`
    url += `?select=*,author:profiles(slug,username,avatar)`
    url += `&order=updated_at.desc&limit=50`

    const xhr = await $nuxt.$axios
      .get(url, {
        headers: supabase.headers,
      })
      .catch((error) => {
        $nuxt.$log.error('[Supabase] Error retrieving  lists')
        $nuxt.$log.error(error.toJSON())
      })

    $nuxt.$log(`[ SupabaseService ] GET /lists(updated) (${xhr.data.length} items)`)
    return xhr.data
  },

  //+-------------------------------------------------
  // getList()
  //
  // -----
  // Created on Tue Jan 20 2026
  //+-------------------------------------------------
  async getList(userSlug, slug) {
    $nuxt ??= useNuxtApp()

    let url = supabase.domain
    url += `/rest/v1/lists?select=*,author:profiles(slug,username,avatar)`
    url += `&slug=eq.${slug}&author.slug=eq.${userSlug}`

    const xhr = await $nuxt.$axios
      .get(url, {
        headers: supabase.headers,
      })
      .catch((error) => {
        console.log(error.toJSON())
        $nuxt.$log.error('Some error')
      })

    if (xhr.data.length === 0) {
      $nuxt.$log(`[ SupabaseService ] GET /lists/${slug} (single) - Not found`)
      return null
    }

    $nuxt.$log(`[ SupabaseService ] GET /lists/${slug} (single)`)
    return xhr.data[0]
  },
}
