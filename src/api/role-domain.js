import request from '@/utils/request'

export function addDomain(data) {
  return request({
    url: '/rbac/domain/',
    method: 'put',
    data
  })
}

export function fetchList(query) {
  return request({
    url: '/rbac/domain/list',
    method: 'get',
    params: query
  })
}

export function updateDomain(data, id) {
  return request({
    url: '/rbac/domain/' + id,
    method: 'post',
    data
  })
}

export function fetchDomain(id) {
  return request({
    url: '/rbac/domain/d/' + id,
    method: 'get'
  })
}

export function deleteDomain(query) {
  return request({
    url: '/rbac/domain',
    method: 'delete',
    params: query
  })
}
