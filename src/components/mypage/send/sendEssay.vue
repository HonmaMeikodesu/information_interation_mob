<template>
  <div id="send-essay-history">
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
            <div class="delete-essay">
              <van-button type="danger" size="mini" @click.stop="deleteEssay(item.id)">删除</van-button>
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
import {Dialog} from 'vant'
export default {
  data(){
    return{
      essayList: this.$store.state.user_info.published.moments,
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
    closeDetailAndRefresh(){
      this.detailShow=false
      this.$emit('needRefresh')
    },
    updateEssayAndRefresh(){
      this.$emit('needRefresh')
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
    deleteEssay(id){
      Dialog.confirm({
      title: '确认提示',
      message: '您确定要删除该文章吗'
      }).then(() => {
        this.$toast.$loading('删除中')
        request(true,{
            method: 'get',
            url: '/api/moment/delete_essay',
            params:{
                id
            }
        }).then(()=>{
            let index = 0
            for(let item of this.essayList){
                if(item.id==id) break
                index++
            }
            this.essayList.splice(index,1)
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
    onRefresh(){
      request(true,{
          method: 'get',
          url: '/api/user/get_user_info'
      }).then(res=>{
          this.$store.state.user_info=res
          this.isLoading=false
          this.$emit('needRefresh')
      }).catch(err=>{
          console.log(err)
          this.$toast.fail('刷新失败')
          this.isLoading=false
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
#send-essay-history
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