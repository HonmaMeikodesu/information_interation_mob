<template>
    <div id='my-page' v-if="flag">
        <div class="test-client-height" style="position:fixed;top:0;bottom:0;width:100%;z-index=-999" ></div>
        <div class="my-page-header">
            <span class="my-page-title">我的信息</span>
            <van-icon name="setting-o" class="my-page-setting" size="20px" color="#359ce7"/>
        </div>
        <div class="my-page-user-info">
            <div class="user-avatar-nickname">
                <div class="user-avatar">
                    <van-image
                    width="65"
                    height="65"
                    round
                    fit="cover"
                    error-icon="user-circle-o"
                    :src="userAvatar"
                    />
                </div>
                <div class="user-nickname">{{userNickname}}</div>
            </div>
            <div class="user-main-info">
                <div class="user-follow-fans">
                    <div class="user-follow">
                        <div class="user-follow-count">{{followListLength}}</div>
                        <div class="user-follow-title">关注</div>
                    </div>
                    <div class="user-fans">
                        <div class="user-fans-count">{{fanListLength}}</div>
                        <div class="user-follow-title">粉丝</div>
                    </div>    
                </div>
                <div class="user-full-info-push">
                    <div class="user-full-info">
                        <van-button round type="info">个人信息</van-button>
                    </div>
                    <div class="user-push">
                        <van-icon name="chat-o" class="user-message-bucket"/>
                    </div>
                </div>
                <div class="user-signature">
                    <span v-if="identity==='student'">个人签名:</span>
                    <span v-else>组织介绍:</span>
                    <span class="user-signature-content">{{userSignature}}</span>
                </div>
            </div>   
        </div> 
        <div class="user-stuff-main-select">
            <div class="send-history"></div>
            <div class="book-history"></div>
            <div class="like-history"></div>
        </div>
        <div class="user-stuff-choose">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import loading_mixin from 'components/loading'

export default {
    name: 'mypage',
    data(){
        return{
        }
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
    mixins: [loading_mixin]
}
</script>
<style lang="stylus" scoped>
#my-page
    .my-page-header
        position relative
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
</style>