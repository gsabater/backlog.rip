/*
 * @file:    \utils\dexieToolkit.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 2nd February 2024
 * Modified: Sun Feb 04 2024
 */

import Dexie from 'dexie'

export default {
  //+-------------------------------------------------
  // checkDeepVersion()
  // Closes the database and opens a new one to check
  // the version number. If its in the list of conflictive
  // versions, it will backup the database and redirect
  // -----
  // Created on Sat Feb 03 2024
  //+-------------------------------------------------
  async checkDeepVersion(db) {
    db.close()

    let checker = new Dexie('backlog.rip')
    await checker.open()

    let conflictive = [9]
    if (conflictive.includes(checker.verno)) {
      await this.backup(checker)
      let $router = useRouter()
      $router.push('/account/update')
      checker.close()
    }
  },

  //+-------------------------------------------------
  // backup()
  // Backups the whole database to a new database
  // -----
  // Created on Fri Feb 02 2024
  //+-------------------------------------------------
  async backup(source) {
    log('🔸Backup: Starting the process')
    await delay(500, 'Waiting for databases to be truly ready')

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
    log('🔸Backup', 'Schema from source:')
    console.log(schema)

    log('🔸Backup: Copying data from tables')
    // Copy each table's data from the source to the target
    for (const table of source.tables) {
      log('🔸Backup', table.name)
      const data = await table.toArray() // Read data from source table
      console.log(data)
      await target.table(table.name).bulkAdd(data) // Write data to target table
    }

    log('🔸Backup', 'Completed the database clone')
  },

  async update() {
    let $version = window.$db.sch
    let $schema = window.$db.ver

    log('🔸Update DB: Starting the process', $version, $schema)
    await Dexie.delete('backlog.rip')

    let target = new Dexie('backlog.rip')
    let backup = new Dexie('backlog.backup')

    target.version($version).stores($schema)
    log('🔸Update DB: Target generated', $schema)

    await target.open()
    await backup.open()

    log('Update DB: Copying data from tables', backup.tables, target.tables)
    for (const table of backup.tables) {
      log('🔸Backup', table.name)
      const data = await table.toArray() // Read data from backup table
      console.log(data)
      await target.table(table.name).bulkAdd(data) // Write data to target table
    }

    log('🔸Update DB: Database restored')
    return true
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
