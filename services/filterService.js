/*
 * @file:    \services\filterService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 28th March 2025
 * Modified: Wed 04 June 2025 - 16:52:23
 */

let $nuxt = null
let $repos = null
let $state = null

export default {
  //+-------------------------------------------------
  // Filter definitions
  // Defines the details of the filter (min, max, etc)
  //+-------------------------------------------------
  definitions: {
    string: { hidden: true, mods: [] },

    score: {
      min: 0,
      max: 100,
      type: 'number',
      mods: ['gte', 'lte', /* 'gte', 'lte', */ 'is', 'not'],
    },

    metacritic: { type: 'number', mods: ['gte', 'lte'] },
    opencritic: { type: 'number', mods: ['gte', 'lte'] },
    // steamscore: {  type: 'number', mods: ['gte', 'lte'] },
    steamdb: { type: 'number', mods: ['gte', 'lte'] },

    state: { type: 'array', mods: ['in', 'not' /* , 'all' */] },
    genre: { type: 'array', mods: ['in', 'all'] },
    language: { type: 'array', mods: ['in', /* 'not', */ 'all'] },
    released: { type: 'date', mods: ['after', 'before', 'is'] },

    hltb: { type: 'time', mods: ['lte', 'gte'] },
    playtime: { type: 'time', mods: ['gte', 'lte'] },
    library: { type: 'date', mods: ['after', 'before', 'is'] },
    achievements: { type: 'number', mods: ['gte', 'lte'] },

    /*
      <div class="dropdown-item">Features</div>
      <div class="dropdown-item">Platform</div>
      <div class="dropdown-item">Type</div>
    */
  },

  //+-------------------------------------------------
  // Filter configurations
  // Defines how the filter is used and shown
  //+-------------------------------------------------
  configurations: {
    string: {
      label: 'Name',
    },

    score: {
      api: true,

      label: 'Score',
      icon: 'Star',
      desc: 'Filter results by their median score. To filter by Steam, Metacritic or Opencritic score, use their respective filters',
    },

    metacritic: {
      api: true,
      advanced: true,

      label: 'Metacritic score',
      logo: 'metacritic',
      desc: 'Filter results by their Metacritic score. To filter by Steam or Opencritic score, use their respective filters',
    },

    opencritic: {
      api: true,
      advanced: true,

      label: 'Opencritic score',
      logo: 'opencritic',
      desc: 'Filter results by their Opencritic score. To filter by Steam or Metacritic score, use their respective filters',
    },

    steamscore: {
      api: true,
      advanced: true,

      label: 'Steam score',
      logo: 'steam',
      desc: 'Filter results by their Steam score. To filter by Metacritic or Opencritic score, use their respective filters',
    },

    steamdb: {
      advanced: true,

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
      api: true,

      label: 'Time to beat (HLTB)',
      icon: 'Clock',
      desc: 'How long to beat is a metric that measures how much time is needed to complete a game. Data provided from howlongtobeat.com',
    },

    playtime: {
      label: 'My playtime',
      icon: 'Clock',
      desc: 'Filter games by their playtime',
    },

    genre: {
      api: true,
      label: 'Genre',
      plural: 'genres',

      icon: 'Graph',
      desc: 'Filter games by their genre',

      data: 'genres',
      opSort: 'order',
      opValue: 'id',
      opLabel: 'name',
    },

    language: {
      api: true,
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
      api: true,
      label: 'Release date',

      icon: 'Calendar',
      desc: 'Filter games by their release date',
    },

    library: {
      advanced: true,

      label: 'Added to library',
      plural: '',
      icon: 'Calendar',
      desc: 'Filter games by their library date',
    },

    achievements: {
      advanced: true,
      label: 'Achievements',
      icon: 'Trophy',
      desc: 'Filter games by their achievements completion',

      menuAppend: '%',
      menuSubtitle: 'Completion percentage',
    },
  },

  //+-------------------------------------------------
  // Filter modifiers
  // Declare some helper content
  //+-------------------------------------------------
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
  // validate()
  // Returns if a filter is valid
  // -----
  // Created on Thu May 29 2025
  //+-------------------------------------------------
  validate(filter) {
    let valid = true
    const { filter: by, mod, value } = filter

    // Check if the filter is valid
    if (!this.definitions[by]) {
      console.warn(`Invalid filter type: ${by}`)
      valid = false
    }

    // Check if the modifier is valid for the filter
    if (!this.definitions[by].mods.includes(mod)) {
      console.warn(`Invalid modifier "${mod}" for filter "${by}"`)
      valid = false
    }

    // Check if the value is valid for the filter type
    if (this.definitions[by].type === 'number' && isNaN(value)) {
      console.warn(`Invalid value for filter "${by}": ${value}`)
      valid = false
    }

    if (
      this.definitions[by].type === 'array' &&
      (!Array.isArray(value) || !value.length)
    ) {
      console.warn(`Invalid value for filter "${by}": ${value}. Expected an array.`)
      valid = false
    }

    return valid
  },

  //+-------------------------------------------------
  // getFilterLabel()
  // Returns the label for the filter + value
  // -----
  // Created on Wed Jun 04 2025
  //+-------------------------------------------------
  getFilterLabel(filter) {
    const { filter: by, mod, value } = filter
    const first = value[0]

    if (by == 'state') {
      $state ??= useStateStore()
      let item = $state.get(first) || {}

      if (first == -1) {
        item.color = null
        item.name = 'No state'
      }

      return {
        label: item.name,
        color: item.color,
        // icon
      }
    }

    if (by == 'genre') {
      $repos ??= useRepositoryStore()
      let genres = $repos.keyedGenres
      let item = genres[first]
      if (!item) return null

      return {
        label: item.name,
        // color: item.color,
        // icon
      }
    }

    if (by == 'language') {
      let languages = enums.LANGUAGES
      let item = languages.find((l) => l.key === first)
      if (!item) return null
      return {
        label: item.label,
        // color: item.color,
        // icon
      }
    }

    console.warn(`No label for filter "${by}" with value "${value}"`)
    return null
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

    if (by == 'library') return this.filterByDate(app, filter, 'owned')
    if (by == 'released') return this.filterByDate(app, filter, 'released')
    if (by == 'playtime') return this.filterByTime(app, filter, 'playtime')

    if (by == 'genre') return this.filterByArray(app, filter, 'genre')
    if (by == 'language') return this.filterByArray(app, filter, 'language')

    if (by == 'score') return this.filterByScore(app, filter)
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
    return this.valueInArrayFilter(app.state, mod, value)
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

  filterByArray(app, filter, type) {
    const { mod, value } = filter
    if (!value || !value.length) return true
    let array = null

    if (type == 'genre') array = app.genres
    else if (type == 'language') array = app.languages

    if (!array || !array.length) return false
    return this.arrayFilter(array, mod, value)
  },

  filterByHLTB(app, filter) {
    const { mod, value } = filter
    let main = app.hltb?.main
    if (!main) return false

    // HLTB value is in seconds, so the value must be multiplied by 60
    return this.numericFilter(main, mod, value * 60)
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
  // valueInArrayFilter()
  // Compares array values with provided input value
  // -----
  // Created on Mon Apr 07 2025
  //+-------------------------------------------------
  valueInArrayFilter(input, mod, value) {
    if (!input) input = null
    // if (!Array.isArray(input)) return false

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
    // debugger

    const cleanSchema = JSON.parse(JSON.stringify(schema))
    let { filters, string, sortBy, sortDir } = cleanSchema
    string = string.trim()

    const isDirty = filters.length || string.length > 2

    // Edge cases to stop unnecessary processing
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let hashAPI = true
    let hashRoute = true

    if (schema.is == 'array') {
      hashAPI = false
      hashRoute = false
    }

    if (schema.is == 'library') {
      hashAPI = false
    }

    if (schema.is == 'all') {
      if (!isDirty && sortBy == 'score' && sortDir == 'desc') {
        hashAPI = false
        hashRoute = false
      }
    }

    // Make hashes for the API and the route
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    const filterParts = this.makeFilterParts(filters, string, sortBy, sortDir)

    if (hashAPI) hashAPI = this.makeApiHash(filterParts?.api)
    if (hashRoute) this.setRouteFilters(filterParts?.route)

    // console.warn('Hash generated', {
    //   filterParts,
    //   hashAPI,
    //   route: filterParts.route.join('&'),
    // })

    return { api: hashAPI }
  },

  //+-------------------------------------------------
  // makeFilterParts()
  // Generates an array of filter parts
  // Those parts are then used to make API hash and route query params
  // -----
  // Created on Fri May 23 2025
  //+-------------------------------------------------
  makeFilterParts(filters, string, sortBy, sortDir) {
    let parts = {
      api: [],
      route: [],
    }

    if (Array.isArray(filters)) {
      filters.forEach(({ filter, mod, value }) => {
        // Skip invalid filters
        if (!this.validate({ filter, mod, value })) {
          return
        }

        const encodedValue = Array.isArray(value)
          ? value.map(encodeURIComponent).join('+')
          : encodeURIComponent(value)

        let hash = `${filter}.${mod}.${encodedValue}`
        parts.route.push(hash)

        if (this.configurations[filter].api) {
          parts.api.push(hash)
        }
      })
    }

    // Process the search string
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (string && string.length > 2) {
      const searchStr = `search=${encodeURIComponent(string)}`
      parts.api.push(searchStr)
      parts.route.push(searchStr)
    }

    // Process the sorting options
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (sortBy) {
      const sortByStr = `sortBy=${encodeURIComponent(sortBy)}`
      const sortDirStr = `sortDir=${encodeURIComponent(sortDir)}`

      parts.api.push(sortByStr, sortDirStr)
      parts.route.push(sortByStr, sortDirStr)
    }

    return parts
  },

  //+-------------------------------------------------
  // makeApiHash()
  // Makes a btoa hash from the api query parts
  // -----
  // Created on Tue May 13 2025
  //+-------------------------------------------------
  makeApiHash(filterParts) {
    if (!filterParts.length) return
    if (!filterParts === null) return

    const json = JSON.stringify(filterParts)
    const hash = btoa(json)

    return hash
  },

  //+-------------------------------------------------
  // setRouteFilters
  // Append the filters to the route as query params
  // Replace the URL without adding the page to history
  // -----
  // TODO: Maybe add a check to see if the URL is the same to avoid unnecessary updates
  // -----
  // Created on Tue Apr 01 2025
  //+-------------------------------------------------
  setRouteFilters(queryParams) {
    if (!Array.isArray(queryParams) || !queryParams.length) return

    const query = queryParams.join('&')
    const newUrl = `${window.location.pathname}?${query}`

    window.history.replaceState({}, '', newUrl)
  },
}
