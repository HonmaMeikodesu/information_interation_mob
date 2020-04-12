<template>
  <div id="show-other-info">
    <van-dialog v-model="show.flag" title="用户信息">
        <div class="user-info-detail">
            <div class="student-info" v-if="judgeStudent">
                <div class="user-avatar">
                    <van-image 
                    :src="computeAvatar(other_info.avatar)"
                    error-icon="user-circle-o"
                    scale-down
                    height="300px"
                    width="300px"
                    >
                    </van-image>
                </div>
                <div class="user-id">
                    <span class="user-id-content">{{other_info.id}}</span>
                </div>
                <div class="user-gender">
                    <span class="user-gender-conten">{{other_info.info.gender}}</span>
                </div>
                <div class="user-major">
                    <span class="user-major">{{other_info.info.major}}</span>
                </div>
                <div class="user-signature" v-if="other_info.signature&&other_info.signature!==null">
                    <span class="user-signature-prefix">用户介绍:</span>
                    <span class="user-signature-content">{{other_info.signature}}</span>
                </div>
            </div>
            <div class="organization-info" v-else>
                <div class="organization-avatar">
                    <van-image 
                    :src="computeAvatar(other_info.avatar_url)"
                    error-icon="user-circle-o"
                    >
                    </van-image>
                </div>
                <div class="organization-name">
                    <span class="organization-name-prefix">组织名称:</span>
                    <span class="organization-name-content">{{other_info.organization_name}}</span>
                </div>
                <div class="organization-info">
                    <span class="organization-info-prefix">组织介绍:</span>
                    <span class="organization-info-content">{{other_info.organization_info}}</span>
                </div>
            </div>
        </div>
    </van-dialog> 
  </div>
</template>
<script>
export default {
  props:['other_identity','other_info','show'],
  computed:{
    judgeStudent:{
        get: function(){
            if(this.other_identity==='student')
              return true
            else
              return false
        },
        set:function(val){
            this.other_identity=val
        }
    }
  },
  methods:{
    computeAvatar(avatar){
        let avatar_str = this.$imgServerUrl.concat(avatar).split(':')
        return avatar_str[0].concat(':',avatar_str[1])
    },
  }
}
</script>
<style lang="stylus" scoped>
#show-other-info
  .user-info-detail
    *
        padding 5px 0
        text-align center
</style>