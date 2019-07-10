import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/rbac/role/list',
    method: 'get'
  })
}

export function fetchList() {
  return request({
    url: '/rbac/role/group',
    method: 'get'
  })
}

export function fetchRole(id) {
  return request({
    url: '/rbac/role/d/' + id,
    method: 'get'
  })
}
export function addRole(data) {
  return request({
    url: '/rbac/role/',
    method: 'put',
    data
  })
}

export function updateRole(data, id) {
  return request({
    url: `/rbac/role/${id}`,
    method: 'post',
    data
  })
}

export function deleteRole(id, role_name) {
  return request({
    url: `/rbac/role/${id}/${role_name}`,
    method: 'delete'
  })
}
