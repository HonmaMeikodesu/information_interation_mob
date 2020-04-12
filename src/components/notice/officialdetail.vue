<template>
  <div id="detail" class="official-detail-root">
    <div class="official-header">
      <van-icon name="arrow-left" @click="closeDetail()" size="25px" class="close" color="white"/>
      <span class="header-title" @click="onLoad">推文详情(点我加载图片)</span>
    </div>
    <div class="official-content">
      <iframe :src="transformUrl" frameborder="0" scrolling="auto" class="outsider-official"></iframe>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      baseUrl: (process.env.NODE_ENV==='production')?'http://129.204.43.32:7002/':'http://192.168.1.7:8080/'
    }
  },
  props: ["url"],
  computed: {
    transformUrl(){
      return this.url.replace('https://mp.weixin.qq.com/s/',this.baseUrl+'api/official_proxy/')
    }
  },
  methods:{
    closeDetail(){
      this.$emit("detailclose",false)
    },
    onLoad(){
          const window = this.$el.getElementsByClassName('outsider-official')[0].contentWindow
          const meta = window.document.createElement('meta')
          meta.setAttribute('name','referrer')
          meta.setAttribute('content','never')
          let script = window.document.getElementsByTagName('script')
          script = [...script]
          script.forEach(item=>{
            item.remove()
          })
          window.document.getElementsByTagName('head')[0].appendChild(meta)
          let imgSet = window.document.getElementsByTagName('img')
          imgSet = [...imgSet]
          const pattern = 'https://mmbiz.qpic.cn/'
          imgSet.forEach((item)=>{
            if(item.dataset.src){
              let newNode = window.document.createElement('img')
              newNode.setAttribute('src',item.dataset.src.replace(pattern,this.baseUrl+'api/official_img_proxy/'))
              newNode.style=item.style
              let parent = item.parentNode
              parent.insertBefore(newNode,item)
              item.remove()   
            }
          })
    }
  },
  mounted(){
    const topSize = 40
    const clientHeight = this.$root.$el.getElementsByClassName('global-notice')[0].offsetHeight
    this.$el.getElementsByClassName('outsider-official')[0].style.height = `${clientHeight-topSize}px`
  }
}
</script>
<style lang="stylus" scoped>
#detail
   position fixed
   width 100%
   top 30px
   bottom 50px
   left 0
   right 0
   z-index 99
   background-color #f3f4f6
   overflow auto
  .official-header
    background-color #1989fa
    .close
      position absolute
      left 5px
      top 7.5px
    .header-title
      display inline-block
      width 100%
      height 40px
      line-height 40px
      text-align center
      color white
      font-weight 80px
  .official-content
    iframe 
      width 100%




    
</style>