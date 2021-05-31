import request from '@/utils/request'

export function addEnterprise(data) {
  return request({
    url: '/base/enterprise/',
    method: 'put',
    data
  })
}

export function fetchList(query) {
  return request({
    url: '/base/enterprise/list',
    method: 'get',
    params: query
  })
}

export function deleteEnterprise(id) {
  return request({
    url: '/base/enterprise/' + id,
    method: 'delete'
  })
}

export function getInfo(id) {
  return request({
    url: '/base/enterprise/d/' + id,
    method: 'get'
  })
}

export function updateEnterprise(data, id) {
  return request({
    url: '/base/enterprise/' + id,
    method: 'post',
    data
  })
}

export function reviewEnterprise(data, id) {
  return request({
    url: '/base/enterprise/review/' + id,
    method: 'patch',
    data
  })
}


export function disabledEnterprise(data, id) {
  return request({
    url: '/base/enterprise/disabled/' + id,
    method: 'patch',
    data
  })
}
