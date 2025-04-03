/*
 * @file:    \services\filterService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 28th March 2025
 * Modified: Wed 02 April 2025 - 17:10:35
 */

export default {
  // Filters array
  // Used to generate options
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  filters: {
    score: {
      min: 0,
      max: 100,
      type: 'number',
      multiple: false,
      mods: ['gt', 'lt', /* 'gte', 'lte', */ 'is', 'not'],
    },
    // state: { group: 'score', mods: ['is', 'not'] },
    // genre: { group: 'score', mods: ['in', 'all'] },
    // language: { mods: [] },
  },

  config: {
    score: {
      label: 'Score',
      icon: 'Star',
      desc: 'Filter results by their median score. To filter by Steam, Metacritic or Opencritic score, use their respective filters',
    },
    state: { label: 'State', icon: '', desc: 'Lorem' },
    genre: { label: 'Genre', icon: '', desc: 'Lorem' },
  },

  // 'is', 'gt', 'lt', 'gte', 'lte', 'not'
  mods: {
    is: {
      short: 'is',
      desc: 'is equal to...',
    },

    gt: {
      short: '>',
      desc: 'is greater than...',
    },
    lt: {
      short: '<',
      desc: 'is lower than...',
    },
    gte: {
      short: '>=',
      desc: 'is greater or equal to...',
    },
    lte: {
      short: '<=',
      desc: 'is lower or equal to...',
    },
    not: {
      short: 'is not',
      desc: 'is not ...',
    },
  },

  //+-------------------------------------------------
  // filterBy()
  // Applies a filter by type and modifier
  // -----
  // Created on Sat Mar 29 2025
  //+-------------------------------------------------
  filterBy(app, filter) {
    const type = filter.filter
    if (type == 'score') return this.filterByScore(app, filter)
  },

  //+-------------------------------------------------
  // function()
  //
  // -----
  // Created on Sat Mar 29 2025
  //+-------------------------------------------------
  filterByScore(app, filter) {
    const { mod, value } = filter

    return this.numericFilter(app.score, mod, value)
  },

  //+-------------------------------------------------
  // numericFilter()
  // Compares numeric values
  // -----
  // Created on Sat Mar 29 2025
  //+-------------------------------------------------
  numericFilter(input, mod, value) {
    value = parseInt(value)
    if (mod == 'is') {
      return input == value
    }

    if (mod == 'not') {
      return input != value
    }

    if (mod == 'gt') {
      return input > value
    }

    if (mod == 'lt') {
      return input < value
    }

    if (mod == 'gte') {
      return input >= value
    }

    if (mod == 'lte') {
      return input <= value
    }

    return null
  },

  //+-------------------------------------------------
  // setRoute
  // Adds filters to the route as query params
  // -----
  // Created on Tue Apr 01 2025
  //+-------------------------------------------------
  setRoute(filters) {
    filters = filters.filters || filters

    const queryParams = filters
      .map((f) => {
        if (f.mod) {
          return `${encodeURIComponent(f.filter)}.${encodeURIComponent(f.mod)}.${encodeURIComponent(f.value)}`
        } else {
          return `${encodeURIComponent(f.filter)}=${encodeURIComponent(f.value)}`
        }
      })
      .join('&')

    console.warn('☁️ setRoute', queryParams)
    // Update URL without adding to history
    const newUrl = queryParams
      ? `${window.location.pathname}?${queryParams}`
      : window.location.pathname

    window.history.replaceState({}, '', newUrl)
  },
}
