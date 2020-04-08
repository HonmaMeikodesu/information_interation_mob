<template>
  <div id="send-essay-history">
    <div class="essay-wrapper">
      <div class="essay-content" v-for="item in essayList" :key="item.id">
        <div class="essay-title">
          <span>{{item.essay_content}}</span>
        </div>
        <div class="essay-status">
          <div class="thumbs-up">
              <van-icon name="thumb-circle" color="rgb(150,150,150)"/>
              <span>{{item.thumbsup_num}}</span>
          </div>
          <div class="booked">
              <van-icon name="star" color="rgb(150,150,150)"/>
              <span>{{item.bookmarked_num}}</span>
          </div>
          <div class="comment">
              <van-icon name="comment-circle" color="rgb(150,150,150)"/>
              <span>{{item.review_num}}</span>
          </div>
        </div>
        <div class="essay-time">
          <span>{{dateFormat(item.updated_at)}}</span>
        </div>
        <div class="delete-essay">
          <van-icon name="cross" color="red" size="20px"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      essayList: this.$store.getters.published.moments
      }
    },
  methods:{
    dateFormat: function(date){
      date = new Date(date)
      return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>