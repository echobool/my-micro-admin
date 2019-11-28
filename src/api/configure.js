import request from '@/utils/request'

export function addConfigure(data) {
  return request({
    url: '/config/',
    method: 'put',
    data
  })
}

export function fetchList(query) {
  return request({
    url: '/config/list',
    method: 'get',
    params: query
  })
}

export function deleteConfigure(id) {
  return request({
    url: '/config/' + id,
    method: 'delete'
  })
}

export function getInfo(id) {
  return request({
    url: '/config/d/' + id,
    method: 'get'
  })
}

export function updateConfigure(data, id) {
  return request({
    url: '/config/' + id,
    method: 'post',
    data
  })
}

export function getHistoryInfo(id) {
  return request({
    url: '/config/history/d/' + id,
    method: 'get'
  })
}

export function rollBack(id) {
  return request({
    url: '/config/history/rollback/' + id,
    method: 'put'
  })
}
export function fetchHistoryList(query, id) {
  return request({
    url: '/config/history/list/' + id,
    method: 'get',
    params: query
  })
}
