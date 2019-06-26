import request from '@/utils/request'

export function getParentMenu(domain_id) {
  return request({
    url: `/rbac/menu/parent/${domain_id}`,
    method: 'get'
  })
}

export function addMenu(data) {
  return request({
    // headers: { 'Custom-Data': 'module' },
    url: '/rbac/menu/',
    method: 'put',
    data
  })
}
/**
 * 添加模块
 * @param {*} data
 */
export function addModule(data) {
  return request({
    url: '/rbac/menu/module',
    method: 'put',
    data
  })
}

export function getMenus(query) {
  return request({
    url: '/rbac/menu/list',
    method: 'get',
    params: query
  })
}

export function fetchList() {
  return request({
    url: '/rbac/role/group',
    method: 'get'
  })
}

export function fetchMenu(id) {
  return request({
    url: '/rbac/menu/d/' + id,
    method: 'get'
  })
}

export function updateRole(data, id) {
  return request({
    url: `/rbac/role/${id}`,
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/rbac/role/${id}`,
    method: 'delete'
  })
}
