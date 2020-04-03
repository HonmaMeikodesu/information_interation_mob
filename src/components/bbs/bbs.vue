<!--热搜功能和置顶文章功能后期再加上去-->
<template>
    <div id="bbs">
        <div class="header">
            <span class="title">信息圈</span>
            <van-icon name="add" class="add" size="20px" color="#359ce7" />
        </div>
        <div class="searchBar">
            <van-search v-model="keyword" placeholder="请输入搜索关键词" @focus="onFocus" @blur="onBlur"/>
        </div>
        <div class="searchOverLay" v-show="searchSelected"></div>
        <van-overlay :show="showFullImg" @click="showFullImg = false">
            <div class="full-img-wrapper">
                <van-image :src="fullImgUrl" cover></van-image>
            </div>
        </van-overlay>
        <div class="bbsList">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                            <div class="essay-wrapper" v-for="item in list" :key="item.id">
                                <div class="essay-id" v-show="false">{{item.id}}</div>
                                <div class="essay-avatar">
                                    <van-image
                                    width="65"
                                    height="65"
                                    round
                                    fit="cover"
                                    error-icon="user-circle-o"
                                    :src="computeAvatar(item.essay_user_avatar)"
                                    />
                                    <van-tag class="follow-status" type="success" size="medium" color="#359ce7">+关注</van-tag>
                                </div>
                                <div class="essay-body">
                                    <div class="essay-body-info">
                                        <div class="essay-body-info-author-name">{{item.essay_user_nickname}}</div>
                                        <div class="essay-body-info-time">{{computePublishTime(item.updated_at)}}</div>
                                        <div class="essay-body-info-edited" v-if="!(item.created_at==item.updated_at)">
                                            <span class="essay-body-info-edited-hint">已被编辑过</span>
                                            <van-tag mark type="primary" class="essay-body-info-edited-history">查看编辑记录</van-tag>
                                        </div>
                                    </div>
                                    <div class="essay-body-content">
                                        <div class="essay-body-content-words">{{item.essay_content}}</div>
                                    </div>
                                    <div class="essay-body-image">
                                        <van-image 
                                        v-for="img in filterImgArr(item.essay_user_image_url)" 
                                        :key="img"
                                        :src="imgServerUrl.concat(img)"
                                        width="100px"
                                        height="100px"
                                        cover
                                        @click="switchFullImg(imgServerUrl.concat(img))"
                                        >
                                        </van-image>
                                    </div>
                                    <div class="essay-status">
                                        <div class="thumbs-up">
                                            <van-icon name="thumb-circle-o" />
                                            <span>{{item.thumbsup_num}}</span>
                                        </div>
                                        <div class="booked">
                                            <van-icon name="star-o" />
                                            <span>{{item.bookmarked_num}}</span>
                                        </div>
                                        <div class="comment">
                                            <van-icon name="comment-circle-o" />
                                            <span>{{item.review_num}}</span>
                                        </div>
                                        <div class="delete" v-if="juegeEssayOwner(item.essay_user_id,item.essay_user_identity)">
                                            <van-icon name="cross" color="red"/>
                                            <span>删除文章</span>
                                        </div>
                                    </div>
                                </div>
                            </div>           
                </van-list>
            </van-pull-refresh>
        </div>
        <div class="bbsDetail">

        </div>
    </div>
</template>
<script>
    let row_start=0
    let row_end=15
    import {request} from '../../request/http'
    import loading_mixin from 'components/loading'
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
                imgServerUrl:'http://cdn.xv1998.cn/',
                showFullImg: false,
                fullImgUrl: '',
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
                    this.list=res.essay
                    row_start+=15
                    row_end+=15
                    this.$toast.clear()
                }).catch(err=>{
                    console.log(err)
                    this.$toast.clear()
                    this.$toast.fail('加载失败')
                })
            },
            onRefresh(){

            },
            onFocus(){

            },
            onBlur(){

            },
            computePublishTime(time){
                let publish_time = new Date(time)
                let now = new Date()
                let gap = now-publish_time
                if(gap<=60000){
                    return `${Math.round(gap/1000)}秒前`
                }else if(gap<=3600000){
                    return `${Math.round(gap/60000)}分钟前`
                }else if(gap<=86400000){
                    return `${Math.round(gap/3600000)}小时前`
                }else{
                    return `${Math.round(gap/86400000)}天前`
                }
            },
            computeAvatar(avatar){
                let avatar_str = this.imgServerUrl.concat(avatar).split(':')
                return avatar_str[0].concat(':',avatar_str[1])
            },
            filterImgArr(str){
                const arr = str.split('$%^')
                arr.shift()
                return arr
            },
            juegeEssayOwner(id,identity){
                if(this.$store.state.user_info.basisInfo.organization_basisInfo){
                    if(identity!=='organization') return false
                    if(id!==this.$store.state.user_info.basisInfo.organization_basisInfo.organization_name) return false
                    return true
                }else{
                    if(identity!=='student') return false
                    if(id!==this.$store.state.user_info.basisInfo.id) return false
                    return true
                }
            },
            switchFullImg(url){
                this.fullImgUrl = url
                this.showFullImg = true
            }
        },
        mixins: [loading_mixin]
    }
</script>
<style lang="stylus" scoped>
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
    .full-img-wrapper 
        display flex
        align-items center
        justify-content center
        height 100%
    .bbsList
        position fixed
        top 75px
        bottom 50px
        left 0
        right 0
        background-color #f3f4f6
        overflow auto
        .essay-wrapper
            display flex
            background-color white
            padding 10px
            border-bottom 1px solid gray
            .essay-avatar
                flex 0 0 65px
                .follow-status
                    margin 5px 10px
            .essay-body 
                position relative
                flex 1
                .essay-body-info
                    padding-left 5px
                    height 65px
                    .essay-body-info-author-name
                        font-size 20px
                    .essay-body-info-time
                        color #96979c
                        font-size 15px
                    .essay-body-info-edited
                        .essay-body-info-edited-hint
                            display inline-block
                            color #96979c
                            font-size 12px
                            padding-right 5px
                .essay-body-content
                    padding 10px 0px 10px 5px
                    .essay-body-content-words
                        font-size 15px
                .essay-body-image
                    padding 10px 0px 30px 0px 
                .essay-status
                    position absolute
                    bottom 0px
                    right 2px
                    >div
                        display inline-block
                        padding 0 2px
                        >span
                            padding-left 1px
                            font-size 14px
                            vertical-align top
                    .delete
                        span 
                            color red
</style>