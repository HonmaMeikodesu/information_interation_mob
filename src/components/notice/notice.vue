<template>
    <div id="notice" class="global-notice" v-if="flag">
        <header>
            <div class="oa" :class="{active:selected===0}" @click="switchOa">
                <span>
                    OA办公
                </span>
            </div>
            <div class="official" :class="{active:selected===1}" @click="switchOfficial">
                <span>
                    社团推文
                </span>
            </div>
        </header>
        <div class="content">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </div>
    </div>
</template>
<script>
import loading_mixin from 'components/loading'
import socket from 'components/socket'
export default {
    data(){
        return{

        }
    },
    computed: {
        flag(){
            if(!this.$store.state.user_info.basisInfo) return false
            return true
        },
        selected:{
            get:function(){
                if(this.$route.path==='/notice/oa') return 0
                if(this.$route.path==='/notice/official') return 1
                return -1
            },
            set:function(val){
                return val
            }
 
        }
    },
    methods: {
        switchOa(){
            this.selected=0
            this.$router.push('/notice/oa')
        },
        switchOfficial(){
            this.selected=1
            this.$router.push('/notice/official')
        }
    },
    mixins: [loading_mixin,socket],
}
</script>
<style lang="stylus" scoped>
#notice
    position fixed
    z-index 99
    top 0px
    left 0px
    right 0px
    bottom 50px
    width 100%
    header 
        display flex
        height 30px
        .oa
            position relative
            flex 1
            span 
                display inline-block
                width 100%
                text-align center
                position absolute
                bottom 0
        .official
            position relative
            flex 1
            span 
                display inline-block
                width 100%
                text-align center
                position absolute
                bottom 0
        .active
            border-bottom 1px solid #1989fa
            color #1989fa
            span
                font-weight 200
                transform scale(1.2)
    .content
        position absolute
        z-index 99
        top 30px
        bottom 0px
        overflow auto
        background-color #f3f4f6
</style>