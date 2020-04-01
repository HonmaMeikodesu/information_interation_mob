<template>
    <div id="oa">
        <van-search v-model="searchkeyword" placeholder="请输入搜索关键词" class="search" @focus="onFocus" @blur="onBlur" @search="onSearch" />
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <div v-show="searchSelected" class="searchOverLay"></div>
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" class="oa-list">
                <div v-for="item in list" :key="item.id">
                    <div class="oa-wrapper" @click="showOaDetail(item.id)">
                        <div class="oa-id" style="display:none">{{item.id}}</div>
                        <div class="oa-title">{{item.title}}</div>
                        <div class="oa-time">{{item.publishDate}}</div>
                        <div class="department-wrapper">
                            <div class="oa-department">{{item.department}}</div>
                            <van-icon :name='followJudge(item.department)?"add":"add-o"' @click="followToggle(item.department,$event)" class="follow"/>
                            <van-icon :name='starJudge(item.id)?"star":"star-o"' @click="starToggle(item,$event)" class="star"/>
                        </div>
                    </div>
                </div>
            </van-list>
        </van-pull-refresh>
        <transition name="slide">
            <div class="search-result" v-show="searchResultShow">12</div>
        </transition>
        <transition name="slide">
            <div class="oa-detail" v-show="oaDetailShow">123</div>
        </transition>
    </div>
</template>
<script>
    import {
        request
    } from '../../request/http'
    import loading_mixin from 'components/loading'
    let row_start = 1
    let row_end = 20
    export default {
        name: 'oa',
        data() {
            return {
                searchkeyword: '',
                searchSelected: false,
                searchResultShow: false,
                oaDetailShow: false,
                list: [],
                loading: false,
                finished: false,
                followed: false,
                star: false,
                refreshing: false
            }
        },
        methods: {
            onLoad() {
                this.$toast.loading({
                    message: '加载中',
                    forbidClick: true,
                    duration: 0
                })
                request(false, {
                    method: 'get',
                    url: 'api/oauth/oa/list',
                    params: {
                        row_start,
                        row_end,
                    }
                }).then(res => {
                    res.forEach(item => {
                        this.list.push(item)
                    })
                    this.loading = false
                    row_start += 20
                    row_end += 20
                    this.$toast.clear()
                }).catch(err => {
                    console.log(err)
                    this.loading = false
                    this.$toast.clear()
                    this.$toast.fail('加载失败')
                })
            },
            followJudge(name){
                name= 'department/'+name
                if(this.$store.state.user_info.followList.includes(name)){
                    return true
                }else return false
            },
            starJudge(id){
                const id_list = []
                this.$store.state.user_info.booked_oa.booked_oa.forEach(item=>{
                    id_list.push(item.id)
                })
                if(id_list.includes(id)) return true
                return false
            },
            followToggle(name,event){
                let full_name= 'department/'+name
                if(this.followJudge(name)){
                    event.target.setAttribute("name","add-o")
                    request(true,{
                        url: '/api/user/unfollow',
                        method: 'get',
                        params: {
                        follow_user_identity: 'department',
                        follow_user_id: name
                        }   
                    }).then(()=>{
                        this.$store.state.user_info.followList.splice(Array.prototype.indexOf(full_name),1)
                    }).catch(err=>{
                        console.log(err)
                        this.$toast.fail('操作失败')
                        event.target.setAttribute("name","add")
                    })
                }else{
                    event.target.setAttribute("name","add")
                    request(true,{
                        url: '/api/user/follow',
                        method: 'get',
                        params: {
                        follow_user_identity: 'department',
                        follow_user_id: name
                        }   
                    }).then(()=>{
                        this.$store.state.user_info.followList.push(full_name)
                    }).catch(err=>{
                        console.log(err)
                        this.$toast.fail('操作失败')
                        event.target.setAttribute("name","add-o")
                    })
                }
            },
            starToggle(oa,event){
                const{id} = oa
                request(true,{
                    url: '/api/moment/book',
                    method: 'get',
                    params: {
                        from: 'oa',
                        message_id: id
                    }
                }).then(()=>{
                    if(this.starJudge(id)){
                        let className = event.target.className.replace(/(van-icon-star)/,"van-icon-star-o")
                        event.target.setAttribute("class",className)
                        let index = 0
                        let ack
                        this.$store.state.user_info.booked_oa.booked_oa.forEach(item=>{
                            if(item.id!=id){
                                index++
                            }else{
                                ack = index
                            }
                        })
                        this.$store.state.user_info.booked_oa.booked_oa.splice(ack,1)
                    }else{
                        let className = event.target.className.replace(/(van-icon-star-o)/,"van-icon-star")
                        event.target.setAttribute("class",className)
                        this.$store.state.user_info.booked_oa.booked_oa.push(oa)
                    }
                }).catch(err=>{
                    console.log(err)
                    this.$toast.fail('操作失败')
                })
            },
            onRefresh(){
                request(false, {
                    method: 'get',
                    url: 'api/oauth/oa/list',
                    params: {
                        row_start: 1,
                        row_end: 20,
                    }
                }).then(res => {
                    if(res[0].id===this.list[0].id){
                        this.refreshing = false
                        return
                    }
                    const gap = res[0].id-this.list[0].id
                    const newOa = res.slice(0,gap-1)
                    this.list = newOa.concat(this.list)
                    this.refreshing = false
                }).catch(err => {
                    console.log(err)
                    this.loading = false
                    this.$toast.fail('加载失败')
                    this.refreshing = false
                })
            },
            onSearch(keyword) {
                this.searchResultShow=true
                request(false,{
                    method: 'get',
                    url: '/api/oauth/oa/search',
                    params: {
                        ncs_keyword: keyword
                    }
                }).then(res=>{
                    console.log(res)
                })
            },
            onFocus() {
                this.searchSelected = true
            },
            onBlur(){
                this.searchSelected = false
            },
            showOaDetail(id){
                console.log(id)
                
            }
        },
        mixins: [loading_mixin],
    }
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
        top 84px
        bottom 0
        left 0
        right 0
        z-index 99
        background-color #f3f4f6
    .oa-detail
        position fixed
        width 100%
        top 84px
        bottom 0
        left 0
        right 0
        z-index 99
        background-color #f3f4f6
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