import jsonp from './common/jsonp'
import axios from 'axios'
import { commonParams, options } from './common/config'

export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    needNewCode: 0
  })
  // const data = Object.assign({}, commonParams)
  return jsonp(url, data, options)
}

export function getRecommendList () {
  const url = '/api/getRecommendList'
  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29,
    rnd: Math.random(),
    format: 'json'
  })
  return axios(url, {
    params: data
  }).then((response) => {
    return Promise.resolve(response.data)
  }).catch((e) => {
    console.log(e)
  })
}
