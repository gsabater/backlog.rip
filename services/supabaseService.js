/*
 * @file:    \services\backupService.js
 * @desc:    Only makes postgrest calls to the public tables
 * -------------------------------------------
 * Created Date: 24th October 2025
 * Modified: 5th March 2026 - 15:54:25
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

    const data = xhr.data.map((list) => ({ ...list, games: list.games ?? [] }))
    $nuxt.$log(`[ SupabaseService ] GET /lists(new) (${data.length} items)`)

    return data
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

    const data = xhr.data.map((list) => ({ ...list, games: list.games ?? [] }))
    $nuxt.$log(`[ SupabaseService ] GET /lists(updated) (${data.length} items)`)

    return data
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

    const data = { ...xhr.data[0], games: xhr.data[0].games ?? [] }
    $nuxt.$log(`[ SupabaseService ] GET /lists/${slug} (single)`, data)

    return data
  },
}
