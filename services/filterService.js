/*
 * @file:    \services\filterService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 28th March 2025
 * Modified: Tue 13 May 2025 - 17:42:20
 */

let $nuxt = null

export default {
  definitions: {
    string: { hidden: true, mods: [] },

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

    hltb: { type: 'time', mods: ['lte', 'gte'] },
    playtime: { type: 'time', mods: ['gte', 'lte'] },
    library: { advanced: true, type: 'date', mods: ['after', 'before', 'is'] },
    achievements: { type: 'number', mods: ['gte', 'lte'] },

    // genre: { group: 'score', mods: ['in', 'all'] },
  },

  configurations: {
    string: {
      label: 'Name',
    },

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

    playtime: {
      label: 'My playtime',
      plural: 'playtime',

      icon: 'Clock',
      desc: 'Filter games by their playtime',

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

    library: {
      label: 'Added to library',
      plural: '',
      icon: 'Calendar',
      desc: 'Filter games by their library date',

      data: null,
      opSort: null,
      opValue: null,
      opLabel: null,
    },

    achievements: {
      label: 'Achievements',
      icon: 'Trophy',
      desc: 'Filter games by their achievements completion',

      menuAppend: '%',
      menuSubtitle: 'Completion percentage',
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
    if (by == 'library') return this.filterByDate(app, filter, 'owned')
    if (by == 'released') return this.filterByDate(app, filter, 'released')
    if (by == 'playtime') return this.filterByTime(app, filter, 'playtime')
    if (by == 'language') return this.filterByLanguage(app, filter)
    if (by == 'metacritic') return this.filterByScore(app, filter, 'metacritic')
    if (by == 'opencritic') return this.filterByScore(app, filter, 'opencritic')
    if (by == 'steamdb') return this.filterByScore(app, filter, 'steamdb')
    if (by == 'achievements') return this.filterByNumber(app, filter, 'achievements')
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

  filterByDate(app, filter, type) {
    const { mod, value } = filter
    let date = null

    if (type == 'owned') date = app.is?.lib
    else if (type == 'released') date = app.dates?.released

    if (!date) return false
    return this.dateFilter(date, mod, value)
  },

  filterByTime(app, filter, type) {
    const { mod, value } = filter
    let time = null

    if (type == 'playtime') time = app._.playtime

    if (!time) return false
    return this.numericFilter(time, mod, value)
  },

  filterByNumber(app, filter, type) {
    const { mod, value } = filter
    let number = null

    if (type == 'achievements') number = app._?.astats?.percentage

    if (!number) return false
    return this.numericFilter(number, mod, value)
  },

  filterByHLTB(app, filter) {
    const { mod, value } = filter
    let main = app.hltb?.main
    if (!main) return false

    // HLTB value is in seconds, so the value must be multiplied by 60
    return this.numericFilter(main, mod, value * 60)
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
  // makeHash()
  // Generates a hash from the filters
  // And returns route and API values
  // -----
  // Created on Tue May 13 2025
  //+-------------------------------------------------
  makeHash(schema) {
    const queryParts = []

    // Deep clone to avoid mutating original
    const cleanSchema = JSON.parse(JSON.stringify(schema))
    const { filters, string, sortBy, sortDir } = cleanSchema
    const searchString = string.trim()

    // Process the filters array
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (Array.isArray(filters)) {
      queryParts.push(
        ...filters.map(({ filter, mod, value }) => {
          const encodedValue = Array.isArray(value)
            ? value.map(encodeURIComponent).join('+')
            : encodeURIComponent(value)

          return `${encodeURIComponent(filter)}.${encodeURIComponent(mod)}.${encodedValue}`
        })
      )
    }

    // Process the search string
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (searchString && searchString.length > 2) {
      queryParts.push(`search=${encodeURIComponent(searchString)}`)
    }

    // Process the sorting options
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (sortBy && sortBy !== 'playtime' && sortBy !== 'rand') {
      queryParts.push(`sortBy=${encodeURIComponent(sortBy)}`)
      queryParts.push(`sortDir=${encodeURIComponent(sortDir)}`)
    }

    // Make hashes for the API and the route
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const API = this.makeApiHash(queryParts)

    const queryParams = queryParts.join('&')
    this.setRouteFilters(queryParams)

    // console.warn('☁️ makeHash', { queryParts, queryParams, API })

    return {
      route: queryParams,
      API: API,
    }
  },

  //+-------------------------------------------------
  // makeApiHash()
  // Makes a btoa hash from a json string
  // -----
  // TODO: maybe clear offset == symbols in the btoa
  // -----
  // Created on Tue May 13 2025
  //+-------------------------------------------------
  makeApiHash(queryParts) {
    const json = JSON.stringify(queryParts)
    const slug = btoa(json)

    // const queryParams = queryParts.join('&')
    // const API = `?${queryParams}`

    console.warn('☁️ makeApiHash', { slug, json })
    return slug
  },

  //+-------------------------------------------------
  // setRouteFilters
  // Append the filters to the route as query params
  // -----
  // Created on Tue Apr 01 2025
  //+-------------------------------------------------
  setRouteFilters(queryParams) {
    // Update URL without adding to history
    const newUrl =
      queryParams && queryParams.length
        ? `${window.location.pathname}?${queryParams}`
        : window.location.pathname

    console.warn('☁️ setRoute', queryParams)
    window.history.replaceState({}, '', newUrl)
  },
}
