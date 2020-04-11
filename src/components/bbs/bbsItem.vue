<template>
  <div id="bbs-essay">
    <van-overlay :show="showFullImg" @click="showFullImg = false" z-index="99">
      <div class="full-img-wrapper">
          <van-image :src="fullImgUrl" cover></van-image>
      </div>
    </van-overlay>
    <otherUserInfo :show="show" :other_info="other_info" :other_identity="other_identity"></otherUserInfo> 
    <div v-for="item in list" :key="item.id">
        <div class="essay-wrapper">
            <div class="essay-id" v-show="false">{{item.id}}</div>
            <div class="essay-avatar">
                <van-image
                width="65"
                height="65"
                round
                fit="cover"
                error-icon="user-circle-o"
                :src="computeAvatar(item.essay_user_avatar)"
                @click="showUserInfo(item.essay_user_identity,item.essay_user_id)"
                />
                <van-tag class="follow-status" size="medium" v-if="judgeFollow(item.essay_user_identity,item.essay_user_id)&&!juegeEssayOwner(item.essay_user_id,item.essay_user_identity)" color="#359ce7" @click="addFollow(item.essay_user_identity,item.essay_user_id)">+关注</van-tag>
                <van-tag class="follow-status" type="success" size="medium" v-else-if="!juegeEssayOwner(item.essay_user_id,item.essay_user_identity)" @click="removeFollow(item.essay_user_identity,item.essay_user_id)">取关</van-tag>
            </div>
            <div class="essay-body">
                <div class="essay-body-info">
                    <div class="essay-body-info-author-name">{{item.essay_user_nickname}}</div>
                    <div class="essay-body-info-time">{{computePublishTime(item.updated_at)}}</div>
                    <div class="essay-body-info-edited" v-if="(item.created_at==item.updated_at)&&juegeEssayOwner(item.essay_user_id,item.essay_user_identity)">
                        <van-tag mark type="primary" class="essay-body-info-edited-history" @click="prepareToEditEssay(item.id,$event.target)">编辑该文章</van-tag>
                    </div>
                    <div class="essay-body-info-edited" v-if="!(item.created_at==item.updated_at)">
                        <span class="essay-body-info-edited-hint">已被编辑过</span>
                        <van-tag mark type="primary" class="essay-body-info-edited-history" @click="showMeHistory(item.id)">查看编辑记录</van-tag>
                    </div>
                </div>
                <div class="essay-body-content">
                    <div class="essay-body-content-words" @click="iNeedMoreDetails(item)">{{item.essay_content}}</div>
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
                        <van-icon name="thumb-circle-o" v-if="judgeThumbsUp(item.id)" @click="addThumbsUp(item)"/>
                        <van-icon name="thumb-circle" v-else @click="removeThumbsUp(item)"/>
                        <span>{{item.thumbsup_num}}</span>
                    </div>
                    <div class="booked">
                        <van-icon name="star-o" v-if="judgeBooked(item.id)" @click="addBooked(item)" />
                        <van-icon name="star" v-else @click="removeBooked(item)" />
                        <span>{{item.bookmarked_num}}</span>
                    </div>
                    <div class="comment">
                        <van-icon name="comment-circle-o" @click="iNeedMoreDetails(item)"/>
                        <span>{{item.review_num}}</span>
                    </div>
                    <div class="delete" @click="deleteEssay(item.id)" v-if="juegeEssayOwner(item.essay_user_id,item.essay_user_identity)">
                        <van-icon name="cross" color="red"/>
                        <span>删除文章</span>
                    </div>
                </div>
            </div>
        </div> 
        <van-divider style="margin:0"/>
    </div>

    <transition name="van-slide-left">
        <div class="send-essay" v-show="editEssaySelected">
            <div class="send-essay-header">
                <div class="send-essay-header">
                    <van-icon name="arrow-left" @click="closeEditEssay" size="25px" class="send-essay-close" color="white"/>
                    <span class="send-essay-title">修改文章</span>
                </div>
            </div>
            <div class="text-area">
                <van-field
                v-model="essayToEdit"
                rows="2"
                autosize
                type="textarea"
                maxlength="100"
                show-word-limit
                />
            </div>
            <div class="img-area">
                <van-uploader
                v-model="imgToUpdateList"
                multiple
                max-count="4"
                max-size='5120‬'
                :before-read='imgTypeCheck'
                />
            </div>
            <div class="van-hairline--bottom"></div>
            <div class="push-essay-to-server">
                <van-button block @click="updateEssay" type="info">确定修改</van-button>
            </div>
        </div>
    </transition>
    <van-overlay :show="historyShow" @click="historyShow = false">
        <div class="edit-history">
            <div class="history-content">
                <span>{{historyContent}}</span>
            </div>
            <div class="history-img">
                <van-image 
                v-for="img in filterImgArr(historyImg)" 
                :key="img"
                :src="imgServerUrl.concat(img)"
                width="100px"
                height="100px"
                cover
                @click.stop="switchFullImg(imgServerUrl.concat(img))"
                >
                </van-image>
            </div>
        </div>
    </van-overlay>
  </div>
</template>
<script>
import {request} from '../../request/http'
import {Dialog} from 'vant'
import {urlToBase64,base64toFile} from '../../utils/imgHandler'
import {uploadImg} from '../../utils/qiniuUpload'
import otherUserInfo from 'components/bbs/otherUserInfo'
export default {
  data(){
      return{
          imgServerUrl:'http://cdn.xv1998.cn/',
          showFullImg: false,
          fullImgUrl: '',
          other_identity: '',
          other_info: {},
          show: {flag:false},
          essayToEdit: '',
          imgToUpdateList: [],
          essayIDOnUpdate: -1,
          editEssaySelected: false,
          historyContent: '',
          historyImg: '',
          historyShow: false,
      }
  },
  components:{
      otherUserInfo
  },
  props: ["list","now"],
  computed: {
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
  methods: {
      computePublishTime(time){
          let publish_time = new Date(time)
          let gap = this.now-publish_time
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
      },
      judgeFollow(identity,id){
          const follow = identity.concat('/',id)
          if(this.$store.getters.followList.includes(follow))
            return false
          else 
            return true
      },
      addFollow(identity,id){
          this.$toast.loading({
              message:'操作中',
              forbidClick: true,
              duration: 0
          })
          const follow = identity.concat('/',id)
          request(true,{
            method: 'get',
            url:'/api/user/follow',
            params:{
                follow_user_identity: identity,
                follow_user_id: id
            }
          }).then(()=>{
            this.$store.getters.followList.push(follow)
            this.$toast.clear()
          }).catch(err=>{
            console.log(err)
            this.$toast.clear()
            this.$toast.fail('失败')
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
      judgeBooked(id){
          for(let item of this.$store.getters.booked_moment.booked_moments){
            if(item.id==id) return false 
          }
          return true
      },
      addBooked(item){
          request(true,{
              method: 'get',
              url: '/api/moment/book',
              params: {
                  from: 'moment',
                  message_id: item.id
              }
          }).then(()=>{
              this.$store.getters.booked_moment.booked_moments.push(item)
              item.bookmarked_num++
          }).catch(err=>{
              console.log(err)
              this.$toast.fail('操作失败')
          })
      },
      removeBooked(item){
          request(true,{
              method: 'get',
              url: '/api/moment/book',
              params: {
                  from: 'moment',
                  message_id: item.id
              }
          }).then(()=>{
              let index = 0
              for(let i of this.$store.getters.booked_moment.booked_moments){
                  if(i.id==item.id){
                      break
                  }
                  index++
              }
              this.$store.getters.booked_moment.booked_moments.splice(index,1)
              item.bookmarked_num--
          }).catch(err=>{
              console.log(err)
              this.$toast.fail('操作失败')
          })
      },
      judgeThumbsUp(id){
          for(let item of this.$store.getters.liked.moments){
            if(item.id==id) return false 
          }
          return true
      },
      addThumbsUp(item){
          request(true,{
              method: 'get',
              url: '/api/moment/like',
              params: {
                  moment_id: item.id
              }
          }).then(()=>{
              this.$store.getters.liked.moments.push(item)
              item.thumbsup_num++
          }).catch(err=>{
              console.log(err)
              this.$toast.fail('操作失败')
          })
      },
      removeThumbsUp(item){
          request(true,{
              method: 'get',
              url: '/api/moment/like',
              params: {
                  moment_id: item.id
              }
          }).then(()=>{
              let index = 0
              for(let i of this.$store.getters.liked.moments){
                  if(i.id==item.id){
                      break
                  }
                  index++
              }
              this.$store.getters.liked.moments.splice(index,1)
              item.thumbsup_num--
          }).catch(err=>{
              console.log(err)
              this.$toast.fail('操作失败')
          })
      },
      deleteEssay(id){
        console.log(id)
        Dialog.confirm({
        title: '确认提示',
        message: '您确定要删除该文章吗'
        }).then(() => {
          this.$toast.loading({
              message: '删除中',
              forbidClick: true,
              duration: 0
          })
          request(true,{
              method: 'get',
              url: '/api/moment/delete_essay',
              params:{
                  id
              }
          }).then(()=>{
              let index = 0
              for(let item of this.list){
                  if(item.id==id) break
                  index++
              }
              this.list.splice(index,1)
              this.$toast.clear()
              this.$emit('essayDeleted')
          }).catch(err=>{
              console.log(err)
              this.$toast.clear()
              this.$toast.fail('操作失败')
          })
        }).catch(() => {
        // on cancel
        });
      },
      showUserInfo(identity,user_id){
          this.other_identity=identity
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
      iNeedMoreDetails(item){
          this.$emit('needMoreDetail',item)
      },
      updateEssay(){
        let id = this.essayIDOnUpdate
        Dialog.confirm({
            title: '确认提示',
            message: '更新机会只有一次，确定要更新文章嘛?'
        }).then(() => {
            this.$toast.$loading('更新中')
            request(true,{
                method: 'get',
                url: '/api/moment/update_essay',
                params:{
                    essay_id:id,
                    content: this.essayToEdit
                }
            }).then(()=>{
                let promiseList = []
                this.imgToUpdateList.forEach(item=>{
                    promiseList.push(uploadImg(id,item.file))
                })
                Promise.all(promiseList).then(()=>{
                    this.$toast.clear()
                    this.$toast.success('更新完毕')
                    this.essayToEdit='',
                    this.imgToUpdateList=[]
                    this.editEssaySelected=false
                    this.$emit('updateEssayAndRefresh')
                }).catch(err=>{
                    console.log(err)
                    this.$toast.clear()
                    this.$toast.fail('更新失败')
                    this.essayToEdit='',
                    this.imgToUpdateList=[]
                    this.editEssaySelected=false
                    this.$emit('updateEssayAndRefresh')
                })
            })
        }).catch(() => {
        // on cancel
        })
      },
      imgTypeCheck(file){
          if (file.type !== 'image/jpeg'&&file.type !== 'image/png') {
              this.$toast.fail('请上传jpg,jpeg,png格式图片')
              return false;
          }
          return true;
      },
      prepareToEditEssay(id,dom){
          this.essayIDOnUpdate=id
          // 由url构造file对象重新上传
          let imgUrlList = []
          let imgCollection = dom.parentNode.parentNode.parentNode.getElementsByTagName('img')
          for(let i=0;i<imgCollection.length;i++){
              imgUrlList.push(imgCollection[i].src)
          }
          imgUrlList.forEach(item=>{
            let tem = document.createElement('img')
            tem.setAttribute("crossOrigin",'Anonymous')
            tem.src=item
            let bstr
            const vueThis = this
            tem.onload=function(){
                bstr = urlToBase64(tem)
                const file=base64toFile(bstr,`bbs-essay-${id}.jpg`)
                let fileCollection = {
                    file,
                    content:bstr
                }
                vueThis.imgToUpdateList.push(fileCollection)
            }
          })
          let originalWords=dom.parentNode.parentNode.parentNode.getElementsByClassName('essay-body-content-words')[0].innerText
          this.essayToEdit=originalWords
          this.editEssaySelected=true
      },
      closeEditEssay(){
        this.essayToEdit='',
        this.imgToUpdateList=[]
        this.editEssaySelected=false
      },
      showMeHistory(id){
          this.$toast.$loading('获取历史信息中')
          request(true,{
              method: 'get',
              url: '/api/moment/previous_essay',
              params: {
                  essay_id: id
              }
          }).then(res=>{
              this.historyContent=res.essay_content
              this.historyImg=res.essay_user_image_url
              this.$toast.clear()
              this.historyShow=true
          }).catch(err=>{
              console.log(err)
              this.$toast.$free_fail('加载失败')
          })
      }
  }
}
</script>
<style lang="stylus" scoped>
#bbs-essay
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
  .full-img-wrapper 
    display flex
    align-items center
    justify-content center
    height 100%
  .edit-history
    background-color rgba(247,248,250,.8)
    display flex
    flex-direction column
    align-items center
    justify-content center
    height 100%
    flex-wrap wrap
    .history-content
        padding 15px
  .essay-wrapper
    display flex
    background-color white
    padding 10px
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