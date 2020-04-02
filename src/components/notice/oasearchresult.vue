<template>
  <div id="search-result">
    <div class="header">
      <van-icon name="arrow-left" @click="closeResult()" size="25px" class="close" color="white"/>
      <span class="title">查询结果</span>
    </div>
    <div class="content">
        <div v-for="item in searchList" :key="item.id">
          <div class="oa-wrapper">
            <div class="oa-id" style="display:none">{{item.id}}</div>
            <div class="oa-title" @click="showOaDetail(item.id)">{{item.title}}</div>
            <div class="oa-time">{{ dateFormat(item.publish_date) }}</div>
            <div class="department-wrapper">
              <div class="oa-department">{{item.department}}</div>
              <oastar :item="item"></oastar>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import oastar from 'components/common/oastar'
export default {
  data(){
    return {

    }
  },
  components:{
      oastar
  },
  props: ["searchList"],
  methods:{
    showOaDetail(id) {
        this.$emit("show-result-detail",id)
    },
    closeResult(){
      this.$emit("searchresultclose",false)
    },
    dateFormat: function(date){
    date = new Date(date)
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    }
  },
}
</script>
<style lang="stylus" scoped>
#search-result
  .header
    background-color #1989fa
    .close
      position absolute
      left 5px
      top 7.5px
    .title
      display inline-block
      width 100%
      height 40px
      line-height 40px
      text-align center
      color white
      font-weight 80px
  .content
    .oa-wrapper
        background-color white
        border 1px solid gray
        box-shadow:0 0 1px 1px #87CEFA
        border-radius 4px
        position relative 
        width 90%
        margin 0 auto
        padding-bottom 5px
        margin 10px auto
        .oa-title
            color #87CEFA
            padding 5px 5px 25px 5px
        .oa-time
            color #868080
            font-size 10px
            position absolute
            bottom 3px
            left 5px
        .department-wrapper
            font-size 15px
            position absolute
            bottom 3px
            right 5px
            > i
                padding 0 3px
            .oa-department
                display inline-block

    
</style>