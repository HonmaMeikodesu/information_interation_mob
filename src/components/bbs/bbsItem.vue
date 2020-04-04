<template>
  <div id="bbs-essay">
    <van-overlay :show="showFullImg" @click="showFullImg = false">
      <div class="full-img-wrapper">
          <van-image :src="fullImgUrl" cover></van-image>
      </div>
    </van-overlay>
    <van-dialog v-model="show" title="用户信息">
        <div class="user-info-detail">
            <div class="student-info" v-if="judgeStudent">
                <div class="user-avatar">
                    <van-image 
                    :src="computeAvatar(other_info.avatar)"
                    error-icon="user-circle-o"
                    cover
                    >
                    </van-image>
                </div>
                <div class="user-id">
                    <span class="user-id-content">{{other_info.id}}</span>
                </div>
                <div class="user-gender">
                    <span class="user-gender-conten">{{other_info.info.gender}}</span>
                </div>
                <div class="user-major">
                    <span class="user-major">{{other_info.info.major}}</span>
                </div>
                <div class="user-signature" v-if="other_info.signature&&other_info.signature!==null">
                    <span class="user-signature-prefix">用户介绍:</span>
                    <span class="user-signature-content">{{other_info.signature}}</span>
                </div>
            </div>
            <div class="organization-info" v-else>
                <div class="organization-avatar">
                    <van-image 
                    :src="computeAvatar(other_info.avatar_url)"
                    error-icon="user-circle-o"
                    >
                    </van-image>
                </div>
                <div class="organization-name">
                    <span class="organization-name-prefix">组织名称:</span>
                    <span class="organization-name-content">{{other_info.organization_name}}</span>
                </div>
                <div class="organization-info">
                    <span class="organization-info-prefix">组织介绍:</span>
                    <span class="organization-info-content">{{other_info.organization_info}}</span>
                </div>
            </div>
        </div>
    </van-dialog>  
    <div class="essay-wrapper" v-for="item in list" :key="item.id">
        <div class="essay-id" v-show="false">{{item.id}}</div>
        <div class="essay-avatar">
            <van-image
            width="65"
            height="65"
            round
            fit="cover"
            error-icon="user-circle-o"
            :src="computeAvatar(item.essay_user_avatar)"
            @click="showUserInfo(item.essay_user_identity,item.essay_user_id)"
            />
            <van-tag class="follow-status" size="medium" v-if="judgeFollow(item.essay_user_identity,item.essay_user_id)&&!juegeEssayOwner(item.essay_user_id,item.essay_user_identity)" color="#359ce7" @click="addFollow(item.essay_user_identity,item.essay_user_id)">+关注</van-tag>
            <van-tag class="follow-status" type="success" size="medium" v-else-if="!juegeEssayOwner(item.essay_user_id,item.essay_user_identity)" @click="removeFollow(item.essay_user_identity,item.essay_user_id)">取关</van-tag>
        </div>
        <div class="essay-body">
            <div class="essay-body-info">
                <div class="essay-body-info-author-name">{{item.essay_user_nickname}}</div>
                <div class="essay-body-info-time">{{computePublishTime(item.updated_at)}}</div>
                <div class="essay-body-info-edited" v-if="(item.created_at==item.updated_at)&&juegeEssayOwner(item.essay_user_id,item.essay_user_identity)">
                    <van-tag mark type="primary" class="essay-body-info-edited-history">编辑该文章</van-tag>
                </div>
                <div class="essay-body-info-edited" v-if="!(item.created_at==item.updated_at)">
                    <span class="essay-body-info-edited-hint">已被编辑过</span>
                    <van-tag mark type="primary" class="essay-body-info-edited-history">查看编辑记录</van-tag>
                </div>
            </div>
            <div class="essay-body-content">
                <div class="essay-body-content-words" @click="iNeedMoreDetails(item)">{{item.essay_content}}</div>
            </div>
            <div class="essay-body-image">
                <van-image 
                v-for="img in filterImgArr(item.essay_user_image_url)" 
                :key="img"
                :src="imgServerUrl.concat(img)"
                width="100px"
                height="100px"
                cover
                @click="switchFullImg(imgServerUrl.concat(img))"
                >
                </van-image>
            </div>
            <div class="essay-status">
                <div class="thumbs-up">
                    <van-icon name="thumb-circle-o" v-if="judgeThumbsUp(item.id)" @click="addThumbsUp(item)"/>
                    <van-icon name="thumb-circle" v-else @click="removeThumbsUp(item)"/>
                    <span>{{item.thumbsup_num}}</span>
                </div>
                <div class="booked">
                    <van-icon name="star-o" v-if="judgeBooked(item.id)" @click="addBooked(item)" />
                    <van-icon name="star" v-else @click="removeBooked(item)" />
                    <span>{{item.bookmarked_num}}</span>
                </div>
                <div class="comment">
                    <van-icon name="comment-circle-o" @click="iNeedMoreDetails(item)"/>
                    <span>{{item.review_num}}</span>
                </div>
                <div class="delete" @click="deleteEssay(item.id)" v-if="juegeEssayOwner(item.essay_user_id,item.essay_user_identity)">
                    <van-icon name="cross" color="red"/>
                    <span>删除文章</span>
                </div>
            </div>
        </div>
    </div> 
  </div>
</template>
<script>
import {request} from '../../request/http'
import {Dialog} from 'vant'
export default {
  data(){
      return{
          imgServerUrl:'http://cdn.xv1998.cn/',
          showFullImg: false,
          fullImgUrl: '',
          other_identity: '',
          other_info: {},
          show: false,
      }
  },
  props: ["list","now"],
  computed: {
      judgeStudent:{
          get: function(){
              if(this.other_identity==='student')
                return true
              else
                return false
          },
          set:function(val){
              this.other_identity=val
          }
      }
  },
  methods: {
      computePublishTime(time){
          let publish_time = new Date(time)
          let gap = this.now-publish_time
          if(gap<=60000){
              return `${Math.round(gap/1000)}秒前`
          }else if(gap<=3600000){
              return `${Math.round(gap/60000)}分钟前`
          }else if(gap<=86400000){
              return `${Math.round(gap/3600000)}小时前`
          }else{
              return `${Math.round(gap/86400000)}天前`
          }
      },
      computeAvatar(avatar){
          let avatar_str = this.imgServerUrl.concat(avatar).split(':')
          return avatar_str[0].concat(':',avatar_str[1])
      },
      filterImgArr(str){
          const arr = str.split('$%^')
          arr.shift()
          return arr
      },
      juegeEssayOwner(id,identity){
          if(this.$store.state.user_info.basisInfo.organization_basisInfo){
              if(identity!=='organization') return false
              if(id!==this.$store.state.user_info.basisInfo.organization_basisInfo.organization_name) return false
              return true
          }else{
              if(identity!=='student') return false
              if(id!==this.$store.state.user_info.basisInfo.id) return false
              return true
          }
      },
      switchFullImg(url){
          this.fullImgUrl = url
          this.showFullImg = true
      },
      judgeFollow(identity,id){
          const follow = identity.concat('/',id)
          if(this.$store.getters.followList.includes(follow))
            return false
          else 
            return true
      },
      addFollow(identity,id){
          this.$toast.loading({
              message:'操作中',
              forbidClick: true,
              duration: 0
          })
          const follow = identity.concat('/',id)
          request(true,{
            method: 'get',
            url:'/api/user/follow',
            params:{
                follow_user_identity: identity,
                follow_user_id: id
            }
          }).then(()=>{
            this.$store.getters.followList.push(follow)
            this.$toast.clear()
          }).catch(err=>{
            console.log(err)
            this.$toast.clear()
            this.$toast.fail('失败')
          })
      },
      removeFollow(identity,id){
          const follow = identity.concat('/',id)
          this.$toast.loading({
              message:'操作中',
              forbidClick: true,
              duration: 0
          })
          request(true,{
            method: 'get',
            url:'/api/user/unfollow',
            params:{
                follow_user_identity: identity,
                follow_user_id: id
            }
          }).then(()=>{
            this.$store.getters.followList.splice(this.$store.getters.followList.indexOf(follow),1)
            this.$toast.clear()
          }).catch(err=>{
            console.log(err)
            this.$toast.clear()
            this.$toast.fail("失败")
          })
          
      },
      judgeBooked(id){
          for(let item of this.$store.getters.booked_moment.booked_moments){
            if(item.id==id) return false 
          }
          return true
      },
      addBooked(item){
          request(true,{
              method: 'get',
              url: '/api/moment/book',
              params: {
                  from: 'moment',
                  message_id: item.id
              }
          }).then(()=>{
              this.$store.getters.booked_moment.booked_moments.push(item)
              item.bookmarked_num++
          }).catch(err=>{
              console.log(err)
              this.$toast.fail('操作失败')
          })
      },
      removeBooked(item){
          request(true,{
              method: 'get',
              url: '/api/moment/book',
              params: {
                  from: 'moment',
                  message_id: item.id
              }
          }).then(()=>{
              let index = 0
              for(let i of this.$store.getters.booked_moment.booked_moments){
                  if(i.id==item.id){
                      break
                  }
                  index++
              }
              this.$store.getters.booked_moment.booked_moments.splice(index,1)
              item.bookmarked_num--
          }).catch(err=>{
              console.log(err)
              this.$toast.fail('操作失败')
          })
      },
      judgeThumbsUp(id){
          for(let item of this.$store.getters.liked.moments){
            if(item.id==id) return false 
          }
          return true
      },
      addThumbsUp(item){
          request(true,{
              method: 'get',
              url: '/api/moment/like',
              params: {
                  moment_id: item.id
              }
          }).then(()=>{
              this.$store.getters.liked.moments.push(item)
              item.thumbsup_num++
          }).catch(err=>{
              console.log(err)
              this.$toast.fail('操作失败')
          })
      },
      removeThumbsUp(item){
          request(true,{
              method: 'get',
              url: '/api/moment/like',
              params: {
                  moment_id: item.id
              }
          }).then(()=>{
              let index = 0
              for(let i of this.$store.getters.liked.moments){
                  if(i.id==item.id){
                      break
                  }
                  index++
              }
              console.log(index+ ' ' +this.$store.getters.liked.moments)
              this.$store.getters.liked.moments.splice(index,1)
              item.thumbsup_num--
          }).catch(err=>{
              console.log(err)
              this.$toast.fail('操作失败')
          })
      },
      deleteEssay(id){
        Dialog.confirm({
        title: '确认提示',
        message: '您确定要删除该文章吗'
        }).then(() => {
          this.$toast.loading({
              message: '删除中',
              forbidClick: true,
              duration: 0
          })
          request(true,{
              method: 'get',
              url: '/api/moment/delete_essay',
              params:{
                  id
              }
          }).then(()=>{
              let index = 0
              for(let item of this.list){
                  if(item.id==id) break
                  index++
              }
              this.list.splice(index,1)
              this.$toast.clear()
          }).catch(err=>{
              console.log(err)
              this.$toast.clear()
              this.$toast.fail('操作失败')
          })
        }).catch(() => {
        // on cancel
        });
      },
      showUserInfo(identity,user_id){
          this.other_identity=identity
          console.log(identity+ ' ' +user_id)
          request(true,{
              method: 'get',
              url: '/api/user/get_others_info',
              params: {
                  identity,
                  user_id
              }
          }).then(res=>{
              if(identity==='student') this.other_info = res.user_info
              else this.other_info = res.organization_basisInfo
              this.show=true
          }).catch(err=>{
              console.log(err)
              this.$toast.fail('操作失败')
              this.show=false
          })
      },
      iNeedMoreDetails(item){
          this.$emit('needMoreDetail',item)
      }
  }
}
</script>
<style lang="stylus" scoped>
#bbs-essay
  .user-info-detail
    *
        padding 5px 0
        text-align center
  .full-img-wrapper 
    display flex
    align-items center
    justify-content center
    height 100%
  .essay-wrapper
    display flex
    background-color white
    padding 10px
    border-bottom 1px solid gray
    $:last-child
      border-bottom 0px
    .essay-avatar
        flex 0 0 65px
        .follow-status
            margin 5px 10px
    .essay-body 
        position relative
        flex 1
        .essay-body-info
            padding-left 5px
            height 65px
            .essay-body-info-author-name
                font-size 20px
            .essay-body-info-time
                color #96979c
                font-size 15px
            .essay-body-info-edited
                .essay-body-info-edited-hint
                    display inline-block
                    color #96979c
                    font-size 12px
                    padding-right 5px
        .essay-body-content
            padding 10px 0px 10px 5px
            .essay-body-content-words
                font-size 15px
        .essay-body-image
            padding 10px 0px 30px 0px 
        .essay-status
            position absolute
            bottom 0px
            right 2px
            >div
                display inline-block
                padding 0 2px
                >span
                    padding-left 1px
                    font-size 14px
                    vertical-align top
            .delete
                span 
                    color red
</style>