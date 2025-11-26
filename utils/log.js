/*
 * @file:    \utils\log.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 26th October 2023
 * Modified: 1st October 2025 - 11:35:43
 */
let $nuxt = null

function info(...args) {
  console.log('INFO:', ...args)
}

function error(...args) {
  console.error('ERROR:', ...args)
}

function warn(...args) {
  console.warn('WARNING:', ...args)
}

function logd(...args) {
  this.logDefault(...args)
  debugger
}

//+-------------------------------------------------
// logDefault()
// Logs debug info to the console
// -----
// Created on Tue Nov 10 2023
//+-------------------------------------------------
async function logDefault(...args) {
  console.warn('deprecated logDefault()')
  $nuxt ??= useNuxtApp()

  const error = new Error()
  const stack = error.stack
    .split('\n')
    .slice(2)
    .map((line) => line.trim().replace(/^at\s+/g, ''))

  let bullet = '🔹'
  if (args[0] == 'search') {
    bullet = '🔸'
    args.shift()
  }

  console.debug(
    `${bullet} %c Backlog %c ${args[0]}`,
    'color: #ccc; border-radius: 3px 0 0 3px; padding: 2px 2px 1px 2px; background: #43565f; margin-bottom: 3px;',
    'color: #ccc; border-radius: 0 3px 3px 0; padding: 2px 8px 1px 2px; background: #00DC8220',
    ...args.slice(1)
    // `\n🪢 ${stack[0]}`
  )

  // console.log('%cTrace 🪢', 'color: blue; text-decoration: underline;', stack[0])

  // Append the log details to the app log
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const dt = new Date()
  // const padL = (nr, len = 2) => String(nr).padStart(len, '0')
  // ${padL(dt.getHours())}:${padL(dt.getMinutes())}:${padL(dt.getSeconds())}

  // TODO: Move logic to logger.js
  // $nuxt.$app.log.unshift({
  //   message: args[0],
  //   args,
  //   stack: stack.slice(5),
  //   time: dt.toLocaleTimeString(),
  //   date: dt.toLocaleDateString(),
  // })
}

export { logd, info, error, warn }
export default logDefault
