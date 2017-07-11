import jsonp from './common/jsonp'
import {commonParams, options} from './common/config'

export function getRankList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  const data = Object.assign({}, commonParams, {
    format: 'jsonp',
    platform: 'h5',
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function getRankListDetails (id) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid: id
  })
  return jsonp(url, data, options)
}
