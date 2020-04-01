<template>
    <div class="login-wrapper">
        <div class="header"><span class="login">登录</span></div>
        <div class="form-wrapper">
            <van-form @submit="Login">
                <van-field v-model="username" name="username" label="用户名" placeholder="用户名"
                    :rules="[{ required: true, message: '请填写用户名' }]" />
                <van-field v-model="password" type="password" name="password" label="密码" placeholder="密码"
                    :rules="[{ required: true, message: '请填写密码' }]" />
                <div @click="show_identity_list = true" class="identity-selector"><span>选择用户身份</span></div>
                <van-overlay :show="show_identity_list" @click="show_identity_list = false" class="overlay">
                    <van-picker :columns="identity_list" :default-index="0" @change="onChange"/>
                </van-overlay>
                <div style="margin: 16px;">
                    <div class="button-group">
                        <van-button round block type="info" native-type="submit">
                            提交
                        </van-button>
                    </div>
                </div>
            </van-form>
            <van-button round block type="info" native-type="prevent" class="register" @click='switchPage'>
                            团体用户注册
            </van-button>
        </div>
        <transition name='slide'>
            <div class="register-page" v-show="!notRegister">
                <div class="header">
                    <span class="login">
                        团体用户注册
                    </span>
                </div>
                <div class="form-wrapper">
                    <van-form @submit="Register">
                        <van-field v-model="username" name="username" label="团体用户名" placeholder="团体用户名"
                            :rules="[{ required: true, message: '请填写用户名' }]" />
                        <van-field v-model="password" type="password" name="password" label="密码" placeholder="密码"
                            :rules="[{ required: true, message: '请填写密码' }]" />
                        <van-field v-model="intro" name="introduction" label="团体介绍" placeholder="团体介绍"
                            :rules="[{ required: true, message: '请填写团体介绍' }]" />
                        <div style="margin: 16px;">
                            <div class="button-group">
                                <van-button round block type="info" native-type="submit">
                                    注册
                                </van-button>
                            </div>
                        </div>
                    </van-form>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    import loading_mixin from 'components/loading'
    import {request} from '../request/http'
    export default {
        data() {
            return {
                username: '',
                password: '',
                identity_list: ['student','organization'],
                identity: 'student',
                notRegister: true,
                intro: '',
                show_identity_list:false,
            };
        },
        mixins: [loading_mixin],
        methods: {
            Login(form_data) {
                const { username, password } = form_data
                const option = {
                    account: username,
                    password: password,
                    identity: this.identity
                }
                this.$toast.loading({
                    message: '登陆中',
                    forbidClick: true,
                    duration: 5
                })
                request(false,{
                    method: 'post',
                    url: 'api/user/login',
                    data: option
                }).then(res=>{
                    res.identity = this.identity
                    localStorage.setItem("login_state",JSON.stringify(res))
                    this.$toast.clear()
                    this.$toast.success('登陆成功')
                    this.$router.push('/mypage')
                }).catch(err=>{
                    console.log(err)
                    this.$toast.clear()
                    this.$toast.fail("登陆失败")
                })
            },
            Register(form_data) {
                const { username, password, introduction } = form_data
                const option = {
                    organization_name: username,
                    organization_psw: password,
                    organization_info: introduction
                }
                this.$toast.loading({
                    message: '注册中',
                    forbidClick: true,
                    duration: 5
                })
                request(false,{
                    method: 'get',
                    url: 'api/user/register',
                    params: option
                }).then(()=>{
                    this.password=''
                    this.identity='organization'
                    this.$toast.clear()
                    this.$toast.success('注册成功')
                    this.switchPage()
                }).catch(err=>{
                    console.log(err)
                    this.$toast.clear()
                    this.$toast.fail("注册失败")
                })
            },
            switchPage(){
                this.notRegister = !this.notRegister
            },
            onChange(picker, value) {
                this.identity = value
            }
        },
    };
</script>
<style lang="stylus" scoped>
.login-wrapper
    position fixed 
    width 100% 
    height 100% 
    z-index 99 
    background #f3f4f6
    .header
        background #1989fa
        height 50px
        line-height 50px
        text-align center
        margin-bottom 50px
        .login
            display inline-block
            font-size 20px
            font-weight 100
            color white
    .form-wrapper
        width 80%
        margin 0 auto
        .button-group  
            width 90%
            margin 0 auto
            margin-top 30px
        .register
            background-color #fff
            color #1989fa 
            margin-top 10px
            margin 0 auto
            width 80%
        .overlay
            display flex
            align-items center
            justify-content center
        .overlay>*
            width 60%
        .identity-selector
            width 100%
            span
                display block
                margin 0 auto
                font-size 20px
                margin-top 20px
                text-align center
    .slide-enter-active,.slide-leave-active
        transition all .5s ease 
    .slide-enter,.slide-leave-to
        transform translate3d(100%,0,0)
    .register-page
        position fixed 
        left 0
        bottom 0
        top 0
        right 0
        background #f3f4f6
</style>