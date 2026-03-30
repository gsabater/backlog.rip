/*
 * @file:    \modules\integrations\supabase.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 24th March 2025
 * Modified: 29th March 2026 - 11:20:31
 */

import { createClient } from '@supabase/supabase-js'

let $log = null
let $nuxt = null
let $user = null

// Supabase client
//+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
let client = {
  sub: null,
  jwt: null,
  anon: {
    head: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.',
    body: 'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtYXZ4am1ja252cnBkcGN6c3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU1OTcwNjEsImV4cCI6MjAyMTE3MzA2MX0.',
    sign: 'W4ucizFl9U0A_oIcZBpILsPXoP5cXbBi6l8LFeIS7e4',
  },

  channels: [],
  instance: null,

  ready: false,
}

export default {
  client,
  domain: 'https://qmavxjmcknvrpdpczswh.supabase.co',
  headers: {
    apikey: `${client.anon.head}${client.anon.body}${client.anon.sign}`,
    Authorization: `Bearer ${client.anon.head}${client.anon.body}${client.anon.sign}`,
  },

  //+-------------------------------------------------
  // getLists()
  // Returns all the lists for the current user
  // Note: .eq('user_id', client.sub) is implicit in the JWT
  // -----
  // Created on Wed Mar 04 2026
  //+-------------------------------------------------
  async getLists() {
    const { data, error } = await client.instance
      .from('lists')
      .select('*')
      .eq('user_id', client.sub)

    if (error) {
      $log('[Supabase] Error retrieving lists', error.message)
      return
    }

    $log(`[ Supabase ] GET /lists (${data.length} items)`)
    return data
  },

  //+-------------------------------------------------
  // getBackups()
  // Queries the list of backups for the current user
  // Note: .eq('user_id', client.sub) is implicit in the JWT
  // -----
  // Created on Tue Oct 07 2025
  //+-------------------------------------------------
  async getBackups() {
    const { data, error } = await client.instance
      .from('cloud')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      this.status = 'error'
      $log('[Supabase] Error retrieving cloud backups', error.message)
      if (error?.message == 'JWT expired') $nuxt.$auth.generateJWT()
      if (error?.message?.text == 'JWT expired') $nuxt.$auth.generateJWT()
      return
    }

    $log(`[ Supabase ] GET /cloud (Backups): (${data.length} items)`)
    return data
  },

  //+-------------------------------------------------
  // getCloudAccount()
  // Gets the backed up account data
  // -----
  // Created on Fri Oct 10 2025
  //+-------------------------------------------------
  async getCloudAccount(signature) {
    const { data, error } = await client.instance
      .from('cloud_accounts')
      .select('data')
      .eq('signature', signature)
      .limit(1)
      .single()

    if (error) {
      $log('[Supabase] Error retrieving cloud account', error.message)
      return
    }

    // ⇢ Decode the response
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let json = data.data
    let decoded = JSON.parse(json)

    $log(`[ Supabase ] GET /cloud_accounts (${Object.keys(decoded).length} keys)`)
    return decoded
  },

  //+-------------------------------------------------
  // getCloudStates()
  // Gets the backed up states data
  // -----
  // Created on Wed Oct 22 2025
  //+-------------------------------------------------
  async getCloudStates(signature) {
    const { data, error } = await client.instance
      .from('cloud_states')
      .select('data')
      .eq('signature', signature)
      .limit(1)
      .single()

    if (error) {
      $log('[Supabase] Error retrieving cloud states', error.message)
      return
    }

    // ⇢ Decode the response
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let json = data.data
    let decoded = JSON.parse(json)

    $log(`[ Supabase ] GET /cloud_states (${Object.keys(decoded).length} keys)`)
    return decoded
  },

  //+-------------------------------------------------
  // getLibrary()
  //
  // -----
  // Created on Wed Oct 22 2025
  //+-------------------------------------------------
  async getLibrary(copy) {
    const { data, error } = await client.instance.storage
      .from('libraries')
      .download(`${client.sub}/${copy}.json`)

    if (error) {
      $log('[Supabase] Error retrieving cloud library', error.message)
      return
    }

    // ⇢ Decode the response
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let json = await this.parseJSONFromBlob(data)

    $log(`[ Supabase ] GET /libraries (${Object.keys(json).length} keys)`)
    return json
  },

  //+-------------------------------------------------
  // getQueueAchievements()
  // -----
  // Note: .eq('user_id', client.sub) is implicit in the JWT
  // -----
  // Created on Mon Mar 24 2025
  //+-------------------------------------------------
  async getQueueAchievements() {
    let jxr = await client.from('queue_achievements').select('*')

    if (!jxr.data.length) {
      return null
    }

    let queued = jxr.data.filter((item) => item.status == null)
    let completed = jxr.data.filter((item) => item.status == 'done')

    return {
      queued: queued,
      completed: completed,
    }
  },

  //+-------------------------------------------------
  // backupAccount()
  //
  // -----
  // Created on Tue Oct 28 2025
  //+-------------------------------------------------
  async backupAccount(account, signature) {
    $log('[Supabase] Uploading account...', signature)

    const { data, error, status } = await client.instance.from('cloud_accounts').upsert(
      {
        user_id: client.sub,
        data: JSON.stringify(account),
        signature: signature.hash,
        updated_at: dates.timestamp(),
      },
      { onConflict: ['signature'] }
    )

    if (error) {
      $log('[Supabase] Error uploading Account', error.message)
      return
    }

    $log(`[ Supabase ] POST /cloud_accounts ${status}`)
  },

  //+-------------------------------------------------
  // backupStates()
  //
  // -----
  // Created on Wed Oct 29 2025
  //+-------------------------------------------------
  async backupStates(states, signature) {
    $log('[Supabase] Uploading states...', signature)

    const { data, error, status } = await client.instance.from('cloud_states').upsert(
      {
        user_id: client.sub,
        signature: signature.hash,
        data: JSON.stringify(states),
        updated_at: dates.timestamp(),
      },
      { onConflict: ['signature'] }
    )

    if (error) {
      $log('[Supabase] Error uploading States', error.message)
      return
    }

    $log(`[ Supabase ] POST /cloud_states ${status}`)
  },

  //+-------------------------------------------------
  // backupLibrary()
  //
  // -----
  // Created on Wed Oct 29 2025
  //+-------------------------------------------------
  async backupLibrary(json, signature) {
    $log('[Supabase] Uploading library...', signature)

    // Blobify the library
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let date = $nuxt.$moment(signature.time * 1000).format('YYYY-MM-DD')
    const blob = new Blob([json], { type: 'application/json' })

    const { data, error, status } = await client.instance.storage
      .from('libraries')
      .upload(`${client.sub}/${date}.json`, blob, {
        upsert: true,
        cacheControl: '3600',
        contentType: 'application/json',
      })

    if (error) {
      $log('[Supabase] Error uploading Library', error.message)
      return
    }

    $log(`[ Supabase ] POST /libraries (success)`)
  },

  //+-------------------------------------------------
  // storeBackup()
  // Creates a backup entry in supabase
  // -----
  // Created on Tue Oct 28 2025
  //+-------------------------------------------------
  async storeBackup(backup) {
    delete backup.id // Remove id to avoid conflicts

    backup.user_id = client.sub
    backup.updated_at = dates.timestamp()

    const { data, error, status } = await client.instance
      .from('cloud')
      .upsert(backup, { onConflict: ['hash'] })

    if (error) {
      $log('[Supabase] Error uploading Backup', error.message)
      return
    }

    $log(`[ Supabase ] POST /cloud ${status}`)
  },

  //+-------------------------------------------------
  // storeList()
  // Stores a list
  // -----
  // Created on Thu Dec 25 2025
  //+-------------------------------------------------
  async storeList(list) {
    const payload = {
      ...(list.id && { id: list.id }),
      games: list.games,
      name: list.name,
      slug: list.slug,
      description: list.description,
      is_public: list.is_public,
      created_at: list.created_at,
      updated_at: list.updated_at,
    }

    // Sample the games for preview
    // payload.sample = list.games.slice(0, 10)
    // payload.games = list.games.length

    const { data, error, status } = await client.instance
      .from('lists')
      .upsert(payload, { onConflict: ['id'] })
      .select()
      .single()

    if (error) {
      console.error(`Failed to store the list online`)
      $log.error('[Supabase] Error uploading Public List', error.message)

      return
    }

    $log(`[ Supabase ] POST /lists ${status}`)
    return data
  },

  //+-------------------------------------------------
  // deleteList()
  //
  // -----
  // Created on Thu Jan 29 2026
  //+-------------------------------------------------
  async deleteList(id) {
    const { data, error } = await client.instance.from('lists').delete().eq('id', id)

    if (error) {
      $log('[Supabase] Error deleting Public List', error.message)
      return
    }

    $log(`[ Supabase ] DELETE /lists (id: ${id})`)
    return data
  },

  //+-------------------------------------------------
  // clearQueueAchievements()
  // Clears completed jobs
  // -----
  // Created on Tue Mar 25 2025
  //+-------------------------------------------------
  async clearQueueAchievements(ids) {
    let jxr = await client.from('queue_achievements').delete().in('id', ids)

    return jxr
  },

  //+-------------------------------------------------
  // connect()
  // Initializes the supabase client
  // -----
  // Created on Thu Mar 20 2025
  //+-------------------------------------------------
  async connect() {
    $user ??= useUserStore()

    // Check the auth state and user credentials
    // If the user is not authenticated, initialize a simple anonymous client
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (!client.jwt) return

    // Otherwise, initialize the supabase client
    // Using the current user's JWT for authentication
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // client.instance.headers['Authorization'] = `Bearer ${client.jwt}`
    // client.instance.rest.headers['Authorization'] = `Bearer ${client.jwt}`

    client.instance = createClient(
      this.domain,
      `${client.anon.head}${client.anon.body}${client.anon.sign}`,
      {
        global: {
          headers: {
            Authorization: `Bearer ${client.jwt}`,
          },
        },
      }
    )

    // Kept for reference
    // Those are the events that can be listened for state changes
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // const { data } = client.instance.auth.onAuthStateChange((event, session) => {
    //   // log(event, session)

    //   if (event === 'INITIAL_SESSION') {
    //     // handle initial session
    //   } else if (event === 'SIGNED_IN') {
    //     // handle sign in event
    //   } else if (event === 'SIGNED_OUT') {
    //     // handle sign out event
    //   } else if (event === 'PASSWORD_RECOVERY') {
    //     // handle password recovery event
    //   } else if (event === 'TOKEN_REFRESHED') {
    //     // handle token refreshed event
    //   } else if (event === 'USER_UPDATED') {
    //     // handle user updated event
    //   }
    // })

    $log('[ Supabase ] connected')

    client.ready = true

    $nuxt.$cloud.server.backups = 'online'
    $nuxt.$cloud.server.supabase = 'online'
  },

  //+-------------------------------------------------
  // subscribe()
  //
  // -----
  // Created on Thu Mar 20 2025
  //+-------------------------------------------------
  async subscribe(channel_name) {
    const channel = client.instance.channel(channel_name)
    channel
      .on('broadcast', { event: 'queue' }, (event) => {
        // $log('🛜 Received message from channel ' + channel_name, event)

        if (event?.payload?.sub !== sync.sub) return
        $nuxt.$mitt.emit('sync:message', event)
      })
      .subscribe()

    client.channels.push(channel_name)
    $log('[ Supabase ] Subscribed to channel ' + channel_name)
  },

  //+-------------------------------------------------
  // unsubscribe()
  //
  // -----
  // Created on Mon Mar 24 2025
  //+-------------------------------------------------
  async unsubscribe(channel_name) {
    if (!client.channels.includes(channel_name)) {
      // $log('⚡ Channel ' + channel_name + ' is not subscribed')
      return
    }

    const channel = client.instance.channel(channel_name)
    channel.unsubscribe()
    $log('🛜 Unsubscribed from channel ' + channel_name)
  },

  //+-------------------------------------------------
  // function()
  //
  // -----
  // Created on Tue Oct 07 2025
  //+-------------------------------------------------
  authenticate($user) {
    $nuxt ??= useNuxtApp()
    $log = $nuxt.$log

    if (!$user.jwt) {
      $log('[ Supabase ] Cannot initialize Supabase without a jwt token', $user)
      return
    }

    client.jwt = $user.jwt
    client.sub = $user.cloud.sub

    $log('[ Supabase ] $user authenticated')
    console.debug(
      JSON.stringify({
        jwt: client.jwt.substring(0, 10) + '...' + client.jwt.slice(-10),
        sub: client.sub.substring(0, 10) + '...' + client.sub.slice(-10),
      })
    )
  },

  //+-------------------------------------------------
  // parseJSONFromBlob()
  // Receives a blob file from storage and parses it to JSON
  // -----
  // Created on Thu Sep 05 2024
  //+-------------------------------------------------
  async parseJSONFromBlob(blob) {
    try {
      const text = await blob.text() // Read the blob content as text
      const json = JSON.parse(text) // Parse the text into JSON
      return json
    } catch (error) {
      console.error('Error parsing JSON:', error)
      throw error
    }
  },

  //+-------------------------------------------------
  // init()
  // -----
  // Created on Mon Mar 24 2025
  //+-------------------------------------------------
  async init() {
    $nuxt ??= useNuxtApp()
    $log = $nuxt.$log
  },
}
