<template>
    <div class="privacy_div">
        <div class="container">
            <h2>{{$t('foot.secret')}}</h2>
            <div class="content" v-html="content"></div>
        </div>
        <Foot />
    </div>
</template>
<script>
import Foot from '@/components/Foot'
import { aboutApi } from '@/api/getData'
export default {
    data(){
        return{
            title:'',
            content:''
        }
    },
    created(){
        this.prvacyFun();
    },
    methods:{
        async prvacyFun(){
            var that = this;
            var dataArr = new URLSearchParams();
            dataArr.set('type','PRIMARY');
            var res = await aboutApi(dataArr);
			if(res.code == 200){
                that.content = res.data.content;
            }
        }
    },
    components:{
        Foot,
    }
}
</script>
<style lang="less">
.privacy_div{
    h2{
        font-weight: initial;
        font-size: 28px;
    }
    .content{
        border-top: 1px solid #3B3B3B;
        color: #C3C3C3;
        img{
            max-width: 100%;
        }
    }
}
</style>