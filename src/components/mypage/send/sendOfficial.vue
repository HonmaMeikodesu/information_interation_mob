<template>
  <div id="send-official-history">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="official-wrapper">
        <div class="official-body" v-for="item in offcialList" :key="item.id" @click="showOfficialDetail(item.official_url)">
          <div class="official-title">
            {{item.official_title}}
          </div>
          <div class="official-time">
            {{dateFormat(item.updated_at)}}
          </div>
          <div class="update-official">
            <van-button type="info" size="mini" @click.stop="updateOfficial(item.official_url)">更新</van-button>
          </div>
          <div class="delete-official">
            <van-button type="danger" size="mini" @click.stop="deleteOfficial(item.id)">删除</van-button>
          </div>
          <van-divider />
        </div>
      </div>
      <div style="width:100%;text-align:center;color:gray;padding:5px">到底了喔~</div>
    </van-pull-refresh>
    <div class="add-official">
      <van-icon class="add-official-icon" name="plus" size="50px" @click="addNewOfficialSelected=true"/>
      <div class="add-official-hint">添加新推文</div>
    </div>
    <transition name="van-slide-up">
      <officialdetail :url="url" v-show="officialDetailShow" @detailclose="officialDetailShow=$event" class="official-detail"></officialdetail>
    </transition>
    <van-popup v-model="addNewOfficialSelected" position="bottom" round>
      <van-form @submit="addNewOfficial">
        <van-field
          v-model="newOfficialUrl"
          label="推文地址"
          placeholder="请输入完整的推文url地址"
          :rules="[{ validator,required:true,message:'请填写正确的url地址'}]"
        />
        <van-button round block type="info" native-type="submit">
          提交
        </van-button>
      </van-form>
    </van-popup>
  </div>
</template>
<script>
import { request } from '../../../request/http'
import {Dialog} from 'vant'
import officialdetail from 'components/notice/officialdetail'
export default {
  data(){
    return{
      url:'',
      officialDetailShow:false,
      offcialList:[],
      addNewOfficialSelected:false,
      newOfficialUrl:'',
      isLoading: false,
    } 
  },
  components:{
    officialdetail
  },
  methods:{
    validator(val) {
      return /^https:\/\/mp.weixin.qq.com\/s\//.test(val);
    },
    dateFormat: function(date){
      date = new Date(date)
      return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    },
    updateOfficial(url){
      let UNCHANGE='00100605'
      this.$toast.$loading('更新中')
      request(true,{
        method:'post',
        url:'/api/official/update',
        data:{
          official_url:url
        }
      }).then(()=>{
        this.$toast.$free_success('更新完成')
        this.$emit('needRefresh')
      }).catch(err=>{
        if(err===UNCHANGE)
          this.$toast.$free_fail('已是最新状态')
        else
          this.$toast.$free_fail('未知错误')
      })
    },
    deleteOfficial(id){
      Dialog.confirm({
      title: '确认提示',
      message: '该推文将被删除'
      }).then(() => {
        this.$toast.$loading('删除中')
        request(true,{
            method: 'get',
            url: '/api/official/delete',
            headers:{
              id
            }
        }).then(()=>{
            let index = 0
            for(let item of this.offcialList){
                if(item.id==id) break
                index++
            }
            this.offcialList.splice(index,1)
            this.$toast.clear()
        }).catch(err=>{
            console.log(err)
            this.$toast.clear()
            this.$toast.fail('操作失败')
        })
      }).catch(() => {
      // on cancel
      });
    },
    showOfficialDetail(url){
      this.url=url
      this.officialDetailShow=true
    },
    addNewOfficial(){
      this.$toast.$loading('分析中')
      request(true,{
        method: 'post',
        url: '/api/official/send',
        data:{
          official_url: this.newOfficialUrl
        }
      }).then(()=>{
        this.$toast.$free_success('上传完成')
        this.officialDetailShow=false
        this.$emit('needRefresh')
        this.$store.state.official_socket.emit('send_official',
        {user_id:this.$store.getters.organization_basisInfo.organization_name,official_url:this.newOfficialUrl})
        this.newOfficialUrl=''
      }).catch(err=>{
        console.log(err)
        this.$toast.$free_fail('上传失败')
      })
    },
    onRefresh(){
      request(true,{
          method: 'get',
          url: '/api/user/get_user_info'
      }).then(res=>{
          this.$store.state.user_info=res
          this.isLoading=false
          this.$emit('needRefresh')
      }).catch(err=>{
          console.log(err)
          this.$toast.fail('刷新失败')
          this.isLoading=false
      })
    }
  },
  created(){
    request(true,{
      method: 'get',
      url:'/api/official/get_self_list',
      params:{
        row_start:0,
        row_end:999 // todo 修改后台接口
      }
    }).then(res=>{
      this.offcialList=res.officialList
    }).catch(err=>{
      console.log(err)
      this.$toast.fail('加载失败')
    })
  },
  mounted(){
    this.$el.getElementsByClassName('official-detail-root')[0].style.top='0px'
  }
}
</script>
<style lang="stylus" scoped>
#send-official-history
  .official-wrapper
    padding 10px
    .official-body
      position relative
      padding 5px 0px
      .official-title
        font-size 20px
        font-weight bold
      .official-time
        color gray
        font-size 15px
        padding 5px 0
      .update-official
        position absolute
        bottom 40px
        right 60px
      .delete-official
        position absolute
        bottom 40px
        right 0px
  .add-official
    color rgb(203,200,206)
    .add-official-icon
      width 100%
      text-align center
    .add-official-hint
      text-align center
</style>