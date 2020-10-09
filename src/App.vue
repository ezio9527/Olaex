<template>
  <div id="app">
    <div class="allDiv">
      <router-view v-if="isRouterAlive" />
    </div>
  </div>
</template>

<script>
import { mobileBaseUrl } from './config/env'
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
  },
  created () {
    if (/(android)/i.test(navigator.userAgent.toLocaleLowerCase()) || /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      window.location.href = mobileBaseUrl
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
  background-color: #0B0B0B;
  color: #ffffff;
}
body { min-height: 100%; }
body::-webkit-scrollbar,html::-webkit-scrollbar{
  width:0px!important;display: none;
}
html{
	scrollbar-width: none;
}
</style>
