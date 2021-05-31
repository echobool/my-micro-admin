import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      if (role.role_name === process.env.VUE_APP_PROTECTIVE_ROLE) {
        return true
      }
      if (role['policies']) {
        return role.policies.some(action => {
          return permissionRoles.includes(action)
        })
      }
    })
    return hasPermission
  } else {
    console.error(`need roles! Like v-permission="['action1','action2']"`)
    return false
  }
}
