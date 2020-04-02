<template>
    <van-icon :name='starJudge(item.id)?"star":"star-o"' @click="starToggle(item,$event)" />
</template>
<script>
    import {
        request
    } from '../../request/http'
    export default {
        props: ['item'],
        methods: {
            starJudge(id) {
                const id_list = [];
                this.$store.state.user_info.booked_official.booked_official.forEach(item => {
                    id_list.push(item.id);
                });
                if (id_list.includes(id)) return true;
                return false;
            },
            starToggle(official, event) {
                const {
                    id
                } = official;
                request(true, {
                        url: "/api/moment/book",
                        method: "get",
                        params: {
                            from: "official",
                            message_id: id
                        }
                    })
                    .then(() => {
                        if (this.starJudge(id)) {
                            let className = event.target.className.replace(
                                /(van-icon-star)/,
                                "van-icon-star-o"
                            );
                            event.target.setAttribute("class", className);
                            let index = 0;
                            let ack;
                            this.$store.state.user_info.booked_official.booked_official.forEach(item => {
                                if (item.id != id) {
                                    index++;
                                } else {
                                    ack = index;
                                }
                            });
                            this.$store.state.user_info.booked_official.booked_official.splice(ack, 1);
                        } else {
                            let className = event.target.className.replace(
                                /(van-icon-star-o)/,
                                "van-icon-star"
                            );
                            event.target.setAttribute("class", className);
                            this.$store.state.user_info.booked_official.booked_official.push(official);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        this.$toast.fail("操作失败");
                    });
            },
        }
    }
</script>