import Vue from 'vue'
import VueRouter from 'vue-router'
import BBS from 'components/bbs/bbs'
import MyPage from 'components/mypage/mypage'
import Notice from 'components/notice/notice'
import Login from 'components/login'
import {request} from '../request/http'
Vue.use(VueRouter)
const login_state_check_mixin = function(to,from,next){
  let login_state = localStorage.getItem('login_state')
  if(!login_state){
    next('/login')
    return
  } 
  login_state = JSON.parse(login_state)
  if(new Date() >= new Date(login_state.expire_at)) {
    next('/login')
    return
  } 
  next()
}
const refresh_skey_mixin = function(to,from,next){
  let login_state = localStorage.getItem('login_state')
  if(!login_state){
    next()
    return
  } 
  login_state = JSON.parse(login_state)
  if(new Date() >= new Date(login_state.expire_at)) {
    next()
    return
  } 
  let identity = login_state.identity
  request(true,{
    method:'get',
    url: '/api/user/refresh_skey'
  }).then(res=>{
    res["identity"] = identity
    localStorage.setItem('login_state',JSON.stringify(res))
    next('/mypage')
  }).catch(err=>{
    console.log(err)
    next()
    return
  })
}
const routes = [
  {
    path:'/notice',
    component:MyPage,
    beforeEnter: login_state_check_mixin
  },
  {
    path:'/bbs',
    component: BBS,
    // beforeEnter: login_state_check_mixin
  },
  {
    path: '/mypage',
    component: Notice,
    beforeEnter: login_state_check_mixin
  },
  {
    path: '/login',
    component: Login,
    beforeEnter: refresh_skey_mixin
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
export default router
