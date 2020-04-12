export default {
    beforeCreate() {
        this.$store.dispatch('sync_user_info')
        this.$toast.$loading('加载中')
    },
    mounted(){
        this.$toast.clear()
    }
}