import * as qiniu from 'qiniu-js'
import {
  request
} from '../request/http'

export function uploadImg(id, file) {
  return new Promise((resolve, reject) => {
    request(true, {
      method: 'post',
      url: '/api/moment/uploadtoken'
    }).then(res => {
      const key = res.key
      const token = res.token
      const putExtra = {
        params: {
          'x:essay_id': id
        }
      }
      const config = {
        region: qiniu.region.z2
      }
      const observer = {
        error(err) {
          reject(err)
        },
        complete(res) {
          resolve(res)
        }
      }
      let ob = qiniu.upload(file, key, token, putExtra, config)
      ob.subscribe(observer)
    }).catch(err => {
      reject(err)
    })
  })
}