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

async function logDefault(...args) {
  const error = new Error()
  const stack = error.stack
    .split('\n')
    .slice(2)
    .map((line) => line.trim().replace(/^at\s+/g, ''))

  const dt = new Date()
  const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr)
  // ${padL(dt.getHours())}:${padL(dt.getMinutes())}:${padL(dt.getSeconds())}

  console.debug(
    `⚡ %c Backlog %c ${args[0]}`,
    'color: #ccc; border-radius: 3px 0 0 3px; padding: 2px 2px 1px 2px; background: #43565f; margin-bottom: 7px;',
    'color: #ccc; border-radius: 0 3px 3px 0; padding: 2px 8px 1px 2px; background: #00DC8220',
    ...args.slice(1),
    `\n🔥 ${stack[0]}`
  )
}

export { logd, info, error, warn }
export default logDefault
