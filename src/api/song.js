import axios from 'axios'
import {commonParams} from './common/config'

export function getlyric (mid) {
  let url = '/api/lyric'
  let data = Object.assign({}, commonParams, {
    pcachetime: +new Date(),
    songmid: mid,
    hostUin: 0,
    format: 'json',
    platform: 'yqq'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
