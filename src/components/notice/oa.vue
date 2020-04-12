<template>
  <div id="oa">
    <van-search v-model="searchkeyword" placeholder="请输入搜索关键词" class="search" @focus="onFocus" @blur="onBlur"
      @search="onSearch" />
    <div v-show="searchSelected" class="searchOverLay"></div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" class="oa-list">
        <div v-for="item in list" :key="item.id">
          <div class="oa-wrapper">
            <div class="oa-id" style="display:none">{{item.id}}</div>
            <div class="oa-title" @click="showOaDetail(item.id)">{{item.title}}</div>
            <div class="oa-time">{{item.publishDate}}</div>
            <div class="department-wrapper">
              <div class="oa-department">{{item.department}}</div>
              <oafollow :department="item.department"></oafollow>
              <oastar :item="item"></oastar>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <transition name="slide">
      <oasearchresult class="search-result" @show-result-detail="showOaDetailInResult($event)" @searchresultclose="searchResultShow=$event" v-show="searchResultShow" v-bind:search-list="searchList"></oasearchresult>
    </transition>
    <transition name="slide">
      <oadetail :id="id" v-show="oaDetailShow" @detailclose="oaDetailShow=$event"></oadetail>
    </transition>
  </div>
</template>
<script>
  import {
    request
  } from "../../request/http"
  import loading_mixin from "components/loading"
  import oafollow from "components/common/oafollow"
  import oastar from 'components/common/oastar'
  import oadetail from 'components/notice/oadetail'
  import oasearchresult from 'components/notice/oasearchresult'
  let row_start = 0;
  let row_end = 19;
  export default {
    name: "oa",
    data() {
      return {
        searchkeyword: "",
        searchSelected: false,
        searchResultShow: false,
        oaDetailShow: false,
        list: [],
        searchList: [],
        loading: false,
        finished: false,
        followed: false,
        star: false,
        refreshing: false,
        id: 1,
      };
    },
    components:{
      oafollow,
      oastar,
      oadetail,
      oasearchresult
    },
    methods: {
      onLoad() {
        this.$toast.$loading('加载中')
        request(false, {
            method: "get",
            url: "api/oauth/oa/list",
            params: {
              row_start,
              row_end
            }
          })
          .then(res => {
            if(res.length === 0) this.finished = true
            res.forEach(item => {
              this.list.push(item);
            });
            this.loading = false;
            row_start += 20;
            row_end += 20;
            this.$toast.clear();
          })
          .catch(err => {
            console.log(err);
            this.loading = false;
            this.$toast.clear();
            this.$toast.fail("加载失败");
          });
      },
      onRefresh() {
        let newStart = 0
        let newEnd = 19
        request(false, {
            method: "get",
            url: "api/oauth/oa/list",
            params: {
              row_start: newStart,
              row_end: newEnd
            }
          })
          .then(res => {
            if (res[0].id === this.list[0].id) {
              this.refreshing = false;
              return;
            }
            // const gap = res[0].id - this.list[0].id;
            // const newOa = res.slice(0, gap - 1);
            // this.list = newOa.concat(this.list);
            this.list = res
            row_start = newStart+20
            row_end = newEnd+20
            this.refreshing = false;
          })
          .catch(err => {
            console.log(err);
            this.loading = false;
            this.$toast.fail("加载失败");
            this.refreshing = false;
          });
      },
      onSearch(keyword) {
        request(false, {
          method: "post",
          url: "/api/oauth/oa/search",
          data: {
            ncs_keyword: keyword
          }
        }).then(res => {
          res.sort(function(a,b){
            const v1 = new Date(a["publish_date"])
            const v2 = new Date(b["publish_date"])
            return v2 - v1
          })
          this.searchList = res
          this.searchResultShow = true;
        });
      },
      onFocus() {
        this.searchSelected = true;
      },
      onBlur() {
        this.searchSelected = false;
      },
      showOaDetail(id) {
        this.id=id
        this.oaDetailShow=true
      },
      showOaDetailInResult(id){
        this.id=id
        this.oaDetailShow=true
      }
    },
    mixins: [loading_mixin]
  };
</script>
<style lang="stylus" scoped>
#oa
    .slide-enter-active,.slide-leave-active
        transition all .5s ease 
    .slide-enter,.slide-leave-to
        transform translate3d(100%,0,0)
    .searchOverLay
        position fixed
        width 100%
        top 84px
        bottom 0
        left 0
        right 0
        z-index 99
        background-color rgba(80,80,80,.7)
    .search-result
        position fixed
        width 100%
        top 0
        bottom 50px
        left 0
        right 0
        z-index 50
        background-color #f3f4f6
        overflow auto
    .oa-list
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