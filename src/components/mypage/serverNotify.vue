<template>
  <div id="notify" class="notify">
    <div class="header">
      <van-icon name="arrow-left" @click="closeNotify()" size="25px" class="close" color="white"/>
      <span class="header-title">消息推送列表</span>
    </div>
    <van-collapse v-model="activeNames">
      <van-collapse-item title="OA消息" name="1">
        <div class="wrapper">
          <div class="body" v-for="item in oaList" :key="item.id" @click="needOaDetail(item.id)">
            <div class="content van-ellipsis">{{item.title}}</div>
            <div class="user-nickname">
              {{item.department}}
            </div>
            <van-divider />
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item title="TA发的新推文" name="2">
        <div class="wrapper">
          <div class="body" v-for="item in officialList" :key="item.id" @click="needOfficialDetail(item.official_url)">
            <div class="content van-ellipsis">{{item.official_title}}</div>
            <div class="user-nickname">
              {{item.user_id}}
            </div>
            <van-divider />
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item title="TA发的新文章" name="3">
        <div class="wrapper">
          <div class="body" v-for="item in essayList" :key="item.id" @click="needEssayDetail(item.id)">
            <div class="content van-ellipsis">{{item.content}}</div>     
            <div class="user-nickname">
              {{item.nickname}}
            </div>
            <van-divider />
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item title="被评论" name="4">
        <div class="wrapper">
          <div class="body" v-for="item in commentList" :key="item.id" @click="needEssayDetail(item.id)">
            <div class="content van-ellipsis">{{item.content}}</div>
            <div class="user-nickname">{{item.nickname}}</div>
            <van-divider />
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>
    <div class="window-to-show">
      <transition name="van-slide-right">
        <oadetail :id="id" v-show="oaDetailShow" @detailclose="oaDetailShow=$event"></oadetail>
      </transition>
      <transition name="van-slide-right">
        <officialdetail :url="url" v-show="officialDetailShow" @detailclose="officialDetailShow=$event"></officialdetail>
      </transition>
      <transition name="van-slide-right">
        <bbsDetail :list="[essay]" :comment="comment" :now="now" v-show="bbsDetailShow" @closedetail="bbsDetailShow=$event"></bbsDetail>
      </transition>
    </div>
  </div>
</template>
<script>
import oadetail from 'components/notice/oadetail'
import officialdetail from 'components/notice/officialdetail'
import bbsDetail from 'components/bbs/bbsDetail'
import {request} from '../../request/http'
export default {
  data(){
    return{
      oaList:[],
      officialList:[],
      essayList:[],
      commentList:[],
      oaDetailShow: false,
      officialDetailShow: false,
      essay:{},
      comment:[],
      bbsDetailShow: false,
      now: new Date(),
      url:'',
      id: '',
      activeNames:['0']
    }
  },
  components:{
    oadetail,
    officialdetail,
    bbsDetail
  },
  methods:{
    closeNotify(){
      this.$emit('closeNotify',false)
    },
    needOaDetail(id){
      this.id=id
      this.oaDetailShow=true
      let index = 0
      for(let item of this.oaList){
          if(item.id===id) break
          index++
      }
      this.oaList.splice(index,1)
    },
    needOfficialDetail(url){
      this.url=url
      this.officialDetailShow=true
      let index = 0
      for(let item of this.officialList){
          if(item.official_url===url) break
          index++
      }
      this.officialList.splice(index,1)
    },
    needEssayDetail(id){
      request(true,{
          method: 'get',
          url: '/api/moment/get_details',
          params:{
              id
          }
      }).then(res=>{
          this.essay=res.article[0]
          this.comment=res.comment
          this.bbsDetailShow=true
          let index = 0
          for(let item of this.essayList){
            if(item.id===id) break
            index++
          }
          this.essayList.splice(index,1)
          index = 0
          for(let item of this.commentList){
            if(item.id===id) break
            index++
          }
          this.commentList.splice(index,1)
      }).catch(err=>{
          console.log(err)
          this.$toast.fail('加载失败')
      })
    }
  },
  created(){
    this.$nextTick(function(){
      const bottomSize = 48
      const clientHeight = this.$root.$el.getElementsByClassName('test-client-height')[0].offsetHeight
      this.$root.$el.getElementsByClassName('notify')[0].style.height=`${clientHeight-bottomSize}px`
    })
    this.$store.state.offline_message.forEach(item=>{
      if(item.wechat_essay_comment){
        this.commentList.push(item.wechat_essay_comment)
      }else if(item.wechat_essay){
        this.essayList.push(item.wechat_essay)
      }else if(item.oa){
        this.oaList.push(item.oa)
      }else if(item.official_essay) 
        this.officialList.push(item.official_essay)
    })
    this.$store.state.moment_socket.on('commented',data=>{
      this.commentList.push(data.wechat_essay_comment)
    })
    this.$store.state.moment_socket.on('new_essay_received',data=>{
      this.essayList.push(data.wechat_essay)
    })
    this.$store.state.official_socket.on('new_official_received',data=>{
      this.officialList.push(data.official_essay)
    })
    this.$store.state.oa_socket.on('new_oa_received',data=>{
      this.oaList.push(data.oa)
    })
  }
}
</script>
<style lang="stylus" scoped>
#notify
  position fixed
  z-index 99
  background-color white
  top 0
  right 0
  left 0
  overflow auto
  .header
    background-color #1989fa
    height 40px
    .close
      position absolute
      left 5px
      top 7.5px
    .header-title
      display inline-block
      width 100%
      height 40px
      line-height 40px
      text-align center
      color white
      font-weight 80px
  .wrapper
    padding 5px
    .body
      .content
        font-size 20px
        font-weight bold
        padding-bottom 5px
      .user-nickname
        font-size 15px
        color gray




    
    
</style>