/**
 * @file:    \utils\notify.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 24th April 2023
 * Modified: Tue May 09 2023
 **/
import Dexie from 'dexie'

export default {
  async migrate9to10(source, action) {
    await source.open()

    await Dexie.delete('backlog.backup')
    let target = new Dexie('backlog.backup')

    let schema = source.tables.reduce((schema, table) => {
      schema[table.name] =
        table.schema.primKey.src +
        ',' +
        table.schema.indexes.map((idx) => idx.src).join(',')
      return schema
    }, {})
    target.version(1).stores(schema)
    console.warn(' target generated', schema)
    await target.open()

    // Copy each table's data from the source to the target
    for (const table of source.tables) {
      console.warn('table', table.name)
      const data = await table.toArray() // Read data from source table
      console.warn(table.name, data)
      await target.table(table.name).bulkAdd(data) // Write data to target table
    }

    console.log(`Database  cloned`)

    source.close()
    target.close()

    console.warn("hey, I'm done!")
  },

  async restore(schema) {
    console.warn('restore')
    await Dexie.delete('backlog.rip')
    let target = new Dexie('backlog.rip')
    let backup = new Dexie('backlog.backup')

    target.version(1).stores(schema)
    console.warn(' target generated', schema)
    await target.open()

    for (const table of backup.tables) {
      console.warn('table', table.name)
      const data = await table.toArray() // Read data from backup table
      console.warn(table.name, data)
      await target.table(table.name).bulkAdd(data) // Write data to target table
    }

    console.log(`Database  restored`)

    backup.close()
    target.close()

    console.warn("hey, I'm done!")

    await Dexie.delete('backlog.backup')

    console.warn("hey, I'm done!")
    return new Dexie('backlog.rip')
  },
}

//+-------------------------------------------------
// Backups of conflictive versions
//+-------------------------------------------------

// db.version(9).stores({
//   account: 'uuid,steam',
//   config: '&key,value',
//   games: '&uuid,api_id,steam_id,name',
//   states: '&id,order,name',
//   journal: '++id,event,ref,created_at',
// })
