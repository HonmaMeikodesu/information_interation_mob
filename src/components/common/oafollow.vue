<template>
  <van-icon :name='followJudge(department)?"add":"add-o"' @click="followToggle(department)" />
</template>
<script>
  import {
    request
  } from "../../request/http";
  export default {
    props: ["department"],
    methods: {
      followJudge(name) {
        name = "department/" + name;
        if (this.$store.state.user_info.followList.includes(name)) {
          return true;
        } else return false;
      },
      followToggle(name) {
        console.log(name);
        let full_name = "department/" + name;
        if (this.followJudge(name)) {
          request(true, {
              url: "/api/user/unfollow",
              method: "get",
              params: {
                follow_user_identity: "department",
                follow_user_id: name
              }
            })
            .then(() => {
              this.$store.state.user_info.followList.splice(this.$store.state.user_info.followList.indexOf(full_name),1)
            })
            .catch(err => {
              console.log(err);
              this.$toast.fail("操作失败");
            });
        } else {
          request(true, {
              url: "/api/user/follow",
              method: "get",
              params: {
                follow_user_identity: "department",
                follow_user_id: name
              }
            })
            .then(() => {
              this.$store.state.user_info.followList.push(full_name);
            })
            .catch(err => {
              console.log(err);
              this.$toast.fail("操作失败");
            });
        }
      }
    }
  };
</script>