import axios from 'axios'
import { Spin,Notice } from 'iview'
import store from '@/store'
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.timeout = 25000
class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        // 'Access-Control-Allow-Origin': '*',
        // 'Content-Type': 'application/json'
        'ticket':store.state.user.token
      },
    }
    return config
  }
  distroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.distroy(url)
      const { data, status } = res
      if(res.data.code != 100){
        Notice.error({
          title: '系统异常'+res.data.code
        });
      }
      return { data, status }
    }, error => {
      this.distroy(url)
      if(error.response.status ===403){
        Notice.error({
          title: '权限不足或登陆超时，请检查登陆状态和权限'
        });
        store.dispatch('handleLogOut')
        app.$router.push('/login')
      }else{
        Notice.error({
          title: error.message
        });
      }
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options.headers = {...this.getInsideConfig().headers,...options.headers}
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
