<template>
  <div id="app">
      <router-view />
    <van-tabbar route>
      <van-tabbar-item replace to="/notice" icon="newspaper-o">
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
    created(){
      this.$router.push('/login')
    }
  }
</script>

<style>

</style>