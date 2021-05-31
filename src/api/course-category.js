import request from '@/utils/request'

export function getParentCategory(cate_type) {
  return request({
    url: `/course/category/parent/${cate_type}`,
    method: 'get'
  })
}

export function addCategory(data) {
  return request({
    // headers: { 'Custom-Data': 'module' },
    url: '/course/category/',
    method: 'put',
    data
  })
}


export function fetchList(query) {
  return request({
    url: '/course/category/list',
    method: 'get',
    params: query
  })
}



export function fetchCategory(id) {
  return request({
    url: '/course/category/d/' + id,
    method: 'get'
  })
}

export function updateCategory(data, id) {
  return request({
    url: `/course/category/${id}`,
    method: 'post',
    data
  })
}


export function deleteCategory(id) {
  return request({
    url: `/course/category/${id}`,
    method: 'delete'
  })
}
