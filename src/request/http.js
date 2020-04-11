import axios from 'axios'
axios.defaults.baseURL = (process.env.NODE_ENV==='production')?'http://129.204.43.32:7002':'http://192.168.1.7:8080/'
const ERR_OK = "0" 
export function request(with_login_state,option){
    return new Promise((resolve,reject)=>{
        if(with_login_state) {
            let login_state = localStorage.getItem('login_state')
            login_state = JSON.parse(login_state)
            let skey = login_state.skey
            let identity = login_state.identity
            if(!option.headers) option.headers = {}
            option.headers.skey = skey
            option.headers.identity = identity
        }
        axios(option).then(res=>{
            if(res.data.code){
                if(res.data.code===ERR_OK) resolve(res.data)
                else reject(res.data.code)
            }
            resolve(res.data)
        }).catch(err=>{
            reject(err)
        })
    })
}