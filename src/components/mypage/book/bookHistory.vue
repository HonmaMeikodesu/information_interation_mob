<template>
  <div id="book-history">
    <div class="book-history-top-bar">
      <van-tabs v-model="bookHistorySelect" title-active-color="rgb(53,156,231)" color="rgb(53,156,231)">
          <van-tab class="oa-history" title="OA" to="/mypage/book/oa"></van-tab>
          <van-tab class="essay-history" title="文章" to="/mypage/book/essay"></van-tab>
          <van-tab class="official-history" title="推文" to="/mypage/book/official"></van-tab>
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
      isLoading:false,
      reRender:true,
    }
  },
  computed:{
    bookHistorySelect(){
      if(/^\/mypage\/book\/oa/.test(this.$route.path))
        return 0
      else if(/^\/mypage\/book\/essay/.test(this.$route.path))
        return 1
      else return 2
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