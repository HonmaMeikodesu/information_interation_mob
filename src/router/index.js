import Vue from 'vue'
import VueRouter from 'vue-router'
import BBS from 'components/bbs/bbs'
import MyPage from 'components/mypage/mypage'
import sendHistory from 'components/mypage/send/sendHistory'
import sendEssay from 'components/mypage/send/sendEssay'
import sendOfficial from 'components/mypage/send/sendOfficial'
import sendComment from 'components/mypage/send/sendComment'
import bookHistory from 'components/mypage/book/bookHistory'
import bookOA from 'components/mypage/book/bookOA'
import bookOfficial from 'components/mypage/book/bookOfficial'
import bookEssay from 'components/mypage/book/bookEssay'
import likeHistory from 'components/mypage/like/likeHistory'
import Notice from 'components/notice/notice'
import Login from 'components/login'
import Oa from 'components/notice/oa'
import Official from 'components/notice/official'
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
    return
  }).catch(err=>{
    console.log(err)
    next()
    return
  })
}
const routes = [
  {
    path:'/notice',
    component:Notice,
    children:[
      {
        path: 'oa',
        component:Oa
      },
      {
        path: 'official',
        component: Official
      }
    ],
    beforeEnter: login_state_check_mixin
  },
  {
    path:'/bbs',
    component: BBS,
    beforeEnter: login_state_check_mixin
  },
  {
    path: '/mypage',
    component: MyPage,
    children: [{
      path: 'send',
      component: sendHistory,
      children: [{
        path: 'essay',
        component: sendEssay
      },{
        path: 'official',
        component: sendOfficial
      },{
        path: 'comment',
        component: sendComment
      }]
    },{
      path: 'book',
      component: bookHistory,
      children:[{
        path: 'oa',
        component: bookOA
      },{
        path: 'official',
        component: bookOfficial
      },{
        path: 'essay',
        component: bookEssay
      }]
    },{
      path: 'like',
      component: likeHistory
    }],
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
