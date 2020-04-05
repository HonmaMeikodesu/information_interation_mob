import axios from 'axios'
axios.defaults.baseURL = 'http://192.168.1.8:8080/'
const ERR_OK = "0" 
export function request(with_login_state,option){
    return new Promise((resolve,reject)=>{
        if(with_login_state) {
            let login_state = localStorage.getItem('login_state')
            login_state = JSON.parse(login_state)
            let skey = login_state.skey
            let identity = login_state.identity
            option.headers = {}
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