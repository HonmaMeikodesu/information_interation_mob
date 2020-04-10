<template>
  <div id="bbs-detail">
    <otherUserInfo :show="show" :other_info="other_info" :other_identity="other_identity"></otherUserInfo>
    <div class="content-half">
      <div class="header">
        <van-icon name="arrow-left" @click="closeDetail()" size="25px" class="close" color="white"/>
        <span class="header-title">文章详情</span>
        <van-icon name="add" class="add" size="20px" color="#f3f4f6" @click="sendCommentSelected=true" />
      </div>
      <div class="comment-content" @click="sendCommentSelected=false">
        <bbsItem :list="list" :now="now" @essayDeleted="closeDetailAndRefresh" @updateEssayAndRefresh='updateEssayAndRefresh'></bbsItem>
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
    <div class="send-comment" v-show="sendCommentSelected">
      <van-field
      v-model="commentToSend"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="评论一下~"
      show-word-limit
      >
        <template #button>
          <van-button size="small" color="#1989fa" @click="sendComment">发送</van-button>
        </template>
      </van-field>
    </div>
  </div>
</template>
<script>
import bbsItem from 'components/bbs/bbsItem'
import {request} from '../../request/http'
import {Dialog} from 'vant'
import otherUserInfo from 'components/bbs/otherUserInfo'
export default {
  data(){
    return{
      imgServerUrl:'http://cdn.xv1998.cn/',
      other_identity: '',
      other_info: {},
      show: {flag:false},
      loadMoreSelected: false,
      sendCommentSelected: false,
      commentToSend: '',
    }
  },
  props:['list','comment',"now"],
  components:{
    bbsItem,
    otherUserInfo
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
      if(this.sendCommentSelected===true){
        this.sendCommentSelected=false
        return
      }
      this.$el.getElementsByClassName('comment-content')[0].style.height = ''
      this.$emit('closedetail',false)
    },
    computeAvatar(avatar){
        let avatar_str = this.imgServerUrl.concat(avatar).split(':')
        return avatar_str[0].concat(':',avatar_str[1])
    },
    showUserInfo(identity,user_id){
        this.other_identity=identity
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
            this.show.flag=true
        }).catch(err=>{
            console.log(err)
            this.$toast.fail('操作失败')
            this.show.flag=false
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
            this.$emit('commentDecrease',this.list[0].id)
        }).catch(err=>{
            console.log(err)
            this.$toast.clear()
            this.$toast.fail('操作失败')
        })
      }).catch(() => {
      // on cancel
      });
    },
    sendComment(){
      if(this.commentToSend===''){
        this.$toast.fail('评论不能为空')
        return
      }
      this.$toast.loading({
        message:'发送中',
        forbidClick: true,
        duration: 0
      })
      let identity = this.$store.getters.identity
      request(true,{
        method: 'get',
        url: '/api/moment/comment',
        params:{
          essay_id: this.list[0].id,
          content: this.commentToSend, // vue自动对<,>等敏感字符做转义，防止XSS
          avatar: (identity==='student')?this.$store.getters.basisInfo.avatar_url:this.$store.getters.organization_basisInfo.avatar_url,
          nickname: (identity==='student')?this.$store.getters.basisInfo.nickname:this.$store.getters.organization_basisInfo.organization_name
        }
      }).then(()=>{
        this.$toast.clear()
        this.$options.methods.loadMore.call(this,this.list[0].id)
        this.$toast.success('发送成功')
        this.$emit('commentIncrease',this.list[0].id)
        let nickname = (identity==='student')?this.$store.getters.basisInfo.nickname:this.$store.getters.organization_basisInfo.organization_name
        this.$store.state.moment_socket.emit('send_comment',
        {nickname,content:this.commentToSend,essay_id:this.list[0].id})
        this.commentToSend=''
      }).catch(err=>{
        console.log(err)
        this.$toast.clear()
        this.$toast.fail('发送失败')
      })
    },
    closeDetailAndRefresh(){
      this.$emit('closeDetailAndRefresh')
    },
    updateEssayAndRefresh(){
      this.$emit('updateEssayAndRefresh')
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
  .send-comment
    position fixed
    z-index 99
    bottom 0px
    left 0px
    right 0px
</style>