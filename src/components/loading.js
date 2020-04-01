export default {
    beforeCreate() {
        this.$store.dispatch('sync_user_info')
        this.$toast.loading({
            message: '加载中',
            forbidClick: true,
            duration: 0
        })
    },
    mounted(){
        this.$toast.clear()
    }
}