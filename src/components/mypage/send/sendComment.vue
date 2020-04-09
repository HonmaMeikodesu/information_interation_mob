<template>
  <div id="send-comment-history">
    <div class="comment-wrapper">
      <div class="comment-body" v-for="item in commentList" :key="item.id" @click="needMoreDetail(item)">
        <div class="comment-time">{{dateFormat(item.commentPublishedTime)}}</div>
        <div class="comment-content van-ellipsis">{{item.comment_content}}</div>
        <div class="essay-wrapper">
          <div class="essay-author-avatar">
            <van-image
            :src="computeAvatar(item.essay_user_avatar)"
            error-icon="user-circle-o"
            cover
            width="80"
            height="80"
            ></van-image>
          </div>
          <div class="essay-body">
            <div class="essay-author-name">@{{item.essay_user_nickname}}</div>
            <div class="essay-content van-ellipsis">{{item.essay_content}}</div>
          </div>
        </div>
        <div class="delete-comment">
          <van-button type="danger" size="mini" @click.stop="deleteComment(item.commentID)">删除</van-button>
        </div>
        <van-divider />
      </div>
    </div>
    <transition name="van-slide-down">
      <bbsDetail :list="[essay]" :comment="comment" :now="now" v-show="detailShow" @closeDetailAndRefresh="closeDetailAndRefresh" @updateEssayAndRefresh='updateEssayAndRefresh' @closedetail="detailShow=$event"></bbsDetail>
    </transition>
  </div>
</template>
<script>
import bbsDetail from 'components/bbs/bbsDetail'
import { request } from '../../../request/http'
import {Dialog} from 'vant'
export default {
  data(){
    return{
      commentList: this.$store.getters.comment.comments,
      essay: {},
      comment: [],
      now: new Date(),
      detailShow: false,
    }
  },
  components:{
    bbsDetail
  },
  methods:{
    dateFormat: function(date){
      date = new Date(date)
      return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    },
    computeAvatar(avatar){
        let avatar_str = this.$imgServerUrl.concat(avatar).split(':')
        return avatar_str[0].concat(':',avatar_str[1])
    },
    closeDetailAndRefresh(){
      this.detailShow=false
      this.$emit('needRefresh')
    },
    updateEssayAndRefresh(){
      this.$emit('needRefresh')
    },
    needMoreDetail(item){
      let id = item.essayID
      request(true,{
          method: 'get',
          url: '/api/moment/get_details',
          params:{
              id
          }
      }).then(res=>{
          this.essay=res.article[0]
          this.comment=res.comment
          this.detailShow=true
      }).catch(err=>{
          console.log(err)
          this.$toast.fail('加载失败')
      })
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
            for(let item of this.commentList){
                if(item.commentID==id) break
                index++
            }
            this.commentList.splice(index,1)
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
  }
}
</script>
<style lang="stylus" scoped>
#send-comment-history
  .comment-wrapper
    margin 10px
    .comment-body
      position relative
      .comment-time
        font-size 15px
        color gray
      .comment-content
        margin 5px 0px
      .essay-wrapper
        display flex
        background-color rgb(243,244,246)
        height 80px
        .essay-body
          flex 1
          font-size 15px
          .essay-author-name
            padding 10px 0px 5px 10px
          .essay-content
            width 200px
            padding 5px 0px 10px 10px
      .delete-comment
        position absolute
        right 0px
        top 10px
          

      
</style>