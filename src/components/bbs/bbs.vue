<!--热搜功能和置顶文章功能后期再加上去-->
<template>
    <div id="bbs">
        <div class="test-client-height" style="position:fixed;top:0;bottom:0;width:100%;z-index=-999" ></div>
        <div class="header">
            <span class="title">信息圈</span>
            <van-icon name="add" class="add" size="20px" color="#359ce7" @click="sendEssaySelected=true"/>
        </div>
        <div class="searchBar">
            <van-search v-model="keyword" placeholder="请输入搜索关键词" @focus="onFocus" @blur="onBlur" @search="onSearch"/>
        </div>
        <div class="searchOverLay" v-show="searchSelected"></div>
        <div class="bbsList">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                    <bbsItem :list="list" :now="now" @needMoreDetail="passBBSDetail=$event" @updateEssayAndRefresh='updateEssayAndRefresh'></bbsItem>
                </van-list>
            </van-pull-refresh>
        </div>
        <div class="bbsDetail">
            <transition name="slide-down">
                <bbsDetail :list="[bbsDetail]" :comment="comment" :now="now" v-show="bbsDetailShow" @closedetail="bbsDetailShow=$event" @commentIncrease="commentNumChange($event,true)" @commentDecrease="commentNumChange($event,false)" @closeDetailAndRefresh="closeDetailAndRefresh" @updateEssayAndRefresh='updateEssayAndRefresh'></bbsDetail>
            </transition>
        </div>
        <transition name="van-slide-right">
            <div class="send-essay" v-show="sendEssaySelected">
                <div class="send-essay-header">
                    <van-icon name="arrow-left" @click="sendEssaySelected=false" size="25px" class="send-essay-close" color="white"/>
                    <span class="send-essay-title">发送文章</span>
                </div>
                <div class="text-area">
                    <van-field
                    v-model="essayToSend"
                    rows="2"
                    autosize
                    type="textarea"
                    maxlength="100"
                    placeholder="请输入文本"
                    show-word-limit
                    />
                </div>
                <div class="img-area">
                    <van-uploader
                    v-model="imgList"
                    multiple
                    max-count="4"
                    max-size='5120‬'
                    :before-read='imgTypeCheck'
                    />
                </div>
                <div class="van-hairline--bottom"></div>
                <div class="push-essay-to-server">
                    <van-button block @click="sendEssay" type="info">发送</van-button>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    import {request} from '../../request/http'
    import {uploadImg} from '../../utils/qiniuUpload'
    import loading_mixin from 'components/loading'
    import bbsItem from 'components/bbs/bbsItem'
    import bbsDetail from 'components/bbs/bbsDetail'
    let row_start = 0
    let row_end = 15
    export default {
        name: 'bbs',
        data(){
            return{
                imgList: [],
                essayToSend: '',
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
                sendEssaySelected: false,
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
            sendEssay(){
                this.$toast.$loading('发送中')
                request(true,{
                    method: 'get',
                    url: '/api/moment/send',
                    params:{
                        content: this.essayToSend
                    }
                }).then(res=>{
                    if(this.imgList.length===0) {
                        this.$toast.clear()
                        this.$toast.success('发送完毕')
                        this.sendEssaySelected=false
                        this.essayToSend=''
                        this.$options.methods.onRefresh.call(this)
                        return
                    }
                    let id = res.id
                    let promiseList = []
                    for(let i=0;i<this.imgList.length;i++){
                        promiseList.push(uploadImg(id,this.imgList[i].file))
                    }
                    Promise.all(promiseList).then(()=>{
                        this.$toast.clear()
                        this.$toast.success('发送完毕')
                        this.sendEssaySelected=false
                        this.$options.methods.onRefresh.call(this)
                    }).catch(err=>{
                        console.log(err)
                        // 文章图片发送失败，自动将整篇文章删除(删除失败就算了)
                        request(true,{
                            method: 'get',
                            url: '/api/moment/delete_essay',
                            params:{
                                id
                            }
                        })
                        this.$toast.clear()
                        this.$toast.fail('发送失败')
                    })
                }).catch(err=>{
                    console.log(err)
                })
            },
            imgTypeCheck(file){
                if (file.type !== 'image/jpeg'&&file.type !== 'image/png') {
                    this.$toast.fail('请上传jpg,jpeg,png格式图片')
                    return false;
                }
                return true;
            },
            commentNumChange(id,flag){
                console.log(id+flag)
                for(let item of this.list){
                    if(item.id===id){
                        item.review_num=flag?item.review_num+1:item.review_num-1
                        break
                    }
                }
            },
            closeDetailAndRefresh(){
                this.bbsDetailShow=false
                this.$options.methods.onRefresh.call(this)
            },
            updateEssayAndRefresh(){
                this.$options.methods.onRefresh.call(this)
            },
            onSearch(keyword){
                this.$toast.$loading('搜索中')
                request(true,{
                    method: 'post',
                    url: '/api/moment/search',
                    data:{
                        ncs_keyword: keyword
                    }
                }).then(res=>{
                    this.list=res.essay
                    this.$toast.clear()
                }).catch(err=>{
                    console.log(err)
                    this.$toast.$fail('搜索失败')
                })
            }
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
    .send-essay
        position fixed
        top 0px
        bottom 50px
        left 0px
        right 0px
        z-index 99
        background-color white
        .send-essay-header
            background-color #1989fa
            height 40px
            .send-essay-close
                position absolute
                left 5px
                top 7.5px
            .send-essay-title
                display inline-block
                width 100%
                height 40px
                line-height 40px
                text-align center
                color white
                font-weight 80px
        .img-area
            padding 20px 10px
        .push-essay-to-server
            width 80%
            padding-top 20px
            margin 0 auto
        

</style>