<template>
  <div id="option">
    <div class="header">
      <van-icon name="arrow-left" @click="closeOption()" size="25px" class="close" color="white"/>
      <span class="header-title">个人设置</span>
    </div>
    <div class="option-content" @click="logout">
      <div class="logout">
        <van-cell title="退出登录" icon="close" />
      </div>
    </div>
  </div>
</template>
<script>
import {Dialog} from 'vant'
export default {
  data(){
    return{

    }
  },
  methods:{
    closeOption(){
      this.$emit('closeOption',false)
    },
    logout(){
      Dialog.confirm({
      title: '确认提示',
      message: '即将进行注销'
      }).then(() => {
        let login_state = 'login_state'
        localStorage.removeItem(login_state)
        this.$router.go(0)
      }).catch(() => {
      // on cancel
      });

    }
  }
}
</script>
<style lang="stylus" scoped>
#option
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  z-index 99
  background-color white
  .header
    background-color #1989fa
    height 40px
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
</style>