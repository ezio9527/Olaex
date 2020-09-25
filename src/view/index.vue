<template>
    <div class="allContent">
        <!-- 回到顶部 -->
        <el-backtop></el-backtop>
        <!-- 头部内容 -->
        <HeaderBox @flyingValue="flyingValue" />
        <!-- 内容 -->
        <div class="content_div">
			<router-view></router-view>
		</div>
    </div>
</template>
<script>
import HeaderBox from '@/components/Head'
export default {
    name:'index',
    data(){
        return{
            getCoinType:''
        }
    },
    components:{
        HeaderBox
    },
    mounted(){
        var mobileAgent = new Array("iphone", "ipod", "ipad", "android", "mobile", "blackberry", "webos", "incognito", "webmate", "bada", "nokia", "lg", "ucweb", "skyfire");
        var browser = navigator.userAgent.toLowerCase();

        var isMobile = false;
        for (var i = 0; i < mobileAgent.length; i++) {
            if (browser.indexOf(mobileAgent[i]) != -1) {
                isMobile = true;
                location.href = 'http://www.healthbtc.vip:8083/api/visitor/reg/link';
                break;
            }
        }
    },
    methods:{
        flyingValue(item){
            this.getCoinType = item;
        }
    }
}
</script>
<style>
.content_div{
    position: absolute;
    width: 100%;
    left: 0;
    top: 60px;
}
.el-icon-caret-top{
    color: #2E75B6;
}
</style>
