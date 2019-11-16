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

export function getInfo(query) {
  return request({
    url: '/config/',
    method: 'get',
    params: query
  })
}

export function updateConfigure(data, id) {
  return request({
    url: '/config/' + id,
    method: 'post',
    data
  })
}

