<template>
  <div id="book-official-history">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="official-wrapper">
        <div class="official-body" v-for="item in officialList" :key="item.id" @click="needMoreDetail(item.official_url)">
          <div class="official-content van-ellipsis">{{item.official_title}}</div>
          <div class="official-status">
            <div class="user-nickname">
              {{item.organization_name}}
            </div>
            <div class="official-time">
              {{dateFormat(item.updated_at)}}
            </div>
            <div class="remove-official">
              <van-button type="danger" size="mini" @click.stop="removeBooked(item)">取消收藏</van-button>
            </div>
          </div>
          <van-divider />
        </div>
      </div>
      <div style="width:100%;text-align:center;color:gray;padding:5px">到底了喔~</div>
    </van-pull-refresh>
    <transition name="van-slide-down">
      <officialdetail :url="url" v-show="officialDetailShow" @detailclose="officialDetailShow=$event"></officialdetail>
    </transition>
  </div>
</template>
<script>
import { request } from '../../../request/http'
import officialdetail from 'components/notice/officialdetail'
  export default {
    data() {
      return {
        url:'',
        officialList: this.$store.getters.booked_official.booked_official,
        officialDetailShow: false,
        isLoading: false
      }
    },
    components:{
      officialdetail
    },
    methods:{
      removeBooked(item){
          request(true,{
              method: 'get',
              url: '/api/moment/book',
              params: {
                  from: 'official',
                  message_id: item.id
              }
          }).then(()=>{
              let index = 0
              for(let i of this.$store.getters.booked_official.booked_official){
                  if(i.id==item.id){
                      break
                  }
                  index++
              }
              this.$store.getters.booked_official.booked_official.splice(index,1)
          }).catch(err=>{
              console.log(err)
              this.$toast.fail('操作失败')
          })
      },
      dateFormat: function(date){
        date = new Date(date)
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
      },
      needMoreDetail(url){
        this.url=url
        this.officialDetailShow=true
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
    },
    mounted(){
      this.$el.getElementsByClassName('official-detail-root')[0].style.top='0px'
    }
  }
</script>
<style lang="stylus" scoped>
#book-official-history
  .official-wrapper
    padding 10px
  .official-body
    .official-content
      font-weight bold
      font-size 20px
      padding-bottom 5px
    .official-status
      display flex
      .user-nickname
        padding-right 5px
      .official-time
        font-size 13px
        color gray
        flex 1
        height 25px
        line-height 25px
      
</style>