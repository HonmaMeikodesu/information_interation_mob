import Vue from 'vue'
import Vuex from 'vuex'
import {
  request
} from '../request/http'
import io from 'socket.io-client'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user_info: {},
    oa_socket:{},
    official_socket:{},
    moment_socket:{},
    offline_message:[]
  },
  getters: {
    identity: state=>{
      if(state.user_info.basisInfo.organization_basisInfo){
        return 'organization'
      }else{
        return 'student'
      }
    },
    basisInfo: (state,getters)=>{
      if(getters.identity==='student'){
        return state.user_info.basisInfo
      }else{
        return undefined
      }
    },
    organization_basisInfo: (state,getters)=>{
      if(getters.identity==='organization'){
        return state.user_info.basisInfo.organization_basisInfo
      }else{
        return undefined
      }
    },
    followList: state=>{
      return state.user_info.followList
    },
    fanList: state=>{
      return state.user_info.fanList
    },
    comment: state=>{
      return state.user_info.comment
    },
    liked: state=>{
      return state.user_info.liked
    },
    booked_oa: state=>{
      return state.user_info.booked_oa
    },
    booked_moment: state=>{
      return state.user_info.booked_moment
    },
    booked_official: state=>{
      return state.user_info.booked_official
    },
    published: state=>{
      return state.user_info.published
    }
  },
  mutations: {
    refresh_user_info(state, user_info) {
      state.user_info = user_info
    },
    refresh_socket(state){
      let serverUrl = 'http://129.204.43.32:7001'
      let login_state = localStorage.getItem('login_state')
      login_state = JSON.parse(login_state)
      let skey = login_state.skey
      let identity = login_state.identity
      state.moment_socket=io(`${serverUrl}/moment`,{
        query: {
          namespace:'/moment',
          skey,
          identity
        },
      })
      state.moment_socket.on('offline_message',data=>{
        state.offline_message=data
      })
      state.oa_socket=io(`${serverUrl}/oa`,{
        query: {
          namespace:'/oa',
          skey,
          identity
        },
      })
      state.official_socket=io(`${serverUrl}/official`,{
        query: {
          namespace:'/official',
          skey,
          identity
        },
      })
    }
  },
  actions: {
    sync_user_info(context) {
      if (!context.state.user_info.basisInfo) {
        request(true, {
          method: 'get',
          url: '/api/user/get_user_info',
        }).then(res => {
          context.commit('refresh_user_info', res)
        }).catch(err => {
          console.log(err)
        })
      }

    }
  },
  modules: {}
})