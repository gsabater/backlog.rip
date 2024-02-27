function debounce(func, wait, immediate = false) {
  console.warn(2)
  let timeout
  return function executedFunction(...args) {
    console.warn(3)
    const context = this
    const later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

export default debounce
