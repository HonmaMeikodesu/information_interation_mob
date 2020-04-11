<template>
  <div id="book-oa-history">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="oa-wrapper">
        <div class="oa-body" v-for="item in oaList" :key="item.id" @click="needMoreDetail(item.id)">
          <div class="oa-content van-ellipsis">{{item.title}}</div>
          <div class="oa-status">
            <div class="department">
              {{item.department}}
            </div>
            <div class="oa-time">
              {{dateFormat(item.publish_date)}}
            </div>
            <div class="remove-oa">
              <van-button type="danger" size="mini" @click.stop="removeBooked(item)">取消收藏</van-button>
            </div>
          </div>
          <van-divider />
        </div>
      </div>
    </van-pull-refresh>
    <transition name="van-slide-down">
      <oadetail :id="id" v-show="oaDetailShow" @detailclose="oaDetailShow=$event"></oadetail>
    </transition>
  </div>
</template>
<script>
import oadetail from 'components/notice/oadetail'
import { request } from '../../../request/http'
export default {
  data(){
    return{
      oaList:this.$store.getters.booked_oa.booked_oa,
      id:'',
      oaDetailShow:false,
      isLoading:false,
    }
  },
  components:{
    oadetail
  },
  methods:{
    dateFormat: function(date){
      date = new Date(date)
      return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
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
          for(let i of this.$store.getters.booked_oa.booked_oa){
              if(i.id==item.id){
                  break
              }
              index++
          }
          this.$store.getters.booked_oa.booked_oa.splice(index,1)
      }).catch(err=>{
          console.log(err)
          this.$toast.fail('操作失败')
      })
    },
    needMoreDetail(id){
      this.id=id
      this.oaDetailShow=true
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
#book-oa-history
  .oa-wrapper
    padding 10px
  .oa-body
    .oa-content
      font-weight bold
      font-size 20px
      padding-bottom 5px
    .oa-status
      display flex
      .department
        padding-right 5px
        height 25px
        line-height 25px
      .oa-time
        font-size 13px
        color gray
        flex 1
        height 25px
        line-height 25px
</style>