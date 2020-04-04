<!--热搜功能和置顶文章功能后期再加上去-->
<template>
    <div id="bbs">
        <div class="test-client-height" style="position:fixed;top:0;bottom:0;width:100%;z-index=-999" ></div>
        <div class="header">
            <span class="title">信息圈</span>
            <van-icon name="add" class="add" size="20px" color="#359ce7" />
        </div>
        <div class="searchBar">
            <van-search v-model="keyword" placeholder="请输入搜索关键词" @focus="onFocus" @blur="onBlur"/>
        </div>
        <div class="searchOverLay" v-show="searchSelected"></div>
        <div class="bbsList">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                    <bbsItem :list="list" :now="now" @needMoreDetail="passBBSDetail=$event"></bbsItem>
                </van-list>
            </van-pull-refresh>
        </div>
        <div class="bbsDetail">
            <transition name="slide-down">
                <bbsDetail :list="[bbsDetail]" :comment="comment" :now="now" v-show="bbsDetailShow" @closedetail="bbsDetailShow=$event"></bbsDetail>
            </transition>
        </div>
    </div>
</template>
<script>
    import {request} from '../../request/http'
    import loading_mixin from 'components/loading'
    import bbsItem from 'components/bbs/bbsItem'
    import bbsDetail from 'components/bbs/bbsDetail'
    let row_start = 0
    let row_end = 15
    export default {
        name: 'bbs',
        data(){
            return{
                list: [],
                keyword: '',
                refreshing: false,
                loading: false,
                finished: false,
                searchSelected: false,
                bbsDetailShow: false,
                bbsDetail: {},
                comment: [],
                now: new Date(),
            }
        },
        components:{
            bbsItem,
            bbsDetail
        },
        computed: {
            passBBSDetail:{
                get:function(){
                    return this.bbsDetail
                },
                set:function(item){
                    this.bbsDetail=item
                    let id=item.id
                    request(true,{
                        method: 'get',
                        url: '/api/moment/get_details',
                        params:{
                            id
                        }
                    }).then(res=>{
                        this.comment=res.comment
                        this.bbsDetailShow=true
                    }).catch(err=>{
                        console.log(err)
                        this.$toast.fail('加载失败')
                    })
                }
            }
        },
        methods: {
            onLoad(){
                this.$toast.loading({
                    message:'加载中',
                    forbidClick: true,
                    duration: 0
                })
                request(true,{
                    method: 'get',
                    url: '/api/moment/get_all_list',
                    params: {
                        row_start,
                        row_end
                    }
                }).then(res=>{
                    if(res.essay.length==0) this.finished=true
                    res.essay.forEach(item=>{
                        this.list.push(item)
                    })
                    row_start+=16
                    row_end+=16
                    this.$toast.clear()
                    this.loading=false
                }).catch(err=>{
                    console.log(err)
                    this.$toast.clear()
                    this.$toast.fail('加载失败')
                    this.loading=false
                })
            },
            onRefresh(){
                this.now = new Date()
                let newStart = 0
                let newEnd = 15
                request(true,{
                    method: 'get',
                    url: '/api/moment/get_all_list',
                    params: {
                        row_start: newStart,
                        row_end: newEnd,
                    }
                }).then(res=>{
                    res=res.essay
                    if (res[0].id === this.list[0].id) {
                    this.refreshing = false;
                    return;
                    }
                    this.list = res
                    row_start = newStart+16
                    row_end = newEnd+16
                    this.refreshing = false;
                }).catch(err=>{
                    console.log(err);
                    this.loading = false;
                    this.$toast.fail("加载失败");
                    this.refreshing = false;
                })
            },
            onFocus(){
                this.searchSelected=true
            },
            onBlur(){
                this.searchSelected=false

            },
        },
        mixins: [loading_mixin]
    }
</script>
<style lang="stylus">
#bbs
    .header
        position relative
        height 30px
        width 100%
        .title
            display inline-block
            width 100%
            font-size 20px
            color #359ce7
            line-height 30px
            text-align center
        .add
            position absolute
            right 10px
            top 5px
    .searchBar
        .van-search
            padding 5px 6px
    .searchOverLay
        position fixed
        top 75px
        bottom 0
        left 0
        right 0
        z-index 99
        background-color rgba(80,80,80,.7)
    .bbsList
        position fixed
        top 75px
        bottom 50px
        left 0
        right 0
        background-color #f3f4f6
        overflow auto
        .essay-body-content-words
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
            width 200px
    .bbsDetail
        .slide-down-enter-active,.slide-down-leave-active
            transition all .5s ease 
        .slide-down-enter,.slide-down-leave-to
            transform translate3d(0,-100%,0)
</style>