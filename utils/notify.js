/**
 * @file:    \utils\notify.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 24th April 2023
 * Modified: Tue May 09 2023
 **/

export default {
  show(params) {
    useNuxtApp().$emit('notifications:show', {
      // type: 'error',
      text: 'Debes revisar los campos antes de continuar',
      ...params,
    })
  },
}
