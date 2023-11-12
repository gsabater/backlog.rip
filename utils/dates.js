/*
 * @file:    \utils\dates.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 10th November 2023
 * Modified: Fri Nov 10 2023
 */

export default {
  now() {
    return new Date().toISOString().replace('T', ' ').substring(0, 19)
  },
}
