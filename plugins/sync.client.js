/*
 * @file:    \plugins\realtime.client.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 18th March 2025
 * Modified: Thu 20 March 2025 - 16:45:50
 */

import { createClient } from '@supabase/supabase-js'

let $user = null

const anon = {
  url: 'https://qmavxjmcknvrpdpczswh.supabase.co',
  head: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.',
  body: 'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtYXZ4am1ja252cnBkcGN6c3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU1OTcwNjEsImV4cCI6MjAyMTE3MzA2MX0.',
  sign: 'W4ucizFl9U0A_oIcZBpILsPXoP5cXbBi6l8LFeIS7e4',
}

let sync = {
  jwt: null,
  sub: null,

  sb: null,
}

//+-------------------------------------------------
// connect()
// Initializes the supabase client
// -----
// Created on Thu Mar 20 2025
//+-------------------------------------------------
async function connect() {
  $user = useUserStore()

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
    .on('broadcast', { event: 'message' }, (payload) => {
      $nuxt.$mitt.emit('sb:message', payload.payload)
    })
    .subscribe()

  console.warn('🛜 Subscribed to channel ' + channel_name)
}

//+-------------------------------------------------
// Define Nuxt plugin
// $sync
// -----
// Created on Thu Mar 20 2025
//+-------------------------------------------------
export default defineNuxtPlugin((nuxtApp) => {
  // const $cloud = useCloudStore()
  // const supabase = $cloud.$sb

  // const subscribeToTable = (table, onInsert, onUpdate) => {
  //   const key = `table-${table}`

  //   if (subscriptions[key]) {
  //     console.warn(`Ya estás suscrito a ${table}`)
  //     return
  //   }

  //   const channel = supabase
  //     .channel(`realtime:${table}`)
  //     .on('postgres_changes', { event: 'INSERT', schema: 'public', table }, (payload) =>
  //       onInsert(payload)
  //     )
  //     .on('postgres_changes', { event: 'UPDATE', schema: 'public', table }, (payload) =>
  //       onUpdate(payload)
  //     )
  //     .subscribe()

  //   subscriptions[key] = channel
  // }

  // const unsubscribeFromTable = (table) => {
  //   const key = `table-${table}`
  //   if (subscriptions[key]) {
  //     supabase.removeChannel(subscriptions[key])
  //     delete subscriptions[key]
  //   }
  // }

  sync.connect = connect
  sync.subscribe = subscribe

  window.$sync = sync

  return {
    provide: {
      sync,
    },
  }
})
