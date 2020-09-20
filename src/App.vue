<template>
  <div id="app">
    <div class="allDiv">
      <router-view v-if="isRouterAlive" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide(){
    return{
      reload:this.reload
    }
  },
  data(){
    return{
      isRouterAlive:true
    }
  },
  methods:{
    reload(){
      this.isRouterAlive = false;
      this.$nextTick(function(){
        this.isRouterAlive = true;
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body,html{
  width: 100%;
	margin: 0;
	padding: 0;
  font-size: 14px;
  /*background: -webkit-gradient(linear,left top,right top,from(#041636),to(#0b2758))!important;*/
  /*background: linear-gradient(90deg,#041636,#0b2758)!important;*/
  background-color: #041636;
  color: #ffffff;
}
body { min-height: 100%; }
body::-webkit-scrollbar,html::-webkit-scrollbar{
  width:0px!important;display: none;
}
html{
	scrollbar-width: none;
}
input, textarea {
  color: black !important;
}
</style>
