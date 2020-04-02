<template>
  <div id="search-result">
    <div class="header">
      <van-icon name="arrow-left" @click="closeResult()" size="25px" class="close" color="white"/>
      <span class="title">查询结果</span>
    </div>
    <div class="content">
        <div v-for="item in searchList" :key="item.id">
          <div class="official-wrapper">
            <div class="official-id" style="display:none">{{item.id}}</div>
            <div class="official-title" @click="showOfficialDetail(item.id)">{{item.official_title}}</div>
            <div class="official-time">{{computePublishDate(item.created_at,item.updated_at)}}</div>
            <div class="department-wrapper">
              <div class="official-department">{{item.organization_name}}</div>
              <officialfollow :organization="item.organization_name"></officialfollow>
              <officialstar :item="item"></officialstar>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import officialstar from 'components/common/officialstar'
import officialfollow from 'components/common/officialfollow'
export default {
  data(){
    return {

    }
  },
  components:{
      officialstar,
      officialfollow
  },
  props: ["searchList"],
  methods:{
    showOfficialDetail(id) {
        this.$emit("show-result-detail",id)
    },
    closeResult(){
      this.$emit("searchresultclose",false)
    },
    computePublishDate(created,updated){
      const created_date = new Date(created)
      const updated_date = new Date(updated)
      created = `${created_date.getFullYear()}-${created_date.getMonth()+1}-${created_date.getDate()}`
      updated = `${updated_date.getFullYear()}-${updated_date.getMonth()+1}-${updated_date.getDate()}`
      return created==updated?created:'更新于'+updated
    },
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
    .official-wrapper
        background-color white
        border 1px solid gray
        box-shadow:0 0 1px 1px #87CEFA
        border-radius 4px
        position relative 
        width 90%
        margin 0 auto
        padding-bottom 5px
        margin 10px auto
        .official-title
            color #87CEFA
            padding 5px 5px 25px 5px
        .official-time
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
            .official-department
                display inline-block
</style>