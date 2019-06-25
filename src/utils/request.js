import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { isJsonString } from '@/utils/index'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    return response.data
  },
  error => {
    const res = error.response.data
    const status = error.response.status

    if (status === 404) {
      Message({
        message: '请求的接口资源不存在，请联系管理员',
        type: 'error',
        duration: 5 * 1000
      })
    } else if (status === 403) {
      Message({
        message: '权限不足，无法访问请求的资源',
        type: 'error',
        duration: 5 * 1000
      })
    } else if (status === 401) {
      // 如果token 过期后重新登录提示
      MessageBox.confirm('您登录凭据已失效，请重新登录', {
        confirmButtonText: '重新登录',
        cancelButtonText: '算球了',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    } else if (status === 405) {
      Message({
        message: '请求方法不允许，无法访问请求的资源',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      if (isJsonString(res.message)) {
        const micro = JSON.parse(res.message)
        Message({
          message: micro.detail || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }

      console.log('err' + error) // for debug
    }
    return Promise.reject(error)
  }
)

export default service
