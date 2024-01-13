/* eslint-disable no-unused-vars */

/*
 * @file:    \stores\journalStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 5th December 2023
 * Modified: Fri Jan 12 2024
 */

//+-------------------------------------------------
// Codex: List of events used in the journal
// - log (general message)
// > ref: null, data: { message: 'string' }
//
// - state (Change in a state)
// > ref: game.uuid, data: { state: 'states.id', 'old': 'states.id / null' }
//
// - added (game added)
// > ref: null, data: { store: 'steam', games: [uuid, uuid2] }
//
// - note (note added to ref)
// > ref: uuid, data: { note: 'string' }
//
// - milestone (100h played)
//
//+-------------------------------------------------

let $nuxt = null

export const useJournalStore = defineStore('journal', {
  state: () => ({
    meta: {
      time: 0,
      timeout: 5 * 60 * 1000,
      loading: false,
    },
  }),

  //+-------------------------------------------------
  //| 🔘 Actions
  //+-------------------------------------------------

  actions: {
    //+-------------------------------------------------
    // list()
    // Returns store as array
    // -----
    // Created
    //+-------------------------------------------------
    async list() {
      $nuxt = useNuxtApp()
      let items = await $nuxt.$db.journal
        // .filter((game) => game.api_id === undefined)
        .toArray()

      return items
    },

    //+-------------------------------------------------
    // get()
    // Get an element by id
    // -----
    // Created
    //+-------------------------------------------------
    async get(uuid) {},

    //+-------------------------------------------------
    // getForRef()
    // Gets all updates for a ref uuid
    // -----
    // Created on Thu Dec 07 2023
    //+-------------------------------------------------
    async getForRef(ref) {
      $nuxt = useNuxtApp()
      let items = await $nuxt.$db.journal.where('ref').equals(ref).toArray()

      return items
    },

    //+-------------------------------------------------
    // getNoteForRef()
    // Returns the note for a ref
    // -----
    // Created on Tue Dec 12 2023
    //+-------------------------------------------------
    async getNoteForRef(ref) {
      $nuxt = useNuxtApp()
      let item = await $nuxt.$db.journal
        .where('ref')
        .equals(ref)
        .and((item) => item.event == 'note')
        .first()

      return item
    },

    //+-------------------------------------------------
    // add()
    // Stores a new record in the journal
    // -----
    // Created on Thu Dec 07 2023
    //+-------------------------------------------------
    async add(data) {
      $nuxt = useNuxtApp()
      let item = await $nuxt.$db.journal.add({
        ...{
          event: 'log',
          ref: null,
          data: null,
          created_at: dates.now(),
        },
        ...data,
      })

      return item
    },

    //+-------------------------------------------------
    // updateOrCreateNote()
    //
    // -----
    // Created on Thu Dec 07 2023
    //+-------------------------------------------------
    async updateOrCreateNote(ref, note) {
      $nuxt = useNuxtApp()
      let db = await this.getNoteForRef(ref)

      let item = {
        ...{
          event: 'note',
          ref: ref,
          data: { note: note },
          created_at: dates.now(),
        },
        ...db,
      }

      if (db) {
        item.updated_at = dates.now()
        return await this.update(item)
      }

      return await this.add(item)
    },

    //+-------------------------------------------------
    // update()
    // Replaces a record in the journal
    // -----
    // Created on Tue Dec 12 2023
    //+-------------------------------------------------
    async update(data) {
      $nuxt = useNuxtApp()

      let item = await $nuxt.$db.journal.put(data)
      return item
    },

    async delete(uuid) {
      // $nuxt = useNuxtApp()
      // let item = await $nuxt.$db.journal.delete(uuid)
      // return item
    },
  },
})

//+-------------------------------------------------
//| 🔃 HMR
//| https://pinia.vuejs.org/cookbook/hot-module-replacement.html
//+-------------------------------------------------
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useJournalStore, import.meta.hot))
}
