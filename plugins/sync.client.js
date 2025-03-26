/*
 * @file:    \plugins\realtime.client.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 18th March 2025
 * Modified: Tue 25 March 2025 - 15:04:45
 */

import { createClient } from '@supabase/supabase-js'
import supabaseService from '../services/supabaseService'

let $nuxt = null
let $user = null

const anon = {
  url: 'https://qmavxjmcknvrpdpczswh.supabase.co',
  head: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.',
  body: 'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtYXZ4am1ja252cnBkcGN6c3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU1OTcwNjEsImV4cCI6MjAyMTE3MzA2MX0.',
  sign: 'W4ucizFl9U0A_oIcZBpILsPXoP5cXbBi6l8LFeIS7e4',
}

let sync = {
  sb: null, // Supabase client
  jwt: null, // JWT token identifying the user
  sub: null, // Subject uuid defined in supabase
  channels: [],

  ready: false,
}

//+-------------------------------------------------
// connect()
// Initializes the supabase client
// -----
// Created on Thu Mar 20 2025
//+-------------------------------------------------
async function connect() {
  $nuxt ??= useNuxtApp()
  $user ??= useUserStore()

  // Check the auth state and user credentials
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  if (!$user.jwt) {
    log('⚡ Unable to start cloud connection due to missing credentials', $user.jwt)
    return
  }

  sync.jwt = $user.jwt
  sync.sub = $user.cloud.sub

  // Initialize the supabase client
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  sync.sb = createClient(anon.url, `${anon.head}${anon.body}${anon.sign}`, {
    // auth: {
    //   autoRefreshToken: false,
    //   persistSession: false,
    //   detectSessionInUrl: false,
    // },

    global: {
      headers: {
        Authorization: `Bearer ${sync.jwt}`,
      },
    },
  })

  // Initialize the supabaseService
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  sync.ready = true
  supabaseService.init()

  // Kept for reference
  // Those are the events that can be listened for state changes
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // const { data } = sync.sb.auth.onAuthStateChange((event, session) => {
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
}

//+-------------------------------------------------
// subscribe()
//
// -----
// Created on Thu Mar 20 2025
//+-------------------------------------------------
async function subscribe(channel_name) {
  const channel = sync.sb.channel(channel_name)
  channel
    .on('broadcast', { event: 'queue' }, (event) => {
      // console.warn('🛜 Received message from channel ' + channel_name, event)

      if (event?.payload?.sub !== sync.sub) return
      $nuxt.$mitt.emit('sync:message', event)
    })
    .subscribe()

  sync.channels.push(channel_name)
  console.warn('🛜 Subscribed to channel ' + channel_name)
}

//+-------------------------------------------------
// unsubscribe()
//
// -----
// Created on Mon Mar 24 2025
//+-------------------------------------------------
async function unsubscribe(channel_name) {
  if (!sync.channels.includes(channel_name)) {
    // console.warn('⚡ Channel ' + channel_name + ' is not subscribed')
    return
  }

  const channel = sync.sb.channel(channel_name)
  channel.unsubscribe()
  console.warn('🛜 Unsubscribed from channel ' + channel_name)
}

//+-------------------------------------------------
// Define Nuxt plugin
// $sync
// -----
// Created on Thu Mar 20 2025
//+-------------------------------------------------
export default defineNuxtPlugin((nuxtApp) => {
  sync.connect = connect
  sync.subscribe = subscribe
  sync.unsubscribe = unsubscribe

  window.$sync = sync

  return {
    provide: {
      sync,
    },
  }
})
