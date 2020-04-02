<template>
  <div id="detail">
    <div class="oa-header">
      <van-icon name="arrow-left" @click="closeDetail()" size="25px" class="close" color="white"/>
      <span class="header-title">OA详情</span>
    </div>
    <div class="oa-content">
      <h1 class="title">{{title}}</h1>
      <div class="content" v-html="content"></div>
      <div class="attachment" v-if="attachment">
        <div class="attachment-wrapper" v-for="item in attachment" :key="item.url">
          <van-icon name="column" size="20px"/>
          <a :href="item.url" style="vertical-align:top">{{item.name}}</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {request} from '../../request/http'
export default {
  data(){
    return {
      title: '',
      content: '',
      attachment: [],
    }
  },
  props: ["id"],
  watch: {
    id: function(newID){
      this.$toast.loading({
        message:'加载中',
        forbidClick: true,
        duration: 0
      })
      request(false,{
        method: 'get',
        url: '/api/oauth/oa/details',
        params: {
          id: newID
        }
      }).then(res=>{
        this.title=res.title
        this.content=res.content
        this.attachment=res.attachment
        this.$toast.clear()
      }).catch(err=>{
        console.log(err)
        this.$toast.clear()
        this.$toast.fail('加载失败')
      })
    }
  },
  methods:{
    closeDetail(){
      this.$emit("detailclose",false)
    }
  }

}
</script>
<style lang="stylus" scoped>
#detail
  .oa-header
    background-color #1989fa
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
  .oa-content
    .title
      text-align center
    .content
      padding 0 5px
    .attachment-wrapper
      margin 5px 0

    
</style>