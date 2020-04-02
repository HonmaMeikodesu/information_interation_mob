<template>
  <div id="detail">
    <div class="official-header">
      <van-icon name="arrow-left" @click="closeDetail()" size="25px" class="close" color="white"/>
      <span class="header-title">推文详情</span>
    </div>
    <div class="official-content">
      <!-- <iframe :src="url" frameborder="0"></iframe> -->
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      title: '',
      content: '',
      attachment: [],
    }
  },
  props: ["url"],
  methods:{
    closeDetail(){
      this.$emit("detailclose",false)
    }
  }

}
</script>
<style lang="stylus" scoped>
#detail
  .official-header
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
  .official-content
    .title
      text-align center
    .content
      padding 0 5px
    .attachment-wrapper
      margin 5px 0

    
</style>