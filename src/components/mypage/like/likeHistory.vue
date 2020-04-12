<template>
  <div id="like-essay-history">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="essay-wrapper">
        <div class="essay-content" v-for="item in essayList" :key="item.id" @click="needMoreDetail(item)">
          <div class="essay-title">
            <div class="van-ellipsis">{{item.essay_content}}</div>
          </div>
          <div class="essay-other-options">
            <div class="essay-status">
              <div class="thumbs-up">
                  <van-icon name="thumb-circle" color="rgb(150,150,150)"/>
                  <span>{{item.thumbsup_num}}</span>
              </div>
              <div class="booked">
                  <van-icon name="star" color="rgb(150,150,150)"/>
                  <span>{{item.bookmarked_num}}</span>
              </div>
              <div class="comment">
                  <van-icon name="comment-circle" color="rgb(150,150,150)"/>
                  <span>{{item.review_num}}</span>
              </div>
              <div class="essay-time">
                <span>{{dateFormat(item.updated_at)}}</span>
              </div>
            </div>
            <div class="remove-like">
              <van-button type="danger" size="mini" @click.stop="removeLike(item)">取消点赞</van-button>
            </div>
          </div>
          <van-divider />
        </div>
      </div>
      <div style="width:100%;text-align:center;color:gray;padding:5px">到底了喔~</div>
    </van-pull-refresh>
    <transition name="van-slide-down">
      <bbsDetail :list="[essay]" :comment="comment" :now="now" v-show="detailShow" @closeDetailAndRefresh="closeDetailAndRefresh" @updateEssayAndRefresh='updateEssayAndRefresh' @closedetail="detailShow=$event"></bbsDetail>
    </transition>
  </div>
</template>
<script>
import bbsDetail from 'components/bbs/bbsDetail'
import { request } from '../../../request/http'
export default {
  data(){
    return{
      essayList: this.$store.state.user_info.liked.moments,
      essay: {},
      comment: [],
      now: new Date(),
      detailShow: false,
      isLoading: false,
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
    judgeEssayOwner(id,identity){
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
    closeDetailAndRefresh(){
      this.detailShow=false
      this.$options.methods.onRefresh.call(this)
    },
    updateEssayAndRefresh(){
      this.$options.methods.onRefresh.call(this)
    },
    needMoreDetail(item){
      this.essay=item
      let id = item.id
      request(true,{
          method: 'get',
          url: '/api/moment/get_details',
          params:{
              id
          }
      }).then(res=>{
          this.comment=res.comment
          this.detailShow=true
      }).catch(err=>{
          console.log(err)
          this.$toast.fail('加载失败')
      })
    },
    onRefresh(){
        request(true,{
            method: 'get',
            url: '/api/user/get_user_info'
        }).then(res=>{
            this.$store.state.user_info=res
            this.essayList=res.liked.moments
            this.isLoading=false
        }).catch(err=>{
            console.log(err)
            this.$toast.fail('刷新失败')
            this.isLoading=false
        })
    },
    removeLike(item){
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
          this.$store.getters.liked.moments.splice(index,1)
      }).catch(err=>{
          console.log(err)
          this.$toast.fail('操作失败')
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
#like-essay-history
  .essay-wrapper
    padding 10px
    .essay-content
      padding 5px 0px
      .essay-title
        font-size 20px
        font-weight bold
        display inline-block
        width 100%
      .essay-other-options
        display flex
        .essay-status
          flex 1
          display flex
          span 
            padding 0px 2px
          .essay-time
            padding-left 10px
            color gray
        .delete-essay
          padding-right 15px
        
</style>