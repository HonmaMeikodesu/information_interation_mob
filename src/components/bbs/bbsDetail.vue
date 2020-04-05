<template>
  <div id="bbs-detail">
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
    <div class="content-half">
      <div class="header">
        <van-icon name="arrow-left" @click="closeDetail()" size="25px" class="close" color="white"/>
        <span class="header-title">文章详情</span>
        <van-icon name="add" class="add" size="20px" color="#f3f4f6" />
      </div>
      <div class="comment-content">
        <bbsItem :list="list" :now="now"></bbsItem>
        <div class="comment-wrapper">
          <div class="comment" v-for="item in comment" :key="item.id">
            <div class="comment-id" id="item.id" style="display:none"></div>
            <div class="comment-user-avatar">
              <van-image
              :src="computeAvatar(item.comment_user_avatar)"
              @click="showUserInfo(item.comment_user_identity,item.comment_user_id)"
              error-icon="user-circle-o"
              cover
              width="65"
              height="65"
              ></van-image>
              <div class="comment-user-name">
                <span>{{item.comment_user_nickname}}</span>
              </div>
            </div>
            <div class="comment-main">
              <div class="comment-time">
                <span>{{computePublishTime(item.updated_at)}}</span>
              </div>
              <div class="comment-content">
                <span>
                  {{item.comment_content}}
                </span>
              </div>
            </div>
            <div class="delete" @click="deleteComment(item.id)" v-if="judgeCommentOwner(item.comment_user_identity,item.comment_user_id)">
                <van-icon name="cross" color="red"/>
                <span>删除评论</span>
            </div>
          </div>
          <div class="load-more">
            <div v-if="loadMoreSelected">
              <van-loading type="spinner" />
            </div>
            <div v-else>
              <span @click="loadMore(list[0].id)">刷新评论</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="over-lay-half" @click="closeDetail()"></div>
  </div>
</template>
<script>
import bbsItem from 'components/bbs/bbsItem'
import {request} from '../../request/http'
import {Dialog} from 'vant';
export default {
  data(){
    return{
      imgServerUrl:'http://cdn.xv1998.cn/',
      other_identity: '',
      other_info: {},
      show: false,
      loadMoreSelected: false,
    }
  },
  props:['list','comment',"now"],
  components:{
    bbsItem
  },
  watch:{
    comment:function(){
      this.$nextTick(function(){
        const topSize = 40
        const bottomSize = 50
        const clientHeight = this.$root.$el.getElementsByClassName('test-client-height')[0].offsetHeight
        const fullScreenHeight = clientHeight-bottomSize-topSize
        const commentHeight = this.$el.getElementsByClassName('comment-content')[0].offsetHeight
        if(commentHeight>fullScreenHeight) this.$el.getElementsByClassName('comment-content')[0].style.height = `${fullScreenHeight}px`
      })
    }
  },
  methods:{
    closeDetail(){
      this.$el.getElementsByClassName('comment-content')[0].style.height = ''
      this.$emit('closedetail',false)
    },
    computeAvatar(avatar){
        let avatar_str = this.imgServerUrl.concat(avatar).split(':')
        return avatar_str[0].concat(':',avatar_str[1])
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
    loadMore(id){
      this.loadMoreSelected=true
      this.now = new Date()
      request(true,{
          method: 'get',
          url: '/api/moment/get_details',
          params:{
              id
          }
      }).then(res=>{
          this.comment=res.comment
          this.$toast.success("已是最新评论")
          this.loadMoreSelected=false
      }).catch(err=>{
          console.log(err)
          this.$toast.fail('加载失败')
          this.loadMoreSelected=false
      })
    },
    judgeCommentOwner(identity,id){
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
    deleteComment(id){
      Dialog.confirm({
      title: '确认提示',
      message: '该评论将被删除'
      }).then(() => {
        this.$toast.loading({
            message: '删除中',
            forbidClick: true,
            duration: 0
        })
        request(true,{
            method: 'get',
            url: '/api/moment/delete_comment',
            params:{
                id
            }
        }).then(()=>{
            let index = 0
            for(let item of this.comment){
                if(item.id==id) break
                index++
            }
            this.comment.splice(index,1)
            this.$toast.clear()
        }).catch(err=>{
            console.log(err)
            this.$toast.clear()
            this.$toast.fail('操作失败')
        })
      }).catch(() => {
      // on cancel
      });
    }
  },
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
}
</script>
<style lang="stylus" scoped>
#bbs-detail
  display flex
  flex-direction column
  position fixed
  top 0px
  left 0px
  right 0px
  bottom 50px
  z-index 99
  .content-half
    background-color white
    flex 0
    .header
      background-color #1989fa
      height 40px
      .add
        position absolute
        right 10px
        top 10px
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
    .comment-content
      overflow auto
      .comment-wrapper
        .comment
          padding 10px 0
          display flex
          border-bottom 1px inset gray
          .comment-user-avatar
            padding 5px
            flex 0
            text-align center
            font-size 20px
          .comment-main
            flex 1
            padding 5px
            .comment-time
              font-size 15px
              color #96979c
            .comment-content
              font-size 15px
          .delete
            color red
            font-size 15px
            vertical-align top
        .load-more
          color #5c959a
          font-size 15px
          text-align center
  .over-lay-half
    flex 1
    background-color rgba(80,80,80,.7)
</style>