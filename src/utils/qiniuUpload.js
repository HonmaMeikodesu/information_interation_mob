import * as qiniu from 'qiniu-js'
import {
  request
} from '../request/http'

function uploadImg(id, file) {
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
function uploadAvatar(nickname,file){
  return new Promise((resolve, reject) => {
    request(true, {
      method: 'post',
      url: '/api/user/avatar/uploadtoken'
    }).then(res=>{
      const key = res.expected_Key
      const token = res.token
      const putExtra = {
        params: {
          'x:nickname': nickname
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
export {
  uploadImg,
  uploadAvatar
}