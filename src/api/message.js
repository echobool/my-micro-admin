import request from '@/utils/request'

export function addSmsTemplate(data) {
  return request({
    url: '/message/sms/template',
    method: 'put',
    data
  })
}

export function updateSmsTemplate(data, id) {
  return request({
    url: '/message/sms/template/' + id,
    method: 'post',
    data
  })
}

export function fetchSmsTemplate(id) {
  return request({
    url: '/message/sms/template/d/' + id,
    method: 'get'
  })
}

export function fetchSmsTemplateList(query) {
  return request({
    url: '/message/sms/template/list',
    method: 'get',
    params: query
  })
}

export function deleteSmsTemplate(id) {
  return request({
    url: '/message/sms/template/' + id,
    method: 'delete'
  })
}

export function fetchSmsLogList(query) {
  return request({
    url: '/message/sms/log/list',
    method: 'get',
    params: query
  })
}

export function fetchSmsLog(id) {
  return request({
    url: '/message/sms/log/d/' + id,
    method: 'get'
  })
}

// 推送接口
export function addPushTemplate(data) {
  return request({
    url: '/message/push/template',
    method: 'put',
    data
  })
}

export function updatePushTemplate(data, id) {
  return request({
    url: '/message/push/template/' + id,
    method: 'post',
    data
  })
}

export function fetchPushTemplate(id) {
  return request({
    url: '/message/push/template/d/' + id,
    method: 'get'
  })
}

export function fetchPushTemplateList(query) {
  return request({
    url: '/message/push/template/list',
    method: 'get',
    params: query
  })
}

export function deletePushTemplate(id) {
  return request({
    url: '/message/push/template/' + id,
    method: 'delete'
  })
}

export function fetchPushLogList(query) {
  return request({
    url: '/message/push/log/list',
    method: 'get',
    params: query
  })
}

export function fetchPushLog(id) {
  return request({
    url: '/message/push/log/d/' + id,
    method: 'get'
  })
}
