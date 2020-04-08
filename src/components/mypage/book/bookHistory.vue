<template>
  <div id="book-history">
    <div class="book-history-top-bar">
      <van-tabs v-model="bookHistorySelect" title-active-color="rgb(53,156,231)" color="rgb(53,156,231)">
          <van-tab class="oa-history" title="OA" to="/mypage/book/oa"></van-tab>
          <van-tab class="essay-history" title="文章" to="/mypage/book/essay"></van-tab>
          <van-tab class="official-history" title="推文" to="/mypage/book/official"></van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      bookHistorySelect:'1',
    }
  },
}
</script>
<style lang="stylus" scoped>

</style>