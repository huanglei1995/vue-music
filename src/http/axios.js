import axios from 'axios'
import qs from 'qs'


const CONTENTTYPE = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.headers['Content-Type'] = CONTENTTYPE

// http request 拦截器
axios.interceptors.request.use(
  config => {
    config.headers['mtoken'] = store.state.token
    config.headers['uid'] = store.state.uid
    config.data = qs.stringify(config.data)
    return config
  },
  err => {
    return Promise.reject(err)
  })

// // http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    console.error(JSON.stringify(error)) // console : Error: Request failed with status code 402
    console.error(error)
    // malert.malert('网络访问出错')
    alert(error)
    return Promise.reject(error)
  })

export default axios
