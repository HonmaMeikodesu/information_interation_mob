<template>
    <div id='my-page' v-if="flag">
        <div class="test-client-height global-notice" style="position:fixed;top:0;bottom:0;width:100%;z-index=-999" ></div>
        <otherUserInfo :show="show" :other_info="other_info" :other_identity="other_identity"></otherUserInfo>
        <div class="my-page-header">
            <span class="my-page-title">我的信息</span>
            <van-icon name="setting-o" class="my-page-setting" size="20px" color="#359ce7"/>
        </div>
        <div class="van-hairline--bottom"></div>
        <div class="my-page-user-info">
            <div class="user-avatar-nickname">
                <div class="user-avatar">
                    <van-image
                    width="85"
                    height="85"
                    round
                    fit="cover"
                    error-icon="user-circle-o"
                    :src="userAvatar"
                    @click="changeAvatar"
                    />
                </div>
                <van-uploader :before-delete="imgTypeCheck" :after-read="imgUpload" v-show="false" class="hiddenAvatarUploader"/>
                <div class="user-nickname">{{userNickname}}</div>
            </div>
            <div class="user-main-info">
                <div class="user-follow-fans">
                    <van-popup v-model="followFanshow">
                        <div class="follow-fan-details">
                            <div class="follow-details" v-if="followSelected">
                                <van-collapse v-model="followActive">
                                    <van-collapse-item title="关注部门" name="1" icon="friends-o">
                                        <div class="follow-fan-body">
                                            <div class="follow-fan-content" v-for="department in getFollow('department')" :key="department">
                                                <span>{{department}}</span>
                                                <van-icon name="cross" color="red" size="20px" @click="removeFollow('department',department)"/>
                                            </div>
                                        </div>
                                    </van-collapse-item>
                                    <van-collapse-item title="关注组织" name="2" icon="friends-o">
                                        <div class="follow-fan-body">
                                            <div class="follow-fan-content" v-for="organization in getFollow('organization')" :key="organization">
                                                <span @click="showUserInfo('organization',organization)">{{organization}}</span>
                                                <van-icon name="cross" color="red" size="20px" @click="removeFollow('organization',organization)"/>
                                            </div>
                                        </div>
                                    </van-collapse-item>
                                    <van-collapse-item title="关注用户" name="3" icon="friends-o">
                                        <div class="follow-fan-body">
                                            <div class="follow-fan-content" v-for="student in getFollow('student')" :key="student">
                                                <span @click="showUserInfo('student',student)">{{student}}</span>
                                                <van-icon name="cross" color="red" size="20px" @click="removeFollow('student',student)"/>
                                            </div>
                                        </div>
                                    </van-collapse-item>
                                </van-collapse>
                            </div>
                            <div class="fan-details" v-else>
                                <van-collapse v-model="fanActive">
                                    <van-collapse-item title="组织粉丝" name="1" icon="friends-o">
                                        <div class="follow-fan-body">
                                            <div class="follow-fan-content" v-for="organization in getFan('organization')" :key="organization">
                                                <span @click="showUserInfo('organization',organization)">{{organization}}</span>
                                            </div>
                                        </div>
                                    </van-collapse-item>
                                    <van-collapse-item title="用户粉丝" name="2" icon="friends-o">
                                        <div class="follow-fan-body">
                                            <div class="follow-fan-content" v-for="student in getFan('student')" :key="student">
                                                <span @click="showUserInfo('student',student)">{{student}}</span>
                                            </div>
                                        </div>
                                    </van-collapse-item>
                                </van-collapse>
                            </div>
                        </div>  
                    </van-popup>
                    <div class="user-follow" @click="checkFollowList()" style="z-index:1">
                        <div class="user-follow-count">{{followListLength}}</div>
                        <div class="user-follow-title">关注</div>
                    </div>
                    <div class="user-fans" @click="checkFanList()" style="z-index:1">
                        <div class="user-fans-count">{{fanListLength}}</div>
                        <div class="user-follow-title">粉丝</div>
                    </div>    
                </div>
                <div class="user-full-info-push">
                    <div class="user-full-info">
                        <van-button round type="info" size="small">个人信息</van-button>
                    </div>
                    <div class="user-push">
                        <van-icon name="chat-o" class="user-message-bucket" size="30px"/>
                        <span>消息推送</span>
                    </div>
                </div>
                <div class="user-signature">
                    <div class="user-signature-title">
                        <span v-if="identity==='student'">个人签名:</span>
                        <span v-else>组织介绍:</span>
                    </div>
                    <div class="user-signature-body">
                        <div v-if="!editSignatureSelected">
                            <span class="user-signature-content">{{userSignature}}</span>
                            <van-icon name="edit" size="20px" @click="switchEditSignatureSelected()"/>
                        </div>
                        <van-field
                        v-else
                        v-model="signatureToUpdate"
                        maxlength="15" 
                        rows="2"
                        show-word-limit
                        style="padding:0"
                        >
                        <template #button>
                            <van-button size="mini" type="info" @click="updateSignature">保存</van-button>
                        </template>
                        </van-field>
                    </div>
                </div>
            </div>   
        </div> 
        <div class="user-stuff-main-select">
            <van-tabs v-model="userTopSelect" title-active-color="rgb(53,156,231)" color="rgb(53,156,231)">
                <van-tab class="send-history" title="发过" to="/mypage/send"></van-tab>
                <van-tab class="book-history" title="收藏" to="/mypage/book"></van-tab>
                <van-tab class="like-history" title="赞过" to="/mypage/like"></van-tab>
            </van-tabs>
        </div>
        <div class="user-stuff-choose">
            <router-view></router-view>
            <div style="height:50px"></div> <!--防止router-view渲染出的组件被footer覆盖-->
        </div>
    </div>
</template>
<script>
import loading_mixin from 'components/loading'
import {uploadAvatar} from '../../utils/qiniuUpload'
import otherUserInfo from 'components/bbs/otherUserInfo'
import {request} from '../../request/http'
export default {
    name: 'mypage',
    data(){
        return{
            userTopSelect:1,
            followFanshow: false,
            followSelected: false,
            followActive: ['0'],
            fanActive: ['0'],
            other_identity: '',
            other_info: '',
            show: {flag:false},
            editSignatureSelected: false,
            signatureToUpdate: '',
        }
    },
    components:{
        otherUserInfo
    },
    computed:{
      flag(){
          if(!this.$store.state.user_info.basisInfo) return false
          return true
      },
      identity(){
          return this.$store.getters.identity
      },
      userAvatar(){
          let avatar_hash = (this.$options.computed.identity.call(this)==='student')?this.$store.getters.basisInfo.avatar_url:this.$store.getters.organization_basisInfo.avatar_url
          let avatar_str = this.$imgServerUrl.concat(avatar_hash).split(':')
          return avatar_str[0].concat(':',avatar_str[1])
      },
      userNickname(){
          return (this.$options.computed.identity.call(this)==='student')?this.$store.getters.basisInfo.nickname:this.$store.getters.organization_basisInfo.organization_name
      },
      followListLength(){
          return this.$store.getters.followList.length
      },
      fanListLength(){
          return this.$store.getters.fanList.length
      },
      userSignature(){
          return (this.$options.computed.identity.call(this)==='student')?this.$store.getters.basisInfo.signature:this.$store.getters.organization_basisInfo.organization_info
      }
    },
    methods:{
        imgTypeCheck(file){
            if (file.type !== 'image/jpeg'&&file.type !== 'image/png') {
                this.$toast.fail('请上传jpg,jpeg,png格式图片')
                return false;
            }
            return true;
        },
        imgUpload(file){
            this.$toast.$loading('上传中')
            let nickname = this.$options.computed.userNickname.call(this)
            uploadAvatar(nickname,file.file).then(res=>{
                console.log(res)
                let avatar_url = res.key.concat(':',res.key.hash)
                if(this.$store.getters.organization_basisInfo){
                    this.$store.getters.organization_basisInfo.avatar_url=avatar_url
                    return
                }
                this.$store.getters.basisInfo.avatar_url=avatar_url
                this.$toast.$free_success('上传完毕')
            }).catch(err=>{
                console.log(err)
                this.$toast.fail('更换失败')
                this.$toast.$free_fail('上传失败')
            })
        },
        changeAvatar(){
            this.$el.getElementsByClassName('hiddenAvatarUploader')[0].getElementsByTagName('input')[0].click()
        },
        getFollow(identity){
            let re =new RegExp("^"+identity)
            let followList = this.$store.getters.followList.filter(val=>{
                return val.match(re)
            })
            return followList.map(item=>{
                return item.replace(`${identity}/`,'')
            })
        },
        getFan(identity){
            let re =new RegExp("^"+identity)
            let fanList = this.$store.getters.fanList.filter(val=>{
                return val.match(re)
            })
            return fanList.map(item=>{
                return item.replace(`${identity}/`,'')
            })
        },
        checkFollowList(){
            this.followFanshow=true
            this.followSelected=true
        },
        checkFanList(){
            this.followFanshow=true
            this.followSelected=false
        },
        showUserInfo(identity,user_id){
            this.other_identity=identity
            console.log(identity+ ' ' +user_id)
            request(true,{
                method: 'get',
                url: '/api/user/get_others_info',
                params: {
                    identity,
                    user_id
                }
            }).then(res=>{
                if(identity==='student') this.other_info = res.user_info
                else this.other_info = res.organization_basisInfo
                this.show.flag=true
            }).catch(err=>{
                console.log(err)
                this.$toast.fail('操作失败')
                this.show.flag=false
            })
        },
        removeFollow(identity,id){
            const follow = identity.concat('/',id)
            this.$toast.loading({
                message:'操作中',
                forbidClick: true,
                duration: 0
            })
            request(true,{
                method: 'get',
                url:'/api/user/unfollow',
                params:{
                    follow_user_identity: identity,
                    follow_user_id: id
                }
            }).then(()=>{
                this.$store.getters.followList.splice(this.$store.getters.followList.indexOf(follow),1)
                this.$toast.clear()
            }).catch(err=>{
                console.log(err)
                this.$toast.clear()
                this.$toast.fail("失败")
            })  
        },
        updateSignature(){
            request(true,{
                method: 'get',
                url: '/api/user/update_signature',
                params:{
                    signature:this.signatureToUpdate
                }
            }).then(()=>{
                if(this.$store.getters.identity==='student') this.$store.getters.basisInfo.signature=this.signatureToUpdate
                else this.$store.getters.organization_basisInfo.organization_info=this.signatureToUpdate
                this.editSignatureSelected=false
            }).catch(err=>{
                console.log(err)
                this.$toast.fail('保存失败,请重试')
            })
        },
        switchEditSignatureSelected(){
            this.signatureToUpdate=this.$store.state.user_info.basisInfo.signature || this.$store.getters.organization_basisInfo.organization_info
            this.editSignatureSelected=true
        },
    },
    mixins: [loading_mixin]
}
</script>
<style lang="stylus" scoped>
#my-page
    .my-page-header
        position relative
        line-height 30px
        height 30px
        width 100%
        .my-page-title
            display inline-block
            width 100%
            font-size 20px
            color #359ce7
            line-height 30px
            text-align center
        .my-page-setting
            position absolute
            right 10px
            top 5px
    .my-page-user-info
        padding 10px
        display flex
        .user-avatar-nickname
            flex 0
            .user-avatar
                padding 5px
            .user-nickname
                width 100%
                text-align center
        .user-main-info
            flex 1
            .user-follow-fans
                display flex
                .follow-fan-details
                    .follow-fan-body
                        max-height 150px
                        overflow auto
                        .follow-fan-content
                            display flex
                            padding 5px 0px
                            span    
                                padding 0px 5px
                                font-size 15px
                                flex 1
                .user-follow
                    text-align center
                    flex 1
                    .user-follow-count
                        font-weight bold
                .user-fans
                    text-align center
                    flex 1
                    .user-fans-count
                        font-weight bold
            .user-full-info-push
                padding 5px 0px
                display flex
                .user-full-info
                    flex 1
                    button
                        left 10px
                        width 80%
                .user-push
                    flex 1
                    span 
                        vertical-align top
                        display inline-block
                        line-height 30px
            .user-signature
                display flex
                padding-left 10px
                width 100%
                .user-signature-title
                    flex 0 0 65px
                    span
                        vertical-align top
                        display inline-block
                        font-size 15px
                .user-signature-body
                    flex 1
                    span
                        vertical-align top
                        display inline-block
        
        
</style>