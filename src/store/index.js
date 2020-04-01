import Vue from 'vue'
import Vuex from 'vuex'
import {
  request
} from '../request/http'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user_info: {}
  },
  mutations: {
    refresh_user_info(state, user_info) {
      state.user_info = user_info
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