<template>
  <div id="send-history">
    <div class="send-history-top-bar">
      <van-tabs v-model="sendHistorySelect" title-active-color="rgb(53,156,231)" color="rgb(53,156,231)">
          <van-tab class="essay-history" title="文章" to="/mypage/send/essay"></van-tab>
          <van-tab class="comment-history" title="评论" to="/mypage/send/comment"></van-tab>
          <van-tab class="official-history" title="推文" to="/mypage/send/official" v-if="judgeOrganization"></van-tab>
      </van-tabs>
    </div>
    <div class="send-history-content">
      <router-view @needRefresh="onRefresh()" v-if="reRender"></router-view>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      isLoading: false,
      reRender: true,
    }
  },
  computed:{
    sendHistorySelect(){
      if(/^\/mypage\/send\/essay/.test(this.$route.path))
        return 0
      else if(/^\/mypage\/send\/comment/.test(this.$route.path))
        return 1
      else return 2
    },
    judgeOrganization(){
      if(this.$store.getters.identity==='student') return false
      return true
    }
  },
  methods:{
    onRefresh(){
      this.reRender=false
      this.$nextTick(function(){
        this.reRender=true
      })
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>