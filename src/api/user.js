import request from '@/utils/request'

export function addUser(data) {
  return request({
    url: '/passport/account/',
    method: 'put',
    data
  })
}

export function fetchList(query) {
  return request({
    url: '/passport/account/list',
    method: 'get',
    params: query
  })
}

export function recoveryList(query) {
  return request({
    url: '/passport/account/recovery',
    method: 'get',
    params: query
  })
}

export function deleteUser(id) {
  return request({
    url: '/passport/account/' + id,
    method: 'delete'
  })
}

export function recoveryUser(id) {
  return request({
    url: '/passport/account/recovery/' + id,
    method: 'post'
  })
}

export function getInfo(query) {
  return request({
    url: '/passport/account/',
    method: 'get',
    params: query
  })
}

export function fetchUser(id) {
  return request({
    url: '/passport/account/d/' + id,
    method: 'get'
  })
}

export function updateUser(data, id) {
  return request({
    url: '/passport/account/u/' + id,
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/passport/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/passport/account/logout',
    method: 'post'
  })
}
