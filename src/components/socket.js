export default{
  created(){
    if(Object.keys(this.$store.state.oa_socket).length === 0){
      this.$store.commit('refresh_socket')
      this.$nextTick(function(){
        this.$store.commit('socket_state_listen')
      })
    }
  }
}