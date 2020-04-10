<template>
  <div id="book-essay-history">
    <div class="essay-wrapper">
      <div class="essay-body" v-for="item in essayList" :key="item.id" @click="needMoreDetail(item)">
        <div class="essay-content van-ellipsis">{{item.essay_content}}</div>
        <div class="essay-status">
          <div class="user-avatar">
            <van-image width="25" height="25" round fit="cover" error-icon="user-circle-o"
              :src="computeAvatar(item.essay_user_avatar)" />
          </div>
          <div class="user-nickname">
            {{item.essay_user_nickname}}
          </div>
          <div class="essay-time">
            {{dateFormat(item.updated_at)}}
          </div>
          <div class="remove-essay">
            <van-button type="danger" size="mini" @click.stop="removeBooked(item)">取消收藏</van-button>
          </div>
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
import { request } from '../../../request/http'
import bbsDetail from 'components/bbs/bbsDetail'
  export default {
    data() {
      return {
        essayList: this.$store.getters.booked_moment.booked_moments,
        detailShow: false,
        comment:[],
        essay:{},
        now: new Date(),
      }
    },
    components:{
      bbsDetail
    },
    methods:{
      computeAvatar(avatar){
          let avatar_str = this.$imgServerUrl.concat(avatar).split(':')
          return avatar_str[0].concat(':',avatar_str[1])
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
      dateFormat: function(date){
        date = new Date(date)
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
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
      closeDetailAndRefresh(){
        this.detailShow=false
        this.$emit('needRefresh')
      },
      updateEssayAndRefresh(){
        this.$emit('needRefresh')
      },
    }
  }
</script>
<style lang="stylus" scoped>
#book-essay-history
  .essay-wrapper
    padding 10px
  .essay-body
    .essay-content
      font-weight bold
      font-size 20px
      padding-bottom 5px
    .essay-status
      display flex
      .user-avatar
        flex 0 0 25px
        padding-right 5px
      .user-nickname
        padding-right 5px
        height 25px
        line-height 25px
      .essay-time
        font-size 13px
        color gray
        flex 1
        height 25px
        line-height 25px
      
</style>