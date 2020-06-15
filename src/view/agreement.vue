<template>
    <div class="agreement_div">
        <div class="container">
            <h2>{{$t('foot.agree')}}</h2>
            <div class="content" v-html="content">

            </div>
        </div>
        <Foot />
    </div>
</template>
<script>
import Foot from '@/components/Foot'
import { agreementApi } from '@/api/getData'
export default {
    data(){
        return{
            content:''
        }
    },
    created(){
        this.agreeFun();
    },
    methods:{
        async agreeFun(){
            var that = this;
            var res = await agreementApi();
			if(res.code == 200){
                that.content = res.data;
            }
        }
    },
    components:{
        Foot,
    }
}
</script>
<style lang="less">
.agreement_div{
    h2{
        font-size: 28px;
        font-weight: initial;
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