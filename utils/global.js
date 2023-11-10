/**
 * @project: catas
 * @file:    \utils\globalHelper.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 2nd June 2023
 * Last Modified: Tue Jun 06 2023
 **/

export default {
  ID(data = {}) {
    if (data.id) return data.id
    if (data.uuid) return data.uuid
    if (data['@id']) return piniaHelper.getId(data)
    console.warn('🛑 No ID found', data)
    return false
  },
}
