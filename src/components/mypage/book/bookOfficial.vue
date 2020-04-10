<template>
  <div id="book-official-history">
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