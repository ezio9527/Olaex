<template>
    <div class="order_div">
        <div class="myselfContent">
            <h2 class="title">{{$t('contract.title')}}</h2>

            <OrderRecord />
        </div>
        <Foot />
    </div>
</template>

<script>
import OrderRecord from '@/components/OrderRecord'
import Foot from '@/components/Foot'
export default{
    data(){
        return{

        }
    },
    methods:{

    },
    components:{
        OrderRecord,Foot
    }
}
</script>

<style lang="less">
.order_div{
    .myselfContent{
        max-width: 80%;
        margin: 0 auto;
        padding: 0;
    }
    .title{
        font-weight: normal;
    }
}
</style>