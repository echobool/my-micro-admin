import request from '@/utils/request'

export function addTeacher(data) {
  return request({
    url: '/base/teacher/',
    method: 'put',
    data
  })
}

export function fetchList(query) {
  return request({
    url: '/base/teacher/list',
    method: 'get',
    params: query
  })
}

export function deleteTeacher(id) {
  return request({
    url: '/base/teacher/' + id,
    method: 'delete'
  })
}

export function getInfo(id) {
  return request({
    url: '/base/teacher/d/' + id,
    method: 'get'
  })
}

export function updateTeacher(data, id) {
  return request({
    url: '/base/teacher/' + id,
    method: 'post',
    data
  })
}

export function reviewTeacher(data, id) {
  return request({
    url: '/base/teacher/review/' + id,
    method: 'patch',
    data
  })
}
