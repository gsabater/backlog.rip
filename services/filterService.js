/*
 * @file:    \services\filterService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 28th March 2025
 * Modified: Tue 29 April 2025 - 16:39:00
 */

let $nuxt = null

export default {
  definitions: {
    score: {
      min: 0,
      max: 100,
      type: 'number',
      mods: ['gte', 'lte', /* 'gte', 'lte', */ 'is', 'not'],
    },

    metacritic: { advanced: true, type: 'number', mods: ['gte', 'lte'] },
    opencritic: { advanced: true, type: 'number', mods: ['gte', 'lte'] },
    // steamscore: { advanced: true, type: 'number', mods: ['gte', 'lte'] },
    steamdb: { advanced: true, type: 'number', mods: ['gte', 'lte'] },

    state: { type: 'array', mods: ['in', 'not' /* , 'all' */] },
    language: { type: 'array', mods: ['in', /* 'not', */ 'all'] },
    released: { type: 'date', mods: ['after', 'before', 'is'] },

    hltb: { type: 'number', mods: ['lte', 'gte'] },

    // genre: { group: 'score', mods: ['in', 'all'] },
  },

  configurations: {
    score: {
      label: 'Score',
      plural: 'scores',

      icon: 'Star',
      desc: 'Filter results by their median score. To filter by Steam, Metacritic or Opencritic score, use their respective filters',
    },

    metacritic: {
      label: 'Metacritic score',
      plural: 'metacritic score',

      logo: 'metacritic',
      desc: 'Filter results by their Metacritic score. To filter by Steam or Opencritic score, use their respective filters',
    },

    opencritic: {
      label: 'Opencritic score',
      plural: 'opencritic score',

      logo: 'opencritic',
      desc: 'Filter results by their Opencritic score. To filter by Steam or Metacritic score, use their respective filters',
    },

    steamscore: {
      label: 'Steam score',
      plural: 'steam score',

      logo: 'steam',
      desc: 'Filter results by their Steam score. To filter by Metacritic or Opencritic score, use their respective filters',
    },

    steamdb: {
      label: 'SteamDB score',
      plural: 'steamdb score',
      desc: 'Filter results by their SteamDB score. To filter by Metacritic or Opencritic score, use their respective filters',
      logo: 'steamdb',
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

    hltb: {
      label: 'Time to beat (HLTB)',
      plural: 'times to beat',

      icon: 'Clock',
      desc: 'How long to beat is a metric that measures how much time is needed to complete a game. Data provided from howlongtobeat.com',
      data: null,
      opSort: null,
      opValue: null,
      opLabel: null,
    },

    language: {
      label: 'Language',
      plural: 'languages',

      icon: 'Language',
      desc: 'Filter games by their language',

      data: 'languages',
      opSort: null,
      opValue: 'key',
      opLabel: 'label',
    },

    released: {
      label: 'Release date',

      icon: 'Calendar',
      desc: 'Filter games by their release date',

      data: null,
      opSort: null,
      opValue: null,
      opLabel: null,
    },

    genre: { label: 'Genre', icon: '', desc: 'Lorem' },
  },

  // 'is', 'gt', 'lt', 'gte', 'lte', 'not'
  mods: {
    in: {
      short: 'in',
      desc: 'one of the following...',
    },

    all: {
      short: 'all',
      desc: 'includes all of the following...',
    },

    before: {
      short: 'before',
      desc: 'is before...',
    },

    after: {
      short: 'after',
      desc: 'is after...',
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
      short: '≥',
      desc: 'is greater than or equal to...',
    },

    lte: {
      short: '≤',
      desc: 'is less than or equal to...',
    },

    not: {
      short: 'is not',
      desc: 'is not equal to...',
    },
  },

  //+-------------------------------------------------
  // filterBy()
  // Applies a filter by type and modifier
  // -----
  // Created on Sat Mar 29 2025
  //+-------------------------------------------------
  filterBy(app, filter) {
    const by = filter.filter

    if (by == 'hltb') return this.filterByHLTB(app, filter)
    if (by == 'state') return this.filterByState(app, filter)
    if (by == 'score') return this.filterByScore(app, filter)
    if (by == 'released') return this.filterByReleased(app, filter)
    if (by == 'language') return this.filterByLanguage(app, filter)
    if (by == 'metacritic') return this.filterByScore(app, filter, 'metacritic')
    if (by == 'opencritic') return this.filterByScore(app, filter, 'opencritic')
    if (by == 'steamdb') return this.filterByScore(app, filter, 'steamdb')
  },

  filterByScore(app, filter, type) {
    const { mod, value } = filter
    let score = null

    if (!type) score = app.score
    else if (type == 'steamdb') score = app.scores?.steamdb
    else if (type == 'metacritic') score = app.scores?.metascore
    else if (type == 'opencritic') score = app.scores?.oc

    if (!score) return false
    return this.numericFilter(app.score, mod, value)
  },

  filterByState(app, filter) {
    const { mod, value } = filter
    return this.valueFilter(app.state, mod, value)
  },

  filterByHLTB(app, filter) {
    const { mod, value } = filter
    let main = app.hltb?.main
    if (!main) return false

    return this.numericFilter(main, mod, value * 60)
  },

  filterByReleased(app, filter) {
    const { mod, value } = filter
    return this.dateFilter(app.dates.released, mod, value)
  },

  filterByLanguage(app, filter) {
    const { mod, value } = filter
    return this.arrayFilter(app.languages, mod, value)
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
  // valueFilter()
  // Compares array values with provided input value
  // -----
  // Created on Mon Apr 07 2025
  //+-------------------------------------------------
  valueFilter(input, mod, value) {
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
      return value.every((v) => {
        if (v == -1) return !input
        return input == v
      })
    }

    return null
  },

  //+-------------------------------------------------
  // arrayFilter()
  // Compares two arrays
  // -----
  // Created on Fri Apr 11 2025
  //+-------------------------------------------------
  arrayFilter(inputArray, mod, value) {
    if (!Array.isArray(inputArray)) return false

    // At least one element from input exists in value
    if (mod == 'in') {
      return inputArray.some((i) => value.includes(i))
    }

    // No element from input exists in value
    if (mod == 'not') {
      return inputArray.every((i) => !value.includes(i))
    }

    // All elements in value must be present in input
    if (mod == 'all') {
      return value.every((v) => inputArray.includes(v))
    }

    // Input and value must match exactly (no extras, no missing)
    if (mod == 'is') {
      return (
        inputArray.every((i) => value.includes(i)) && inputArray.length === value.length
      )
    }

    return null
  },

  //+-------------------------------------------------
  // dateFilter()
  //
  // -----
  // Created on Tue Apr 15 2025
  //+-------------------------------------------------
  dateFilter(input, mod, value) {
    if (!input) return false
    $nuxt ??= useNuxtApp()

    const appDate = $nuxt.$dayjs.unix(input)
    const valueDate = $nuxt.$dayjs(value, 'YYYY-MM-DD')

    if (mod == 'after') {
      return appDate.isSameOrAfter(valueDate, 'day')
      // return input > value
    }

    if (mod == 'before') {
      return appDate.isSameOrBefore(valueDate, 'day')
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
