import request from '@/utils/request'

export function addPolicy(data) {
  return request({
    url: '/rbac/authorize/',
    method: 'put',
    data
  })
}

export function editPolicy(data) {
  return request({
    url: `/rbac/authorize/${data.role_id}/${data.policy_id}`,
    method: 'post',
    data
  })
}

export function getRolePolicies(query) {
  return request({
    url: '/rbac/authorize/list',
    method: 'get',
    params: query
  })
}

export function deletePolicy(role_id, policy_id) {
  return request({
    url: `/rbac/authorize/${role_id}/${policy_id}`,
    method: 'delete'
  })
}
