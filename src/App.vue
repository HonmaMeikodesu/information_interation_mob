<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
    <van-tabbar route class="footer">
      <van-tabbar-item replace to="/notice/oa" icon="newspaper-o">
        资讯
      </van-tabbar-item>
      <van-tabbar-item replace to="/bbs" icon="home-o">
        信息
      </van-tabbar-item>
      <van-tabbar-item replace to="/mypage" icon="user-o">
        我的
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
  export default {
    name: 'app',
    components: {

    },
    created() {
      this.$router.push('/login')
    }
  }
</script>

<style lang="stylus" scoped>
#app 
  .footer
    position fixed
    bottom 0
    box-shadow 1 1 1 1
</style>