<template>
    <div id="official">
        <van-search v-model="searchkeyword" placeholder="请输入搜索关键词" class="search" @focus="onFocus" @blur="onBlur"
        @search="onSearch" />
        <div v-show="searchSelected" class="searchOverLay"></div>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" class="official-list">
            <div v-for="item in list" :key="item.id">
              <div class="official-wrapper">
                  <div class="official-id" style="display:none">{{item.id}}</div>
                  <div class="official-title" @click="showOfficialDetail(item.official_url)">{{item.official_title}}</div>
                  <div class="official-time">{{computePublishDate(item.created_at,item.updated_at)}}</div>
                  <div class="publisher-wrapper">
                      <div class="official-organization">{{item.organization_name}}</div>
                      <officialfollow :organization="item.organization_name"></officialfollow>
                      <officialstar :item="item"></officialstar>
                  </div>
              </div>
            </div>
        </van-list>
        </van-pull-refresh>
        <transition name="slide">
          <officialdetail :url="url" v-show="officialDetailShow" @detailclose="officialDetailShow=$event"></officialdetail>
        </transition>
        <transition name="slide">
          <officialsearchresult class="search-result" @show-result-detail="showOfficialDetailInResult($event)" @searchresultclose="searchResultShow=$event" v-show="searchResultShow" v-bind:search-list="searchList"></officialsearchresult>
        </transition>
    </div>
</template>
<script>
  import {
    request
  } from "../../request/http"
  import officialfollow from 'components/common/officialfollow'
  import officialstar from 'components/common/officialstar'
  import officialdetail from 'components/notice/officialdetail'
  import officialsearchresult from 'components/notice/officialsearchresult'
  import loading_mixin from "components/loading"
  let row_start = 1;
  let row_end = 20;
  export default {
    name: "official",
    data() {
      return {
        searchkeyword: "",
        searchSelected: false,
        searchResultShow: false,
        officialDetailShow: false,
        list: [],
        searchList: [],
        loading: false,
        finished: false,
        followed: false,
        star: false,
        refreshing: false,
        url: '',
      };
    },
    components:{
      officialfollow,
      officialstar,
      officialdetail,
      officialsearchresult
    },
    methods: {
      computePublishDate(created,updated){
        const created_date = new Date(created)
        const updated_date = new Date(updated)
        created = `${created_date.getFullYear()}-${created_date.getMonth()+1}-${created_date.getDate()}`
        updated = `${updated_date.getFullYear()}-${updated_date.getMonth()+1}-${updated_date.getDate()}`
        return created==updated?created:'更新于'+updated
      },
      onLoad() {
        this.$toast.$loading('加载中')
        request(true, {
            method: "get",
            url: "api/official/get_all_list",
            params: {
              row_start,
              row_end
            }
          })
          .then(res => {
            if(res.officialList.length===0) this.finished = true
            res.officialList.forEach(item => {
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
        let newStart = 1
        let newEnd = 20
        request(true, {
            method: "get",
            url: "api/official/get_all_list",
            params: {
              row_start: newStart,
              row_end: newEnd
            }
          })
          .then(res => {
            res = res.officialList
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
        request(true, {
          method: "get",
          url: "/api/official/search",
          params: {
            ncs_keyword: keyword
          }
        }).then(res => {
          this.searchList = res.officialList
          this.searchResultShow = true;
        });
      },
      onFocus() {
        this.searchSelected = true;
      },
      onBlur() {
        this.searchSelected = false;
      },
      showOfficialDetail(url) {
        this.url=url
        this.officialDetailShow=true
      },
      showOfficialDetailInResult(url){
        this.url=url
        this.officialDetailShow=true
      }
    },
    mixins: [loading_mixin]
  }
</script>
<style lang="stylus" scoped>
#official
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
    .official-list
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
            .publisher-wrapper
                font-size 15px
                position absolute
                bottom 3px
                right 5px
                > i
                    padding 0 3px
                .official-organization
                    display inline-block
</style>