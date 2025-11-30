/*
 * @file:    \plugins\mod.log.client.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 30th September 2025
 * Modified: 15th October 2025 - 10:30:17
 */

// Usage:
// const { $log } = useNuxtApp()
// $log(message, b, c, ...)
// $log.error(message)
// const allLogs = $log.getAll()
// $log.clear()

let logs = [
  {
    level: 'info',
    message: 'Client log initialized',
    timestamp: new Date().toISOString(),
  },
]

// Creamos un objeto logger con múltiples métodos
//+-------------------------------------------------
// $log(), logger
// Default method to log info messages
// -----
// Created on Tue Sep 30 2025
//+-------------------------------------------------
const logger = function (...args) {
  logger.log('info', ...args)
}

logger.log = (level, ...args) => {
  const entry = {
    level,
    message: args,
    timestamp: new Date().toISOString(),
  }

  logs.push(entry)
  console.debug(
    // `%c .rip %c ${args[0]}`,
    // 'color: #fff; border-radius: 2px; padding: 1px; background: #43565f; margin: 2px;',
    `%c ${args[0]}`,
    'color: #ccc; border-radius: 3px; padding: 1px 7px 2px 0px; nborder: 1px solid #cccccc34; background: #b30bf02a',
    ...args.slice(1)
    // `\n🪢 ${stack[0]}`
  )
}

logger.warn = function (message) {
  const entry = {
    level: 'warn',
    message,
    timestamp: new Date().toISOString(),
  }
  logs.push(entry)
  console.warn(message)
  return entry
}

logger.error = function (...args) {
  const entry = {
    level: 'error',
    message: args,
    timestamp: new Date().toISOString(),
  }
  logs.push(entry)
  // Don't call console.error here anymore as it will be handled by the interceptor
  // console.error(message)
  return entry
}

// Método para obtener todos los logs
logger.getAll = function () {
  return [...logs]
}

// Método para limpiar logs
logger.clear = function () {
  logs = []
}

export default defineNuxtPlugin((nuxtApp) => {
  // logger('⪨ [ Logger ]')

  // Provide the app object to the Nuxt instance
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  nuxtApp.provide('log', logger)

  // Setup automatic error logging
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  if (process.client) {
    // Intercept console.error
    const originalConsoleError = console.error
    console.error = function (...args) {
      // Log to our logger system - pass all args so they show up as details
      logger.error(...args)
      // Call the original console.error
      originalConsoleError.apply(console, args)
    }

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason

      // Extract meaningful error message
      let errorMessage = 'Unhandled Promise Rejection'
      let errorDetails = reason
      let stack = null

      if (reason && typeof reason === 'object') {
        // If it's an Error object, use its message
        if (reason.message) {
          errorMessage = reason.message
          stack = reason.stack
        }
        // If it has a toString that's not [object Object], use it
        else if (reason.toString && reason.toString() !== '[object Object]') {
          errorMessage = reason.toString()
        }
      } else if (typeof reason === 'string') {
        errorMessage = reason
        errorDetails = null
      }

      // Log with proper structure: message first, then details/stack
      if (stack) {
        logger.error(`[Promise] ${errorMessage}`, errorDetails, stack)
      } else if (errorDetails && errorDetails !== reason) {
        logger.error(`[Promise] ${errorMessage}`, errorDetails)
      } else {
        logger.error(`[Promise] ${errorMessage}`)
      }
    })

    // Catch global errors
    window.addEventListener('error', (event) => {
      const errorDetails = {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      }

      if (event.error?.stack) {
        logger.error(event.message, errorDetails, event.error.stack)
      } else {
        logger.error(event.message, errorDetails)
      }
    })
  }

  // Setup Vue error handler
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  nuxtApp.hook('vue:error', (error, instance, info) => {
    const errorDetails = {
      component: instance?.$options?.name || 'Unknown',
      info,
    }

    if (error.stack) {
      logger.error(`[Vue Error] ${error.message}`, errorDetails, error.stack)
    } else {
      logger.error(`[Vue Error] ${error.message}`, errorDetails, error)
    }
  })
})
