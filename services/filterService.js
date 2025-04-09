/*
 * @file:    \services\filterService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 28th March 2025
 * Modified: Tue 08 April 2025 - 13:18:43
 */

export default {
  definitions: {
    score: {
      min: 0,
      max: 100,
      type: 'number',
      mods: ['gt', 'lt', /* 'gte', 'lte', */ 'is', 'not'],
    },

    state: { type: 'array', mods: ['in', 'not', 'all'] },
    // genre: { group: 'score', mods: ['in', 'all'] },
    // language: { mods: [] },
  },

  configurations: {
    score: {
      label: 'Score',
      plural: 'scores',

      icon: 'Star',
      desc: 'Filter results by their median score. To filter by Steam, Metacritic or Opencritic score, use their respective filters',
    },

    state: {
      label: 'State',
      plural: 'states',

      icon: 'Background',
      desc: 'Filter games by their state',

      data: 'states',
      opSort: 'order',
      opValue: 'id',
      opLabel: 'name',
    },

    genre: { label: 'Genre', icon: '', desc: 'Lorem' },
  },

  // 'is', 'gt', 'lt', 'gte', 'lte', 'not'
  mods: {
    in: {
      short: 'in',
      desc: 'is any of...',
    },

    all: {
      short: 'all',
      desc: 'match all options',
    },

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
    if (type == 'state') return this.filterByState(app, filter)
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
  // function()
  //
  // -----
  // Created on Mon Apr 07 2025
  //+-------------------------------------------------
  filterByState(app, filter) {
    const { mod, value } = filter

    return this.arrayFilter(app.state, mod, value)
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
  // arrayFilter()
  // Compares array values with provided input value
  // -----
  // Created on Mon Apr 07 2025
  //+-------------------------------------------------
  arrayFilter(input, mod, value) {
    if (!input) input = null

    // Handle special case for -1 (no state)
    const hasNoState = value.includes(-1)

    if (mod == 'in') {
      return hasNoState ? !input || value.includes(input) : value.includes(input)
    }

    if (mod == 'not') {
      return hasNoState ? input && !value.includes(input) : !value.includes(input)
    }

    if (mod == 'all') {
      return value.every((v) => (v === -1 ? !input : input.includes(v)))
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
        let value = f.value

        if (Array.isArray(value)) {
          // Join array with '+' and encode each item individually
          value = value.map(encodeURIComponent).join('+')
        } else {
          value = encodeURIComponent(value)
        }

        if (f.mod) {
          return `${encodeURIComponent(f.filter)}.${encodeURIComponent(f.mod)}.${value}`
        } else {
          return `${encodeURIComponent(f.filter)}=${f.value}`
        }
      })
      .join('&')

    // Update URL without adding to history
    const newUrl = queryParams
      ? `${window.location.pathname}?${queryParams}`
      : window.location.pathname

    console.warn('☁️ setRoute', queryParams)
    window.history.replaceState({}, '', newUrl)
  },
}
