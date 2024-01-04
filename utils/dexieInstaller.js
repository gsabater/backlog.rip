export class DexieInstaller {
  defaultStates = [
    // {
    //   id: 1,
    //   order: 1,
    //   color: 'blue',
    //   name: 'Library',
    //   description: 'Hold all Played and not played games not in other categories.',
    // },

    {
      id: 1,
      order: 1,
      key: 'backlog',
      color: 'red',
      name: 'Backlog',
      description:
        'For games that have been purchased or added to a collection but not yet started. This helps to keep track of games that the user intends to play.',
    },
    {
      id: 2,
      order: 2,
      key: 'playing',
      color: 'orange',
      name: 'Currently Playing',
      description:
        'Games that are actively being played. This category helps users focus on their current engagements and track progress in these games.',
    },
    {
      id: 3,
      order: 3,
      key: 'completed',
      color: 'purple',
      name: 'Completed',
      description:
        'For games that the user has finished. This can include reaching the end of the story, achieving all objectives, or simply reaching a point where the user feels they have experienced all they wanted from the game.',
    },

    {
      id: 4,
      order: 0,
      color: '#ff3d5f',
      name: 'Favorites',
      description:
        'A category for games that the user particularly enjoyed or would recommend. This is useful for revisiting or suggesting to others.',
    },

    {
      id: 5,
      order: 5,
      color: 'grey',
      name: 'Abandoned',
      description:
        "Games that the user started but decided not to finish for various reasons like loss of interest, too difficult, etc. It's useful for understanding personal preferences and patterns in gaming choices.",
    },
    {
      id: 6,
      order: 6,
      color: 'yellow',
      name: 'On-Hold',
      description:
        "This category is for games that the user has paused playing but intends to return to. Different from 'Abandoned', as the intention to finish is still there.",
    },
    {
      id: 7,
      order: 7,
      color: 'green',
      name: 'Replayable',
      description:
        'Games that offer a significant replay value, either through different story paths, gameplay styles, or just personal preference for revisiting.',
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
      username: 'Anonymous',

      steam: null,
      steam_data: null,
      steam_updated_at: null,

      created_at: dates.now(),
      updated_at: dates.now(),
      ...row,
    }

    await this.$db.account.put(data)
  }

  async checkin() {
    let count = await this.$db.config.count()
    if (count === 0) {
      this.$db.config.put({
        key: 'created_at',
        value: dates.now(),
      })
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
