export class DexieInstaller {
  defaultStates = [
    // {
    //   id: 4,
    //   order: 0,
    //   key: 'favorites',
    //   color: '#ff3d5f',
    //   name: 'Favorites',
    //   description:
    //     'A category for games that the user particularly enjoyed or would recommend. This is useful for revisiting or suggesting to others.',
    // },
    {
      id: 1,
      order: 1,
      key: 'backlog',
      color: '#ff0000',
      name: 'Backlog',
      description:
        "Games you've bought or added to your collection but haven't started playing yet. This makes it easier for you to keep an eye on the games you plan to dive into",
    },
    {
      id: 2,
      order: 2,
      key: 'playing',
      color: '#800080',
      name: 'Currently Playing',
      description:
        "Games you're currently playing. This category helps you stay focused on what you're actively engaged with and monitor your progress in these games.",
    },
    {
      id: 3,
      order: 3,
      key: 'completed',
      color: '#249b25',
      name: 'Completed',
      description:
        "For games you've completed. This covers everything from finishing the story, accomplishing all goals, or just reaching a point where you feel you've gotten everything you wanted out of the game.",
    },

    {
      id: 5,
      order: 5,
      color: '#c76f1c',
      name: 'On-Hold',
      description:
        "This category is for games you've put on hold but plan to come back to. It's different from 'Abandoned' because you still intend to finish them.",
    },

    {
      id: 6,
      order: 6,
      color: '#808080',
      name: 'Abandoned',
      description:
        'Games you began but chose not to complete for various reasons, such as losing interest or finding them too challenging.',
    },

    {
      id: 7,
      order: 7,
      color: '#8682dd',
      name: 'Replayable',
      description:
        'Games worth playing again and again. Either through different story paths, gameplay styles, or simply because you love revisiting them.',
    },
  ]

  constructor($db) {
    this.$db = $db
  }

  //+-------------------------------------------------
  // account()
  // Account initialization
  // Adds default fields to use the site
  // -----
  // Created on Wed Dec 13 2023
  //+-------------------------------------------------
  async account() {
    let row = await this.$db.account.get('me')
    let data = {
      uuid: 'me',
      username: 'Traveler',

      steam: null,
      steam_data: null,
      steam_updated_at: null,

      created_at: dates.now(),
      updated_at: dates.now(),
      ...row,
    }

    await this.$db.account.put(data)
  }

  //+-------------------------------------------------
  // checkin()
  // Checks in the user in the database and updates
  // config with missing values
  // -----
  // Created on Thu Jan 25 2024
  //+-------------------------------------------------
  async checkin() {
    const fields = {
      created_at: dates.now(),
      autosync_steam: false,
    }

    for (const [field, value] of Object.entries(fields)) {
      let row = await this.$db.config.get(field)

      if (row === undefined) {
        this.$db.config.put({
          key: field,
          value: value,
        })
      }
    }

    this.$db.config.put({
      key: 'updated_at',
      value: dates.now(),
    })
  }

  //+-------------------------------------------------
  // states()
  // Install default states on indexeddb
  // -----
  // Created on Tue Nov 28 2023
  //+-------------------------------------------------
  async states() {
    let count = await this.$db.states.count()
    if (count > 0) return

    let states = this.defaultStates.map((state) => {
      return {
        ...state,
        created_at: dates.now(),
        updated_at: dates.now(),
      }
    })

    await this.$db.states.bulkAdd(states)
  }

  //+-------------------------------------------------
  // journal()
  // Install the journal inserting a first entry
  // -----
  // Created on Tue Dec 05 2023
  //+-------------------------------------------------
  async journal() {
    let count = await this.$db.journal.count()
    if (count > 0) return

    await this.$db.journal.add({
      // id: ,
      event: 'log',
      ref: null,

      data: {
        message: 'This is your first entry in the journal. Welcome!',
      },
      created_at: dates.now(),
    })
  }
}
